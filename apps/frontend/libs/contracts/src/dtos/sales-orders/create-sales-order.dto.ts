export class CreateSalesOrderLineDto {
  itemId: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  discountRate: number;
}

export class CreateSalesOrderDto {
  orderNumber: string;
  orderDate: Date;
  customerId: string;
  expectedDeliveryDate?: Date;
  paymentTerms?: string;
  notes?: string;
  lines: CreateSalesOrderLineDto[];
  holdingId: string;
  unitId?: string;
  projectId?: string;
}
