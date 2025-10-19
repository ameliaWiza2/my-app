import axios from 'axios';
import {
  Conversation,
  ConversationSummary,
  PaginatedResponse,
  SendMessageRequest,
  AIMetrics,
} from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function createConversation(
  userId: string,
  title: string,
  familyMemberId?: string
): Promise<Conversation> {
  const response = await api.post('/conversations', {
    userId,
    title,
    familyMemberId,
  });
  return response.data;
}

export async function getConversations(
  userId: string,
  page: number = 1,
  pageSize: number = 20
): Promise<PaginatedResponse<ConversationSummary>> {
  const response = await api.get('/conversations', {
    params: { userId, page, pageSize },
  });
  return response.data;
}

export async function getConversation(
  conversationId: string,
  userId: string
): Promise<Conversation> {
  const response = await api.get(`/conversations/${conversationId}`, {
    params: { userId },
  });
  return response.data;
}

export async function deleteConversation(
  conversationId: string,
  userId: string
): Promise<void> {
  await api.delete(`/conversations/${conversationId}`, {
    params: { userId },
  });
}

export async function sendMessage(
  conversationId: string,
  userId: string,
  message: SendMessageRequest
): Promise<{ content: string; error?: boolean }> {
  const response = await api.post(
    `/conversations/${conversationId}/messages`,
    message,
    {
      params: { userId, stream: 'false' },
    }
  );
  return response.data;
}

export async function* streamMessage(
  conversationId: string,
  userId: string,
  message: SendMessageRequest
): AsyncGenerator<{ content: string; done: boolean; error?: boolean }> {
  const response = await fetch(
    `${API_URL}/api/conversations/${conversationId}/messages?userId=${userId}&stream=true`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    throw new Error('No response body');
  }

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6));
          yield data;
          if (data.done) return;
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export async function getMetrics(userId?: string): Promise<AIMetrics> {
  const response = await api.get('/metrics', {
    params: userId ? { userId } : {},
  });
  return response.data;
}
