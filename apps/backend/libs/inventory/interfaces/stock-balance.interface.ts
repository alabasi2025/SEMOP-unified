/**
 * واجهة لرصيد الصنف في مستودع واحد
 */
export interface StockBalance {
  warehouseId: string;
  warehouseName: string;
  itemId: string;
  itemName: string;
  quantity: number;
  reservedQty: number;
  availableQty: number;
  costPrice?: number;
  totalValue?: number;
  lastUpdated: Date;
}

/**
 * واجهة لرصيد الصنف في جميع المستودعات
 */
export interface ItemStockSummary {
  itemId: string;
  itemCode: string;
  itemName: string;
  totalQuantity: number;
  totalReserved: number;
  totalAvailable: number;
  totalValue: number;
  warehouses: StockBalance[];
}

/**
 * واجهة لرصيد المستودع (جميع الأصناف)
 */
export interface WarehouseStockSummary {
  warehouseId: string;
  warehouseCode: string;
  warehouseName: string;
  totalItems: number;
  totalQuantity: number;
  totalValue: number;
  items: StockBalance[];
}

/**
 * واجهة لتفاصيل حركة المخزون
 */
export interface StockMovementDetail {
  id: string;
  movementNumber: string;
  movementType: string;
  warehouseId: string;
  warehouseName: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  fromWarehouseId?: string;
  fromWarehouseName?: string;
  toWarehouseId?: string;
  toWarehouseName?: string;
  referenceType?: string;
  referenceId?: string;
  referenceNumber?: string;
  notes?: string;
  createdBy?: string;
  movementDate: Date;
  createdAt: Date;
}

/**
 * واجهة لملخص حركات المخزون
 */
export interface MovementSummary {
  totalMovements: number;
  totalIn: number;
  totalOut: number;
  totalTransfers: number;
  totalAdjustments: number;
  movements: StockMovementDetail[];
}

/**
 * واجهة لتفاصيل التحويل
 */
export interface TransferDetail {
  id: string;
  transferNumber: string;
  fromWarehouseId: string;
  fromWarehouseName: string;
  toWarehouseId: string;
  toWarehouseName: string;
  status: string;
  items: TransferItemDetail[];
  reason?: string;
  notes?: string;
  requestedBy?: string;
  approvedBy?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * واجهة لصنف في التحويل
 */
export interface TransferItemDetail {
  itemId: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  notes?: string;
}
