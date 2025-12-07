// Items
export * from './item.model';

// Warehouses
export * from './warehouse.model';

// Movements
export * from './movement.model';

// Stock Count
export * from './stock-count.model';

// Categories
export * from './category.model';

// Units
export * from './unit.model';

// Legacy models (for backward compatibility)
export * from './inventory.models';

// Common Types
export type InventoryStatus = 'active' | 'inactive' | 'discontinued';
export type MovementType = 'in' | 'out' | 'transfer' | 'adjustment';
export type StockCountType = 'full' | 'partial' | 'cycle';
export type TransferStatus = 'draft' | 'pending' | 'in_transit' | 'completed' | 'cancelled';

// StockCount Status Enum
export enum StockCountStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// StockCount Interfaces
export interface StockCount {
  id: string;
  countNumber: string;
  warehouseId: string;
  warehouseName: string;
  countType: StockCountType;
  status: StockCountStatus;
  startDate: Date;
  endDate?: Date;
  notes?: string;
}

export interface StockCountFilter {
  status: StockCountStatus | null;
  startDate: Date | null;
  endDate: Date | null;
  warehouseId: string | null;
}

export interface StockCountStats {
  totalCounts: number;
  inProgress: number;
  completed: number;
  totalDifferenceValue: number;
}

export interface AdvancedSearchFilter {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: string;
  searchTerm?: string;
  category?: string[];
  status?: string[];
  minQuantity?: number;
  maxQuantity?: number;
  minPrice?: number;
  maxPrice?: number;
}
