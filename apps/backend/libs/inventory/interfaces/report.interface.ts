/**
 * واجهة لتقرير حركة صنف
 */
export interface ItemMovementReport {
  itemId: string;
  itemCode: string;
  itemName: string;
  startDate: Date;
  endDate: Date;
  openingBalance: number;
  totalIn: number;
  totalOut: number;
  totalTransferIn: number;
  totalTransferOut: number;
  totalAdjustment: number;
  closingBalance: number;
  movements: MovementReportLine[];
}

/**
 * واجهة لسطر في تقرير الحركة
 */
export interface MovementReportLine {
  date: Date;
  movementNumber: string;
  movementType: string;
  warehouseName: string;
  quantity: number;
  balance: number;
  referenceType?: string;
  referenceNumber?: string;
  notes?: string;
}

/**
 * واجهة لتقرير حركة مستودع
 */
export interface WarehouseMovementReport {
  warehouseId: string;
  warehouseCode: string;
  warehouseName: string;
  startDate: Date;
  endDate: Date;
  totalMovements: number;
  totalIn: number;
  totalOut: number;
  totalTransferIn: number;
  totalTransferOut: number;
  totalAdjustment: number;
  movements: MovementReportLine[];
}

/**
 * واجهة لتقرير الأصناف الناقصة
 */
export interface LowStockReport {
  generatedAt: Date;
  warehouseId?: string;
  warehouseName?: string;
  categoryId?: string;
  categoryName?: string;
  totalItems: number;
  items: LowStockItem[];
}

/**
 * واجهة لصنف ناقص
 */
export interface LowStockItem {
  itemId: string;
  itemCode: string;
  itemName: string;
  warehouseId: string;
  warehouseName: string;
  currentQuantity: number;
  minStock: number;
  reorderPoint?: number;
  shortage: number;
  status: 'BELOW_MIN' | 'AT_REORDER' | 'CRITICAL';
}

/**
 * واجهة لتقرير الأصناف الراكدة
 */
export interface InactiveItemsReport {
  generatedAt: Date;
  warehouseId?: string;
  warehouseName?: string;
  daysWithoutMovement: number;
  totalItems: number;
  totalValue: number;
  items: InactiveItem[];
}

/**
 * واجهة لصنف راكد
 */
export interface InactiveItem {
  itemId: string;
  itemCode: string;
  itemName: string;
  warehouseId: string;
  warehouseName: string;
  currentQuantity: number;
  costPrice: number;
  totalValue: number;
  lastMovementDate?: Date;
  daysInactive: number;
}

/**
 * واجهة لتقرير قيمة المخزون
 */
export interface StockValueReport {
  generatedAt: Date;
  asOfDate: Date;
  warehouseId?: string;
  warehouseName?: string;
  categoryId?: string;
  categoryName?: string;
  totalItems: number;
  totalQuantity: number;
  totalValue: number;
  items: StockValueItem[];
}

/**
 * واجهة لصنف في تقرير القيمة
 */
export interface StockValueItem {
  itemId: string;
  itemCode: string;
  itemName: string;
  categoryName?: string;
  warehouseId: string;
  warehouseName: string;
  quantity: number;
  costPrice: number;
  totalValue: number;
}

/**
 * واجهة لتقرير الرصيد الحالي
 */
export interface StockBalanceReport {
  generatedAt: Date;
  warehouseId?: string;
  warehouseName?: string;
  categoryId?: string;
  categoryName?: string;
  totalItems: number;
  totalQuantity: number;
  items: StockBalanceItem[];
}

/**
 * واجهة لصنف في تقرير الرصيد
 */
export interface StockBalanceItem {
  itemId: string;
  itemCode: string;
  itemName: string;
  categoryName?: string;
  warehouseId: string;
  warehouseName: string;
  quantity: number;
  reservedQty: number;
  availableQty: number;
  minStock?: number;
  maxStock?: number;
  status: 'NORMAL' | 'LOW' | 'CRITICAL' | 'OVERSTOCK';
}

/**
 * واجهة لتقرير التحويلات
 */
export interface TransfersReport {
  generatedAt: Date;
  startDate: Date;
  endDate: Date;
  totalTransfers: number;
  totalPending: number;
  totalApproved: number;
  totalRejected: number;
  totalCompleted: number;
  transfers: TransferReportLine[];
}

/**
 * واجهة لسطر في تقرير التحويلات
 */
export interface TransferReportLine {
  transferNumber: string;
  date: Date;
  fromWarehouseName: string;
  toWarehouseName: string;
  itemsCount: number;
  totalQuantity: number;
  status: string;
  requestedBy?: string;
  approvedBy?: string;
}

/**
 * واجهة لتقرير التسويات
 */
export interface AdjustmentsReport {
  generatedAt: Date;
  startDate: Date;
  endDate: Date;
  totalAdjustments: number;
  totalPositive: number;
  totalNegative: number;
  adjustments: AdjustmentReportLine[];
}

/**
 * واجهة لسطر في تقرير التسويات
 */
export interface AdjustmentReportLine {
  movementNumber: string;
  date: Date;
  warehouseName: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  type: 'POSITIVE' | 'NEGATIVE';
  referenceType?: string;
  referenceNumber?: string;
  notes?: string;
  createdBy?: string;
}
