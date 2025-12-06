import { IsOptional, IsDateString, IsString } from 'class-validator';

export class GetReportDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  itemId?: string;

  @IsOptional()
  @IsString()
  warehouseId?: string;
}
