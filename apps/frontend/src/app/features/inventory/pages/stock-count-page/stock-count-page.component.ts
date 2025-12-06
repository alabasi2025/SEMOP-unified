
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

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from './inventory.service';
import { StockCount, StockCountFilter, StockCountStats, StockCountStatus } from './inventory.interfaces';
import { BehaviorSubject, Observable, catchError, combineLatest, map, of, startWith, switchMap, tap } from 'rxjs';
import { FormsModule } from '@angular/forms'; // لاستخدام ngModel في الفلترة

// استيراد المكونات المشتركة

// افتراض أن هذه المكونات مستقلة ومتاحة للاستيراد
// في التطبيق الحقيقي، يجب استيرادها من مسارها الصحيح
// لغرض هذا المثال، نفترض وجودها

/**
 * @description مكون صفحة جرد المخزون (Stock Count Page Component)
 * يستخدم Angular 15+ Standalone Component و RxJS للبرمجة التفاعلية.
 */
@Component({
  selector: 'app-stock-count-page',
  standalone: true,
  imports: [CommonModule, DataTableComponent, StatsCardComponent, SearchBarComponent],
  templateUrl: './stock-count-page.component.html',
  styleUrls: ['./stock-count-page.component.scss'],
})
export class StockCountPageComponent implements OnInit {
  // حقن الخدمات
  private inventoryService = inject(InventoryService);
  private toastService = inject(ToastService);

  // حالة التحميل
  loadingStats$ = new BehaviorSubject<boolean>(false);
  loadingList$ = new BehaviorSubject<boolean>(false);

  // مصدر البيانات التفاعلي للمرشحات
  private filterSubject = new BehaviorSubject<StockCountFilter>({
    status: null,
    startDate: null,
    endDate: null,
    warehouseId: null,
  });

  // المرشحات الحالية (لربطها بـ ngModel في القالب)
  currentFilter: StockCountFilter = this.filterSubject.value;

  // قائمة حالات الجرد المتاحة للفلترة
  stockCountStatuses = Object.values(StockCountStatus);

  // Observables للبيانات النهائية
  stockCounts$!: Observable<StockCount[]>;
  stockCountStats$!: Observable<StockCountStats>;

  // تفاصيل الجرد المعروضة في Dialog
  selectedCountDetails$ = new BehaviorSubject<StockCount | null>(null);
  isDetailsDialogOpen = false;

  ngOnInit(): void {
    // 1. تدفق البيانات الإحصائية (Stats)
    this.stockCountStats$ = this.getStats();

    // 2. تدفق بيانات قائمة الجرد (List)
    this.stockCounts$ = this.filterSubject.pipe(
      // عند تغيير المرشحات، قم بتحميل القائمة الجديدة
      tap(() => this.loadingList$.next(true)),
      switchMap((filter) => this.inventoryService.getStockCounts(filter).pipe(
        tap(() => this.loadingList$.next(false)),
        catchError((error) => {
          this.loadingList$.next(false);
          this.toastService.showError('فشل في تحميل قائمة الجرد: ' + error.message);
          return of([]); // إرجاع مصفوفة فارغة عند الخطأ
        })
      )),
      startWith([]) // قيمة أولية
    );
  }

  /**
   * @description جلب الإحصائيات من الخدمة.
   * @returns Observable لـ StockCountStats
   */
  private getStats(): Observable<StockCountStats> {
    this.loadingStats$.next(true);
    return this.inventoryService.getStockCountStats().pipe(
      tap(() => this.loadingStats$.next(false)),
      catchError((error) => {
        this.loadingStats$.next(false);
        this.toastService.showError('فشل في تحميل الإحصائيات: ' + error.message);
        // إرجاع إحصائيات صفرية عند الخطأ
        return of({ totalCounts: 0, inProgress: 0, completed: 0, totalDifferenceValue: 0 });
      })
    );
  }

  /**
   * @description تطبيق المرشحات الجديدة.
   */
  applyFilter(): void {
    // إرسال قيمة المرشحات الجديدة إلى filterSubject لتشغيل تدفق البيانات
    this.filterSubject.next(this.currentFilter);
  }

  /**
   * @description مسح المرشحات وإعادة تعيينها.
   */
  clearFilter(): void {
    this.currentFilter = {
      status: null,
      startDate: null,
      endDate: null,
      warehouseId: null,
    };
    this.applyFilter();
  }

  /**
   * @description إنشاء عملية جرد جديدة.
   */
  createNewCount(): void {
    // محاكاة اختيار مستودع (نفترض معرف 1 للمستودع الرئيسي)
    const warehouseId = 1;
    this.inventoryService.createStockCount(warehouseId).subscribe({
      next: (newCount) => {
        this.toastService.showSuccess(`تم إنشاء جرد جديد بنجاح: ${newCount.number}`);
        // إعادة تحميل القائمة بعد الإنشاء
        this.applyFilter();
      },
      error: (error) => {
        this.toastService.showError('فشل في إنشاء جرد جديد: ' + error.message);
      }
    });
  }

  /**
   * @description عرض تفاصيل عملية جرد.
   * @param count عملية الجرد المراد عرض تفاصيلها
   */
  viewDetails(count: StockCount): void {
    this.isDetailsDialogOpen = true;
    this.selectedCountDetails$.next(count);
    // يمكن هنا جلب التفاصيل الكاملة من الخدمة إذا لزم الأمر
    // this.inventoryService.getStockCountDetails(count.id).subscribe(...)
  }

  /**
   * @description إغلاق نافذة التفاصيل.
   */
  closeDetailsDialog(): void {
    this.isDetailsDialogOpen = false;
    this.selectedCountDetails$.next(null);
  }

  /**
   * @description اعتماد عملية جرد.
   * @param count عملية الجرد المراد اعتمادها
   */
  approveCount(count: StockCount): void {
    if (count.status !== StockCountStatus.COMPLETED) {
      this.toastService.showInfo('لا يمكن اعتماد جرد لم يكتمل بعد.');
      return;
    }

    this.inventoryService.approveStockCount(count.id).subscribe({
      next: (updatedCount) => {
        this.toastService.showSuccess(`تم اعتماد الجرد ${updatedCount.number} بنجاح.`);
        // تحديث القائمة والإحصائيات
        this.applyFilter();
        this.stockCountStats$ = this.getStats();
      },
      error: (error) => {
        this.toastService.showError('فشل في اعتماد الجرد: ' + error.message);
      }
    });
  }

  /**
   * @description تصدير قائمة الجرد الحالية إلى PDF.
   */
  exportToPdf(): void {
    // منطق تصدير PDF (يمكن أن يكون استدعاء لخدمة أو مكتبة)
    this.toastService.showInfo('جاري تصدير قائمة الجرد إلى ملف PDF...');
    // محاكاة عملية التصدير
    setTimeout(() => {
      this.toastService.showSuccess('تم تصدير ملف PDF بنجاح.');
    }, 1500);
  }

  /**
   * @description دالة مساعدة لتحديد لون الحالة.
   * @param status حالة الجرد
   * @returns اسم الفئة (Class Name) للون
   */
  getStatusClass(status: StockCountStatus): string {
    switch (status) {
      case StockCountStatus.APPROVED:
        return 'status-approved';
      case StockCountStatus.COMPLETED:
        return 'status-completed';
      case StockCountStatus.IN_PROGRESS:
        return 'status-in-progress';
      case StockCountStatus.DRAFT:
        return 'status-draft';
      case StockCountStatus.CANCELED:
        return 'status-canceled';
      default:
        return 'status-default';
    }
  }
}
