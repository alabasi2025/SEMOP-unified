// PHASE-15: Smart Journal Entries System - Template DTOs
// This file contains DTOs for journal entry templates

export interface JournalEntryTemplateDto {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  operationType: string;
  isActive: boolean;
  lines?: JournalEntryTemplateLineDto[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface JournalEntryTemplateLineDto {
  id: string;
  templateId: string;
  lineOrder: number;
  accountType: 'debit' | 'credit';
  accountId?: string;
  accountPlaceholder?: string;
  amountSource: string;
  descriptionTemplate?: string;
  createdAt: Date;
}

export interface CreateJournalEntryTemplateDto {
  code: string;
  nameAr: string;
  nameEn: string;
  operationType: string;
  isActive?: boolean;
  lines: CreateJournalEntryTemplateLineDto[];
}

export interface CreateJournalEntryTemplateLineDto {
  lineOrder: number;
  accountType: 'debit' | 'credit';
  accountId?: string;
  accountPlaceholder?: string;
  amountSource: string;
  descriptionTemplate?: string;
}

export interface UpdateJournalEntryTemplateDto {
  code?: string;
  nameAr?: string;
  nameEn?: string;
  operationType?: string;
  isActive?: boolean;
  lines?: UpdateJournalEntryTemplateLineDto[];
}

export interface UpdateJournalEntryTemplateLineDto {
  id?: string;
  lineOrder?: number;
  accountType?: 'debit' | 'credit';
  accountId?: string;
  accountPlaceholder?: string;
  amountSource?: string;
  descriptionTemplate?: string;
}
