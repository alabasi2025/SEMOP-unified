import {
  IsString,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * صنف في التحويل
 */
export class TransferItemDto {
  /**
   * معرف الصنف
   * @example "item-001"
   */
  @IsString()
  @IsNotEmpty({ message: 'معرف الصنف مطلوب' })
  itemId: string;

  /**
   * الكمية المراد تحويلها
   * @example 50
   */
  @IsNumber()
  @IsNotEmpty({ message: 'الكمية مطلوبة' })
  @Min(0.01, { message: 'الكمية يجب أن تكون أكبر من صفر' })
  quantity: number;

  /**
   * ملاحظات خاصة بهذا الصنف (اختياري)
   * @example "تأكد من التغليف الجيد"
   */
  @IsString()
  @IsOptional()
  notes?: string;
}

/**
 * DTO لإنشاء تحويل بين مستودعات
 */
export class CreateTransferDto {
  /**
   * معرف المستودع المصدر (مطلوب)
   * @example "wh-001"
   */
  @IsString()
  @IsNotEmpty({ message: 'معرف المستودع المصدر مطلوب' })
  fromWarehouseId: string;

  /**
   * معرف المستودع الوجهة (مطلوب)
   * @example "wh-002"
   */
  @IsString()
  @IsNotEmpty({ message: 'معرف المستودع الوجهة مطلوب' })
  toWarehouseId: string;

  /**
   * قائمة الأصناف المراد تحويلها (مطلوب)
   */
  @IsArray({ message: 'قائمة الأصناف مطلوبة' })
  @ValidateNested({ each: true })
  @Type(() => TransferItemDto)
  items: TransferItemDto[];

  /**
   * سبب التحويل (اختياري)
   * @example "نقل مخزون إلى الفرع الجديد"
   */
  @IsString()
  @IsOptional()
  reason?: string;

  /**
   * ملاحظات عامة (اختياري)
   * @example "يرجى التسليم قبل نهاية الأسبوع"
   */
  @IsString()
  @IsOptional()
  notes?: string;

  /**
   * المستخدم الطالب (اختياري)
   * @example "user-123"
   */
  @IsString()
  @IsOptional()
  requestedBy?: string;
}

/**
 * DTO للموافقة على التحويل أو رفضه
 */
export class ApproveTransferDto {
  /**
   * المستخدم الموافق (اختياري)
   * @example "user-456"
   */
  @IsString()
  @IsOptional()
  approvedBy?: string;

  /**
   * ملاحظات الموافقة (اختياري)
   * @example "تمت الموافقة"
   */
  @IsString()
  @IsOptional()
  notes?: string;
}

/**
 * DTO لرفض التحويل
 */
export class RejectTransferDto {
  /**
   * المستخدم الرافض (اختياري)
   * @example "user-456"
   */
  @IsString()
  @IsOptional()
  rejectedBy?: string;

  /**
   * سبب الرفض (مطلوب)
   * @example "الكمية غير متوفرة في المستودع المصدر"
   */
  @IsString()
  @IsNotEmpty({ message: 'سبب الرفض مطلوب' })
  reason: string;
}
