// PHASE-15: Smart Journal Entries System - Smart Learning DTOs
// This file contains DTOs for AI-powered learning and suggestions

export interface SmartLearningLogDto {
  id: string;
  operationType: string;
  contextType?: string;
  contextId?: string;
  accountId: string;
  usageCount: number;
  lastUsedAt: Date;
  createdAt: Date;
}

export interface SuggestedAccountDto {
  accountId: string;
  accountCode: string;
  accountNameAr: string;
  accountNameEn: string;
  usageCount: number;
  lastUsedAt: Date;
  confidence: number; // 0-100
}

export interface AccountSuggestionRequestDto {
  operationType: string;
  contextType?: string;
  contextId?: string;
  limit?: number;
}

export interface RecordUsageDto {
  operationType: string;
  contextType?: string;
  contextId?: string;
  accountId: string;
}

export interface UsageStatisticsDto {
  accountId: string;
  totalUsage: number;
  usageByOperationType: Record<string, number>;
  usageByContext: Record<string, number>;
  lastUsedAt: Date;
}
