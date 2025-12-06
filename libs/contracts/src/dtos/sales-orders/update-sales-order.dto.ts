export class UpdateSalesOrderLineDto {
  id?: string;
  itemId: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  discountRate: number;
}

export class UpdateSalesOrderDto {
  orderNumber?: string;
  orderDate?: Date;
  customerId?: string;
  expectedDeliveryDate?: Date;
  paymentTerms?: string;
  notes?: string;
  lines?: UpdateSalesOrderLineDto[];
}
