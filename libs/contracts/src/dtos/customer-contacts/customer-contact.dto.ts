import { IsUUID, IsString, IsEmail, IsOptional, IsBoolean, Length } from 'class-validator';
// No need for PartialType - using TypeScript Partial<T>

// DTO لإنشاء جهة اتصال جديدة
export class CreateCustomerContactDto {
  @IsUUID('4', { message: 'Customer ID must be a valid UUID' })
  customerId: string;

  @IsString({ message: 'Full name must be a string' })
  @Length(1, 100, { message: 'Full name must be between 1 and 100 characters' })
  fullName: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @Length(0, 100, { message: 'Email must be at most 100 characters' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  @Length(0, 20, { message: 'Phone must be at most 20 characters' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Contact type must be a string' })
  @Length(0, 20, { message: 'Contact type must be at most 20 characters' })
  contactType?: string;

  @IsOptional()
  @IsBoolean({ message: 'isPrimary must be a boolean value' })
  isPrimary?: boolean = true;
}

// DTO لتحديث جهة اتصال موجودة
// نستخدم PartialType لجعل جميع الحقول اختيارية
// DTO لتحديث جهة اتصال موجودة - استخدم Partial<CreateCustomerContactDto> في الكود
export type UpdateCustomerContactDto = Partial<CreateCustomerContactDto>;
