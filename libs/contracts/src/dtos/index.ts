/**
 * SEMOP - Shared Contracts - DTOs Index
 * @version 0.4.1
 * PHASE-1.1.1: Fixed export conflicts
 */

// Auth DTOs
export * from './auth/login.dto';

// User DTOs
export * from './users/create-user.dto';

// Identity DTOs
export * from './identity/user.dto';

// Holdings DTOs
export * from './holdings/create-holding.dto';

// Units DTOs
export * from './units/create-unit.dto';

// Projects DTOs
export * from './projects/create-project.dto';

// Roles DTOs
export * from './roles/create-role.dto';

// Permissions DTOs
export * from './permissions/create-permission.dto';

// Accounting DTOs
export * from './accounting';

// Supplier DTOs
export * from './suppliers/supplier.dto';

// Customer DTOs
export * from './customers/customer.dto';

// Inventory DTOs
export * from './inventory/item.dto';

// Purchase DTOs
export * from './purchases/purchase.dto';

// Sales DTOs - Using sales.dto.ts (comprehensive)
export * from './sales/sales.dto';

// Stock Movements DTOs
export * from './stock-movements';

// Note: sales-orders is included in sales.dto.ts to avoid conflicts

// Customer Contacts
export * from './customer-contacts/customer-contact.dto';

// Role Permissions
export * from './role-permissions/role-permissions.dto';

// Latitude Points
export * from './latitude-points/latitude-points.dto';

// Genes
export * from './genes/genes.dto';
export * from './genes/bulk-update.dto';
export * from './genes/gene-dependency.dto';
export * from './genes/gene-history.dto';
export * from './genes/link-gene-sector.dto';
export * from './genes/usage-report.dto';

// Customer Contacts DTOs
export * from './customer-contacts/customer-contact.dto';

// Role Permissions DTOs
export * from './role-permissions/role-permissions.dto';

// Latitude Points DTOs
export * from './latitude-points/latitude-points.dto';

// Genes DTOs
export * from './genes/genes.dto';
export * from './genes/bulk-update.dto';
export * from './genes/gene-dependency.dto';
export * from './genes/gene-history.dto';
export * from './genes/link-gene-sector.dto';
export * from './genes/usage-report.dto';

// Sales Templates DTOs
export * from './sales/sales-template.dto';

// Templates DTOs
export * from './templates';

// Suggestions DTOs
export * from './suggestions/suggestion-score.dto';
export * from './suggestions/create-suggestion-score.dto';
