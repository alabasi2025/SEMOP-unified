import { IsBoolean, IsDate, IsNotEmpty, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';

/**
 * DTO لتمثيل قالب الإيراد الافتراضي.
 */
export class RevenueTemplateDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsNotEmpty()
  isVirtual: boolean; // يجب أن يكون true للقوالب الافتراضية

  @IsObject()
  @IsNotEmpty()
  templateData: any; // هيكل البيانات الفعلي للإيراد (مثل الحسابات، الأصناف، إلخ)

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;
}

/**
 * DTO لإنشاء قالب إيراد افتراضي جديد.
 */
export class CreateRevenueTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isVirtual?: boolean = true; // افتراضيًا هو قالب افتراضي

  @IsObject()
  @IsNotEmpty()
  templateData: any;
}

/**
 * DTO لتحديث قالب إيراد افتراضي موجود.
 */
export class UpdateRevenueTemplateDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @IsOptional()
  templateData?: any;
}
