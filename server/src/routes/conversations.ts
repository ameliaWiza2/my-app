import { Router, Request, Response } from 'express';
import { z } from 'zod';
import {
  createConversation,
  getConversations,
  getConversationById,
  deleteConversation,
  addMessage,
  getConversationHistory,
  getHealthContext,
  checkConsent,
} from '../services/conversationService';
import { streamChatCompletion, generateChatCompletion, getFallbackResponse } from '../services/aiService';
import { redactHealthData } from '../utils/privacy';
import { logAIMetrics, startTimer } from '../utils/monitoring';
import { chatLimiter } from '../middleware/rateLimiter';

const router = Router();

const createConversationSchema = z.object({
  userId: z.string().uuid(),
  familyMemberId: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
});

const sendMessageSchema = z.object({
  content: z.string().min(1).max(5000),
  includeHealthContext: z.boolean().optional().default(true),
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const data = createConversationSchema.parse(req.body);
    const conversation = await createConversation(data);
    res.status(201).json(conversation);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to create conversation' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const result = await getConversations(userId, page, pageSize);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch conversations' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const conversationId = req.params.id;
    const userId = req.query.userId as string;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const conversation = await getConversationById(conversationId, userId);
    res.json(conversation);
  } catch (error) {
    if (error instanceof Error && error.message === 'Conversation not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Failed to fetch conversation' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const conversationId = req.params.id;
    const userId = req.query.userId as string;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    await deleteConversation(conversationId, userId);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error && error.message === 'Conversation not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Failed to delete conversation' });
  }
});

router.post('/:id/messages', chatLimiter, async (req: Request, res: Response) => {
  const conversationId = req.params.id;
  const userId = req.query.userId as string;
  const stream = req.query.stream === 'true';

  try {
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const messageData = sendMessageSchema.parse(req.body);

    const conversation = await getConversationById(conversationId, userId);
    const conversationHistory = await getConversationHistory(conversationId);

    await addMessage(conversationId, 'user', messageData.content);

    const consentedToHealthData = await checkConsent(userId, conversation.familyMemberId || undefined);

    let healthContext;
    let usedHealthData = false;

    if (messageData.includeHealthContext && consentedToHealthData) {
      const rawHealthData = await getHealthContext(userId, conversation.familyMemberId || undefined);
      if (rawHealthData) {
        healthContext = redactHealthData(rawHealthData);
        usedHealthData = true;
      }
    }

    const aiContext = {
      userMessage: messageData.content,
      conversationHistory: conversationHistory.slice(-10),
      healthContext,
      consentedToHealthData,
    };

    const timer = startTimer();

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      let fullResponse = '';
      let success = true;
      let errorMessage: string | undefined;

      try {
        for await (const chunk of streamChatCompletion(aiContext)) {
          if (!chunk.done) {
            fullResponse += chunk.content;
            res.write(`data: ${JSON.stringify(chunk)}\n\n`);
          } else {
            res.write(`data: ${JSON.stringify({ content: '', done: true })}\n\n`);
          }
        }

        await addMessage(conversationId, 'assistant', fullResponse, usedHealthData);
      } catch (error) {
        success = false;
        errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const fallback = getFallbackResponse();
        await addMessage(conversationId, 'assistant', fallback, false);
        res.write(`data: ${JSON.stringify({ content: fallback, done: true, error: true })}\n\n`);
      }

      const responseTime = timer();

      await logAIMetrics({
        userId,
        conversationId,
        tokensUsed: 0,
        responseTime,
        model: 'gpt-4',
        promptType: usedHealthData ? 'with-context' : 'without-context',
        success,
        errorMessage,
      });

      res.end();
    } else {
      let success = true;
      let errorMessage: string | undefined;
      let response;
      let tokensUsed = 0;

      try {
        const result = await generateChatCompletion(aiContext);
        response = result.content;
        tokensUsed = result.tokensUsed;
        await addMessage(conversationId, 'assistant', response, usedHealthData);
      } catch (error) {
        success = false;
        errorMessage = error instanceof Error ? error.message : 'Unknown error';
        response = getFallbackResponse();
        await addMessage(conversationId, 'assistant', response, false);
      }

      const responseTime = timer();

      await logAIMetrics({
        userId,
        conversationId,
        tokensUsed,
        responseTime,
        model: 'gpt-4',
        promptType: usedHealthData ? 'with-context' : 'without-context',
        success,
        errorMessage,
      });

      res.json({ content: response, error: !success });
    }
  } catch (error) {
    console.error('Error in message handler:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to send message' });
  }
});

export default router;
