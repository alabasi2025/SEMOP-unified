/**
 * SEMOP - Unit DTOs
 * كائنات نقل البيانات للوحدات
 * 
 * @module UnitDtos
 * @version 0.2.0
 * @date 2025-11-20
 */

import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsEnum,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export enum UnitType {
  BRANCH = 'BRANCH',
  DEPARTMENT = 'DEPARTMENT',
  DIVISION = 'DIVISION',
  SUBSIDIARY = 'SUBSIDIARY',
  OTHER = 'OTHER',
}

export class CreateUnitDto {
  @IsNotEmpty({ message: 'Code is required' })
  @IsString({ message: 'Code must be a string' })
  @MinLength(2, { message: 'Code must be at least 2 characters long' })
  @MaxLength(20, { message: 'Code must not exceed 20 characters' })
  @Matches(/^[A-Z0-9_-]+$/, {
    message: 'Code can only contain uppercase letters, numbers, underscores and hyphens',
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

  @IsNotEmpty({ message: 'Type is required' })
  @IsEnum(UnitType, { message: 'Type must be a valid unit type' })
  type: UnitType;

  @IsNotEmpty({ message: 'Holding ID is required' })
  @IsUUID('4', { message: 'Holding ID must be a valid UUID' })
  holdingId: string;
}

export class UpdateUnitDto {
  @IsOptional()
  @IsString({ message: 'Code must be a string' })
  @MinLength(2, { message: 'Code must be at least 2 characters long' })
  @MaxLength(20, { message: 'Code must not exceed 20 characters' })
  @Matches(/^[A-Z0-9_-]+$/, {
    message: 'Code can only contain uppercase letters, numbers, underscores and hyphens',
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
  @IsEnum(UnitType, { message: 'Type must be a valid unit type' })
  type?: UnitType;

  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;

  @IsOptional()
  @IsUUID('4', { message: 'Holding ID must be a valid UUID' })
  holdingId?: string;
}

export class UnitResponseDto {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  description?: string;
  type: UnitType;
  isActive: boolean;
  holdingId: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}
