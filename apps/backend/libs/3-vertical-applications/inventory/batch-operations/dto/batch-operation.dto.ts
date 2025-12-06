import { IsArray, IsNotEmpty, IsString, ArrayMinSize, IsOptional } from 'class-validator';

export class BatchOperationDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty({ each: true })
  readonly itemIds: string[];

  @IsString()
  @IsNotEmpty()
  readonly operationType: 'updateStatus' | 'delete' | 'updateLocation'; // أنواع العمليات المجمعة

  @IsOptional()
  @IsString()
  readonly value?: string; // القيمة الجديدة للعملية (مثل الحالة الجديدة أو الموقع الجديد)
}

export class BatchOperationResponseDto {
  readonly success: boolean;
  readonly processedCount: number;
  readonly message: string;
  readonly errors?: { itemId: string; reason: string }[];
}
