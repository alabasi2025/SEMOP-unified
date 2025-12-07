
// warehouses-page.component.ts

import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BehaviorSubject, Observable, Subscription, catchError, combineLatest, filter, map, of, startWith, switchMap, tap } from 'rxjs';

// استيراد المكونات المشتركة
import { StatsCardComponent } from '../../shared/stats-card/stats-card.component';
import { WarehouseListComponent } from '../../components/warehouses/warehouse-list/warehouse-list.component';
import { WarehouseFormComponent } from '../../components/warehouses/warehouse-form/warehouse-form.component';
import { WarehouseDetailsComponent } from '../../components/warehouses/warehouse-details/warehouse-details.component';
import { InventoryService } from '../../services/inventory.service';
import { Warehouse, WarehouseStats } from '../../models';
import { ToastService } from '../../services/toast.service';

/**
 * واجهة لتمثيل حالة الصفحة
 */
interface WarehousesPageState {
  warehouses: Warehouse[];
  stats: WarehouseStats | null | undefined;
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
      this.inventoryService.deleteWarehouse(warehouse.id.toString()).pipe(
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
