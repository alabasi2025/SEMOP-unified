// Temporary contracts barrel export
// TODO: Replace with actual @semop/contracts package

// Auth DTOs
export class LoginDto {
  email: string;
  password: string;
}

// Organizational Structure DTOs
export class CreateDepartmentDto {}
export class UpdateDepartmentDto {}
export class CreatePositionDto {}
export class UpdatePositionDto {}
export class CreateEmployeeDto {}
export class UpdateEmployeeDto {}

// Role Permissions DTOs
export class CreateRolePermissionDto {}
export class UpdateRolePermissionDto {}

// Roles DTOs
export class CreateRoleDto {}
export class UpdateRoleDto {}
export class RoleResponseDto {}

// Genes DTOs
export class CreateGeneDto {}
export class UpdateGeneDto {}
export class LinkGeneSectorDto {}

// Latitude Points DTOs
export class CreateLatitudePointDto {}
export class UpdateLatitudePointDto {}

// Inventory DTOs
export class BatchOperationDto {}
export class BatchOperationResponseDto {}
export class CreateWarehouseTransferDto {}
export class TransferItemDto {}
export class WarehouseTransfer {
  id: number;
  sourceWarehouseId: number;
  destinationWarehouseId: number;
  transferDate: Date;
  status: string;
  notes?: string;
  items: TransferItemDto[];
}

// Purchasing DTOs
export class CreatePurchaseOrderDto {}
export class UpdatePurchaseOrderDto {}

// Accounting DTOs
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
export class CreateAccountDto {}
export class UpdateAccountDto {}
export class AccountResponseDto {}
export class AccountSuggestionRequestDto {}
export class SuggestedAccountDto {}
export class CreateJournalEntryFromOperationDto {}
export class CreateJournalEntryFromTemplateDto {}
export class CreateJournalEntryTemplateDto {}
export class UpdateJournalEntryTemplateDto {}
export class JournalEntryTemplateDto {}
export class ValidateJournalEntryDto {}
export class JournalEntryValidationResultDto {}
export class AutomatedJournalEntryDto {}
export class RecordUsageDto {}
export class UsageStatisticsDto {}
