export class SalesOrderLineResponseDto {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  discountRate: number;
  lineTotal: number;
}

export class SalesOrderResponseDto {
  id: string;
  orderNumber: string;
  orderDate: Date;
  customerId: string;
  customerName: string;
  expectedDeliveryDate?: Date;
  paymentTerms?: string;
  notes?: string;
  status: string;
  totalAmount: number;
  lines: SalesOrderLineResponseDto[];
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
}
