/**
 * SEMOP - Journal Entry DTOs
 * كائنات نقل البيانات للقيود اليومية
 * 
 * @module JournalEntryDtos
 * @version 0.3.0
 * @date 2025-11-20
 */

import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
  IsDate,
  IsNumber,
  IsInt,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum JournalEntryType {
  OPENING = 'OPENING',
  REGULAR = 'REGULAR',
  CLOSING = 'CLOSING',
  ADJUSTMENT = 'ADJUSTMENT',
}

export enum JournalEntryStatus {
  DRAFT = 'DRAFT',
  POSTED = 'POSTED',
  REVERSED = 'REVERSED',
}

export class CreateJournalEntryLineDto {
  @IsNotEmpty({ message: 'Line number is required' })
  @IsInt({ message: 'Line number must be an integer' })
  @Min(1, { message: 'Line number must be at least 1' })
  lineNumber: number;

  @IsNotEmpty({ message: 'Account ID is required' })
  @IsUUID('4', { message: 'Account ID must be a valid UUID' })
  accountId: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  @MinLength(2, { message: 'Description must be at least 2 characters long' })
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description: string;

  @IsNotEmpty({ message: 'Debit amount is required' })
  @IsNumber({}, { message: 'Debit must be a number' })
  @Min(0, { message: 'Debit must be at least 0' })
  debit: number;

  @IsNotEmpty({ message: 'Credit amount is required' })
  @IsNumber({}, { message: 'Credit must be a number' })
  @Min(0, { message: 'Credit must be at least 0' })
  credit: number;

  @IsOptional()
  @IsUUID('4', { message: 'Cost center ID must be a valid UUID' })
  costCenterId?: string;
}

export class CreateJournalEntryDto {
  @IsNotEmpty({ message: 'Entry date is required' })
  @IsDate({ message: 'Entry date must be a valid date' })
  @Type(() => Date)
  entryDate: Date;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  @MinLength(5, { message: 'Description must be at least 5 characters long' })
  @MaxLength(1000, { message: 'Description must not exceed 1000 characters' })
  description: string;

  @IsOptional()
  @IsString({ message: 'Reference must be a string' })
  @MaxLength(100, { message: 'Reference must not exceed 100 characters' })
  reference?: string;

  @IsNotEmpty({ message: 'Entry type is required' })
  @IsEnum(JournalEntryType, { message: 'Entry type must be a valid type' })
  entryType: JournalEntryType;

  @IsNotEmpty({ message: 'Fiscal year ID is required' })
  @IsUUID('4', { message: 'Fiscal year ID must be a valid UUID' })
  fiscalYearId: string;

  @IsOptional()
  @IsUUID('4', { message: 'Holding ID must be a valid UUID' })
  holdingId?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Unit ID must be a valid UUID' })
  unitId?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Project ID must be a valid UUID' })
  projectId?: string;

  @IsNotEmpty({ message: 'Lines are required' })
  @IsArray({ message: 'Lines must be an array' })
  @ArrayMinSize(2, { message: 'Journal entry must have at least 2 lines' })
  @ValidateNested({ each: true })
  @Type(() => CreateJournalEntryLineDto)
  lines: CreateJournalEntryLineDto[];
  @IsOptional()
  @IsUUID('4', { message: 'Smart Journal Entry ID must be a valid UUID' })
  smartJournalEntryId?: string;
}

export class UpdateJournalEntryDto {
  @IsOptional()
  @IsDate({ message: 'Entry date must be a valid date' })
  @Type(() => Date)
  entryDate?: Date;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MinLength(5, { message: 'Description must be at least 5 characters long' })
  @MaxLength(1000, { message: 'Description must not exceed 1000 characters' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'Reference must be a string' })
  @MaxLength(100, { message: 'Reference must not exceed 100 characters' })
  reference?: string;

  @IsOptional()
  @IsArray({ message: 'Lines must be an array' })
  @ArrayMinSize(2, { message: 'Journal entry must have at least 2 lines' })
  @ValidateNested({ each: true })
  @Type(() => CreateJournalEntryLineDto)
  lines?: CreateJournalEntryLineDto[];
}

export class JournalEntryLineResponseDto {
  id: string;
  journalEntryId: string;
  lineNumber: number;
  accountId: string;
  description: string;
  debit: number;
  credit: number;
  costCenterId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class JournalEntryResponseDto {
  id: string;
  entryNumber: string;
  entryDate: Date;
  description: string;
  reference?: string;
  entryType: JournalEntryType;
  status: JournalEntryStatus;
  totalDebit: number;
  totalCredit: number;
  isBalanced: boolean;
  postedAt?: Date;
  postedBy?: string;
  reversedAt?: Date;
  reversedBy?: string;
  reversalOfId?: string;
  fiscalYearId: string;
  holdingId?: string;
  unitId?: string;
  projectId?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
  lines?: JournalEntryLineResponseDto[];
  smartJournalEntryId?: string;
}
