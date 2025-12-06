/**
 * SEMOP - Item DTOs
 * @version 0.4.0
 */

import { IsString, IsNumber, IsOptional, IsBoolean, IsUUID, MinLength, MaxLength, Matches, IsEnum, Min } from 'class-validator';


export enum ItemType {
  GOODS = 'GOODS',
  SERVICE = 'SERVICE',
  ASSET = 'ASSET',
}

export enum UnitOfMeasure {
  PIECE = 'PIECE',
  KG = 'KG',
  LITER = 'LITER',
  METER = 'METER',
  BOX = 'BOX',
  CARTON = 'CARTON',
  PALLET = 'PALLET',
}

export class CreateItemDto {
  @IsString()
  @MinLength(2, { message: 'Item code must be at least 2 characters' })
  @MaxLength(20, { message: 'Item code must not exceed 20 characters' })
  @Matches(/^[A-Z0-9-]+$/, { message: 'Item code must contain only uppercase letters, numbers, and hyphens' })
  code: string;

  @IsString()
  @MinLength(2, { message: 'Item name (English) must be at least 2 characters' })
  @MaxLength(200, { message: 'Item name (English) must not exceed 200 characters' })
  nameEn: string;

  @IsString()
  @MinLength(2, { message: 'Item name (Arabic) must be at least 2 characters' })
  @MaxLength(200, { message: 'Item name (Arabic) must not exceed 200 characters' })
  nameAr: string;

  @IsEnum(ItemType, { message: 'Item type must be one of: GOODS, SERVICE, ASSET' })
  type: ItemType;

  @IsEnum(UnitOfMeasure, { message: 'Unit of measure must be valid' })
  unitOfMeasure: UnitOfMeasure;

  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Barcode must not exceed 50 characters' })
  barcode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'SKU must not exceed 50 characters' })
  sku?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Description must not exceed 1000 characters' })
  description?: string;

  @IsBoolean({ message: 'isStockable must be a boolean value' })
  isStockable: boolean;

  @IsBoolean({ message: 'isPurchasable must be a boolean value' })
  isPurchasable: boolean;

  @IsBoolean({ message: 'isSellable must be a boolean value' })
  isSellable: boolean;

  @IsOptional()
  @IsNumber({}, { message: 'Cost price must be a valid number' })
  @Min(0, { message: 'Cost price cannot be negative' })
  costPrice?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Selling price must be a valid number' })
  @Min(0, { message: 'Selling price cannot be negative' })
  sellingPrice?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Minimum selling price must be a valid number' })
  @Min(0, { message: 'Minimum selling price cannot be negative' })
  minSellingPrice?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Reorder level must be a valid number' })
  @Min(0, { message: 'Reorder level cannot be negative' })
  reorderLevel?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Reorder quantity must be a valid number' })
  @Min(0, { message: 'Reorder quantity cannot be negative' })
  reorderQuantity?: number;

  @IsOptional()
  @IsUUID('4', { message: 'Category ID must be a valid UUID' })
  categoryId?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Inventory account ID must be a valid UUID' })
  inventoryAccountId?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Sales account ID must be a valid UUID' })
  salesAccountId?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Purchase account ID must be a valid UUID' })
  purchaseAccountId?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Holding ID must be a valid UUID' })
  holdingId?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Unit ID must be a valid UUID' })
  unitId?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Project ID must be a valid UUID' })
  projectId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Notes must not exceed 1000 characters' })
  notes?: string;
}

export class UpdateItemDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  nameEn?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  nameAr?: string;

  @IsOptional()
  @IsEnum(ItemType)
  type?: ItemType;

  @IsOptional()
  @IsEnum(UnitOfMeasure)
  unitOfMeasure?: UnitOfMeasure;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  barcode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  sku?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsBoolean()
  isStockable?: boolean;

  @IsOptional()
  @IsBoolean()
  isPurchasable?: boolean;

  @IsOptional()
  @IsBoolean()
  isSellable?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  costPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  sellingPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minSellingPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  reorderLevel?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  reorderQuantity?: number;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsUUID()
  inventoryAccountId?: string;

  @IsOptional()
  @IsUUID()
  salesAccountId?: string;

  @IsOptional()
  @IsUUID()
  purchaseAccountId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ItemResponseDto {
  id: string;
  code: string;
  nameEn: string;
  nameAr: string;
  type: ItemType;
  unitOfMeasure: UnitOfMeasure;
  barcode?: string;
  sku?: string;
  description?: string;
  isStockable: boolean;
  isPurchasable: boolean;
  isSellable: boolean;
  costPrice?: number;
  sellingPrice?: number;
  minSellingPrice?: number;
  reorderLevel?: number;
  reorderQuantity?: number;
  categoryId?: string;
  inventoryAccountId?: string;
  salesAccountId?: string;
  purchaseAccountId?: string;
  holdingId?: string;
  unitId?: string;
  projectId?: string;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateItemCategoryDto {
  @IsString()
  @MinLength(2, { message: 'Category code must be at least 2 characters' })
  @MaxLength(20, { message: 'Category code must not exceed 20 characters' })
  @Matches(/^[A-Z0-9-]+$/, { message: 'Category code must contain only uppercase letters, numbers, and hyphens' })
  code: string;

  @IsString()
  @MinLength(2, { message: 'Category name (English) must be at least 2 characters' })
  @MaxLength(100, { message: 'Category name (English) must not exceed 100 characters' })
  nameEn: string;

  @IsString()
  @MinLength(2, { message: 'Category name (Arabic) must be at least 2 characters' })
  @MaxLength(100, { message: 'Category name (Arabic) must not exceed 100 characters' })
  nameAr: string;

  @IsOptional()
  @IsUUID('4', { message: 'Parent category ID must be a valid UUID' })
  parentId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;
}

export class UpdateItemCategoryDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  nameEn?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  nameAr?: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateWarehouseDto {
  @IsString()
  @MinLength(2, { message: 'Warehouse code must be at least 2 characters' })
  @MaxLength(20, { message: 'Warehouse code must not exceed 20 characters' })
  @Matches(/^[A-Z0-9-]+$/, { message: 'Warehouse code must contain only uppercase letters, numbers, and hyphens' })
  code: string;

  @IsString()
  @MinLength(2, { message: 'Warehouse name (English) must be at least 2 characters' })
  @MaxLength(200, { message: 'Warehouse name (English) must not exceed 200 characters' })
  nameEn: string;

  @IsString()
  @MinLength(2, { message: 'Warehouse name (Arabic) must be at least 2 characters' })
  @MaxLength(200, { message: 'Warehouse name (Arabic) must not exceed 200 characters' })
  nameAr: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Location must not exceed 500 characters' })
  location?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Manager name must not exceed 100 characters' })
  manager?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'Phone must not exceed 20 characters' })
  phone?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Holding ID must be a valid UUID' })
  holdingId?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Unit ID must be a valid UUID' })
  unitId?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Project ID must be a valid UUID' })
  projectId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Notes must not exceed 1000 characters' })
  notes?: string;
}

export class UpdateWarehouseDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  nameEn?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  nameAr?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  location?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  manager?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class WarehouseResponseDto {
  id: string;
  code: string;
  nameEn: string;
  nameAr: string;
  location?: string;
  manager?: string;
  phone?: string;
  holdingId?: string;
  unitId?: string;
  projectId?: string;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
