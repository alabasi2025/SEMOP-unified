import { IsString, IsOptional, IsBoolean, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateWarehouseDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  nameAr: string;

  @IsString()
  @IsOptional()
  nameEn?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  managerId?: string;

  @IsString()
  @IsOptional()
  managerName?: string;

  @IsNumber()
  @IsOptional()
  capacity?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateWarehouseDto {
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  nameAr?: string;

  @IsString()
  @IsOptional()
  nameEn?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  managerId?: string;

  @IsString()
  @IsOptional()
  managerName?: string;

  @IsNumber()
  @IsOptional()
  capacity?: number;

  @IsNumber()
  @IsOptional()
  currentStock?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class WarehouseResponseDto {
  id: string;
  code: string;
  nameAr: string;
  nameEn?: string;
  location?: string;
  managerId?: string;
  managerName?: string;
  capacity?: number;
  currentStock?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
