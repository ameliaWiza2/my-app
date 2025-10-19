import OpenAI from 'openai';
import { AIPromptContext, StreamChunk } from '../types';
import { buildHealthContextPrompt, sanitizeUserMessage } from '../utils/privacy';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a helpful and empathetic AI health assistant. Your role is to:
- Provide general health information and wellness guidance
- Help users understand health concepts and symptoms
- Encourage users to seek professional medical care when appropriate
- Be supportive and non-judgmental

Important disclaimers:
- You are NOT a replacement for professional medical advice
- Always recommend consulting with healthcare providers for diagnoses or treatment plans
- In emergencies, advise users to call emergency services immediately
- Respect privacy and handle health information with care

Maintain a warm, professional tone and provide evidence-based information when possible.`;

export async function* streamChatCompletion(
  context: AIPromptContext
): AsyncGenerator<StreamChunk, void, unknown> {
  const sanitizedMessage = sanitizeUserMessage(context.userMessage);

  let userPrompt = sanitizedMessage;

  if (context.consentedToHealthData && context.healthContext) {
    const healthContextText = buildHealthContextPrompt(context.healthContext);
    if (healthContextText) {
      userPrompt += healthContextText;
    }
  }

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...context.conversationHistory.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })),
    { role: 'user', content: userPrompt },
  ];

  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 1000,
    });

    let fullContent = '';

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullContent += content;
        yield { content, done: false };
      }
    }

    yield { content: '', done: true };
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate AI response');
  }
}

export async function generateChatCompletion(
  context: AIPromptContext
): Promise<{ content: string; tokensUsed: number }> {
  const sanitizedMessage = sanitizeUserMessage(context.userMessage);

  let userPrompt = sanitizedMessage;

  if (context.consentedToHealthData && context.healthContext) {
    const healthContextText = buildHealthContextPrompt(context.healthContext);
    if (healthContextText) {
      userPrompt += healthContextText;
    }
  }

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...context.conversationHistory.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })),
    { role: 'user', content: userPrompt },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';
    const tokensUsed = response.usage?.total_tokens || 0;

    return { content, tokensUsed };
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate AI response');
  }
}

export function getFallbackResponse(): string {
  return "I'm sorry, but I'm currently unable to process your request due to a technical issue. Please try again in a moment, or contact support if the problem persists. If you're experiencing a medical emergency, please call emergency services immediately.";
}
