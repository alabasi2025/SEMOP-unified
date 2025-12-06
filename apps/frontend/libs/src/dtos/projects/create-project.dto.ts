/**
 * SEMOP - Project DTOs
 * كائنات نقل البيانات للمشاريع
 * 
 * @module ProjectDtos
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
  IsDate,
  IsNumber,
  Min,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class CreateProjectDto {
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

  @IsNotEmpty({ message: 'Status is required' })
  @IsEnum(ProjectStatus, { message: 'Status must be a valid project status' })
  status: ProjectStatus;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Start date must be a valid date' })
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'End date must be a valid date' })
  endDate?: Date;

  @IsOptional()
  @IsNumber({}, { message: 'Budget must be a number' })
  @Min(0, { message: 'Budget must be a positive number' })
  budget?: number;

  @IsNotEmpty({ message: 'Unit ID is required' })
  @IsUUID('4', { message: 'Unit ID must be a valid UUID' })
  unitId: string;
}

export class UpdateProjectDto {
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
  @IsEnum(ProjectStatus, { message: 'Status must be a valid project status' })
  status?: ProjectStatus;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Start date must be a valid date' })
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'End date must be a valid date' })
  endDate?: Date;

  @IsOptional()
  @IsNumber({}, { message: 'Budget must be a number' })
  @Min(0, { message: 'Budget must be a positive number' })
  budget?: number;

  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;

  @IsOptional()
  @IsUUID('4', { message: 'Unit ID must be a valid UUID' })
  unitId?: string;
}

export class ProjectResponseDto {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  description?: string;
  status: ProjectStatus;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  isActive: boolean;
  unitId: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}
