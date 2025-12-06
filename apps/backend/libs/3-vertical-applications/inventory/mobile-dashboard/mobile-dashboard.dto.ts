import { ApiProperty } from '@nestjs/swagger';

export class MobileDashboardDto {
  @ApiProperty({ description: 'عدد الأصناف الكلي', example: 1500 })
  totalItems: number;

  @ApiProperty({ description: 'عدد المخازن الكلي', example: 5 })
  totalWarehouses: number;

  @ApiProperty({ description: 'عدد الأصناف ذات المخزون المنخفض', example: 45 })
  lowStockItems: number;

  @ApiProperty({ description: 'آخر تحديث للبيانات', example: '2025-12-06T10:00:00Z' })
  lastUpdate: string;
}
