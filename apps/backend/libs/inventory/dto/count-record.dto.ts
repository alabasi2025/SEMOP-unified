import {
  IsString,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * سجل واحد في الجرد (صنف واحد)
 */
export class CountRecordItemDto {
  /**
   * معرف الصنف
   * @example "item-001"
   */
  @IsString()
  @IsNotEmpty({ message: 'معرف الصنف مطلوب' })
  itemId: string;

  /**
   * الكمية المعدودة فعلياً
   * @example 95
   */
  @IsNumber()
  @IsNotEmpty({ message: 'الكمية المعدودة مطلوبة' })
  @Min(0, { message: 'الكمية يجب أن تكون صفر أو أكثر' })
  countedQuantity: number;

  /**
   * ملاحظات خاصة بهذا الصنف (اختياري)
   * @example "وجدت 5 قطع تالفة"
   */
  @IsString()
  @IsOptional()
  notes?: string;
}

/**
 * DTO لإضافة سجلات الجرد (الكميات المعدودة)
 */
export class AddCountRecordsDto {
  /**
   * قائمة سجلات الجرد (مطلوب)
   */
  @IsArray({ message: 'قائمة سجلات الجرد مطلوبة' })
  @ValidateNested({ each: true })
  @Type(() => CountRecordItemDto)
  records: CountRecordItemDto[];
}

/**
 * DTO لإتمام الجرد
 */
export class CompleteCountDto {
  /**
   * المستخدم الذي وافق على الجرد (اختياري)
   * @example "user-456"
   */
  @IsString()
  @IsOptional()
  approvedBy?: string;

  /**
   * ملاحظات الإتمام (اختياري)
   * @example "تم الجرد بنجاح وتم إنشاء التسويات اللازمة"
   */
  @IsString()
  @IsOptional()
  notes?: string;

  /**
   * هل يتم إنشاء تسويات تلقائية للفروقات؟ (افتراضياً true)
   * @example true
   */
  @IsOptional()
  createAdjustments?: boolean;
}
