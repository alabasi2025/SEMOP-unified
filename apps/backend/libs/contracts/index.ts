// Temporary contracts barrel export
// TODO: Replace with actual @semop/contracts package

// ==================== Auth DTOs ====================
export class LoginDto {
  email: string;
  password: string;
}

// ==================== Organizational Structure DTOs ====================
export class CreateDepartmentDto {
  name?: string;
  description?: string;
}

export class UpdateDepartmentDto {
  name?: string;
  description?: string;
}

export class CreatePositionDto {
  title?: string;
  description?: string;
}

export class UpdatePositionDto {
  title?: string;
  description?: string;
}

export class CreateEmployeeDto {
  name?: string;
  email?: string;
}

export class UpdateEmployeeDto {
  name?: string;
  email?: string;
}

// ==================== Role Permissions DTOs ====================
export class CreateRolePermissionDto {
  roleId?: string;
  permissionId?: string;
}

export class UpdateRolePermissionDto {
  roleId?: string;
  permissionId?: string;
}

// ==================== Roles DTOs ====================
export class CreateRoleDto {
  name?: string;
  description?: string;
}

export class UpdateRoleDto {
  name?: string;
  description?: string;
}

export class RoleResponseDto {
  id?: string;
  name?: string;
  description?: string;
}

// ==================== Genes DTOs ====================
export class CreateGeneDto {
  name?: string;
  code?: string;
}

export class UpdateGeneDto {
  name?: string;
  code?: string;
}

export class LinkGeneSectorDto {
  geneId?: string;
  sectorId?: string;
}

// ==================== Latitude Points DTOs ====================
export class CreateLatitudePointDto {
  latitude?: number;
  longitude?: number;
  name?: string;
}

export class UpdateLatitudePointDto {
  latitude?: number;
  longitude?: number;
  name?: string;
}

// ==================== Customer Contacts DTOs ====================
export class CreateCustomerContactDto {
  name?: string;
  email?: string;
  phone?: string;
}

export class UpdateCustomerContactDto {
  name?: string;
  email?: string;
  phone?: string;
}

export class CustomerContactDto {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
}

// ==================== Inventory DTOs ====================
export class BatchOperationDto {
  itemIds: string[];
  operationType: string;
  value: any;
}

export class BatchOperationResponseDto {
  processedCount: number;
  errors: { itemId: string; reason: string }[];
}

export class TransferItemDto {
  itemId: string;
  quantity: number;
}

export class CreateWarehouseTransferDto {
  sourceWarehouseId: number;
  destinationWarehouseId: number;
  transferDate: string;
  notes?: string;
  items: TransferItemDto[];
}

export class WarehouseTransfer {
  id: number;
  sourceWarehouseId: number;
  destinationWarehouseId: number;
  transferDate: Date;
  status: string;
  notes?: string;
  items: TransferItemDto[];
}

// ==================== Purchasing DTOs ====================
export class CreatePurchaseOrderDto {
  supplierId?: string;
  items?: any[];
}

export class UpdatePurchaseOrderDto {
  supplierId?: string;
  items?: any[];
}

// ==================== Accounting DTOs ====================

// Enums
export enum AccountType {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  EQUITY = 'EQUITY',
  REVENUE = 'REVENUE',
  EXPENSE = 'EXPENSE'
}

export enum AccountNature {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT'
}

export enum PeriodStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  LOCKED = 'LOCKED'
}

// Account DTOs
export class CreateAccountDto {
  code?: string;
  name?: string;
  type?: AccountType;
  nature?: AccountNature;
}

export class UpdateAccountDto {
  code?: string;
  name?: string;
  type?: AccountType;
  nature?: AccountNature;
}

export class AccountResponseDto {
  id?: string;
  code?: string;
  name?: string;
  type?: AccountType;
  nature?: AccountNature;
}

export class AccountSuggestionRequestDto {
  operationType?: string;
  amount?: number;
}

export class SuggestedAccountDto {
  accountId?: string;
  accountCode?: string;
  accountName?: string;
  confidence?: number;
}

export class GenerateAccountCodeDto {
  type?: AccountType;
  parentCode?: string;
}

// Journal Entry DTOs
export class CreateJournalEntryFromOperationDto {
  operationType?: string;
  operationId?: string;
  amount?: number;
}

export class CreateJournalEntryFromTemplateDto {
  templateId?: string;
  data?: any;
}

export class CreateJournalEntryTemplateDto {
  name?: string;
  description?: string;
  entries?: any[];
}

export class UpdateJournalEntryTemplateDto {
  name?: string;
  description?: string;
  entries?: any[];
}

export class JournalEntryTemplateDto {
  id?: string;
  name?: string;
  description?: string;
  entries?: any[];
}

export class ValidateJournalEntryDto {
  entries?: any[];
}

export class JournalEntryValidationResultDto {
  isValid: boolean;
  errors: string[];
}

export class AutomatedJournalEntryDto {
  operationType?: string;
  data?: any;
}

export class PostJournalEntryDto {
  journalEntryId?: string;
}

export class SmartJournalEntryStatsDto {
  totalEntries?: number;
  automatedEntries?: number;
  manualEntries?: number;
}

// Usage DTOs
export class RecordUsageDto {
  feature?: string;
  action?: string;
}

export class UsageStatisticsDto {
  feature?: string;
  usageCount?: number;
}

// Fiscal Year DTOs
export class CloseFiscalYearDto {
  fiscalYearId?: string;
}

// Period DTOs
export class ClosePeriodDto {
  periodId?: string;
}

export class CheckPeriodStatusDto {
  periodId?: string;
}

// Income Statement DTOs
export class GetIncomeStatementDto {
  startDate?: string;
  endDate?: string;
  fiscalYearId?: string;
}

export class IncomeStatementDto {
  revenue?: number;
  expenses?: number;
  netIncome?: number;
  items?: any[];
}

// Export DTOs
export class ExportDataDto {
  format?: string;
  startDate?: string;
  endDate?: string;
  dataType?: string;
}
