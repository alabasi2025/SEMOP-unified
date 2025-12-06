import { IsString, IsEmail, IsOptional, IsEnum, IsDate, IsNumber, IsBoolean, MinLength, MaxLength, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  TEMPORARY = 'TEMPORARY',
  INTERN = 'INTERN',
}

export enum EmploymentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  SUSPENDED = 'SUSPENDED',
  TERMINATED = 'TERMINATED',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum MaritalStatus {
  SINGLE = 'SINGLE',
  MARRIED = 'MARRIED',
  DIVORCED = 'DIVORCED',
  WIDOWED = 'WIDOWED',
}

// Department DTOs
export class CreateDepartmentDto {
  @IsString({ message: 'Code must be a string' })
  @MinLength(2, { message: 'Code must be at least 2 characters' })
  @MaxLength(20, { message: 'Code must not exceed 20 characters' })
  @Matches(/^[A-Z0-9-]+$/, { message: 'Code must contain only uppercase letters, numbers, and hyphens' })
  code!: string;

  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name!: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'Parent department ID must be a string' })
  parentId?: string;

  @IsOptional()
  @IsString({ message: 'Manager ID must be a string' })
  managerId?: string;

  @IsOptional()
  @IsString({ message: 'Cost center ID must be a string' })
  costCenterId?: string;

  @IsOptional()
  @IsString({ message: 'Holding ID must be a string' })
  holdingId?: string;

  @IsOptional()
  @IsString({ message: 'Unit ID must be a string' })
  unitId?: string;

  @IsOptional()
  @IsString({ message: 'Project ID must be a string' })
  projectId?: string;
}

export class UpdateDepartmentDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'Parent department ID must be a string' })
  parentId?: string;

  @IsOptional()
  @IsString({ message: 'Manager ID must be a string' })
  managerId?: string;

  @IsOptional()
  @IsString({ message: 'Cost center ID must be a string' })
  costCenterId?: string;

  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;
}

// Position DTOs
export class CreatePositionDto {
  @IsString({ message: 'Code must be a string' })
  @MinLength(2, { message: 'Code must be at least 2 characters' })
  @MaxLength(20, { message: 'Code must not exceed 20 characters' })
  @Matches(/^[A-Z0-9-]+$/, { message: 'Code must contain only uppercase letters, numbers, and hyphens' })
  code!: string;

  @IsString({ message: 'Title must be a string' })
  @MinLength(2, { message: 'Title must be at least 2 characters' })
  @MaxLength(100, { message: 'Title must not exceed 100 characters' })
  title!: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Level must be a number' })
  level?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Minimum salary must be a number' })
  minSalary?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Maximum salary must be a number' })
  maxSalary?: number;
}

export class UpdatePositionDto {
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  @MinLength(2, { message: 'Title must be at least 2 characters' })
  @MaxLength(100, { message: 'Title must not exceed 100 characters' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Level must be a number' })
  level?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Minimum salary must be a number' })
  minSalary?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Maximum salary must be a number' })
  maxSalary?: number;

  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;
}

// WorkLocation DTOs
export class CreateWorkLocationDto {
  @IsString({ message: 'Code must be a string' })
  @MinLength(2, { message: 'Code must be at least 2 characters' })
  @MaxLength(20, { message: 'Code must not exceed 20 characters' })
  @Matches(/^[A-Z0-9-]+$/, { message: 'Code must contain only uppercase letters, numbers, and hyphens' })
  code!: string;

  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name!: string;

  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  address?: string;

  @IsOptional()
  @IsString({ message: 'City must be a string' })
  city?: string;

  @IsOptional()
  @IsString({ message: 'Country must be a string' })
  country?: string;
}

export class UpdateWorkLocationDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  address?: string;

  @IsOptional()
  @IsString({ message: 'City must be a string' })
  city?: string;

  @IsOptional()
  @IsString({ message: 'Country must be a string' })
  country?: string;

  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;
}

// Employee DTOs
export class CreateEmployeeDto {
  @IsString({ message: 'Code must be a string' })
  @MinLength(2, { message: 'Code must be at least 2 characters' })
  @MaxLength(20, { message: 'Code must not exceed 20 characters' })
  @Matches(/^[A-Z0-9-]+$/, { message: 'Code must contain only uppercase letters, numbers, and hyphens' })
  code!: string;

  @IsString({ message: 'First name must be a string' })
  @MinLength(2, { message: 'First name must be at least 2 characters' })
  @MaxLength(50, { message: 'First name must not exceed 50 characters' })
  firstName!: string;

  @IsString({ message: 'Last name must be a string' })
  @MinLength(2, { message: 'Last name must be at least 2 characters' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
  lastName!: string;

  @IsOptional()
  @IsString({ message: 'Middle name must be a string' })
  @MaxLength(50, { message: 'Middle name must not exceed 50 characters' })
  middleName?: string;

  @IsEmail({}, { message: 'Invalid email address' })
  email!: string;

  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number format' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Mobile must be a string' })
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid mobile number format' })
  mobile?: string;

  @IsEnum(Gender, { message: 'Invalid gender' })
  gender!: Gender;

  @Type(() => Date)
  @IsDate({ message: 'Date of birth must be a valid date' })
  dateOfBirth!: Date;

  @IsOptional()
  @IsString({ message: 'National ID must be a string' })
  nationalId?: string;

  @IsOptional()
  @IsString({ message: 'Passport number must be a string' })
  passportNumber?: string;

  @IsOptional()
  @IsEnum(MaritalStatus, { message: 'Invalid marital status' })
  maritalStatus?: MaritalStatus;

  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  address?: string;

  @IsOptional()
  @IsString({ message: 'City must be a string' })
  city?: string;

  @IsOptional()
  @IsString({ message: 'Country must be a string' })
  country?: string;

  @Type(() => Date)
  @IsDate({ message: 'Hire date must be a valid date' })
  hireDate!: Date;

  @IsEnum(EmploymentType, { message: 'Invalid employment type' })
  employmentType!: EmploymentType;

  @IsNumber({}, { message: 'Basic salary must be a number' })
  basicSalary!: number;

  @IsString({ message: 'Department ID must be a string' })
  departmentId!: string;

  @IsString({ message: 'Position ID must be a string' })
  positionId!: string;

  @IsOptional()
  @IsString({ message: 'Work location ID must be a string' })
  workLocationId?: string;

  @IsOptional()
  @IsString({ message: 'Manager ID must be a string' })
  managerId?: string;

  @IsOptional()
  @IsString({ message: 'User ID must be a string' })
  userId?: string;

  @IsOptional()
  @IsString({ message: 'Holding ID must be a string' })
  holdingId?: string;

  @IsOptional()
  @IsString({ message: 'Unit ID must be a string' })
  unitId?: string;

  @IsOptional()
  @IsString({ message: 'Project ID must be a string' })
  projectId?: string;
}

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  @MinLength(2, { message: 'First name must be at least 2 characters' })
  @MaxLength(50, { message: 'First name must not exceed 50 characters' })
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  @MinLength(2, { message: 'Last name must be at least 2 characters' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
  lastName?: string;

  @IsOptional()
  @IsString({ message: 'Middle name must be a string' })
  @MaxLength(50, { message: 'Middle name must not exceed 50 characters' })
  middleName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number format' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Mobile must be a string' })
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid mobile number format' })
  mobile?: string;

  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  address?: string;

  @IsOptional()
  @IsString({ message: 'City must be a string' })
  city?: string;

  @IsOptional()
  @IsString({ message: 'Country must be a string' })
  country?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Basic salary must be a number' })
  basicSalary?: number;

  @IsOptional()
  @IsString({ message: 'Department ID must be a string' })
  departmentId?: string;

  @IsOptional()
  @IsString({ message: 'Position ID must be a string' })
  positionId?: string;

  @IsOptional()
  @IsString({ message: 'Work location ID must be a string' })
  workLocationId?: string;

  @IsOptional()
  @IsString({ message: 'Manager ID must be a string' })
  managerId?: string;

  @IsOptional()
  @IsEnum(EmploymentStatus, { message: 'Invalid employment status' })
  status?: EmploymentStatus;
}

// EmployeeDocument DTOs
export class CreateEmployeeDocumentDto {
  @IsString({ message: 'Employee ID must be a string' })
  employeeId!: string;

  @IsString({ message: 'Document type must be a string' })
  @MinLength(2, { message: 'Document type must be at least 2 characters' })
  documentType!: string;

  @IsString({ message: 'Document number must be a string' })
  documentNumber!: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Issue date must be a valid date' })
  issueDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Expiry date must be a valid date' })
  expiryDate?: Date;

  @IsOptional()
  @IsString({ message: 'File URL must be a string' })
  fileUrl?: string;
}

export class UpdateEmployeeDocumentDto {
  @IsOptional()
  @IsString({ message: 'Document type must be a string' })
  @MinLength(2, { message: 'Document type must be at least 2 characters' })
  documentType?: string;

  @IsOptional()
  @IsString({ message: 'Document number must be a string' })
  documentNumber?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Issue date must be a valid date' })
  issueDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Expiry date must be a valid date' })
  expiryDate?: Date;

  @IsOptional()
  @IsString({ message: 'File URL must be a string' })
  fileUrl?: string;
}

// EmployeeContract DTOs
export class CreateEmployeeContractDto {
  @IsString({ message: 'Employee ID must be a string' })
  employeeId!: string;

  @IsString({ message: 'Contract number must be a string' })
  contractNumber!: string;

  @Type(() => Date)
  @IsDate({ message: 'Start date must be a valid date' })
  startDate!: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'End date must be a valid date' })
  endDate?: Date;

  @IsNumber({}, { message: 'Salary must be a number' })
  salary!: number;

  @IsOptional()
  @IsString({ message: 'Terms must be a string' })
  terms?: string;
}

export class UpdateEmployeeContractDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'End date must be a valid date' })
  endDate?: Date;

  @IsOptional()
  @IsNumber({}, { message: 'Salary must be a number' })
  salary?: number;

  @IsOptional()
  @IsString({ message: 'Terms must be a string' })
  terms?: string;
}

