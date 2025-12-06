import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  IsArray,
  MaxLength,
} from 'class-validator';

/**
 * DTO لإنشاء عملية جرد جديدة
 */
export class CreateCountDto {
  /**
   * معرف المستودع المراد جرده (مطلوب)
   * @example "wh-001"
   */
  @IsString()
  @IsNotEmpty({ message: 'معرف المستودع مطلوب' })
  warehouseId: string;

  /**
   * تاريخ الجرد (اختياري - افتراضياً الآن)
   * @example "2024-12-06"
   */
  @IsDateString()
  @IsOptional()
  countDate?: string;

  /**
   * قائمة معرفات الأصناف المراد جردها (اختياري - إذا لم يتم تحديدها يتم جرد جميع الأصناف)
   * @example ["item-001", "item-002", "item-003"]
   */
  @IsArray()
  @IsOptional()
  itemIds?: string[];

  /**
   * المستخدم الذي يقوم بالجرد (اختياري)
   * @example "user-123"
   */
  @IsString()
  @IsOptional()
  countedBy?: string;

  /**
   * ملاحظات (اختياري)
   * @example "جرد نهاية السنة المالية"
   */
  @IsString()
  @IsOptional()
  notes?: string;
}
