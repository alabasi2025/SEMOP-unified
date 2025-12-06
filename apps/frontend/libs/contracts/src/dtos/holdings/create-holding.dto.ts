/**
 * SEMOP - Holding DTOs
 * كائنات نقل البيانات للشركات القابضة
 * 
 * @module HoldingDtos
 * @version 0.2.0
 * @date 2025-11-20
 */

import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateHoldingDto {
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

  @IsOptional()
  @IsString({ message: 'Logo must be a string' })
  logo?: string;
}

export class UpdateHoldingDto {
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
  @IsString({ message: 'Logo must be a string' })
  logo?: string;

  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;
}

export class HoldingResponseDto {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  description?: string;
  logo?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}
