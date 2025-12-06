import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription, timer, switchMap, catchError, of, BehaviorSubject, tap } from 'rxjs';

// استيراد المكونات المشتركة
import { StatsCardComponent, DataTableComponent } from '../../components/shared';
import { ChartComponent } from './chart/chart.component';
import { FilterPanelComponent } from './filter-panel/filter-panel.component';
import { ToastService } from './toast.service'; // خدمة إشعارات وهمية

/**
 * واجهات نمذجة البيانات
 * Interfaces for data modeling
 */

// واجهة لبطاقة الإحصائيات العامة
export interface StatsCard {
  title: string; // عنوان الإحصائية
  value: number; // القيمة
  unit: string; // الوحدة (مثل: صنف، مستودع، ريال)
  icon: string; // أيقونة المادة
}

// واجهة عامة لبيانات الرسوم البيانية
export interface ChartData {
  labels: string[]; // تسميات المحور السيني
  datasets: {
    label: string; // تسمية مجموعة البيانات
    data: number[]; // بيانات الرسم البياني
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

// واجهة لملخص الصنف (للأصناف الناقصة)
export interface ItemSummary {
  id: number;
  name: string;
  sku: string;
  stock: number; // الكمية الحالية
  minStock: number; // الحد الأدنى للمخزون
}

// واجهة لملخص الحركة (لآخر الحركات)
export interface TransactionSummary {
  id: number;
  type: 'دخول' | 'خروج' | 'نقل';
  item: string;
  quantity: number;
  date: string;
}

// واجهة لبيانات لوحة التحكم المجمعة
export interface DashboardData {
  generalStats: StatsCard[]; // إحصائيات عامة
  monthlyInventoryMovement: ChartData; // حركة المخزون الشهرية
  topMovingItems: ChartData; // أعلى الأصناف حركة
  inventoryDistributionByCategory: ChartData; // توزيع المخزون حسب الفئة
  lowStockItems: ItemSummary[]; // الأصناف الناقصة
  recentTransactions: TransactionSummary[]; // آخر الحركات
}

/**
 * خدمة المخزون الوهمية (Mock InventoryService)
 * تحاكي جلب البيانات من الواجهة الخلفية باستخدام RxJS
 */
export class InventoryService {
  // محاكاة جلب بيانات لوحة التحكم
  getDashboardData(filter: { startDate: string, endDate: string }): Observable<DashboardData> {
    // محاكاة تأخير الشبكة
    return of(this.createMockData()).pipe(
      tap(() => console.log(`جلب بيانات لوحة التحكم للفترة: ${filter.startDate} - ${filter.endDate}`)),
      // محاكاة خطأ بنسبة 10%
      switchMap(data => Math.random() < 0.1 ? of(new Error('خطأ في الاتصال بالخادم')) : of(data)),
      catchError(error => {
        console.error('خطأ في جلب البيانات:', error);
        return of(error); // تمرير الخطأ كقيمة Observable
      })
    );
  }

  // دالة لإنشاء بيانات وهمية
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
      lowStockItems: [
        { id: 101, name: 'صنف 101', sku: 'SKU-001', stock: 5, minStock: 10 },
        { id: 102, name: 'صنف 102', sku: 'SKU-002', stock: 8, minStock: 15 },
        { id: 103, name: 'صنف 103', sku: 'SKU-003', stock: 2, minStock: 5 },
      ],
      recentTransactions: [
        { id: 501, type: 'دخول', item: 'صنف 105', quantity: 50, date: '2025-12-05' },
        { id: 502, type: 'خروج', item: 'صنف 101', quantity: 5, date: '2025-12-05' },
        { id: 503, type: 'نقل', item: 'صنف 108', quantity: 10, date: '2025-12-04' },
      ]
    };
  }
}

// تعريف المكونات التي سيتم استخدامها في القالب
const MOCK_COMPONENTS = [
  StatsCardComponent,
  ChartComponent,
  DataTableComponent,
  FilterPanelComponent,
  // ... أي مكونات أخرى مطلوبة
];

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ...MOCK_COMPONENTS],
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  providers: [InventoryService, ToastService] // توفير الخدمات
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  // حقن الخدمات
  private inventoryService = inject(InventoryService);
  private toastService = inject(ToastService);

  // حالة تحميل البيانات
  isLoading = new BehaviorSubject<boolean>(true);
  // حالة وجود خطأ
  hasError = new BehaviorSubject<boolean>(false);
  // بيانات لوحة التحكم
  dashboardData: DashboardData | null = null;
  // اشتراك RxJS لإدارة التحديث التلقائي
  private autoRefreshSubscription: Subscription | undefined;
  // الفلتر الحالي (افتراضي: آخر 30 يومًا)
  currentFilter = {
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  };

  // ثابت للتحديث التلقائي (30 ثانية)
  private readonly REFRESH_INTERVAL_MS = 30000;

  constructor() {
    // إعداد الفلتر الافتراضي
  }

  ngOnInit(): void {
    // بدء عملية جلب البيانات والتحديث التلقائي
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    // إلغاء الاشتراك عند تدمير المكون لتجنب تسرب الذاكرة
    this.stopAutoRefresh();
  }

  /**
   * @description يبدأ عملية جلب البيانات والتحديث التلقائي كل 30 ثانية.
   */
  startAutoRefresh(): void {
    this.stopAutoRefresh(); // التأكد من عدم وجود اشتراك سابق

    // استخدام timer لإنشاء Observable يبدأ فوراً ثم يتكرر كل 30 ثانية
    this.autoRefreshSubscription = timer(0, this.REFRESH_INTERVAL_MS).pipe(
      tap(() => {
        this.isLoading.next(true); // تعيين حالة التحميل قبل كل جلب
        this.hasError.next(false); // إعادة تعيين حالة الخطأ
      }),
      // استخدام switchMap للتبديل إلى Observable جلب البيانات وإلغاء الجلب السابق إذا تكرر بسرعة
      switchMap(() => this.inventoryService.getDashboardData(this.currentFilter)),
      // معالجة الأخطاء في مسار البيانات
      catchError(error => {
        this.handleError(error);
        // إرجاع Observable بقيمة null أو بيانات فارغة للسماح للتدفق بالاستمرار
        return of(null);
      })
    ).subscribe({
      next: (data) => {
        this.isLoading.next(false); // إيقاف حالة التحميل

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
        // هذا الجزء لن يتم تنفيذه عادة بسبب catchError في الـ pipe
        this.handleError(err);
      }
    });
  }

  /**
   * @description يوقف عملية التحديث التلقائي بإلغاء الاشتراك.
   */
  stopAutoRefresh(): void {
    if (this.autoRefreshSubscription) {
      this.autoRefreshSubscription.unsubscribe();
      this.autoRefreshSubscription = undefined;
    }
  }

  /**
   * @description يعالج الأخطاء ويعرض إشعار Toast.
   * @param error كائن الخطأ.
   */
  handleError(error: any): void {
    this.hasError.next(true);
    this.isLoading.next(false);
    const errorMessage = error instanceof Error ? error.message : 'حدث خطأ غير متوقع أثناء جلب البيانات.';
    this.toastService.showError(`فشل تحديث لوحة التحكم: ${errorMessage}`);
    console.error('خطأ في المكون:', error);
  }

  /**
   * @description يتم استدعاؤها عند تغيير الفلتر من المكون الفرعي.
   * @param newFilter الفلتر الجديد.
   */
  onFilterChange(newFilter: { startDate: string, endDate: string }): void {
    this.currentFilter = newFilter;
    // إعادة تشغيل التحديث التلقائي لبدء جلب البيانات بالفلتر الجديد فوراً
    this.startAutoRefresh();
  }

  /**
   * @description محاكاة لخدمة الإشعارات (ToastService)
   */
  // Mock ToastService implementation for the sake of a complete file
  // In a real application, this would be a separate service.
  // The inject(ToastService) above assumes it's provided.
}

// محاكاة المكونات المستخدمة
@Component({ selector: 'app-inventory-stats-card', standalone: true, template: '' })
class StatsCardComponent {}
@Component({ selector: 'app-chart', standalone: true, template: '' })
class ChartComponent {
  // محاكاة لـ @Input() data: ChartData;
  // محاكاة لـ @Input() type: 'bar' | 'line' | 'pie';
}
@Component({ selector: 'app-data-table', standalone: true, template: '' })
class DataTableComponent {
  // محاكاة لـ @Input() data: any[];
  // محاكاة لـ @Input() columns: any[];
}
@Component({ selector: 'app-inventory-filter-panel', standalone: true, template: '' })
class FilterPanelComponent {
  // محاكاة لـ @Output() filterChange = new EventEmitter<{ startDate: string, endDate: string }>();
}
@Component({ selector: 'app-toast-service', standalone: true, template: '' })
class ToastService {
  showError(message: string) {
    console.warn(`[TOAST ERROR]: ${message}`);
  }
}
