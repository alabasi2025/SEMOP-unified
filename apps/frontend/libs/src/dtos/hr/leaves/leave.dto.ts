import { IsString, IsOptional, IsEnum, IsDate, IsNumber, IsBoolean, MinLength, MaxLength, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export enum LeaveCategory {
  ANNUAL = 'ANNUAL',
  SICK = 'SICK',
  EMERGENCY = 'EMERGENCY',
  MATERNITY = 'MATERNITY',
  PATERNITY = 'PATERNITY',
  UNPAID = 'UNPAID',
  OTHER = 'OTHER',
}

export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

// LeaveType DTOs
export class CreateLeaveTypeDto {
  @IsString({ message: 'Code must be a string' })
  @MinLength(2, { message: 'Code must be at least 2 characters' })
  @MaxLength(20, { message: 'Code must not exceed 20 characters' })
  @Matches(/^[A-Z0-9-]+$/, { message: 'Code must contain only uppercase letters, numbers, and hyphens' })
  code!: string;

  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name!: string;

  @IsEnum(LeaveCategory, { message: 'Invalid leave category' })
  category!: LeaveCategory;

  @IsNumber({}, { message: 'Default days must be a number' })
  defaultDays!: number;

  @IsBoolean({ message: 'isPaid must be a boolean' })
  isPaid!: boolean;

  @IsBoolean({ message: 'requiresApproval must be a boolean' })
  requiresApproval!: boolean;
}

export class UpdateLeaveTypeDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Default days must be a number' })
  defaultDays?: number;

  @IsOptional()
  @IsBoolean({ message: 'isPaid must be a boolean' })
  isPaid?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'requiresApproval must be a boolean' })
  requiresApproval?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;
}

// LeaveBalance DTOs
export class CreateLeaveBalanceDto {
  @IsString({ message: 'Employee ID must be a string' })
  employeeId!: string;

  @IsString({ message: 'Leave type ID must be a string' })
  leaveTypeId!: string;

  @IsNumber({}, { message: 'Year must be a number' })
  year!: number;

  @IsNumber({}, { message: 'Total days must be a number' })
  totalDays!: number;
}

export class UpdateLeaveBalanceDto {
  @IsOptional()
  @IsNumber({}, { message: 'Total days must be a number' })
  totalDays?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Used days must be a number' })
  usedDays?: number;
}

// LeaveRequest DTOs
export class CreateLeaveRequestDto {
  @IsString({ message: 'Employee ID must be a string' })
  employeeId!: string;

  @IsString({ message: 'Leave type ID must be a string' })
  leaveTypeId!: string;

  @Type(() => Date)
  @IsDate({ message: 'Start date must be a valid date' })
  startDate!: Date;

  @Type(() => Date)
  @IsDate({ message: 'End date must be a valid date' })
  endDate!: Date;

  @IsNumber({}, { message: 'Total days must be a number' })
  totalDays!: number;

  @IsOptional()
  @IsString({ message: 'Reason must be a string' })
  reason?: string;
}

export class UpdateLeaveRequestDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Start date must be a valid date' })
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'End date must be a valid date' })
  endDate?: Date;

  @IsOptional()
  @IsNumber({}, { message: 'Total days must be a number' })
  totalDays?: number;

  @IsOptional()
  @IsString({ message: 'Reason must be a string' })
  reason?: string;
}

