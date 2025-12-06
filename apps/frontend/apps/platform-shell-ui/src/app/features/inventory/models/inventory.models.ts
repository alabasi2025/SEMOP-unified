/**
 * نماذج البيانات لنظام المخازن
 */

// الصنف
export interface Item {
  id: string;
  code: string;
  nameAr: string;
  nameEn?: string;
  description?: string;
  categoryId?: string;
  categoryName?: string;
  unitId?: string;
  unitName?: string;
  barcode?: string;
  sku?: string;
  minStock?: number;
  maxStock?: number;
  reorderPoint?: number;
  costPrice?: number;
  sellingPrice?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// المستودع
export interface Warehouse {
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

// حركة المخزون
export interface StockMovement {
  id: string;
  movementNumber: string;
  movementType: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT';
  warehouseId: string;
  warehouseName: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  fromWarehouseId?: string;
  toWarehouseId?: string;
  referenceType?: string;
  referenceId?: string;
  referenceNumber?: string;
  notes?: string;
  createdBy?: string;
  movementDate: Date;
  createdAt: Date;
}

// رصيد المخزون
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

// الفئة
export interface ItemCategory {
  id: string;
  code: string;
  nameAr: string;
  nameEn?: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  children?: ItemCategory[];
}

// الوحدة
export interface Unit {
  id: string;
  code: string;
  nameAr: string;
  nameEn?: string;
  symbol?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// عملية الجرد
export interface InventoryCount {
  id: string;
  countNumber: string;
  warehouseId: string;
  countDate: Date;
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  countedBy?: string;
  approvedBy?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// سجل الجرد
export interface InventoryRecord {
  id: string;
  countId: string;
  itemId: string;
  systemQuantity: number;
  countedQuantity?: number;
  difference?: number;
  notes?: string;
}

// استجابة مع pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// فلاتر البحث
export interface SearchFilters {
  search?: string;
  categoryId?: string;
  warehouseId?: string;
  isActive?: boolean;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}
