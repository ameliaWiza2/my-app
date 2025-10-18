import { PrismaClient } from '@prisma/client';
import {
  CreateConversationRequest,
  HealthContext,
  PaginatedResponse,
} from '../types';

const prisma = new PrismaClient();

export async function createConversation(data: CreateConversationRequest) {
  return await prisma.conversation.create({
    data: {
      userId: data.userId,
      familyMemberId: data.familyMemberId,
      title: data.title,
    },
    include: {
      messages: true,
    },
  });
}

export async function getConversations(
  userId: string,
  page: number = 1,
  pageSize: number = 20
): Promise<PaginatedResponse<any>> {
  const skip = (page - 1) * pageSize;

  const [conversations, total] = await Promise.all([
    prisma.conversation.findMany({
      where: { userId },
      skip,
      take: pageSize,
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 1,
        },
        familyMember: {
          select: {
            name: true,
            relationship: true,
          },
        },
      },
    }),
    prisma.conversation.count({ where: { userId } }),
  ]);

  return {
    data: conversations,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getConversationById(conversationId: string, userId: string) {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      userId,
    },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
      familyMember: {
        select: {
          name: true,
          relationship: true,
        },
      },
    },
  });

  if (!conversation) {
    throw new Error('Conversation not found');
  }

  return conversation;
}

export async function deleteConversation(conversationId: string, userId: string) {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      userId,
    },
  });

  if (!conversation) {
    throw new Error('Conversation not found');
  }

  await prisma.conversation.delete({
    where: { id: conversationId },
  });
}

export async function addMessage(
  conversationId: string,
  role: string,
  content: string,
  usedHealthData: boolean = false
) {
  const message = await prisma.message.create({
    data: {
      conversationId,
      role,
      content,
      usedHealthData,
    },
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  return message;
}

export async function getConversationHistory(conversationId: string) {
  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
    select: {
      role: true,
      content: true,
    },
  });

  return messages;
}

export async function getHealthContext(
  userId: string,
  familyMemberId?: string
): Promise<HealthContext | null> {
  const where = familyMemberId
    ? { familyMemberId }
    : { userId };

  const healthData = await prisma.healthData.findFirst({
    where,
  });

  if (!healthData) {
    return null;
  }

  return {
    weight: healthData.weight || undefined,
    height: healthData.height || undefined,
    bloodPressure: healthData.bloodPressure || undefined,
    heartRate: healthData.heartRate || undefined,
    bloodType: healthData.bloodType || undefined,
    allergies: healthData.allergies,
    medications: healthData.medications,
    conditions: healthData.conditions,
    pregnancyStage: healthData.pregnancyStage || undefined,
    lastCheckup: healthData.lastCheckup || undefined,
  };
}

export async function checkConsent(userId: string, familyMemberId?: string): Promise<boolean> {
  if (familyMemberId) {
    const familyMember = await prisma.familyMember.findFirst({
      where: {
        id: familyMemberId,
        userId,
      },
    });
    return familyMember?.consentedToAI || false;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  return user?.consentedToAI || false;
}
