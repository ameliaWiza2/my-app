export interface User {
  id: string;
  email: string;
  name: string;
  consentedToAI: boolean;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  consentedToAI: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  usedHealthData: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  familyMember?: {
    name: string;
    relationship: string;
  };
}

export interface ConversationSummary {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  familyMember?: {
    name: string;
    relationship: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface StreamChunk {
  content: string;
  done: boolean;
  error?: boolean;
}

export interface SendMessageRequest {
  content: string;
  includeHealthContext?: boolean;
}

export interface AIMetrics {
  totalRequests: number;
  successfulRequests: number;
  successRate: number;
  averageResponseTime: number;
  totalTokensUsed: number;
}
