/**
 * PHASE-11: Complete Contracts Exports
 * COMPONENT: Main Index
 * IMPACT: Critical
 * 
 * Changes:
 * - Added all missing exports for DTOs
 * - Organized by domain/module
 * 
 * Date: 2025-12-03
 * Author: Development Team
 * 
 * @module @semop/contracts
 * @version 0.1.4
 */

// ============================================================================
// Auth DTOs
// ============================================================================
export * from './dtos/auth/login.dto';

// ============================================================================
// User & Identity DTOs
// ============================================================================
export * from './dtos/users/create-user.dto';
export * from './dtos/identity/user.dto';

// ============================================================================
// Holding DTOs
// ============================================================================
export * from './dtos/holdings/create-holding.dto';

// ============================================================================
// Unit DTOs
// ============================================================================
export * from './dtos/units/create-unit.dto';

// ============================================================================
// Project DTOs
// ============================================================================
export * from './dtos/projects/create-project.dto';

// ============================================================================
// Role DTOs
// ============================================================================
export * from './dtos/roles/create-role.dto';

// ============================================================================
// Permission DTOs
// ============================================================================
export * from './dtos/permissions/create-permission.dto';

// ============================================================================
// Role-Permission DTOs
// ============================================================================
export * from './dtos/role-permissions/role-permissions.dto';

// ============================================================================
// Accounting DTOs
// ============================================================================
export * from './dtos/accounting';

// ============================================================================
// HR DTOs
// ============================================================================
export * from './dtos/hr/employees/employee.dto';
export * from './dtos/hr/attendance/attendance.dto';
export * from './dtos/hr/leaves/leave.dto';
export * from './dtos/hr/payroll/payroll.dto';
export * from './dtos/hr/deductions-benefits/deductions-benefits.dto';

// ============================================================================
// OCMP - Genes DTOs
// ============================================================================
export * from './dtos/genes/genes.dto';
export * from './dtos/genes/link-gene-sector.dto';
export * from './dtos/genes/gene-dependency.dto';
export * from './dtos/genes/gene-history.dto';
export * from './dtos/genes/bulk-update.dto';
export * from './dtos/genes/usage-report.dto';

// ============================================================================
// OCMP - Latitude Points DTOs
// ============================================================================
export * from './dtos/latitude-points/latitude-points.dto';

// ============================================================================
// Inventory DTOs
// ============================================================================
export * from './dtos/inventory/item.dto';

// ============================================================================
// Stock Movements DTOs
// ============================================================================
export * from './dtos/stock-movements/create-stock-movement.dto';
export * from './dtos/stock-movements/stock-movement-response.dto';

// ============================================================================
// Purchasing DTOs
// ============================================================================
export * from './dtos/purchases/purchase.dto';
export * from './dtos/suppliers/supplier.dto';

// ============================================================================
// Sales DTOs
// ============================================================================
export * from './dtos/sales/sales.dto';
export * from './dtos/customers/customer.dto';
export * from './dtos/customer-contacts/customer-contact.dto';


