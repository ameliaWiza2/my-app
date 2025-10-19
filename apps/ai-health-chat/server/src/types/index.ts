export interface CreateConversationRequest {
  userId: string;
  familyMemberId?: string;
  title: string;
}

export interface SendMessageRequest {
  content: string;
  includeHealthContext?: boolean;
}

export interface HealthContext {
  weight?: number;
  height?: number;
  bloodPressure?: string;
  heartRate?: number;
  bloodType?: string;
  allergies: string[];
  medications: string[];
  conditions: string[];
  pregnancyStage?: string;
  lastCheckup?: Date;
}

export interface RedactedHealthContext {
  hasWeight: boolean;
  hasHeight: boolean;
  hasBloodPressure: boolean;
  heartRateRange?: string;
  hasAllergies: boolean;
  allergyCount: number;
  hasMedications: boolean;
  medicationCount: number;
  hasConditions: boolean;
  conditionCount: number;
  pregnancyStage?: string;
  hasRecentCheckup: boolean;
}

export interface AIPromptContext {
  userMessage: string;
  conversationHistory: Array<{ role: string; content: string }>;
  healthContext?: RedactedHealthContext;
  consentedToHealthData: boolean;
}

export interface StreamChunk {
  content: string;
  done: boolean;
}

export interface AIMetricsData {
  userId: string;
  conversationId: string;
  tokensUsed: number;
  responseTime: number;
  model: string;
  promptType: string;
  success: boolean;
  errorMessage?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
