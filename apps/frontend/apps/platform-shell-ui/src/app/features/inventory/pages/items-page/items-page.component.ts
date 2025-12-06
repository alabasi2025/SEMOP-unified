import { of } from 'rxjs';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, Observable, combineLatest, switchMap, catchError, tap, map, startWith, Subject, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';

// محاكاة للخدمات والمكونات المطلوبة
// في تطبيق حقيقي، سيتم استيراد هذه من مساراتها الفعلية
interface Item {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  isActive: boolean;
}

interface ItemStats {
  totalItems: number;
  activeItems: number;
  lowStockItems: number;
}

interface ItemFilter {
  searchTerm: string;
  category: string | null;
}

// محاكاة لخدمة إدارة المخزون (InventoryService)
class MockInventoryService {
  // محاكاة البيانات الأولية
  private mockItems: Item[] = [
    { id: 1, name: 'لابتوب ديل', category: 'إلكترونيات', price: 2500, stock: 15, isActive: true },
    { id: 2, name: 'هاتف سامسونج', category: 'إلكترونيات', price: 1800, stock: 5, isActive: true },
    { id: 3, name: 'كرسي مكتبي', category: 'أثاث', price: 450, stock: 0, isActive: false },
    { id: 4, name: 'طاولة اجتماعات', category: 'أثاث', price: 1200, stock: 22, isActive: true },
  ];

  getItems(filter: ItemFilter): Observable<Item[]> {
    // محاكاة استدعاء API مع تأخير بسيط
    return of(this.mockItems.filter(item =>
      item.name.toLowerCase().includes(filter.searchTerm.toLowerCase()) &&
      (filter.category === null || item.category === filter.category)
    )).pipe(
      delay(300),
      // محاكاة خطأ محتمل
      // tap(() => { if (Math.random() < 0.1) throw new Error('فشل في تحميل الأصناف'); })
    );
  }

  getItemStats(): Observable<ItemStats> {
    // محاكاة استدعاء API لإحصائيات الأصناف
    const stats: ItemStats = {
      totalItems: this.mockItems.length,
      activeItems: this.mockItems.filter(i => i.isActive).length,
      lowStockItems: this.mockItems.filter(i => i.stock <= 5 && i.stock > 0).length,
    };
    return of(stats).pipe(delay(100));
  }

  addItem(item: Partial<Item>): Observable<Item> {
    const newItem: Item = { ...item, id: Date.now(), isActive: true } as Item;
    this.mockItems.push(newItem);
    return of(newItem).pipe(delay(300));
  }

  updateItem(item: Item): Observable<Item> {
    const index = this.mockItems.findIndex(i => i.id === item.id);
    if (index > -1) {
      this.mockItems[index] = item;
      return of(item).pipe(delay(300));
    }
    return throwError(() => new Error('الصنف غير موجود'));
  }

  deleteItem(id: number): Observable<void> {
    this.mockItems = this.mockItems.filter(i => i.id !== id);
    return of(undefined).pipe(delay(300));
  }

  exportItems(): Observable<Blob> {
    // محاكاة عملية التصدير
    return of(new Blob(['Excel Data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })).pipe(delay(500));
  }
}

// محاكاة لخدمة الإشعارات (ToastService)
class MockToastService {
  success(message: string): void {
    console.log(`Toast SUCCESS: ${message}`);
  }
  error(message: string): void {
    console.error(`Toast ERROR: ${message}`);
  }
  info(message: string): void {
    console.log(`Toast INFO: ${message}`);
  }
}

// محاكاة لمكونات أخرى
const ItemListComponent = Component({ selector: 'app-item-list', template: '' })(class {});
const ItemSearchComponent = Component({ selector: 'app-item-search', template: '' })(class {});
const ItemFormComponent = Component({ selector: 'app-item-form', template: '' })(class {});
const StatsCardComponent = Component({ selector: 'app-stats-card', template: '' })(class {});
const FilterPanelComponent = Component({ selector: 'app-filter-panel', template: '' })(class {});
const ConfirmationDialogComponent = Component({ selector: 'app-confirmation-dialog', template: '' })(class {});

// دالة مساعدة لمحاكاة التأخير
const delay = (ms: number) => (source: Observable<any>) => new Observable(observer => {
  const subscription = source.subscribe({
    next: value => setTimeout(() => observer.next(value), ms),
    error: err => setTimeout(() => observer.error(err), ms),
    complete: () => setTimeout(() => observer.complete(), ms)
  });
  return () => subscription.unsubscribe();
});

// تعريف المكون الرئيسي
@Component({
  selector: 'app-items-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    // المكونات المستوردة
    ItemListComponent,
    ItemSearchComponent,
    StatsCardComponent,
    FilterPanelComponent,
    // ...
  ],
  templateUrl: './items-page.component.html',
  styleUrls: ['./items-page.component.scss'],
  providers: [
    // توفير الخدمات هنا (في تطبيق حقيقي، قد تكون مقدمة في الجذر)
    { provide: 'InventoryService', useClass: MockInventoryService },
    { provide: 'ToastService', useClass: MockToastService },
  ]
})
export class ItemsPageComponent implements OnInit, OnDestroy {
  // حقن الخدمات
  private inventoryService: MockInventoryService = inject('InventoryService');
  private toastService: MockToastService = inject('ToastService');
  private dialog: MatDialog = inject(MatDialog);

  // إدارة الحالة باستخدام RxJS
  // Subject لإرسال طلبات تحديث البيانات
  private refresh$ = new BehaviorSubject<void>(undefined);
  // Subject لإدارة الفلترة والبحث
  private filter$ = new BehaviorSubject<ItemFilter>({ searchTerm: '', category: null });
  // Subject لإلغاء جميع الاشتراكات عند تدمير المكون
  private destroy$ = new Subject<void>();

  // حالة التحميل
  isLoading$ = new BehaviorSubject<boolean>(false);
  // قائمة الأصناف المراد عرضها
  items$: Observable<Item[]>;
  // إحصائيات الأصناف
  stats$: Observable<ItemStats>;
  // رسالة الخطأ
  error: string | null = null;

  // قائمة الفئات المتاحة (للفلترة)
  categories: string[] = ['إلكترونيات', 'أثاث', 'ملابس', 'أخرى'];

  constructor() {
    // دمج طلبات التحديث مع الفلترة لإنشاء تدفق البيانات الرئيسي
    this.items$ = combineLatest([
      this.refresh$.pipe(startWith(undefined)), // يبدأ بتحميل عند التهيئة
      this.filter$
    ]).pipe(
      tap(() => {
        this.isLoading$.next(true); // بدء التحميل
        this.error = null;
      }),
      // التبديل إلى استدعاء الخدمة عند حدوث أي تغيير في التحديث أو الفلترة
      switchMap(([_, filter]) => this.inventoryService.getItems(filter).pipe(
        tap(() => this.isLoading$.next(false)), // انتهاء التحميل بنجاح
        catchError(err => {
          this.isLoading$.next(false); // انتهاء التحميل بخطأ
          this.error = 'فشل في تحميل الأصناف: ' + err.message;
          this.toastService.error(this.error);
          return of([]); // إرجاع مصفوفة فارغة عند الخطأ
        })
      )),
      takeUntil(this.destroy$) // إلغاء الاشتراك عند تدمير المكون
    );

    // تدفق إحصائيات الأصناف
    this.stats$ = this.refresh$.pipe(
      startWith(undefined),
      switchMap(() => this.inventoryService.getItemStats().pipe(
        catchError(err => {
          this.toastService.error('فشل في تحميل الإحصائيات: ' + err.message);
          return of({ totalItems: 0, activeItems: 0, lowStockItems: 0 }); // إرجاع إحصائيات فارغة عند الخطأ
        })
      )),
      takeUntil(this.destroy$)
    );
  }

  ngOnInit(): void {
    // لا حاجة لـ subscribe هنا، لأننا نستخدم async pipe في القالب
    // ولكن يمكننا استخدامها لتسجيل الأخطاء أو التفاعلات الجانبية
  }

  /**
   * @description معالجة تغييرات البحث والفلترة.
   * @param newFilter الفلتر الجديد المطبق.
   */
  onFilterChange(newFilter: Partial<ItemFilter>): void {
    const currentFilter = this.filter$.getValue();
    this.filter$.next({ ...currentFilter, ...newFilter });
  }

  /**
   * @description فتح نموذج إضافة/تعديل صنف في نافذة منبثقة (Dialog).
   * @param item الصنف المراد تعديله (اختياري للإضافة).
   */
  openItemForm(item?: Item): void {
    const dialogRef = this.dialog.open(ItemFormComponent, {
      data: { item },
      width: '600px',
      direction: 'rtl' // دعم RTL للنافذة المنبثقة
    });

    dialogRef.afterClosed().pipe(
      // معالجة النتيجة بعد إغلاق النافذة
      tap((result: Item | undefined) => {
        if (result) {
          // إذا كانت النتيجة موجودة، فهذا يعني أنه تم إضافة/تعديل صنف
          const action = item ? 'تعديل' : 'إضافة';
          this.toastService.success(`تم ${action} الصنف بنجاح.`);
          this.refresh$.next(undefined); // تحديث قائمة الأصناف والإحصائيات
        }
      }),
      catchError(err => {
        this.toastService.error('فشل في حفظ الصنف: ' + err.message);
        return of(null);
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  /**
   * @description حذف صنف بعد تأكيد المستخدم.
   * @param item الصنف المراد حذفه.
   */
  deleteItem(item: Item): void {
    // محاكاة فتح نافذة تأكيد
    const confirmationRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: `هل أنت متأكد من حذف الصنف: ${item.name}؟` },
      direction: 'rtl'
    });

    confirmationRef.afterClosed().pipe(
      switchMap((confirmed: boolean) => {
        if (confirmed) {
          this.isLoading$.next(true);
          return this.inventoryService.deleteItem(item.id).pipe(
            tap(() => {
              this.isLoading$.next(false);
              this.toastService.success(`تم حذف الصنف ${item.name} بنجاح.`);
              this.refresh$.next(undefined); // تحديث القائمة
            }),
            catchError(err => {
              this.isLoading$.next(false);
              this.toastService.error('فشل في حذف الصنف: ' + err.message);
              return of(null);
            })
          );
        }
        return of(null); // لم يتم التأكيد
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  /**
   * @description تصدير بيانات الأصناف إلى ملف Excel.
   */
  exportToExcel(): void {
    this.toastService.info('بدء تصدير البيانات...');
    this.isLoading$.next(true);
    this.inventoryService.exportItems().pipe(
      tap(blob => {
        this.isLoading$.next(false);
        // محاكاة تنزيل الملف
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'items_export.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        this.toastService.success('تم تصدير البيانات بنجاح.');
      }),
      catchError(err => {
        this.isLoading$.next(false);
        this.toastService.error('فشل في تصدير البيانات: ' + err.message);
        return of(null);
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  /**
   * @description تنظيف الاشتراكات عند تدمير المكون.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
