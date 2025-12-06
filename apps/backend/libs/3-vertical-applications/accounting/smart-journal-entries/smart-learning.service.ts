// PHASE-15: Smart Journal Entries System - Smart Learning Service
// This service handles AI-powered learning and account suggestions

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../1-core-services/prisma/prisma.service';
import {
  SuggestedAccountDto,
  AccountSuggestionRequestDto,
  RecordUsageDto,
  UsageStatisticsDto,
} from '@semop/contracts';

@Injectable()
export class SmartLearningService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Record account usage for learning
   */
  async recordUsage(dto: RecordUsageDto): Promise<void> {
    const existing = await this.prisma.smartLearningLog.findFirst({
      where: {
        operationType: dto.operationType,
        contextType: dto.contextType || null,
        contextId: dto.contextId || null,
        accountId: dto.accountId,
      },
    });

    if (existing) {
      // Update existing record
      await this.prisma.smartLearningLog.update({
        where: { id: existing.id },
        data: {
          usageCount: { increment: 1 },
          lastUsedAt: new Date(),
        },
      });
    } else {
      // Create new record
      await this.prisma.smartLearningLog.create({
        data: {
          operationType: dto.operationType,
          contextType: dto.contextType,
          contextId: dto.contextId,
          accountId: dto.accountId,
          usageCount: 1,
          lastUsedAt: new Date(),
        },
      });
    }
  }

  /**
   * Get suggested accounts based on learning
   */
  async getSuggestedAccounts(dto: AccountSuggestionRequestDto): Promise<SuggestedAccountDto[]> {
    const limit = dto.limit || 5;

    // Build where clause
    const where: any = {
      operationType: dto.operationType,
    };

    if (dto.contextType && dto.contextId) {
      where.contextType = dto.contextType;
      where.contextId = dto.contextId;
    }

    // Get learning logs
    const logs = await this.prisma.smartLearningLog.findMany({
      where,
      orderBy: [
        { usageCount: 'desc' },
        { lastUsedAt: 'desc' },
      ],
      take: limit,
    });

    // Get account details (assuming accounts table exists)
    const suggestions: SuggestedAccountDto[] = [];

    for (const log of logs) {
      // Note: This assumes you have an Account model in Prisma
      // You may need to adjust this based on your actual schema
      const account = await this.prisma.$queryRaw`
        SELECT id, code, name_ar, name_en
        FROM accounts
        WHERE id = ${log.accountId}
        LIMIT 1
      `;

      if (account && Array.isArray(account) && account.length > 0) {
        const acc = account[0] as any;
        
        // Calculate confidence (0-100)
        const maxUsage = logs[0]?.usageCount || 1;
        const confidence = Math.round((log.usageCount / maxUsage) * 100);

        suggestions.push({
          accountId: log.accountId,
          accountCode: acc.code,
          accountNameAr: acc.name_ar,
          accountNameEn: acc.name_en,
          usageCount: log.usageCount,
          lastUsedAt: log.lastUsedAt,
          confidence,
        });
      }
    }

    return suggestions;
  }

  /**
   * Get usage statistics for an account
   */
  async getUsageStatistics(accountId: string): Promise<UsageStatisticsDto> {
    const logs = await this.prisma.smartLearningLog.findMany({
      where: { accountId },
    });

    const totalUsage = logs.reduce((sum, log) => sum + log.usageCount, 0);

    const usageByOperationType: Record<string, number> = {};
    const usageByContext: Record<string, number> = {};

    let lastUsedAt = new Date(0);

    for (const log of logs) {
      // Group by operation type
      usageByOperationType[log.operationType] =
        (usageByOperationType[log.operationType] || 0) + log.usageCount;

      // Group by context
      if (log.contextType && log.contextId) {
        const contextKey = `${log.contextType}:${log.contextId}`;
        usageByContext[contextKey] =
          (usageByContext[contextKey] || 0) + log.usageCount;
      }

      // Track latest usage
      if (log.lastUsedAt > lastUsedAt) {
        lastUsedAt = log.lastUsedAt;
      }
    }

    return {
      accountId,
      totalUsage,
      usageByOperationType,
      usageByContext,
      lastUsedAt,
    };
  }

  /**
   * Clear learning data for a specific operation type
   */
  async clearLearningData(operationType: string): Promise<void> {
    await this.prisma.smartLearningLog.deleteMany({
      where: { operationType },
    });
  }

  /**
   * Clear all learning data
   */
  async clearAllLearningData(): Promise<void> {
    await this.prisma.smartLearningLog.deleteMany({});
  }
}
