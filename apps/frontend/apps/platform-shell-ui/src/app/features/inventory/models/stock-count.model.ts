import type { Item } from './item.model';
import type { Warehouse } from './warehouse.model';

export interface StockCount {
  id: number;
  countNumber: string;
  warehouseId: number;
  warehouse?: Warehouse;
  type: 'full' | 'partial' | 'cycle';
  status: 'draft' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: Date;
  startedAt?: Date;
  completedAt?: Date;
  items: StockCountItem[];
  notes?: string;
  createdBy: number;
  approvedBy?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StockCountItem {
  id: number;
  stockCountId: number;
  itemId: number;
  item?: Item;
  systemQuantity: number;
  countedQuantity?: number;
  variance?: number;
  varianceValue?: number;
  notes?: string;
  countedBy?: number;
  countedAt?: Date;
}

export interface CreateStockCountDto {
  warehouseId: number;
  type: 'full' | 'partial' | 'cycle';
  scheduledDate: Date;
  itemIds?: number[]; // للجرد الجزئي
  notes?: string;
}

export interface UpdateStockCountItemDto {
  stockCountItemId: number;
  countedQuantity: number;
  notes?: string;
}
