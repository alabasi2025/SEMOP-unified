import {
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
  IsNumber,
  Min,
} from 'class-validator';
import { MovementType } from './stock-movement.dto';

/**
 * DTO لفلاتر التقارير
 */
export class ReportFiltersDto {
  /**
   * معرف المستودع (اختياري)
   * @example "wh-001"
   */
  @IsString()
  @IsOptional()
  warehouseId?: string;

  /**
   * معرف الصنف (اختياري)
   * @example "item-001"
   */
  @IsString()
  @IsOptional()
  itemId?: string;

  /**
   * معرف الفئة (اختياري)
   * @example "cat-electronics"
   */
  @IsString()
  @IsOptional()
  categoryId?: string;

  /**
   * تاريخ البداية (اختياري)
   * @example "2024-01-01"
   */
  @IsDateString()
  @IsOptional()
  startDate?: string;

  /**
   * تاريخ النهاية (اختياري)
   * @example "2024-12-31"
   */
  @IsDateString()
  @IsOptional()
  endDate?: string;

  /**
   * نوع الحركة (اختياري)
   * @example "IN"
   */
  @IsEnum(MovementType)
  @IsOptional()
  movementType?: MovementType;

  /**
   * رقم الصفحة (للتصفح)
   * @example 1
   */
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number;

  /**
   * عدد العناصر في الصفحة
   * @example 50
   */
  @IsNumber()
  @IsOptional()
  @Min(1)
  limit?: number;
}

/**
 * DTO لتقرير الأصناف الناقصة
 */
export class LowStockReportDto {
  /**
   * معرف المستودع (اختياري)
   * @example "wh-001"
   */
  @IsString()
  @IsOptional()
  warehouseId?: string;

  /**
   * معرف الفئة (اختياري)
   * @example "cat-electronics"
   */
  @IsString()
  @IsOptional()
  categoryId?: string;

  /**
   * عرض الأصناف التي وصلت لنقطة إعادة الطلب فقط
   * @example true
   */
  @IsOptional()
  reorderPointOnly?: boolean;
}

/**
 * DTO لتقرير الأصناف الراكدة
 */
export class InactiveItemsReportDto {
  /**
   * معرف المستودع (اختياري)
   * @example "wh-001"
   */
  @IsString()
  @IsOptional()
  warehouseId?: string;

  /**
   * عدد الأيام بدون حركة (افتراضياً 90 يوم)
   * @example 90
   */
  @IsNumber()
  @IsOptional()
  @Min(1)
  daysWithoutMovement?: number;
}

/**
 * DTO لتقرير قيمة المخزون
 */
export class StockValueReportDto {
  /**
   * معرف المستودع (اختياري)
   * @example "wh-001"
   */
  @IsString()
  @IsOptional()
  warehouseId?: string;

  /**
   * معرف الفئة (اختياري)
   * @example "cat-electronics"
   */
  @IsString()
  @IsOptional()
  categoryId?: string;

  /**
   * تاريخ التقرير (اختياري - افتراضياً الآن)
   * @example "2024-12-31"
   */
  @IsDateString()
  @IsOptional()
  asOfDate?: string;
}
