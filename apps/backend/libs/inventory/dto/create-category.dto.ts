import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';

/**
 * DTO لإنشاء فئة أصناف جديدة
 */
export class CreateCategoryDto {
  /**
   * رمز الفئة (مطلوب وفريد)
   * @example "CAT-ELEC"
   */
  @IsString()
  @IsNotEmpty({ message: 'رمز الفئة مطلوب' })
  @MaxLength(50, { message: 'رمز الفئة يجب ألا يتجاوز 50 حرف' })
  code: string;

  /**
   * اسم الفئة بالعربية (مطلوب)
   * @example "إلكترونيات"
   */
  @IsString()
  @IsNotEmpty({ message: 'اسم الفئة بالعربية مطلوب' })
  @MaxLength(255, { message: 'اسم الفئة يجب ألا يتجاوز 255 حرف' })
  nameAr: string;

  /**
   * اسم الفئة بالإنجليزية (اختياري)
   * @example "Electronics"
   */
  @IsString()
  @IsOptional()
  @MaxLength(255)
  nameEn?: string;

  /**
   * وصف الفئة (اختياري)
   * @example "جميع الأجهزة الإلكترونية والكهربائية"
   */
  @IsString()
  @IsOptional()
  description?: string;

  /**
   * معرف الفئة الأب (اختياري - للفئات الفرعية)
   * @example "cat-main"
   */
  @IsString()
  @IsOptional()
  parentId?: string;

  /**
   * حالة الفئة (نشط/غير نشط) - افتراضياً نشط
   * @example true
   */
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
