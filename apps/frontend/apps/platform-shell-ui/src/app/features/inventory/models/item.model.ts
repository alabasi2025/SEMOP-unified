export interface Item {
  id: number;
  code: string;
  name: string;
  nameEn?: string;
  description?: string;
  categoryId: number;
  category?: Category;
  unitId: number;
  unit?: Unit;
  barcode?: string;
  sku?: string;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  costPrice: number;
  sellingPrice: number;
  isActive: boolean;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateItemDto {
  code: string;
  name: string;
  nameEn?: string;
  description?: string;
  categoryId: number;
  unitId: number;
  barcode?: string;
  sku?: string;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  costPrice: number;
  sellingPrice: number;
  isActive?: boolean;
  imageUrl?: string;
}

export interface UpdateItemDto extends Partial<CreateItemDto> {
  id: number;
}

export interface ItemStock {
  itemId: number;
  item?: Item;
  warehouseId: number;
  warehouse?: Warehouse;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lastUpdated: Date;
}

export interface ItemStockHistory {
  id: number;
  itemId: number;
  warehouseId: number;
  quantity: number;
  type: 'in' | 'out' | 'transfer' | 'adjustment';
  reference?: string;
  notes?: string;
  createdBy: number;
  createdAt: Date;
}

// Import types for cross-references
import type { Category } from './category.model';
import type { Unit } from './unit.model';
import type { Warehouse } from './warehouse.model';
