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
export type StockCountStatus = 'draft' | 'in_progress' | 'completed' | 'cancelled';
export type TransferStatus = 'draft' | 'pending' | 'in_transit' | 'completed' | 'cancelled';
