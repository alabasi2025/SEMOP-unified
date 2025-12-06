import { Module } from '@nestjs/common';
import { PrismaModule } from '../1-core-services/prisma/prisma.module';

// Services
import { ItemsService } from './services/items.service';
import { WarehousesService } from './services/warehouses.service';
import { StockMovementsService } from './services/stock-movements.service';
import { TransfersService } from './services/transfers.service';
import { StockCountService } from './services/stock-count.service';
import { ReportsService } from './services/reports.service';
import { CategoriesService } from './services/categories.service';
import { UnitsService } from './services/units.service';

// Controllers
import { ItemsController } from './controllers/items.controller';
import { WarehousesController } from './controllers/warehouses.controller';
import { StockMovementsController } from './controllers/stock-movements.controller';
import { TransfersController } from './controllers/transfers.controller';
import { StockCountController } from './controllers/stock-count.controller';
import { ReportsController } from './controllers/reports.controller';
import { CategoriesController } from './controllers/categories.controller';
import { UnitsController } from './controllers/units.controller';

/**
 * وحدة نظام إدارة المخازن
 * 
 * تحتوي على جميع الخدمات والمتحكمات الخاصة بنظام المخازن:
 * - إدارة الأصناف (Items)
 * - إدارة المستودعات (Warehouses)
 * - حركات المخزون (Stock Movements)
 * - التحويلات بين المستودعات (Transfers)
 * - الجرد (Stock Count)
 * - التقارير (Reports)
 * - الفئات (Categories)
 * - الوحدات (Units)
 */
@Module({
  imports: [PrismaModule],
  controllers: [
    ItemsController,
    WarehousesController,
    StockMovementsController,
    TransfersController,
    StockCountController,
    ReportsController,
    CategoriesController,
    UnitsController,
  ],
  providers: [
    ItemsService,
    WarehousesService,
    StockMovementsService,
    TransfersService,
    StockCountService,
    ReportsService,
    CategoriesService,
    UnitsService,
  ],
  exports: [
    ItemsService,
    WarehousesService,
    StockMovementsService,
    TransfersService,
    StockCountService,
    ReportsService,
    CategoriesService,
    UnitsService,
  ],
})
export class InventoryModule {}
