export class CreateStockMovementDto {
  warehouseId: string;
  itemId: string;
  movementType: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT';
  quantity: number;
  unitCost?: number;
  referenceType?: string;
  referenceId?: string;
  notes?: string;
  holdingId: string;
  unitId?: string;
  projectId?: string;
}
