export class StockMovementResponseDto {
  id: string;
  warehouseId: string;
  warehouseName: string;
  itemId: string;
  itemName: string;
  movementType: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  referenceType?: string;
  referenceId?: string;
  notes?: string;
  createdAt: Date;
  createdBy: string;
}
