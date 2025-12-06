import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Routing
import { InventoryRoutingModule } from './inventory-routing.module';

// Services
import { InventoryService } from './services/inventory.service';

// Pages
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { ItemsPageComponent } from './pages/items-page/items-page.component';
import { WarehousesPageComponent } from './pages/warehouses-page/warehouses-page.component';
import { MovementsPageComponent } from './pages/movements-page/movements-page.component';
import { StockCountPageComponent } from './pages/stock-count-page/stock-count-page.component';
import { ReportsPageComponent } from './pages/reports-page/reports-page.component';

// Shared Components
import { DataTableComponent } from './components/shared/data-table/data-table.component';
import { StatsCardComponent } from './components/shared/stats-card/stats-card.component';
import { SearchBarComponent } from './components/shared/search-bar/search-bar.component';
import { FilterPanelComponent } from './components/shared/filter-panel/filter-panel.component';
import { PaginationComponent } from './components/shared/pagination/pagination.component';

// Items Components
import { ItemListComponent } from './components/items/item-list/item-list.component';
import { ItemFormComponent } from './components/items/item-form/item-form.component';
import { ItemDetailsComponent } from './components/items/item-details/item-details.component';
import { ItemSearchComponent } from './components/items/item-search/item-search.component';
import { ItemStockCardComponent } from './components/items/item-stock-card/item-stock-card.component';

// Warehouses Components
import { WarehouseListComponent } from './components/warehouses/warehouse-list/warehouse-list.component';
import { WarehouseFormComponent } from './components/warehouses/warehouse-form/warehouse-form.component';
import { WarehouseDetailsComponent } from './components/warehouses/warehouse-details/warehouse-details.component';
import { WarehouseStockComponent } from './components/warehouses/warehouse-stock/warehouse-stock.component';
import { WarehouseStatsCardComponent } from './components/warehouses/warehouse-stats-card/warehouse-stats-card.component';

/**
 * وحدة نظام المخازن
 * 
 * تحتوي على جميع المكونات والخدمات والصفحات الخاصة بنظام المخازن
 */
@NgModule({
  declarations: [],
  imports: [
    // Angular Core Modules
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,

    // Routing
    InventoryRoutingModule,

    // Pages (Standalone Components)
    DashboardPageComponent,
    ItemsPageComponent,
    WarehousesPageComponent,
    MovementsPageComponent,
    StockCountPageComponent,
    ReportsPageComponent,

    // Shared Components (Standalone Components)
    DataTableComponent,
    StatsCardComponent,
    SearchBarComponent,
    FilterPanelComponent,
    PaginationComponent,

    // Items Components (Standalone Components)
    ItemListComponent,
    ItemFormComponent,
    ItemDetailsComponent,
    ItemSearchComponent,
    ItemStockCardComponent,

    // Warehouses Components (Standalone Components)
    WarehouseListComponent,
    WarehouseFormComponent,
    WarehouseDetailsComponent,
    WarehouseStockComponent,
    WarehouseStatsCardComponent
  ],
  providers: [
    // Services
    InventoryService
  ],
  exports: [
    // Export components that might be used outside this module
    DataTableComponent,
    StatsCardComponent,
    SearchBarComponent,
    FilterPanelComponent,
    PaginationComponent
  ]
})
export class InventoryModule {}
