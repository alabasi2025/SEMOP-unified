/**
 * SEMOP - Permission DTOs
 * كائنات نقل البيانات للصلاحيات
 * 
 * @module PermissionDtos
 * @version 0.2.0
 * @date 2025-11-20
 */

import {
  IsNotEmpty,
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty({ message: 'Code is required' })
  @IsString({ message: 'Code must be a string' })
  @MinLength(2, { message: 'Code must be at least 2 characters long' })
  @MaxLength(100, { message: 'Code must not exceed 100 characters' })
  @Matches(/^[A-Z0-9_]+$/, {
    message: 'Code can only contain uppercase letters, numbers and underscores',
  })
  code: string;

  @IsNotEmpty({ message: 'Arabic name is required' })
  @IsString({ message: 'Arabic name must be a string' })
  @MinLength(2, { message: 'Arabic name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Arabic name must not exceed 100 characters' })
  nameAr: string;

  @IsNotEmpty({ message: 'English name is required' })
  @IsString({ message: 'English name must be a string' })
  @MinLength(2, { message: 'English name must be at least 2 characters long' })
  @MaxLength(100, { message: 'English name must not exceed 100 characters' })
  nameEn: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;

  @IsNotEmpty({ message: 'Module is required' })
  @IsString({ message: 'Module must be a string' })
  @MinLength(2, { message: 'Module must be at least 2 characters long' })
  @MaxLength(50, { message: 'Module must not exceed 50 characters' })
  @Matches(/^[a-z_]+$/, {
    message: 'Module can only contain lowercase letters and underscores',
  })
  module: string;

  @IsNotEmpty({ message: 'Action is required' })
  @IsString({ message: 'Action must be a string' })
  @MinLength(2, { message: 'Action must be at least 2 characters long' })
  @MaxLength(50, { message: 'Action must not exceed 50 characters' })
  @Matches(/^[a-z_]+$/, {
    message: 'Action can only contain lowercase letters and underscores',
  })
  action: string;
}

export class UpdatePermissionDto {
  @IsOptional()
  @IsString({ message: 'Code must be a string' })
  @MinLength(2, { message: 'Code must be at least 2 characters long' })
  @MaxLength(100, { message: 'Code must not exceed 100 characters' })
  @Matches(/^[A-Z0-9_]+$/, {
    message: 'Code can only contain uppercase letters, numbers and underscores',
  })
  code?: string;

  @IsOptional()
  @IsString({ message: 'Arabic name must be a string' })
  @MinLength(2, { message: 'Arabic name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Arabic name must not exceed 100 characters' })
  nameAr?: string;

  @IsOptional()
  @IsString({ message: 'English name must be a string' })
  @MinLength(2, { message: 'English name must be at least 2 characters long' })
  @MaxLength(100, { message: 'English name must not exceed 100 characters' })
  nameEn?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'Module must be a string' })
  @MinLength(2, { message: 'Module must be at least 2 characters long' })
  @MaxLength(50, { message: 'Module must not exceed 50 characters' })
  @Matches(/^[a-z_]+$/, {
    message: 'Module can only contain lowercase letters and underscores',
  })
  module?: string;

  @IsOptional()
  @IsString({ message: 'Action must be a string' })
  @MinLength(2, { message: 'Action must be at least 2 characters long' })
  @MaxLength(50, { message: 'Action must not exceed 50 characters' })
  @Matches(/^[a-z_]+$/, {
    message: 'Action can only contain lowercase letters and underscores',
  })
  action?: string;
}

export class PermissionResponseDto {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  description?: string;
  module: string;
  action: string;
  createdAt: Date;
  updatedAt: Date;
}
