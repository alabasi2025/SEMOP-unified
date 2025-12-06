/**
 * SEMOP - Role DTOs
 * كائنات نقل البيانات للأدوار
 * 
 * @module RoleDtos
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

export class CreateRoleDto {
  @IsNotEmpty({ message: 'Code is required' })
  @IsString({ message: 'Code must be a string' })
  @MinLength(2, { message: 'Code must be at least 2 characters long' })
  @MaxLength(50, { message: 'Code must not exceed 50 characters' })
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
}

export class UpdateRoleDto {
  @IsOptional()
  @IsString({ message: 'Code must be a string' })
  @MinLength(2, { message: 'Code must be at least 2 characters long' })
  @MaxLength(50, { message: 'Code must not exceed 50 characters' })
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
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;
}

export class RoleResponseDto {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  description?: string;
  isSystem: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class AssignPermissionDto {
  @IsNotEmpty({ message: 'Permission ID is required' })
  @IsString({ message: 'Permission ID must be a string' })
  permissionId: string;
}
