import { IsString, IsOptional, IsEnum, IsDate, IsNumber, IsBoolean, MinLength, MaxLength, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export enum CalculationType {
  FIXED = 'FIXED',
  PERCENTAGE = 'PERCENTAGE',
}

export enum RecurrenceType {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
  ONE_TIME = 'ONE_TIME',
}

export enum LoanStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
}

// AllowanceType DTOs
export class CreateAllowanceTypeDto {
  @IsString({ message: 'Code must be a string' })
  @MinLength(2, { message: 'Code must be at least 2 characters' })
  @MaxLength(20, { message: 'Code must not exceed 20 characters' })
  @Matches(/^[A-Z0-9-]+$/, { message: 'Code must contain only uppercase letters, numbers, and hyphens' })
  code!: string;

  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name!: string;

  @IsEnum(CalculationType, { message: 'Invalid calculation type' })
  calculationType!: CalculationType;

  @IsOptional()
  @IsNumber({}, { message: 'Default amount must be a number' })
  defaultAmount?: number;

  @IsBoolean({ message: 'isTaxable must be a boolean' })
  isTaxable!: boolean;
}

export class UpdateAllowanceTypeDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name?: string;

  @IsOptional()
  @IsEnum(CalculationType, { message: 'Invalid calculation type' })
  calculationType?: CalculationType;

  @IsOptional()
  @IsNumber({}, { message: 'Default amount must be a number' })
  defaultAmount?: number;

  @IsOptional()
  @IsBoolean({ message: 'isTaxable must be a boolean' })
  isTaxable?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;
}

// DeductionType DTOs
export class CreateDeductionTypeDto {
  @IsString({ message: 'Code must be a string' })
  @MinLength(2, { message: 'Code must be at least 2 characters' })
  @MaxLength(20, { message: 'Code must not exceed 20 characters' })
  @Matches(/^[A-Z0-9-]+$/, { message: 'Code must contain only uppercase letters, numbers, and hyphens' })
  code!: string;

  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name!: string;

  @IsEnum(CalculationType, { message: 'Invalid calculation type' })
  calculationType!: CalculationType;

  @IsOptional()
  @IsNumber({}, { message: 'Default amount must be a number' })
  defaultAmount?: number;
}

export class UpdateDeductionTypeDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name?: string;

  @IsOptional()
  @IsEnum(CalculationType, { message: 'Invalid calculation type' })
  calculationType?: CalculationType;

  @IsOptional()
  @IsNumber({}, { message: 'Default amount must be a number' })
  defaultAmount?: number;

  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;
}

// BonusType DTOs
export class CreateBonusTypeDto {
  @IsString({ message: 'Code must be a string' })
  @MinLength(2, { message: 'Code must be at least 2 characters' })
  @MaxLength(20, { message: 'Code must not exceed 20 characters' })
  @Matches(/^[A-Z0-9-]+$/, { message: 'Code must contain only uppercase letters, numbers, and hyphens' })
  code!: string;

  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name!: string;

  @IsEnum(CalculationType, { message: 'Invalid calculation type' })
  calculationType!: CalculationType;

  @IsOptional()
  @IsNumber({}, { message: 'Default amount must be a number' })
  defaultAmount?: number;

  @IsBoolean({ message: 'isTaxable must be a boolean' })
  isTaxable!: boolean;
}

export class UpdateBonusTypeDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name?: string;

  @IsOptional()
  @IsEnum(CalculationType, { message: 'Invalid calculation type' })
  calculationType?: CalculationType;

  @IsOptional()
  @IsNumber({}, { message: 'Default amount must be a number' })
  defaultAmount?: number;

  @IsOptional()
  @IsBoolean({ message: 'isTaxable must be a boolean' })
  isTaxable?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;
}

// EmployeeAllowance DTOs
export class CreateEmployeeAllowanceDto {
  @IsString({ message: 'Employee ID must be a string' })
  employeeId!: string;

  @IsString({ message: 'Allowance type ID must be a string' })
  allowanceTypeId!: string;

  @IsNumber({}, { message: 'Amount must be a number' })
  amount!: number;

  @IsEnum(RecurrenceType, { message: 'Invalid recurrence type' })
  recurrence!: RecurrenceType;

  @Type(() => Date)
  @IsDate({ message: 'Effective date must be a valid date' })
  effectiveDate!: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'End date must be a valid date' })
  endDate?: Date;
}

export class UpdateEmployeeAllowanceDto {
  @IsOptional()
  @IsNumber({}, { message: 'Amount must be a number' })
  amount?: number;

  @IsOptional()
  @IsEnum(RecurrenceType, { message: 'Invalid recurrence type' })
  recurrence?: RecurrenceType;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'End date must be a valid date' })
  endDate?: Date;

  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;
}

// EmployeeDeduction DTOs
export class CreateEmployeeDeductionDto {
  @IsString({ message: 'Employee ID must be a string' })
  employeeId!: string;

  @IsString({ message: 'Deduction type ID must be a string' })
  deductionTypeId!: string;

  @IsNumber({}, { message: 'Amount must be a number' })
  amount!: number;

  @IsEnum(RecurrenceType, { message: 'Invalid recurrence type' })
  recurrence!: RecurrenceType;

  @Type(() => Date)
  @IsDate({ message: 'Effective date must be a valid date' })
  effectiveDate!: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'End date must be a valid date' })
  endDate?: Date;
}

export class UpdateEmployeeDeductionDto {
  @IsOptional()
  @IsNumber({}, { message: 'Amount must be a number' })
  amount?: number;

  @IsOptional()
  @IsEnum(RecurrenceType, { message: 'Invalid recurrence type' })
  recurrence?: RecurrenceType;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'End date must be a valid date' })
  endDate?: Date;

  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;
}

// LoanRequest DTOs
export class CreateLoanRequestDto {
  @IsString({ message: 'Employee ID must be a string' })
  employeeId!: string;

  @IsNumber({}, { message: 'Loan amount must be a number' })
  loanAmount!: number;

  @IsNumber({}, { message: 'Number of installments must be a number' })
  numberOfInstallments!: number;

  @IsNumber({}, { message: 'Monthly installment must be a number' })
  monthlyInstallment!: number;

  @Type(() => Date)
  @IsDate({ message: 'Request date must be a valid date' })
  requestDate!: Date;

  @IsOptional()
  @IsString({ message: 'Reason must be a string' })
  reason?: string;
}

export class UpdateLoanRequestDto {
  @IsOptional()
  @IsNumber({}, { message: 'Loan amount must be a number' })
  loanAmount?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Number of installments must be a number' })
  numberOfInstallments?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Monthly installment must be a number' })
  monthlyInstallment?: number;

  @IsOptional()
  @IsString({ message: 'Reason must be a string' })
  reason?: string;
}

