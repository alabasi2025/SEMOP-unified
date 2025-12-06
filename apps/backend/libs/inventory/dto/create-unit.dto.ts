import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';

/**
 * DTO لإنشاء وحدة قياس جديدة
 */
export class CreateUnitDto {
  /**
   * رمز الوحدة (مطلوب وفريد)
   * @example "UNIT-PC"
   */
  @IsString()
  @IsNotEmpty({ message: 'رمز الوحدة مطلوب' })
  @MaxLength(50, { message: 'رمز الوحدة يجب ألا يتجاوز 50 حرف' })
  code: string;

  /**
   * اسم الوحدة بالعربية (مطلوب)
   * @example "قطعة"
   */
  @IsString()
  @IsNotEmpty({ message: 'اسم الوحدة بالعربية مطلوب' })
  @MaxLength(255, { message: 'اسم الوحدة يجب ألا يتجاوز 255 حرف' })
  nameAr: string;

  /**
   * اسم الوحدة بالإنجليزية (اختياري)
   * @example "Piece"
   */
  @IsString()
  @IsOptional()
  @MaxLength(255)
  nameEn?: string;

  /**
   * رمز الوحدة المختصر (اختياري)
   * @example "PC"
   */
  @IsString()
  @IsOptional()
  @MaxLength(20)
  symbol?: string;

  /**
   * حالة الوحدة (نشط/غير نشط) - افتراضياً نشط
   * @example true
   */
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
