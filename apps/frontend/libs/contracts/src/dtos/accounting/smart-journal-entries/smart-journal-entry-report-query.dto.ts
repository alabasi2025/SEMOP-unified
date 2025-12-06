import { IsOptional, IsDateString, IsString, IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class SmartJournalEntryReportQueryDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  status?: 'Pending' | 'Approved' | 'Rejected'; // افتراض حالات القيد الذكي

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  accountIds?: string[]; // تصفية حسب الحسابات المتأثرة

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  costCenterIds?: string[]; // تصفية حسب مراكز التكلفة

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset?: number;
}
