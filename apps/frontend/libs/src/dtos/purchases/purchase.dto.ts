/**
 * SEMOP - Purchase DTOs
 * @version 0.4.0
 */

import { IsString, IsNumber, IsDate, IsOptional, IsUUID, IsArray, ValidateNested, Min, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export enum PurchaseOrderStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  PARTIALLY_RECEIVED = 'PARTIALLY_RECEIVED',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED',
}

export enum PurchaseInvoiceStatus {
  DRAFT = 'DRAFT',
  POSTED = 'POSTED',
  CANCELLED = 'CANCELLED',
}

export enum PurchaseReturnStatus {
  DRAFT = 'DRAFT',
  POSTED = 'POSTED',
  CANCELLED = 'CANCELLED',
}

export class PurchaseOrderLineDto {
  @IsUUID('4', { message: 'Item ID must be a valid UUID' })
  itemId: string;

  @IsNumber({}, { message: 'Quantity must be a valid number' })
  @Min(0.01, { message: 'Quantity must be greater than zero' })
  quantity: number;

  @IsNumber({}, { message: 'Unit price must be a valid number' })
  @Min(0, { message: 'Unit price cannot be negative' })
  unitPrice: number;

  @IsOptional()
  @IsNumber({}, { message: 'Tax rate must be a valid number' })
  @Min(0, { message: 'Tax rate cannot be negative' })
  taxRate?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Discount rate must be a valid number' })
  @Min(0, { message: 'Discount rate cannot be negative' })
  discountRate?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;
}

export class CreatePurchaseOrderDto {
  @IsUUID('4', { message: 'Supplier ID must be a valid UUID' })
  supplierId: string;

  @IsDate({ message: 'Order date must be a valid date' })
  @Type(() => Date)
  orderDate: Date;

  @IsOptional()
  @IsDate({ message: 'Expected delivery date must be a valid date' })
  @Type(() => Date)
  expectedDeliveryDate?: Date;

  @IsArray({ message: 'Lines must be an array' })
  @ValidateNested({ each: true })
  @Type(() => PurchaseOrderLineDto)
  lines: PurchaseOrderLineDto[];

  @IsOptional()
  @IsUUID('4', { message: 'Holding ID must be a valid UUID' })
  holdingId?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Unit ID must be a valid UUID' })
  unitId?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Project ID must be a valid UUID' })
  projectId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Notes must not exceed 1000 characters' })
  notes?: string;
}

export class UpdatePurchaseOrderDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expectedDeliveryDate?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}

export class PurchaseInvoiceLineDto {
  @IsUUID('4', { message: 'Item ID must be a valid UUID' })
  itemId: string;

  @IsUUID('4', { message: 'Warehouse ID must be a valid UUID' })
  warehouseId: string;

  @IsNumber({}, { message: 'Quantity must be a valid number' })
  @Min(0.01, { message: 'Quantity must be greater than zero' })
  quantity: number;

  @IsNumber({}, { message: 'Unit price must be a valid number' })
  @Min(0, { message: 'Unit price cannot be negative' })
  unitPrice: number;

  @IsOptional()
  @IsNumber({}, { message: 'Tax rate must be a valid number' })
  @Min(0, { message: 'Tax rate cannot be negative' })
  taxRate?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Discount rate must be a valid number' })
  @Min(0, { message: 'Discount rate cannot be negative' })
  discountRate?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;
}

export class CreatePurchaseInvoiceDto {
  @IsUUID('4', { message: 'Supplier ID must be a valid UUID' })
  supplierId: string;

  @IsDate({ message: 'Invoice date must be a valid date' })
  @Type(() => Date)
  invoiceDate: Date;

  @IsOptional()
  @IsDate({ message: 'Due date must be a valid date' })
  @Type(() => Date)
  dueDate?: Date;

  @IsOptional()
  @IsUUID('4', { message: 'Purchase order ID must be a valid UUID' })
  purchaseOrderId?: string;

  @IsArray({ message: 'Lines must be an array' })
  @ValidateNested({ each: true })
  @Type(() => PurchaseInvoiceLineDto)
  lines: PurchaseInvoiceLineDto[];

  @IsOptional()
  @IsUUID('4', { message: 'Holding ID must be a valid UUID' })
  holdingId?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Unit ID must be a valid UUID' })
  unitId?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Project ID must be a valid UUID' })
  projectId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Notes must not exceed 1000 characters' })
  notes?: string;
}

export class UpdatePurchaseInvoiceDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dueDate?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}

export class PurchaseReturnLineDto {
  @IsUUID('4', { message: 'Item ID must be a valid UUID' })
  itemId: string;

  @IsUUID('4', { message: 'Warehouse ID must be a valid UUID' })
  warehouseId: string;

  @IsNumber({}, { message: 'Quantity must be a valid number' })
  @Min(0.01, { message: 'Quantity must be greater than zero' })
  quantity: number;

  @IsNumber({}, { message: 'Unit price must be a valid number' })
  @Min(0, { message: 'Unit price cannot be negative' })
  unitPrice: number;

  @IsOptional()
  @IsNumber({}, { message: 'Tax rate must be a valid number' })
  @Min(0, { message: 'Tax rate cannot be negative' })
  taxRate?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Reason must not exceed 500 characters' })
  reason?: string;
}

export class CreatePurchaseReturnDto {
  @IsUUID('4', { message: 'Supplier ID must be a valid UUID' })
  supplierId: string;

  @IsDate({ message: 'Return date must be a valid date' })
  @Type(() => Date)
  returnDate: Date;

  @IsOptional()
  @IsUUID('4', { message: 'Purchase invoice ID must be a valid UUID' })
  purchaseInvoiceId?: string;

  @IsArray({ message: 'Lines must be an array' })
  @ValidateNested({ each: true })
  @Type(() => PurchaseReturnLineDto)
  lines: PurchaseReturnLineDto[];

  @IsOptional()
  @IsUUID('4', { message: 'Holding ID must be a valid UUID' })
  holdingId?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Unit ID must be a valid UUID' })
  unitId?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Project ID must be a valid UUID' })
  projectId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Notes must not exceed 1000 characters' })
  notes?: string;
}

export class UpdatePurchaseReturnDto {
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}

export class PurchaseOrderResponseDto {
  id: string;
  orderNumber: string;
  orderDate: Date;
  expectedDeliveryDate?: Date;
  status: PurchaseOrderStatus;
  supplierId: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  holdingId?: string;
  unitId?: string;
  projectId?: string;
  notes?: string;
  approvedAt?: Date;
  approvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PurchaseInvoiceResponseDto {
  id: string;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate?: Date;
  status: PurchaseInvoiceStatus;
  supplierId: string;
  purchaseOrderId?: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  journalEntryId?: string;
  holdingId?: string;
  unitId?: string;
  projectId?: string;
  notes?: string;
  postedAt?: Date;
  postedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PurchaseReturnResponseDto {
  id: string;
  returnNumber: string;
  returnDate: Date;
  status: PurchaseReturnStatus;
  supplierId: string;
  purchaseInvoiceId?: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  refundedAmount: number;
  journalEntryId?: string;
  holdingId?: string;
  unitId?: string;
  projectId?: string;
  notes?: string;
  postedAt?: Date;
  postedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}
