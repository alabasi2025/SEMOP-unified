import {
  IsString,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsEnum,
  IsDateString,
  Min,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { MovementType, ReferenceType } from './stock-movement.dto';

/**
 * DTO لإنشاء حركة مخزون جديدة
 * 
 * يحتوي على جميع الحقول المطلوبة لإنشاء حركة إدخال أو إخراج أو تسوية
 */
export class CreateMovementDto {
  /**
   * نوع الحركة (مطلوب)
   * @example "IN"
   */
  @IsEnum(MovementType, { message: 'نوع الحركة غير صحيح' })
  @IsNotEmpty({ message: 'نوع الحركة مطلوب' })
  movementType: MovementType;

  /**
   * معرف المستودع (مطلوب)
   * @example "wh-001"
   */
  @IsString()
  @IsNotEmpty({ message: 'معرف المستودع مطلوب' })
  warehouseId: string;

  /**
   * معرف الصنف (مطلوب)
   * @example "item-001"
   */
  @IsString()
  @IsNotEmpty({ message: 'معرف الصنف مطلوب' })
  itemId: string;

  /**
   * الكمية (مطلوب)
   * @example 100
   */
  @IsNumber()
  @IsNotEmpty({ message: 'الكمية مطلوبة' })
  @Min(0.01, { message: 'الكمية يجب أن تكون أكبر من صفر' })
  quantity: number;

  /**
   * معرف المستودع المصدر (مطلوب للتحويلات فقط)
   * @example "wh-002"
   */
  @ValidateIf((o) => o.movementType === MovementType.TRANSFER)
  @IsString()
  @IsNotEmpty({ message: 'معرف المستودع المصدر مطلوب للتحويلات' })
  fromWarehouseId?: string;

  /**
   * معرف المستودع الوجهة (مطلوب للتحويلات فقط)
   * @example "wh-003"
   */
  @ValidateIf((o) => o.movementType === MovementType.TRANSFER)
  @IsString()
  @IsNotEmpty({ message: 'معرف المستودع الوجهة مطلوب للتحويلات' })
  toWarehouseId?: string;

  /**
   * نوع المرجع (اختياري)
   * @example "PURCHASE"
   */
  @IsEnum(ReferenceType)
  @IsOptional()
  referenceType?: ReferenceType;

  /**
   * معرف المرجع (اختياري)
   * @example "po-12345"
   */
  @IsString()
  @IsOptional()
  referenceId?: string;

  /**
   * رقم المرجع (اختياري)
   * @example "PO-2024-001"
   */
  @IsString()
  @IsOptional()
  @MaxLength(100)
  referenceNumber?: string;

  /**
   * ملاحظات (اختياري)
   * @example "شراء من المورد الرئيسي"
   */
  @IsString()
  @IsOptional()
  notes?: string;

  /**
   * تاريخ الحركة (اختياري - افتراضياً الآن)
   * @example "2024-12-06T10:30:00Z"
   */
  @IsDateString()
  @IsOptional()
  movementDate?: string;

  /**
   * المستخدم الذي أنشأ الحركة (اختياري)
   * @example "user-123"
   */
  @IsString()
  @IsOptional()
  createdBy?: string;
}
