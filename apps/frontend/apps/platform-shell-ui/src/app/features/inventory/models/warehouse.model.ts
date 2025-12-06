export interface Warehouse {
  id: number;
  code: string;
  name: string;
  nameEn?: string;
  type: 'main' | 'branch' | 'virtual';
  location?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  managerId?: number;
  isActive: boolean;
  capacity?: number;
  currentOccupancy?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWarehouseDto {
  code: string;
  name: string;
  nameEn?: string;
  type: 'main' | 'branch' | 'virtual';
  location?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  managerId?: number;
  isActive?: boolean;
  capacity?: number;
}

export interface UpdateWarehouseDto extends Partial<CreateWarehouseDto> {
  id: number;
}

export interface WarehouseStats {
  warehouseId: number;
  totalItems: number;
  totalQuantity: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  occupancyRate: number;
}
