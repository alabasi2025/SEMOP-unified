import { IsString, IsOptional, IsEnum, IsDate, IsNumber, IsBoolean, MinLength, MaxLength, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  LEAVE = 'LEAVE',
  HALF_DAY = 'HALF_DAY',
}

export enum DayType {
  WORKING_DAY = 'WORKING_DAY',
  WEEKEND = 'WEEKEND',
  HOLIDAY = 'HOLIDAY',
}

// Shift DTOs
export class CreateShiftDto {
  @IsString({ message: 'Code must be a string' })
  @MinLength(2, { message: 'Code must be at least 2 characters' })
  @MaxLength(20, { message: 'Code must not exceed 20 characters' })
  @Matches(/^[A-Z0-9-]+$/, { message: 'Code must contain only uppercase letters, numbers, and hyphens' })
  code!: string;

  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name!: string;

  @IsString({ message: 'Start time must be a string' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Start time must be in HH:MM format' })
  startTime!: string;

  @IsString({ message: 'End time must be a string' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'End time must be in HH:MM format' })
  endTime!: string;

  @IsNumber({}, { message: 'Work hours must be a number' })
  workHours!: number;

  @IsOptional()
  @IsNumber({}, { message: 'Grace period must be a number' })
  gracePeriodMinutes?: number;
}

export class UpdateShiftDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Start time must be a string' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Start time must be in HH:MM format' })
  startTime?: string;

  @IsOptional()
  @IsString({ message: 'End time must be a string' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'End time must be in HH:MM format' })
  endTime?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Work hours must be a number' })
  workHours?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Grace period must be a number' })
  gracePeriodMinutes?: number;

  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;
}

// EmployeeShift DTOs
export class CreateEmployeeShiftDto {
  @IsString({ message: 'Employee ID must be a string' })
  employeeId!: string;

  @IsString({ message: 'Shift ID must be a string' })
  shiftId!: string;

  @Type(() => Date)
  @IsDate({ message: 'Effective date must be a valid date' })
  effectiveDate!: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'End date must be a valid date' })
  endDate?: Date;
}

export class UpdateEmployeeShiftDto {
  @IsOptional()
  @IsString({ message: 'Shift ID must be a string' })
  shiftId?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'End date must be a valid date' })
  endDate?: Date;
}

// AttendanceRecord DTOs
export class CreateAttendanceRecordDto {
  @IsString({ message: 'Employee ID must be a string' })
  employeeId!: string;

  @Type(() => Date)
  @IsDate({ message: 'Date must be a valid date' })
  date!: Date;

  @Type(() => Date)
  @IsDate({ message: 'Check-in time must be a valid date' })
  checkIn!: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Check-out time must be a valid date' })
  checkOut?: Date;

  @IsEnum(AttendanceStatus, { message: 'Invalid attendance status' })
  status!: AttendanceStatus;
}

export class UpdateAttendanceRecordDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Check-out time must be a valid date' })
  checkOut?: Date;

  @IsOptional()
  @IsEnum(AttendanceStatus, { message: 'Invalid attendance status' })
  status?: AttendanceStatus;

  @IsOptional()
  @IsNumber({}, { message: 'Work minutes must be a number' })
  workMinutes?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Late minutes must be a number' })
  lateMinutes?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Overtime minutes must be a number' })
  overtimeMinutes?: number;
}

// OvertimeRequest DTOs
export class CreateOvertimeRequestDto {
  @IsString({ message: 'Employee ID must be a string' })
  employeeId!: string;

  @Type(() => Date)
  @IsDate({ message: 'Date must be a valid date' })
  date!: Date;

  @IsNumber({}, { message: 'Hours must be a number' })
  hours!: number;

  @IsOptional()
  @IsString({ message: 'Reason must be a string' })
  reason?: string;
}

export class UpdateOvertimeRequestDto {
  @IsOptional()
  @IsNumber({}, { message: 'Hours must be a number' })
  hours?: number;

  @IsOptional()
  @IsString({ message: 'Reason must be a string' })
  reason?: string;
}

