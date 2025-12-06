// warehouses-page.component.ts

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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BehaviorSubject, Observable, Subscription, catchError, combineLatest, filter, map, of, startWith, switchMap, tap } from 'rxjs';

// افتراض وجود المكونات والخدمات التالية
// يجب استبدالها بالمسارات الصحيحة في المشروع الفعلي
// افتراض وجود هذا المكون
// افتراض وجود هذا المكون
// افتراض وجود هذا المكون للـ Dialog
// افتراض وجود هذا المكون
import { InventoryService, Warehouse, WarehouseStats } from '../services/inventory.service'; // افتراض وجود هذه الخدمة والأنواع
import { ToastService } from '../services/toast.service'; // افتراض وجود خدمة الإشعارات

/**
 * واجهة لتمثيل حالة الصفحة
 */
interface WarehousesPageState {
  warehouses: Warehouse[];
  stats: WarehouseStats | null;
  loading: boolean;
  error: string | null;
  selectedWarehouse: Warehouse | null;
}

@Component({
  selector: 'app-warehouses-page',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    // المكونات الافتراضية
    WarehouseListComponent,
    StatsCardComponent,
    WarehouseDetailsComponent,
  ],
  templateUrl: './warehouses-page.component.html',
  styleUrls: ['./warehouses-page.component.scss'],
})
export class WarehousesPageComponent implements OnInit, OnDestroy {
  // حقن الخدمات المطلوبة
  private inventoryService = inject(InventoryService);
  private dialog = inject(MatDialog);
  private toastService = inject(ToastService);

  // BehaviorSubject لإدارة تحديث البيانات بشكل تفاعلي
  private refresh$ = new BehaviorSubject<void>(undefined);
  private subscriptions = new Subscription();

  // BehaviorSubject لإدارة حالة الصفحة
  private stateSubject = new BehaviorSubject<WarehousesPageState>({
    warehouses: [],
    stats: null,
    loading: true,
    error: null,
    selectedWarehouse: null,
  });

  // Observable لحالة الصفحة العامة
  public state$: Observable<WarehousesPageState> = this.stateSubject.asObservable();

  // Observable للإحصائيات
  public stats$: Observable<WarehouseStats | null> = this.state$.pipe(map(state => state.stats));

  // Observable لقائمة المستودعات
  public warehouses$: Observable<Warehouse[]> = this.state$.pipe(map(state => state.warehouses));

  // Observable لحالة التحميل
  public loading$: Observable<boolean> = this.state$.pipe(map(state => state.loading));

  // Observable لرسالة الخطأ
  public error$: Observable<string | null> = this.state$.pipe(map(state => state.error));

  // Observable للمستودع المحدد
  public selectedWarehouse$: Observable<Warehouse | null> = this.state$.pipe(map(state => state.selectedWarehouse));

  ngOnInit(): void {
    // [RxJS] دمج طلب جلب البيانات مع تحديث الصفحة
    const data$ = this.refresh$.pipe(
      // عند بدء التحديث، قم بتعيين حالة التحميل إلى صحيح
      tap(() => this.stateSubject.next({ ...this.stateSubject.value, loading: true, error: null })),
      // استخدم switchMap للتبديل إلى Observable جديد (جلب البيانات) وإلغاء الطلبات السابقة
      switchMap(() =>
        combineLatest([
          this.inventoryService.getWarehouses(),
          this.inventoryService.getWarehouseStats(),
        ]).pipe(
          // عند النجاح، قم بتحديث حالة الصفحة
          tap(([warehouses, stats]) => {
            this.stateSubject.next({
              ...this.stateSubject.value,
              warehouses,
              stats,
              loading: false,
              error: null,
            });
          }),
          // عند حدوث خطأ، قم بتحديث حالة الخطأ وعرض إشعار
          catchError(error => {
            const errorMessage = 'فشل في جلب بيانات المستودعات: ' + (error.message || 'خطأ غير معروف');
            this.toastService.showError(errorMessage);
            this.stateSubject.next({
              ...this.stateSubject.value,
              loading: false,
              error: errorMessage,
            });
            return of(null); // إرجاع Observable فارغ لتجنب إنهاء السلسلة
          }),
          // ابدأ بقيمة افتراضية عند الاشتراك
          startWith(null)
        )
      ),
      // تصفية القيم الفارغة الناتجة عن startWith أو catchError
      filter(result => result !== null)
    );

    // الاشتراك في دفق البيانات
    this.subscriptions.add(data$.subscribe());
  }

  /**
   * [حدث] يتم استدعاؤه عند تحديد مستودع من القائمة
   * @param warehouse المستودع المحدد
   */
  onWarehouseSelected(warehouse: Warehouse): void {
    this.stateSubject.next({ ...this.stateSubject.value, selectedWarehouse: warehouse });
  }

  /**
   * [حدث] يتم استدعاؤه لإضافة مستودع جديد أو تعديل مستودع موجود
   * @param warehouse المستودع المراد تعديله (اختياري للإضافة)
   */
  openWarehouseForm(warehouse?: Warehouse): void {
    const dialogRef = this.dialog.open(WarehouseFormComponent, {
      width: '600px',
      data: { warehouse }, // تمرير بيانات المستودع للتعديل
      direction: 'rtl', // دعم RTL للـ Dialog
    });

    this.subscriptions.add(
      dialogRef.afterClosed().subscribe(result => {
        // إذا تم إغلاق الـ Dialog بنجاح (تمت الإضافة/التعديل)
        if (result) {
          this.toastService.showSuccess(`تم ${warehouse ? 'تعديل' : 'إضافة'} المستودع بنجاح.`);
          this.refreshData(); // تحديث البيانات بعد العملية
        }
      })
    );
  }

  /**
   * [حدث] يتم استدعاؤه لحذف مستودع
   * @param warehouse المستودع المراد حذفه
   */
  deleteWarehouse(warehouse: Warehouse): void {
    // يجب استبدال هذا بمنطق تأكيد حقيقي (مثل MatDialog أو خدمة تأكيد مخصصة)
    const confirmation = confirm(`هل أنت متأكد من حذف المستودع: ${warehouse.name}؟`);

    if (confirmation) {
      this.inventoryService.deleteWarehouse(warehouse.id).pipe(
        tap(() => {
          this.toastService.showSuccess(`تم حذف المستودع: ${warehouse.name} بنجاح.`);
          this.refreshData(); // تحديث البيانات بعد الحذف
          // إلغاء تحديد المستودع إذا كان هو المحدد
          if (this.stateSubject.value.selectedWarehouse?.id === warehouse.id) {
            this.stateSubject.next({ ...this.stateSubject.value, selectedWarehouse: null });
          }
        }),
        catchError(error => {
          const errorMessage = `فشل في حذف المستودع: ${warehouse.name}.`;
          this.toastService.showError(errorMessage);
          console.error(error);
          return of(null);
        })
      ).subscribe();
    }
  }

  /**
   * [إجراء] تحديث بيانات الصفحة
   */
  refreshData(): void {
    this.refresh$.next(undefined);
  }

  ngOnDestroy(): void {
    // إلغاء جميع الاشتراكات لتجنب تسرب الذاكرة
    this.subscriptions.unsubscribe();
  }
}

// ----------------------------------------------------------------
// محاكاة لخدمة InventoryService والأنواع المطلوبة
// يجب أن تكون هذه في ملفات منفصلة في مشروع حقيقي (مثل inventory.service.ts)
// ----------------------------------------------------------------

/**
 * واجهة لتمثيل بيانات المستودع
 */
export interface Warehouse {
  id: number;
  name: string;
  location: string;
  isActive: boolean;
  totalValue: number; // إجمالي قيمة المخزون
  itemCount: number; // عدد الأصناف
  lastUpdated: Date;
}

/**
 * واجهة لتمثيل إحصائيات المستودعات
 */
export interface WarehouseStats {
  totalWarehouses: number;
  activeWarehouses: number;
  totalInventoryValue: number;
}

// محاكاة للخدمة
,
    { id: 2, name: 'مستودع الشمال', location: 'جدة', isActive: true, totalValue: 850000, itemCount: 320, lastUpdated: new Date() },
    { id: 3, name: 'مستودع الأرشيف', location: 'الدمام', isActive: false, totalValue: 12000, itemCount: 50, lastUpdated: new Date() },
  ];

  /**
   * جلب قائمة المستودعات
   */
  getWarehouses(): Observable<Warehouse[]> {
    // محاكاة لطلب API مع تأخير
    return of(this.mockWarehouses).pipe(
      delay(500),
      tap(() => console.log('تم جلب المستودعات بنجاح'))
    );
  }

  /**
   * جلب إحصائيات المستودعات
   */
  getWarehouseStats(): Observable<WarehouseStats> {
    const totalWarehouses = this.mockWarehouses.length;
    const activeWarehouses = this.mockWarehouses.filter(w => w.isActive).length;
    const totalInventoryValue = this.mockWarehouses.reduce((sum, w) => sum + w.totalValue, 0);

    return of({ totalWarehouses, activeWarehouses, totalInventoryValue }).pipe(
      delay(500),
      tap(() => console.log('تم جلب الإحصائيات بنجاح'))
    );
  }

  /**
   * حذف مستودع
   * @param id معرف المستودع
   */
  deleteWarehouse(id: number): Observable<void> {
    return of(undefined).pipe(
      delay(300),
      tap(() => {
        const initialLength = this.mockWarehouses.length;
        this.mockWarehouses = this.mockWarehouses.filter(w => w.id !== id);
        if (this.mockWarehouses.length === initialLength) {
          throw new Error('المستودع غير موجود');
        }
        console.log(`تم حذف المستودع ذو المعرف ${id}`);
      })
    );
  }
}

// محاكاة لخدمة الإشعارات
`);
    // منطق عرض إشعار النجاح
  }
  showError(message: string): void {
    console.error(`[خطأ]: ${message}`);
    // منطق عرض إشعار الخطأ
  }
}

// يجب توفير الخدمات الحقيقية في ملفات منفصلة
// هنا نستخدم Mocking لأغراض العرض
export const InventoryService = MockInventoryService as any;
export const ToastService = MockToastService as any;

// دالة مساعدة لمحاكاة التأخير
function delay(ms: number) {
  return (source: Observable<any>) =>
    new Observable(observer => {
      const subscription = source.subscribe({
        next(value) {
          setTimeout(() => observer.next(value), ms);
        },
        error(err) {
          setTimeout(() => observer.error(err), ms);
        },
        complete() {
          setTimeout(() => observer.complete(), ms);
        },
      });
      return () => subscription.unsubscribe();
    });
}
