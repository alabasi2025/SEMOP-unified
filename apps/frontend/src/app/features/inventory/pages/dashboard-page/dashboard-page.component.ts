
// استيراد المكونات المشتركة
// استيراد المكونات المشتركة
import { DataTableComponent, ColumnConfig } from '../../components/shared/data-table/data-table.component';
import { StatsCardComponent } from '../../components/shared/stats-card/stats-card.component';
import { SearchBarComponent } from '../../components/shared/search-bar/search-bar.component';

import { 
  Item, 
  Warehouse, 
  StockMovement, 
  ItemCategory, 
  Unit,
  InventoryCount,
  StockBalance
} from '../../models/inventory.models';

import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, timer, switchMap, catchError, of, BehaviorSubject, tap } from 'rxjs';

/**
 * واجهات نمذجة البيانات
 */
export interface StatsCard {
  title: string;
  value: number;
  unit: string;
  icon: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

export interface DashboardData {
  generalStats: StatsCard[];
  monthlyInventoryMovement: ChartData;
  topMovingItems: ChartData;
  inventoryDistributionByCategory: ChartData;
  lowStockItems: Item[];
  recentTransactions: StockMovement[];
}

/**
 * خدمة المخزون الوهمية (Mock InventoryService)
 */
export class InventoryService {
  getDashboardData(filter: { startDate: string, endDate: string }): Observable<DashboardData> {
    return of(this.createMockData()).pipe(
      tap(() => console.log(`جلب بيانات لوحة التحكم للفترة: ${filter.startDate} - ${filter.endDate}`)),
      switchMap(data => Math.random() < 0.1 ? of(new Error('خطأ في الاتصال بالخادم')) : of(data)),
      catchError(error => {
        console.error('خطأ في جلب البيانات:', error);
        return of(error);
      })
    );
  }

  private createMockData(): DashboardData {
    return {
      generalStats: [
        { title: 'إجمالي الأصناف', value: 1250, unit: 'صنف', icon: 'package' },
        { title: 'المستودعات', value: 12, unit: 'مستودع', icon: 'warehouse' },
        { title: 'قيمة المخزون', value: 4500000, unit: 'ريال', icon: 'dollar-sign' },
        { title: 'الحركات اليوم', value: 87, unit: 'حركة', icon: 'activity' },
      ],
      monthlyInventoryMovement: {
        labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
        datasets: [
          { label: 'دخول', data: [120, 190, 300, 500, 200, 300], backgroundColor: '#4CAF50' },
          { label: 'خروج', data: [80, 100, 150, 350, 150, 250], backgroundColor: '#F44336' },
        ]
      },
      topMovingItems: {
        labels: ['صنف أ', 'صنف ب', 'صنف ج', 'صنف د', 'صنف هـ'],
        datasets: [
          { label: 'إجمالي الحركات', data: [500, 450, 300, 250, 180], backgroundColor: '#2196F3' },
        ]
      },
      inventoryDistributionByCategory: {
        labels: ['إلكترونيات', 'ملابس', 'أدوات', 'أثاث'],
        datasets: [
          { label: 'النسبة المئوية', data: [40, 30, 20, 10], backgroundColor: ['#FF9800', '#00BCD4', '#8BC34A', '#673AB7'] },
        ]
      },
      lowStockItems: [],
      recentTransactions: []
    };
  }
}

export class ToastService {
  showError(message: string) {
    console.warn(`[TOAST ERROR]: ${message}`);
  }
}

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    StatsCardComponent,
    DataTableComponent
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  providers: [InventoryService, ToastService]
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  private inventoryService = inject(InventoryService);
  private toastService = inject(ToastService);

  isLoading = new BehaviorSubject<boolean>(true);
  hasError = new BehaviorSubject<boolean>(false);
  dashboardData: DashboardData | null = null;
  private autoRefreshSubscription: Subscription | undefined;
  
  currentFilter = {
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  };

  private readonly REFRESH_INTERVAL_MS = 30000;

  // تعريف الأعمدة للجداول
  movementColumns: ColumnConfig[] = [
    { field: 'id', header: 'رقم الحركة', sortable: true },
    { field: 'movementType', header: 'النوع', sortable: true },
    { field: 'itemName', header: 'الصنف', sortable: true },
    { field: 'quantity', header: 'الكمية', sortable: true },
    { field: 'movementDate', header: 'التاريخ', sortable: true, type: 'date' }
  ];

  itemColumns: ColumnConfig[] = [
    { field: 'code', header: 'الكود', sortable: true },
    { field: 'nameAr', header: 'الاسم', sortable: true },
    { field: 'minStock', header: 'الحد الأدنى', sortable: true }
  ];

  ngOnInit(): void {
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }

  startAutoRefresh(): void {
    this.stopAutoRefresh();

    this.autoRefreshSubscription = timer(0, this.REFRESH_INTERVAL_MS).pipe(
      tap(() => {
        this.isLoading.next(true);
        this.hasError.next(false);
      }),
      switchMap(() => this.inventoryService.getDashboardData(this.currentFilter)),
      catchError(error => {
        this.handleError(error);
        return of(null);
      })
    ).subscribe({
      next: (data) => {
        this.isLoading.next(false);

        if (data instanceof Error) {
          this.handleError(data);
          this.dashboardData = null;
          return;
        }

        if (data) {
          this.dashboardData = data;
          console.log('تم تحديث بيانات لوحة التحكم بنجاح.');
        }
      },
      error: (err) => {
        this.handleError(err);
      }
    });
  }

  stopAutoRefresh(): void {
    if (this.autoRefreshSubscription) {
      this.autoRefreshSubscription.unsubscribe();
      this.autoRefreshSubscription = undefined;
    }
  }

  handleError(error: any): void {
    this.hasError.next(true);
    this.isLoading.next(false);
    const errorMessage = error instanceof Error ? error.message : 'حدث خطأ غير متوقع أثناء جلب البيانات.';
    this.toastService.showError(`فشل تحديث لوحة التحكم: ${errorMessage}`);
    console.error('خطأ في المكون:', error);
  }

  onFilterChange(newFilter: { startDate: string, endDate: string }): void {
    this.currentFilter = newFilter;
    this.startAutoRefresh();
  }
}
