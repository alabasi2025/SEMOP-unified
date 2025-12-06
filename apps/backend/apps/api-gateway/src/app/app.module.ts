/**
 * PHASE-11: Complete Backend Fixes
 * COMPONENT: App Module
 * IMPACT: Critical
 * 
 * Changes:
 * - Removed Layer 0 (NO Layer 0 allowed per Sacred Book)
 * - Fixed PrismaModule import to Layer 1
 * - Added OrganizationalStructure module back (now working)
 * - Updated all imports to use @semop/contracts
 * 
 * Date: 2025-12-03
 * Author: Development Team
 */

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Layer 1: Core Services
import { PrismaModule } from '../../../../libs/1-core-services/prisma/prisma.module';
import { AuthModule } from '../../../../libs/1-core-services/auth/auth.module';
import { RolesModule } from '../../../../libs/1-core-services/roles/roles.module';
import { PermissionsModule } from '../../../../libs/1-core-services/permissions/permissions.module';
import { RolePermissionsModule } from '../../../../libs/1-core-services/role-permissions/role-permissions.module';
import { DashboardModule } from '../../../../libs/1-core-services/dashboard/dashboard.module';
import { OrganizationalStructureModule } from '../../../../libs/1-core-services/organizational-structure/organizational-structure.module';

// Layer 2: OCMP
import { GenesModule } from '../../../../libs/2-ocmp/genes/genes.module';
import { HoldingsModule } from '../../../../libs/2-ocmp/holdings/holdings.module';
import { LatitudePointsModule } from '../../../../libs/2-ocmp/latitude-points/latitude-points.module';

// Layer 3: Vertical Applications - Accounting
import { AccountsModule } from '../../../../libs/3-vertical-applications/accounting/accounts/accounts.module';
import { AccountHierarchyModule } from '../../../../libs/3-vertical-applications/accounting/account-hierarchy/account-hierarchy.module';
import { FiscalYearsModule } from '../../../../libs/3-vertical-applications/accounting/fiscal-years/fiscal-years.module';
import { FiscalPeriodsModule } from '../../../../libs/3-vertical-applications/accounting/fiscal-periods/fiscal-periods.module';
import { CostCentersModule } from '../../../../libs/3-vertical-applications/accounting/cost-centers/cost-centers.module';
import { JournalEntriesModule } from '../../../../libs/3-vertical-applications/accounting/journal-entries/journal-entries.module';
import { SmartJournalEntriesModule } from '../../../../libs/3-vertical-applications/accounting/smart-journal-entries/smart-journal-entries.module';

// Layer 3: Vertical Applications - Purchasing
import { SuppliersModule } from '../../../../libs/3-vertical-applications/purchasing/suppliers/suppliers.module';
import { PurchaseOrdersModule } from '../../../../libs/3-vertical-applications/purchasing/purchase-orders/purchase-orders.module';

// Layer 3: Vertical Applications - Sales
import { CustomersModule } from '../../../../libs/3-vertical-applications/sales/customers/customers.module';
import { CustomerContactsModule } from '../../../../libs/3-vertical-applications/sales/customer-contacts/customer-contacts.module';

// Layer 3: Vertical Applications - Projects
import { ProjectsModule } from '../../../../libs/3-vertical-applications/projects/projects/projects.module';

// Layer 3: Vertical Applications - Inventory
import { InventoryModule } from '../../../../libs/3-vertical-applications/inventory/inventory.module';

@Module({
  imports: [
    // Layer 1: Core Services (including Prisma)
    PrismaModule,
    AuthModule,
    RolesModule,
    PermissionsModule,
    RolePermissionsModule,
    DashboardModule,
    OrganizationalStructureModule,
    
    // Layer 2: OCMP
    GenesModule,
    HoldingsModule,
    LatitudePointsModule,
    
    // Layer 3: Accounting
    AccountsModule,
    AccountHierarchyModule,
    FiscalYearsModule,
    FiscalPeriodsModule,
    CostCentersModule,
    JournalEntriesModule,
    SmartJournalEntriesModule,
    
    // Layer 3: Purchasing
    SuppliersModule,
    PurchaseOrdersModule,
    
    // Layer 3: Sales
    CustomersModule,
    CustomerContactsModule,
    
    // Layer 3: Projects
    ProjectsModule,
    
    // Layer 3: Inventory
    InventoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
