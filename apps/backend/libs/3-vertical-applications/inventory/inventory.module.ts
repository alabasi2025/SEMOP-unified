import { Module } from '@nestjs/common';
import { PrismaService } from '../../1-core-services/prisma/prisma.service';

// Warehouses
import { WarehousesController } from './warehouses/warehouses.controller';
import { WarehousesService } from './warehouses/warehouses.service';

// Items
import { ItemsController } from './items/items.controller';
import { ItemsService } from './items/items.service';

// Stock Movements
import { StockMovementsController } from './stock-movements/stock-movements.controller';
import { StockMovementsService } from './stock-movements/stock-movements.service';

// Item Categories
import { ItemCategoriesController } from './item-categories/item-categories.controller';
import { ItemCategoriesService } from './item-categories/item-categories.service';

// Units
import { UnitsController } from './units/units.controller';
import { UnitsService } from './units/units.service';

// Advanced Search
import { ItemsController as AdvancedSearchController } from './advanced-search/items.controller';
import { ItemsService as AdvancedSearchService } from './advanced-search/items.service';

// Barcode Scanner
import { BarcodeScannerController } from './barcode-scanner/barcode-scanner.controller';
import { BarcodeScannerService } from './barcode-scanner/barcode-scanner.service';

// Reports
import { ReportsController } from './reports/reports.controller';
import { ReportsService } from './reports/reports.service';

// Batch Operations
import { BatchOperationsController } from './batch-operations/batch-operations.controller';
import { BatchOperationsService } from './batch-operations/batch-operations.service';

// Dashboard Analytics
import { DashboardAnalyticsController } from './dashboard-analytics/dashboard-analytics.controller';
import { DashboardAnalyticsService } from './dashboard-analytics/dashboard-analytics.service';

// Multi Warehouse Transfer
import { MultiWarehouseTransferController } from './multi-warehouse-transfer/multi-warehouse-transfer.controller';
import { MultiWarehouseTransferService } from './multi-warehouse-transfer/multi-warehouse-transfer.service';

// Mobile Dashboard
import { MobileDashboardController } from './mobile-dashboard/mobile-dashboard.controller';
import { MobileDashboardService } from './mobile-dashboard/mobile-dashboard.service';

@Module({
  controllers: [
    WarehousesController,
    ItemsController,
    StockMovementsController,
    ItemCategoriesController,
    UnitsController,
    AdvancedSearchController,
    BarcodeScannerController,
    ReportsController,
    BatchOperationsController,
    DashboardAnalyticsController,
    MultiWarehouseTransferController,
    MobileDashboardController
  ],
  providers: [
    PrismaService,
    WarehousesService,
    ItemsService,
    StockMovementsService,
    ItemCategoriesService,
    UnitsService,
    AdvancedSearchService,
    BarcodeScannerService,
    ReportsService,
    BatchOperationsService,
    DashboardAnalyticsService,
    MultiWarehouseTransferService,
    MobileDashboardService
  ],
  exports: [
    WarehousesService,
    ItemsService,
    StockMovementsService,
    ItemCategoriesService,
    UnitsService,
    AdvancedSearchService,
    BarcodeScannerService,
    ReportsService,
    BatchOperationsService,
    DashboardAnalyticsService,
    MultiWarehouseTransferService,
    MobileDashboardService
  ]
})
export class InventoryModule {}
