// Temporary contracts barrel export
// TODO: Replace with actual @semop/contracts package

// Base DTO with index signature
class BaseDto {
  [key: string]: any;
}

// ==================== Auth DTOs ====================
export class LoginDto extends BaseDto {
  email?: string;
  password?: string;
}

// ==================== Organizational Structure DTOs ====================
export class CreateDepartmentDto extends BaseDto {
  name?: string;
  description?: string;
  code?: string;
  parentId?: string;
  managerId?: string;
}

export class UpdateDepartmentDto extends BaseDto {
  name?: string;
  description?: string;
  parentId?: string;
  managerId?: string;
  isActive?: boolean;
}

export class CreatePositionDto extends BaseDto {
  title?: string;
  description?: string;
  code?: string;
  level?: number;
}

export class UpdatePositionDto extends BaseDto {
  title?: string;
  description?: string;
  level?: number;
  isActive?: boolean;
}

export class CreateEmployeeDto extends BaseDto {
  name?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  mobile?: string;
  hireDate?: string;
}

export class UpdateEmployeeDto extends BaseDto {
  name?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  mobile?: string;
}

// ==================== Role Permissions DTOs ====================
export class CreateRolePermissionDto extends BaseDto {
  roleId?: string;
  permissionId?: string;
}

export class UpdateRolePermissionDto extends BaseDto {
  roleId?: string;
  permissionId?: string;
}

// ==================== Roles DTOs ====================
export class CreateRoleDto extends BaseDto {
  name?: string;
  description?: string;
  nameAr?: string;
  nameEn?: string;
}

export class UpdateRoleDto extends BaseDto {
  name?: string;
  description?: string;
  nameAr?: string;
  nameEn?: string;
}

export class RoleResponseDto extends BaseDto {
  id?: string;
  name?: string;
  description?: string;
}

// ==================== Genes DTOs ====================
export class CreateGeneDto extends BaseDto {
  name?: string;
  code?: string;
  sectorCode?: string;
}

export class UpdateGeneDto extends BaseDto {
  name?: string;
  code?: string;
  sectorCode?: string;
}

export class LinkGeneSectorDto extends BaseDto {
  geneId?: string;
  sectorId?: string;
}

// ==================== Latitude Points DTOs ====================
export class CreateLatitudePointDto extends BaseDto {
  latitude?: number;
  longitude?: number;
  name?: string;
}

export class UpdateLatitudePointDto extends BaseDto {
  latitude?: number;
  longitude?: number;
  name?: string;
}

// ==================== Customer Contacts DTOs ====================
export class CreateCustomerContactDto extends BaseDto {
  name?: string;
  email?: string;
  phone?: string;
}

export class UpdateCustomerContactDto extends BaseDto {
  name?: string;
  email?: string;
  phone?: string;
}

export class CustomerContactDto extends BaseDto {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
}

// ==================== Inventory DTOs ====================
export class BatchOperationDto extends BaseDto {
  itemIds?: string[];
  operationType?: string;
  value?: any;
}

export class BatchOperationResponseDto extends BaseDto {
  processedCount?: number;
  errors?: { itemId: string; reason: string }[];
}

export class TransferItemDto extends BaseDto {
  itemId?: string;
  quantity?: number;
}

export class CreateWarehouseTransferDto extends BaseDto {
  sourceWarehouseId?: number;
  destinationWarehouseId?: number;
  transferDate?: string;
  notes?: string;
  items?: TransferItemDto[];
}

export class WarehouseTransfer extends BaseDto {
  id?: number;
  sourceWarehouseId?: number;
  destinationWarehouseId?: number;
  transferDate?: Date;
  status?: string;
  notes?: string;
  items?: TransferItemDto[];
}

// ==================== Purchasing DTOs ====================
export class CreatePurchaseOrderDto extends BaseDto {
  supplierId?: string;
  items?: any[];
}

export class UpdatePurchaseOrderDto extends BaseDto {
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
export class CreateAccountDto extends BaseDto {
  code?: string;
  name?: string;
  type?: AccountType;
  nature?: AccountNature;
  accountType?: string;
  accountNature?: string;
  isParent?: boolean;
  parentId?: string;
}

export class UpdateAccountDto extends BaseDto {
  code?: string;
  name?: string;
  type?: AccountType;
  nature?: AccountNature;
  accountType?: string;
  accountNature?: string;
  isParent?: boolean;
  parentId?: string;
}

export class AccountResponseDto extends BaseDto {
  id?: string;
  code?: string;
  name?: string;
  type?: AccountType;
  nature?: AccountNature;
}

export class AccountSuggestionRequestDto extends BaseDto {
  operationType?: string;
  amount?: number;
  contextType?: string;
  contextId?: string;
}

export class SuggestedAccountDto extends BaseDto {
  accountId?: string;
  accountCode?: string;
  accountName?: string;
  confidence?: number;
}

export class GenerateAccountCodeDto extends BaseDto {
  type?: AccountType;
  parentCode?: string;
}

// Journal Entry DTOs
export class CreateJournalEntryFromOperationDto extends BaseDto {
  operationType?: string;
  operationId?: string;
  amount?: number;
  sourceType?: string;
  sourceId?: string;
  sourceData?: any;
}

export class CreateJournalEntryFromTemplateDto extends BaseDto {
  templateId?: string;
  data?: any;
}

export class CreateJournalEntryTemplateDto extends BaseDto {
  name?: string;
  description?: string;
  entries?: any[];
  lines?: any[];
  allowManualEntry?: boolean;
}

export class UpdateJournalEntryTemplateDto extends BaseDto {
  name?: string;
  description?: string;
  entries?: any[];
  lines?: any[];
  allowManualEntry?: boolean;
}

export class JournalEntryTemplateDto extends BaseDto {
  id?: string;
  name?: string;
  description?: string;
  entries?: any[];
  lines?: any[];
}

export class ValidateJournalEntryDto extends BaseDto {
  entries?: any[];
  lines?: any[];
  entryDate?: string;
  fiscalYearId?: string;
  fiscalPeriodId?: string;
}

export class JournalEntryValidationResultDto extends BaseDto {
  isValid?: boolean;
  errors?: string[];
}

export class AutomatedJournalEntryDto extends BaseDto {
  operationType?: string;
  data?: any;
}

export class PostJournalEntryDto extends BaseDto {
  journalEntryId?: string;
}

export class SmartJournalEntryStatsDto extends BaseDto {
  totalEntries?: number;
  automatedEntries?: number;
  manualEntries?: number;
}

// Usage DTOs
export class RecordUsageDto extends BaseDto {
  feature?: string;
  action?: string;
}

export class UsageStatisticsDto extends BaseDto {
  feature?: string;
  usageCount?: number;
}

// Fiscal Year DTOs
export class CloseFiscalYearDto extends BaseDto {
  fiscalYearId?: string;
}

// Period DTOs
export class ClosePeriodDto extends BaseDto {
  periodId?: string;
}

export class CheckPeriodStatusDto extends BaseDto {
  periodId?: string;
}

// Income Statement DTOs
export class GetIncomeStatementDto extends BaseDto {
  startDate?: string;
  endDate?: string;
  fiscalYearId?: string;
  limit?: number;
}

export class IncomeStatementDto extends BaseDto {
  revenue?: number;
  expenses?: number;
  netIncome?: number;
  items?: any[];
}

// Export DTOs
export class ExportDataDto extends BaseDto {
  format?: string;
  startDate?: string;
  endDate?: string;
  dataType?: string;
}
