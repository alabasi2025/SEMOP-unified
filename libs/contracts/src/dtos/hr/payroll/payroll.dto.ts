import { IsString, IsOptional, IsEnum, IsDate, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export enum PayrollStatus {
  DRAFT = 'DRAFT',
  CALCULATED = 'CALCULATED',
  APPROVED = 'APPROVED',
  POSTED = 'POSTED',
  CLOSED = 'CLOSED',
}

// PayrollPeriod DTOs
export class CreatePayrollPeriodDto {
  @IsNumber({}, { message: 'Year must be a number' })
  year!: number;

  @IsNumber({}, { message: 'Month must be a number' })
  month!: number;

  @Type(() => Date)
  @IsDate({ message: 'Start date must be a valid date' })
  startDate!: Date;

  @Type(() => Date)
  @IsDate({ message: 'End date must be a valid date' })
  endDate!: Date;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;
}

export class UpdatePayrollPeriodDto {
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsOptional()
  @IsEnum(PayrollStatus, { message: 'Invalid payroll status' })
  status?: PayrollStatus;
}

// PayrollItem DTOs
export class CreatePayrollItemDto {
  @IsString({ message: 'Payroll period ID must be a string' })
  payrollPeriodId!: string;

  @IsString({ message: 'Employee ID must be a string' })
  employeeId!: string;

  @IsNumber({}, { message: 'Gross salary must be a number' })
  grossSalary!: number;

  @IsOptional()
  @IsNumber({}, { message: 'Working days must be a number' })
  workingDays?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Absent days must be a number' })
  absentDays?: number;
}

export class UpdatePayrollItemDto {
  @IsOptional()
  @IsNumber({}, { message: 'Gross salary must be a number' })
  grossSalary?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Working days must be a number' })
  workingDays?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Absent days must be a number' })
  absentDays?: number;
}

// PayrollAllowance DTOs
export class CreatePayrollAllowanceDto {
  @IsString({ message: 'Payroll item ID must be a string' })
  payrollItemId!: string;

  @IsString({ message: 'Allowance type ID must be a string' })
  allowanceTypeId!: string;

  @IsNumber({}, { message: 'Amount must be a number' })
  amount!: number;
}

export class UpdatePayrollAllowanceDto {
  @IsOptional()
  @IsNumber({}, { message: 'Amount must be a number' })
  amount?: number;
}

// PayrollDeduction DTOs
export class CreatePayrollDeductionDto {
  @IsString({ message: 'Payroll item ID must be a string' })
  payrollItemId!: string;

  @IsString({ message: 'Deduction type ID must be a string' })
  deductionTypeId!: string;

  @IsNumber({}, { message: 'Amount must be a number' })
  amount!: number;
}

export class UpdatePayrollDeductionDto {
  @IsOptional()
  @IsNumber({}, { message: 'Amount must be a number' })
  amount?: number;
}

// PayrollBonus DTOs
export class CreatePayrollBonusDto {
  @IsString({ message: 'Payroll item ID must be a string' })
  payrollItemId!: string;

  @IsString({ message: 'Bonus type ID must be a string' })
  bonusTypeId!: string;

  @IsNumber({}, { message: 'Amount must be a number' })
  amount!: number;

  @IsOptional()
  @IsString({ message: 'Reason must be a string' })
  reason?: string;
}

export class UpdatePayrollBonusDto {
  @IsOptional()
  @IsNumber({}, { message: 'Amount must be a number' })
  amount?: number;

  @IsOptional()
  @IsString({ message: 'Reason must be a string' })
  reason?: string;
}

