import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Pages
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { ItemsPageComponent } from './pages/items-page/items-page.component';
import { WarehousesPageComponent } from './pages/warehouses-page/warehouses-page.component';
import { MovementsPageComponent } from './pages/movements-page/movements-page.component';
import { StockCountPageComponent } from './pages/stock-count-page/stock-count-page.component';
import { ReportsPageComponent } from './pages/reports-page/reports-page.component';

/**
 * مسارات نظام المخازن
 */
const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardPageComponent,
    data: {
      title: 'لوحة التحكم',
      breadcrumb: 'لوحة التحكم',
      icon: 'dashboard',
      description: 'نظرة عامة على نظام المخازن'
    }
  },
  {
    path: 'items',
    component: ItemsPageComponent,
    data: {
      title: 'الأصناف',
      breadcrumb: 'الأصناف',
      icon: 'inventory',
      description: 'إدارة الأصناف والمنتجات'
    }
  },
  {
    path: 'warehouses',
    component: WarehousesPageComponent,
    data: {
      title: 'المستودعات',
      breadcrumb: 'المستودعات',
      icon: 'warehouse',
      description: 'إدارة المستودعات ورصيدها'
    }
  },
  {
    path: 'movements',
    component: MovementsPageComponent,
    data: {
      title: 'حركات المخزون',
      breadcrumb: 'حركات المخزون',
      icon: 'swap_horiz',
      description: 'عرض وإدارة حركات المخزون'
    }
  },
  {
    path: 'stock-count',
    component: StockCountPageComponent,
    data: {
      title: 'الجرد',
      breadcrumb: 'الجرد',
      icon: 'fact_check',
      description: 'إجراء وإدارة عمليات الجرد'
    }
  },
  {
    path: 'reports',
    component: ReportsPageComponent,
    data: {
      title: 'التقارير',
      breadcrumb: 'التقارير',
      icon: 'assessment',
      description: 'تقارير المخزون والحركات'
    }
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

/**
 * وحدة التوجيه لنظام المخازن
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule {}
