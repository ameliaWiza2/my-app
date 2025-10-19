import { PrismaClient } from '@prisma/client';
import { AIMetricsData } from '../types';

const prisma = new PrismaClient();

export async function logAIMetrics(metrics: AIMetricsData): Promise<void> {
  try {
    await prisma.aIMetrics.create({
      data: metrics,
    });
  } catch (error) {
    console.error('Failed to log AI metrics:', error);
  }
}

export async function getAIMetricsSummary(userId?: string) {
  const where = userId ? { userId } : {};

  const [totalRequests, successfulRequests, avgResponseTime, totalTokens] = await Promise.all([
    prisma.aIMetrics.count({ where }),
    prisma.aIMetrics.count({ where: { ...where, success: true } }),
    prisma.aIMetrics.aggregate({
      where,
      _avg: { responseTime: true },
    }),
    prisma.aIMetrics.aggregate({
      where,
      _sum: { tokensUsed: true },
    }),
  ]);

  const successRate = totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0;

  return {
    totalRequests,
    successfulRequests,
    successRate: Math.round(successRate * 100) / 100,
    averageResponseTime: Math.round(avgResponseTime._avg.responseTime || 0),
    totalTokensUsed: totalTokens._sum.tokensUsed || 0,
  };
}

export function startTimer(): () => number {
  const start = Date.now();
  return () => Date.now() - start;
}
