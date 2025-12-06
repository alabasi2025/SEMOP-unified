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
 * DTO لإنشاء صنف جديد
 * 
 * يحتوي على جميع الحقول المطلوبة والاختيارية لإنشاء صنف في نظام المخازن
 */
export class CreateItemDto {
  /**
   * رمز الصنف (مطلوب وفريد)
   * @example "ITM-001"
   */
  @IsString()
  @IsNotEmpty({ message: 'رمز الصنف مطلوب' })
  @MaxLength(50, { message: 'رمز الصنف يجب ألا يتجاوز 50 حرف' })
  code: string;

  /**
   * اسم الصنف بالعربية (مطلوب)
   * @example "جهاز كمبيوتر محمول"
   */
  @IsString()
  @IsNotEmpty({ message: 'اسم الصنف بالعربية مطلوب' })
  @MaxLength(255, { message: 'اسم الصنف يجب ألا يتجاوز 255 حرف' })
  nameAr: string;

  /**
   * اسم الصنف بالإنجليزية (اختياري)
   * @example "Laptop Computer"
   */
  @IsString()
  @IsOptional()
  @MaxLength(255)
  nameEn?: string;

  /**
   * وصف الصنف (اختياري)
   * @example "جهاز كمبيوتر محمول من نوع Dell بمعالج Intel Core i7"
   */
  @IsString()
  @IsOptional()
  description?: string;

  /**
   * معرف الفئة (اختياري)
   * @example "cat-electronics"
   */
  @IsString()
  @IsOptional()
  categoryId?: string;

  /**
   * اسم الفئة (اختياري)
   * @example "إلكترونيات"
   */
  @IsString()
  @IsOptional()
  categoryName?: string;

  /**
   * معرف الوحدة (اختياري)
   * @example "unit-piece"
   */
  @IsString()
  @IsOptional()
  unitId?: string;

  /**
   * اسم الوحدة (اختياري)
   * @example "قطعة"
   */
  @IsString()
  @IsOptional()
  unitName?: string;

  /**
   * الباركود (اختياري وفريد)
   * @example "1234567890123"
   */
  @IsString()
  @IsOptional()
  @MaxLength(100)
  barcode?: string;

  /**
   * رمز SKU (اختياري وفريد)
   * @example "DELL-LAP-001"
   */
  @IsString()
  @IsOptional()
  @MaxLength(100)
  sku?: string;

  /**
   * الحد الأدنى للمخزون (اختياري)
   * @example 10
   */
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'الحد الأدنى يجب أن يكون صفر أو أكثر' })
  minStock?: number;

  /**
   * الحد الأقصى للمخزون (اختياري)
   * @example 100
   */
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'الحد الأقصى يجب أن يكون صفر أو أكثر' })
  maxStock?: number;

  /**
   * نقطة إعادة الطلب (اختياري)
   * @example 20
   */
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'نقطة إعادة الطلب يجب أن تكون صفر أو أكثر' })
  reorderPoint?: number;

  /**
   * سعر التكلفة (اختياري)
   * @example 5000
   */
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'سعر التكلفة يجب أن يكون صفر أو أكثر' })
  costPrice?: number;

  /**
   * سعر البيع (اختياري)
   * @example 7000
   */
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'سعر البيع يجب أن يكون صفر أو أكثر' })
  sellingPrice?: number;

  /**
   * حالة الصنف (نشط/غير نشط) - افتراضياً نشط
   * @example true
   */
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
