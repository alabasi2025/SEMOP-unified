import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsNotEmpty,
  Min,
  MaxLength,
} from 'class-validator';

/**
 * DTO لإنشاء مستودع جديد
 * 
 * يحتوي على جميع الحقول المطلوبة والاختيارية لإنشاء مستودع في نظام المخازن
 */
export class CreateWarehouseDto {
  /**
   * رمز المستودع (مطلوب وفريد)
   * @example "WH-001"
   */
  @IsString()
  @IsNotEmpty({ message: 'رمز المستودع مطلوب' })
  @MaxLength(50, { message: 'رمز المستودع يجب ألا يتجاوز 50 حرف' })
  code: string;

  /**
   * اسم المستودع بالعربية (مطلوب)
   * @example "المستودع الرئيسي"
   */
  @IsString()
  @IsNotEmpty({ message: 'اسم المستودع بالعربية مطلوب' })
  @MaxLength(255, { message: 'اسم المستودع يجب ألا يتجاوز 255 حرف' })
  nameAr: string;

  /**
   * اسم المستودع بالإنجليزية (اختياري)
   * @example "Main Warehouse"
   */
  @IsString()
  @IsOptional()
  @MaxLength(255)
  nameEn?: string;

  /**
   * موقع المستودع (اختياري)
   * @example "صنعاء - شارع الزبيري"
   */
  @IsString()
  @IsOptional()
  location?: string;

  /**
   * معرف المسؤول عن المستودع (اختياري)
   * @example "user-123"
   */
  @IsString()
  @IsOptional()
  managerId?: string;

  /**
   * اسم المسؤول عن المستودع (اختياري)
   * @example "أحمد محمد"
   */
  @IsString()
  @IsOptional()
  @MaxLength(255)
  managerName?: string;

  /**
   * السعة الإجمالية للمستودع (اختياري)
   * @example 10000
   */
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'السعة يجب أن تكون صفر أو أكثر' })
  capacity?: number;

  /**
   * حالة المستودع (نشط/غير نشط) - افتراضياً نشط
   * @example true
   */
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
