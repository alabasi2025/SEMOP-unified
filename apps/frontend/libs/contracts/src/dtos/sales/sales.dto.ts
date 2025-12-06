/**
 * SEMOP - Sales DTOs
 * @version 0.4.0
 */

import { IsString, IsNumber, IsDate, IsOptional, IsUUID, IsArray, ValidateNested, Min, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export enum SalesOrderStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  PARTIALLY_DELIVERED = 'PARTIALLY_DELIVERED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum SalesInvoiceStatus {
  DRAFT = 'DRAFT',
  POSTED = 'POSTED',
  CANCELLED = 'CANCELLED',
}

export enum SalesReturnStatus {
  DRAFT = 'DRAFT',
  POSTED = 'POSTED',
  CANCELLED = 'CANCELLED',
}

export class SalesOrderLineDto {
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

export class CreateSalesOrderDto {
  @IsUUID('4', { message: 'Customer ID must be a valid UUID' })
  customerId: string;

  @IsDate({ message: 'Order date must be a valid date' })
  @Type(() => Date)
  orderDate: Date;

  @IsOptional()
  @IsDate({ message: 'Expected delivery date must be a valid date' })
  @Type(() => Date)
  expectedDeliveryDate?: Date;

  @IsArray({ message: 'Lines must be an array' })
  @ValidateNested({ each: true })
  @Type(() => SalesOrderLineDto)
  lines: SalesOrderLineDto[];

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

export class UpdateSalesOrderDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expectedDeliveryDate?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}

export class SalesInvoiceLineDto {
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

export class CreateSalesInvoiceDto {
  @IsUUID('4', { message: 'Customer ID must be a valid UUID' })
  customerId: string;

  @IsDate({ message: 'Invoice date must be a valid date' })
  @Type(() => Date)
  invoiceDate: Date;

  @IsOptional()
  @IsDate({ message: 'Due date must be a valid date' })
  @Type(() => Date)
  dueDate?: Date;

  @IsOptional()
  @IsUUID('4', { message: 'Sales order ID must be a valid UUID' })
  salesOrderId?: string;

  @IsArray({ message: 'Lines must be an array' })
  @ValidateNested({ each: true })
  @Type(() => SalesInvoiceLineDto)
  lines: SalesInvoiceLineDto[];

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

export class UpdateSalesInvoiceDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dueDate?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}

export class SalesReturnLineDto {
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

export class CreateSalesReturnDto {
  @IsUUID('4', { message: 'Customer ID must be a valid UUID' })
  customerId: string;

  @IsDate({ message: 'Return date must be a valid date' })
  @Type(() => Date)
  returnDate: Date;

  @IsOptional()
  @IsUUID('4', { message: 'Sales invoice ID must be a valid UUID' })
  salesInvoiceId?: string;

  @IsArray({ message: 'Lines must be an array' })
  @ValidateNested({ each: true })
  @Type(() => SalesReturnLineDto)
  lines: SalesReturnLineDto[];

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

export class UpdateSalesReturnDto {
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}

export class SalesOrderResponseDto {
  id: string;
  orderNumber: string;
  orderDate: Date;
  expectedDeliveryDate?: Date;
  status: SalesOrderStatus;
  customerId: string;
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

export class SalesInvoiceResponseDto {
  id: string;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate?: Date;
  status: SalesInvoiceStatus;
  customerId: string;
  salesOrderId?: string;
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

export class SalesReturnResponseDto {
  id: string;
  returnNumber: string;
  returnDate: Date;
  status: SalesReturnStatus;
  customerId: string;
  salesInvoiceId?: string;
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

export class AddSalesOrderLineDto {
  @IsUUID('4')
  itemId: string;

  @IsNumber()
  @Min(0.01)
  quantity: number;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  taxRate?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discountRate?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

export class UpdateSalesOrderLineDto {
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  quantity?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  unitPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  taxRate?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discountRate?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
