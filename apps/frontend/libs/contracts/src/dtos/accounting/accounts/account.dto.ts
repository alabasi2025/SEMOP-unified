/**
 * SEMOP - Account DTOs
 * كائنات نقل البيانات للحسابات المحاسبية
 * 
 * @module AccountDtos
 * @version 0.3.0
 * @date 2025-11-20
 */

import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsInt,
  IsUUID,
  Min,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export enum AccountType {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  EQUITY = 'EQUITY',
  REVENUE = 'REVENUE',
  EXPENSE = 'EXPENSE',
}

export enum AccountNature {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

export class CreateAccountDto {
  @IsNotEmpty({ message: 'Code is required' })
  @IsString({ message: 'Code must be a string' })
  @MinLength(1, { message: 'Code must be at least 1 character long' })
  @MaxLength(20, { message: 'Code must not exceed 20 characters' })
  @Matches(/^[0-9]+$/, {
    message: 'Code can only contain numbers',
  })
  code: string;

  @IsNotEmpty({ message: 'Arabic name is required' })
  @IsString({ message: 'Arabic name must be a string' })
  @MinLength(2, { message: 'Arabic name must be at least 2 characters long' })
  @MaxLength(200, { message: 'Arabic name must not exceed 200 characters' })
  nameAr: string;

  @IsNotEmpty({ message: 'English name is required' })
  @IsString({ message: 'English name must be a string' })
  @MinLength(2, { message: 'English name must be at least 2 characters long' })
  @MaxLength(200, { message: 'English name must not exceed 200 characters' })
  nameEn: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(1000, { message: 'Description must not exceed 1000 characters' })
  description?: string;

  @IsNotEmpty({ message: 'Account type is required' })
  @IsEnum(AccountType, { message: 'Account type must be a valid type' })
  accountType: AccountType;

  @IsNotEmpty({ message: 'Account nature is required' })
  @IsEnum(AccountNature, { message: 'Account nature must be a valid nature' })
  accountNature: AccountNature;

  @IsNotEmpty({ message: 'Level is required' })
  @IsInt({ message: 'Level must be an integer' })
  @Min(1, { message: 'Level must be at least 1' })
  level: number;

  @IsOptional()
  @IsBoolean({ message: 'isParent must be a boolean' })
  isParent?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'allowManualEntry must be a boolean' })
  allowManualEntry?: boolean;

  @IsOptional()
  @IsUUID('4', { message: 'Parent ID must be a valid UUID' })
  parentId?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Holding ID must be a valid UUID' })
  holdingId?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Unit ID must be a valid UUID' })
  unitId?: string;
}

export class UpdateAccountDto {
  @IsOptional()
  @IsString({ message: 'Code must be a string' })
  @MinLength(1, { message: 'Code must be at least 1 character long' })
  @MaxLength(20, { message: 'Code must not exceed 20 characters' })
  @Matches(/^[0-9]+$/, {
    message: 'Code can only contain numbers',
  })
  code?: string;

  @IsOptional()
  @IsString({ message: 'Arabic name must be a string' })
  @MinLength(2, { message: 'Arabic name must be at least 2 characters long' })
  @MaxLength(200, { message: 'Arabic name must not exceed 200 characters' })
  nameAr?: string;

  @IsOptional()
  @IsString({ message: 'English name must be a string' })
  @MinLength(2, { message: 'English name must be at least 2 characters long' })
  @MaxLength(200, { message: 'English name must not exceed 200 characters' })
  nameEn?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(1000, { message: 'Description must not exceed 1000 characters' })
  description?: string;

  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'allowManualEntry must be a boolean' })
  allowManualEntry?: boolean;
}

export class AccountResponseDto {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  description?: string;
  accountType: AccountType;
  accountNature: AccountNature;
  level: number;
  isParent: boolean;
  isActive: boolean;
  allowManualEntry: boolean;
  parentId?: string;
  holdingId?: string;
  unitId?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export class AccountBalanceResponseDto {
  id: string;
  accountId: string;
  fiscalYearId: string;
  openingBalance: number;
  closingBalance: number;
  debitTotal: number;
  creditTotal: number;
  createdAt: Date;
  updatedAt: Date;
}
