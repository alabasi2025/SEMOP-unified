import { IsString, IsOptional, IsNumber, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateStockMovementDto {
  @IsString()
  @IsNotEmpty()
  movementType: string; // IN, OUT, TRANSFER, ADJUSTMENT

  @IsString()
  @IsNotEmpty()
  warehouseId: string;

  @IsString()
  @IsNotEmpty()
  itemId: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsOptional()
  fromWarehouseId?: string;

  @IsString()
  @IsOptional()
  toWarehouseId?: string;

  @IsString()
  @IsOptional()
  referenceType?: string;

  @IsString()
  @IsOptional()
  referenceId?: string;

  @IsString()
  @IsOptional()
  referenceNumber?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  createdBy?: string;

  @IsDateString()
  @IsOptional()
  movementDate?: string;
}

export class StockMovementResponseDto {
  id: string;
  movementNumber: string;
  movementType: string;
  warehouseId: string;
  itemId: string;
  quantity: number;
  fromWarehouseId?: string;
  toWarehouseId?: string;
  referenceType?: string;
  referenceId?: string;
  referenceNumber?: string;
  notes?: string;
  createdBy?: string;
  movementDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
