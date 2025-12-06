import { IsUUID, IsString, IsNotEmpty, IsOptional, IsBoolean, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

// Base DTO for Sales Template
export class SalesTemplateDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  type: 'Invoice' | 'Quotation' | 'SalesOrder' | string; // يمكن توسيعها لاحقاً

  @IsObject()
  @IsNotEmpty()
  templateData: Record<string, any>;

  @IsBoolean()
  isDefault: boolean;

  @IsUUID()
  holdingId: string;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  updatedAt: Date;
}

// DTO for creating a new Sales Template
export class CreateSalesTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  type: 'Invoice' | 'Quotation' | 'SalesOrder' | string;

  @IsObject()
  @IsNotEmpty()
  templateData: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean = false;
}

// DTO for updating an existing Sales Template
export class UpdateSalesTemplateDto extends CreateSalesTemplateDto {
  @IsUUID()
  @IsOptional()
  id?: string;
}
