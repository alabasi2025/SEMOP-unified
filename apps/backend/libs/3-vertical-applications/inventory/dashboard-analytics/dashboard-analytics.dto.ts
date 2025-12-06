// /root/task_outputs/Task7_Dashboard_Analytics/backend/dashboard-analytics.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsArray, ValidateNested, IsDateString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

// DTO for Category Distribution
export class CategoryDistributionDto {
  @ApiProperty({ description: 'اسم الفئة', example: 'أجهزة إلكترونية' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'عدد الأصناف في الفئة', example: 150 })
  @IsNumber()
  value: number;
}

// DTO for Monthly Stock Movement
export class MonthlyStockMovementDto {
  @ApiProperty({ description: 'الشهر', example: 'يناير 2025' })
  @IsString()
  month: string;

  @ApiProperty({ description: 'الكمية الواردة', example: 500 })
  @IsNumber()
  incoming: number;

  @ApiProperty({ description: 'الكمية الصادرة', example: 200 })
  @IsNumber()
  outgoing: number;
}

// DTO for the main analytics response
export class DashboardAnalyticsResponseDto {
  @ApiProperty({ description: 'العدد الكلي للأصناف', example: 1250 })
  @IsNumber()
  totalItems: number;

  @ApiProperty({ description: 'الكمية الكلية للمخزون', example: 5500 })
  @IsNumber()
  totalStockQuantity: number;

  @ApiProperty({ description: 'القيمة الكلية للمخزون (بالريال السعودي)', example: 150000.75 })
  @IsNumber()
  totalStockValue: number;

  @ApiProperty({ type: [CategoryDistributionDto], description: 'توزيع الأصناف حسب الفئة' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryDistributionDto)
  categoryDistribution: CategoryDistributionDto[];

  @ApiProperty({ type: [MonthlyStockMovementDto], description: 'حركة المخزون الشهرية' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MonthlyStockMovementDto)
  monthlyStockMovement: MonthlyStockMovementDto[];
}

// DTO for the request query parameters (filters)
export class DashboardAnalyticsQueryDto {
  @ApiProperty({ description: 'تاريخ البدء (صيغة ISO 8601)', example: '2024-01-01', required: false })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ description: 'تاريخ الانتهاء (صيغة ISO 8601)', example: '2024-12-31', required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}
