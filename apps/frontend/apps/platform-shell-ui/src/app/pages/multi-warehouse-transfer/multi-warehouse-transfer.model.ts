export interface TransferItem {
  itemId: number;
  quantity: number;
  notes?: string;
}

export interface CreateMultiWarehouseTransferDto {
  sourceWarehouseId: number;
  destinationWarehouseId: number;
  transferDate: string; // ISO Date String
  notes?: string;
  items: TransferItem[];
}

export interface UpdateMultiWarehouseTransferDto extends CreateMultiWarehouseTransferDto {}

export interface MultiWarehouseTransferResponseDto {
  id: number;
  sourceWarehouseId: number;
  destinationWarehouseId: number;
  transferDate: Date;
  notes: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
  items: TransferItem[];
}

export interface Warehouse {
  id: number;
  name: string;
}

export interface Item {
  id: number;
  name: string;
  unit: string;
}
