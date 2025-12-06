import type { Item } from './item.model';
import type { Warehouse } from './warehouse.model';

export interface StockMovement {
  id: number;
  type: 'in' | 'out' | 'transfer' | 'adjustment';
  itemId: number;
  item?: Item;
  fromWarehouseId?: number;
  fromWarehouse?: Warehouse;
  toWarehouseId?: number;
  toWarehouse?: Warehouse;
  quantity: number;
  unitCost?: number;
  totalCost?: number;
  reference?: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdBy: number;
  approvedBy?: number;
  createdAt: Date;
  approvedAt?: Date;
  completedAt?: Date;
}

export interface CreateStockMovementDto {
  type: 'in' | 'out' | 'transfer' | 'adjustment';
  itemId: number;
  fromWarehouseId?: number;
  toWarehouseId?: number;
  quantity: number;
  unitCost?: number;
  reference?: string;
  notes?: string;
}

export interface UpdateStockMovementDto extends Partial<CreateStockMovementDto> {
  id: number;
  status?: 'pending' | 'approved' | 'rejected' | 'completed';
}

export interface StockTransfer {
  id: number;
  transferNumber: string;
  fromWarehouseId: number;
  fromWarehouse?: Warehouse;
  toWarehouseId: number;
  toWarehouse?: Warehouse;
  items: StockTransferItem[];
  status: 'draft' | 'pending' | 'in_transit' | 'completed' | 'cancelled';
  notes?: string;
  createdBy: number;
  approvedBy?: number;
  receivedBy?: number;
  createdAt: Date;
  approvedAt?: Date;
  receivedAt?: Date;
}

export interface StockTransferItem {
  id: number;
  transferId: number;
  itemId: number;
  item?: Item;
  requestedQuantity: number;
  approvedQuantity?: number;
  receivedQuantity?: number;
  notes?: string;
}
