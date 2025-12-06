/**
 * واجهة عامة للرد على الطلبات مع pagination
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * واجهة للرد على العمليات الناجحة
 */
export interface SuccessResponse {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * واجهة لمعلومات الصنف
 */
export interface ItemInfo {
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

/**
 * واجهة لمعلومات المستودع
 */
export interface WarehouseInfo {
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

/**
 * واجهة لمعلومات الفئة
 */
export interface CategoryInfo {
  id: string;
  code: string;
  nameAr: string;
  nameEn?: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * واجهة لمعلومات الوحدة
 */
export interface UnitInfo {
  id: string;
  code: string;
  nameAr: string;
  nameEn?: string;
  symbol?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * واجهة لإحصائيات المخزون
 */
export interface InventoryStats {
  totalItems: number;
  totalWarehouses: number;
  totalStockValue: number;
  lowStockItems: number;
  inactiveItems: number;
  totalMovements: number;
}

/**
 * واجهة لإحصائيات المستودع
 */
export interface WarehouseStats {
  warehouseId: string;
  warehouseName: string;
  totalItems: number;
  totalQuantity: number;
  totalValue: number;
  capacityUsed: number;
  capacityPercentage: number;
}
