import { of } from 'rxjs';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  BehaviorSubject,
  Observable,
  catchError,
  combineLatest,
  debounceTime,
  filter,
  map,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import {
  InventoryService,
  Movement,
  MovementFilter,
  MovementStats,
  DataTableComponent,
  StatsCardComponent,
  FilterPanelComponent,
  ItemListComponent,
  WarehouseListComponent,
  DialogComponent,
  ButtonComponent,
  IconComponent,
  MovementType,
} from '../models'; // استيراد الواجهات والخدمة الوهمية

// تعريف خدمة وهمية لتجنب أخطاء الحقن
class MockInventoryService extends InventoryService {
  private mockMovements: Movement[] = [
    {
      id: 1,
      date: new Date().toISOString(),
      type: 'INBOUND',
      item: { id: 1, name: 'لابتوب' },
      warehouse: { id: 1, name: 'المستودع الرئيسي' },
      quantity: 10,
      user: { id: 1, name: 'أحمد' },
    },
    {
      id: 2,
      date: new Date().toISOString(),
      type: 'OUTBOUND',
      item: { id: 2, name: 'هاتف ذكي' },
      warehouse: { id: 2, name: 'مستودع الفرع' },
      quantity: 5,
      user: { id: 2, name: 'فاطمة' },
    },
    // ... المزيد من البيانات الوهمية
  ];

  getMovements(filter: MovementFilter): Promise<Movement[]> {
    console.log('Fetching movements with filter:', filter);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.mockMovements);
      }, 500);
    });
  }

  getMovementStats(filter: MovementFilter): Promise<MovementStats> {
    console.log('Fetching stats with filter:', filter);
    return new Promise((resolve) => {
      setTimeout(() => {
        const inbound = this.mockMovements
          .filter((m) => m.type === 'INBOUND')
          .reduce((acc, m) => acc + m.quantity, 0);
        const outbound = this.mockMovements
          .filter((m) => m.type === 'OUTBOUND')
          .reduce((acc, m) => acc + m.quantity, 0);
        resolve({
          totalMovements: this.mockMovements.length,
          totalInbound: inbound,
          totalOutbound: outbound,
        });
      }, 500);
    });
  }

  exportMovements(filter: MovementFilter): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.showToast('تم تصدير الحركات بنجاح.', 'success');
        resolve();
      }, 1000);
    });
  }

  showToast(message: string, type: 'success' | 'error' | 'info'): void {
    console.log(`Toast (${type}): ${message}`);
  }
}

/**
 * @description المكون الرئيسي لصفحة حركات المخزون
 */
@Component({
  selector: 'app-movements-page',
  standalone: true,
  imports: [CommonModule, FormsModule], // سيتم إضافة المكونات الأخرى في ملف HTML
  templateUrl: './movements-page.component.html',
  styleUrls: ['./movements-page.component.scss'],
  providers: [
    // توفير الخدمة الوهمية للاختبار والتطوير
    { provide: InventoryService, useClass: MockInventoryService },
  ],
})
export class MovementsPageComponent implements OnInit {
  // حقن الخدمة
  private inventoryService = inject(InventoryService);

  // حالة التحميل
  public isLoading = new BehaviorSubject<boolean>(false);

  // حالة الخطأ
  public error = new BehaviorSubject<string | null>(null);

  // موضوع الفلتر لتطبيق البرمجة التفاعلية
  private filterSubject = new BehaviorSubject<MovementFilter>({});

  // Observable للحركات
  public movements$: Observable<Movement[]>;

  // Observable للإحصائيات
  public stats$: Observable<MovementStats>;

  // حالة عرض تفاصيل الحركة في Dialog
  public showDetailsDialog = new BehaviorSubject<boolean>(false);

  // الحركة المحددة لعرض التفاصيل
  public selectedMovement = new BehaviorSubject<Movement | null>(null);

  // تعريف أعمدة الجدول
  public tableColumns = [
    { field: 'date', header: 'التاريخ' },
    { field: 'type', header: 'نوع الحركة' },
    { field: 'item.name', header: 'الصنف' },
    { field: 'warehouse.name', header: 'المستودع' },
    { field: 'quantity', header: 'الكمية' },
    { field: 'user.name', header: 'المستخدم' },
    { field: 'actions', header: 'إجراءات' },
  ];

  constructor() {
    // دمج طلبات جلب البيانات في Observable واحد
    const dataStream$ = this.filterSubject.pipe(
      // تأخير بسيط لتجميع تغييرات الفلتر
      debounceTime(300),
      // إظهار حالة التحميل
      tap(() => {
        this.isLoading.next(true);
        this.error.next(null);
      }),
      // التبديل إلى طلب جلب البيانات
      switchMap((filter) =>
        combineLatest([
          // جلب الحركات
          this.inventoryService.getMovements(filter).catch((error: unknown) => error: unknown) => {
            throw new Error('فشل في جلب الحركات');
          }),
          // جلب الإحصائيات
          this.inventoryService.getMovementStats(filter).catch((error: unknown) => error: unknown) => {
            throw new Error('فشل في جلب الإحصائيات');
          }),
        ]).pipe(
          // إخفاء حالة التحميل عند النجاح
          tap(() => this.isLoading.next(false)),
          // معالجة الأخطاء
          catchError((err: any) => {
            this.isLoading.next(false);
            const errorMessage = err.message || 'حدث خطأ غير متوقع.';
            this.error.next(errorMessage);
            this.inventoryService.showToast(errorMessage, 'error');
            // إرجاع قيم افتراضية عند الخطأ
            return of([[] as Movement[], { totalMovements: 0, totalInbound: 0, totalOutbound: 0 } as MovementStats]);
          })
        )
      ),
      // إرجاع البيانات ككائن يحتوي على الحركات والإحصائيات
      map(([movements, stats]) => ({ movements, stats }))
    );

    // فصل الحركات والإحصائيات إلى Observables منفصلة
    this.movements$ = dataStream$.pipe(map((data) => data.movements), startWith([] as Movement[]));
    this.stats$ = dataStream$.pipe(
      map((data) => data.stats),
      startWith({ totalMovements: 0, totalInbound: 0, totalOutbound: 0 } as MovementStats)
    );
  }

  ngOnInit(): void {
    // تحميل البيانات الأولية
    this.filterSubject.next({});
  }

  /**
   * @description معالجة تغييرات الفلتر المتقدم
   * @param newFilter نموذج الفلتر الجديد
   */
  public onFilterChange(newFilter: MovementFilter): void {
    // تحديث موضوع الفلتر لتشغيل تدفق البيانات
    this.filterSubject.next(newFilter);
  }

  /**
   * @description تصدير بيانات الحركات إلى Excel
   */
  public exportToExcel(): void {
    this.isLoading.next(true);
    this.inventoryService
      .exportMovements(this.filterSubject.value)
      .then(() => {
        this.isLoading.next(false);
      })
      .catch((error: unknown) => {
        this.isLoading.next(false);
        const errorMessage = 'فشل في تصدير البيانات.';
        this.error.next(errorMessage);
        this.inventoryService.showToast(errorMessage, 'error');
      });
  }

  /**
   * @description عرض تفاصيل حركة معينة
   * @param movement الحركة المراد عرض تفاصيلها
   */
  public showMovementDetails(movement: Movement): void {
    this.selectedMovement.next(movement);
    this.showDetailsDialog.next(true);
  }

  /**
   * @description إغلاق نافذة تفاصيل الحركة
   */
  public closeDetailsDialog(): void {
    this.showDetailsDialog.next(false);
    this.selectedMovement.next(null);
  }

  /**
   * @description تحويل نوع الحركة إلى نص عربي
   * @param type نوع الحركة
   * @returns النص العربي لنوع الحركة
   */
  public getMovementTypeLabel(type: MovementType): string {
    switch (type) {
      case 'INBOUND':
        return 'وارد';
      case 'OUTBOUND':
        return 'صادر';
      case 'ADJUSTMENT':
        return 'تسوية';
      default:
        return 'غير محدد';
    }
  }
}
