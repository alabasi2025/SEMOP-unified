import {
  IsString,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsEnum,
  IsDateString,
  Min,
  MaxLength,
} from 'class-validator';

/**
 * أنواع حركات المخزون
 */
export enum MovementType {
  IN = 'IN',           // إدخال
  OUT = 'OUT',         // إخراج
  TRANSFER = 'TRANSFER', // تحويل
  ADJUSTMENT = 'ADJUSTMENT', // تسوية
}

/**
 * أنواع المراجع للحركات
 */
export enum ReferenceType {
  PURCHASE = 'PURCHASE',     // شراء
  SALE = 'SALE',             // بيع
  PRODUCTION = 'PRODUCTION', // إنتاج
  RETURN = 'RETURN',         // مرتجع
  DAMAGE = 'DAMAGE',         // تالف
  LOSS = 'LOSS',             // فاقد
  FOUND = 'FOUND',           // موجود
}

/**
 * DTO لحركة المخزون
 * 
 * يستخدم لعرض معلومات حركة المخزون
 */
export class StockMovementDto {
  /**
   * معرف الحركة
   */
  id: string;

  /**
   * رقم الحركة
   */
  movementNumber: string;

  /**
   * نوع الحركة
   */
  movementType: MovementType;

  /**
   * معرف المستودع
   */
  warehouseId: string;

  /**
   * معرف الصنف
   */
  itemId: string;

  /**
   * الكمية
   */
  quantity: number;

  /**
   * معرف المستودع المصدر (للتحويلات)
   */
  fromWarehouseId?: string;

  /**
   * معرف المستودع الوجهة (للتحويلات)
   */
  toWarehouseId?: string;

  /**
   * نوع المرجع
   */
  referenceType?: ReferenceType;

  /**
   * معرف المرجع
   */
  referenceId?: string;

  /**
   * رقم المرجع
   */
  referenceNumber?: string;

  /**
   * ملاحظات
   */
  notes?: string;

  /**
   * المستخدم الذي أنشأ الحركة
   */
  createdBy?: string;

  /**
   * تاريخ الحركة
   */
  movementDate: Date;

  /**
   * تاريخ الإنشاء
   */
  createdAt: Date;

  /**
   * تاريخ آخر تحديث
   */
  updatedAt: Date;
}
