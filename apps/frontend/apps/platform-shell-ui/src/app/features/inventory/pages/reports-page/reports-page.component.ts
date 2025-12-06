import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Observable, BehaviorSubject, combineLatest, of, throwError } from 'rxjs';
import { switchMap, tap, catchError, startWith, delay } from 'rxjs/operators';

// -------------------------------------------------------------------
// 1. تعريف الواجهات والنماذج (Models)
// -------------------------------------------------------------------

/**
 * @description واجهة لتعريف تقرير متاح.
 */
interface Report {
  id: string;
  nameAr: string;
  descriptionAr: string;
  icon: string;
  componentType: 'table' | 'chart'; // نوع العرض: جدول أو مخطط
}

/**
 * @description واجهة لخيارات الفلترة المتقدمة.
 */
interface ReportFilters {
  dateRange: [Date | null, Date | null];
  warehouseId: number | null;
  categoryId: number | null;
}

/**
 * @description واجهة لبيانات تقرير المخزون (مثال).
 */
interface InventoryReportData {
  itemId: number;
  itemName: string;
  category: string;
  warehouse: string;
  currentStock: number;
  stockValue: number;
  lastMovement: Date;
}

// -------------------------------------------------------------------
// 2. خدمة وهمية (Mock Service)
// -------------------------------------------------------------------

/**
 * @description خدمة وهمية لمحاكاة InventoryService.
 * في التطبيق الحقيقي، سيتم استبدال هذه الخدمة بالخدمة الفعلية التي تتواصل مع الـ Backend.
 */
class MockInventoryService {
  /**
   * @description محاكاة جلب بيانات التقرير بناءً على المعرف والفلاتر.
   * @param reportId معرف التقرير المطلوب.
   * @param filters خيارات الفلترة.
   * @returns Observable ببيانات التقرير.
   */
  getReportData(reportId: string, filters: ReportFilters): Observable<any> {
    console.log(`Fetching data for report: ${reportId} with filters:`, filters);

    // محاكاة خطأ في حالة تقرير معين
    if (reportId === 'stagnant-items') {
      return throwError(() => new Error('فشل في جلب بيانات الأصناف الراكدة. يرجى المحاولة لاحقاً.'));
    }

    // محاكاة بيانات وهمية لتقرير المخزون
    const mockData: InventoryReportData[] = [
      { itemId: 1, itemName: 'كمبيوتر محمول X1', category: 'إلكترونيات', warehouse: 'المستودع الرئيسي', currentStock: 150, stockValue: 750000, lastMovement: new Date('2025-11-20') },
      { itemId: 2, itemName: 'شاشة 27 بوصة', category: 'إلكترونيات', warehouse: 'مستودع فرعي 1', currentStock: 220, stockValue: 440000, lastMovement: new Date('2025-12-01') },
      { itemId: 3, itemName: 'طابعة ليزر', category: 'مكاتب', warehouse: 'المستودع الرئيسي', currentStock: 55, stockValue: 55000, lastMovement: new Date('2025-10-15') },
      { itemId: 4, itemName: 'ماوس لاسلكي', category: 'إكسسوارات', warehouse: 'مستودع فرعي 1', currentStock: 800, stockValue: 40000, lastMovement: new Date('2025-12-05') },
    ];

    // محاكاة تأخير الشبكة
    return of(mockData).pipe(delay(1000));
  }
}

// -------------------------------------------------------------------
// 3. المكونات الخارجية الوهمية (Mock Standalone Components)
// -------------------------------------------------------------------

// يجب استيراد هذه المكونات من مكتبة المكونات الخاصة بالنظام
// هنا نستخدم مكونات وهمية لغرض العرض فقط

@Component({
  selector: 'app-inventory-filter-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div [formGroup]="form" class="filter-panel-mock">
      <h4 class="text-primary">لوحة الفلترة المتقدمة</h4>
      <div class="form-group">
        <label>الفترة الزمنية:</label>
        <input type="date" formControlName="startDate" class="form-control" />
        <input type="date" formControlName="endDate" class="form-control" />
      </div>
      <div class="form-group">
        <label>المستودع:</label>
        <select formControlName="warehouseId" class="form-control">
          <option [ngValue]="null">كل المستودعات</option>
          <option [ngValue]="1">المستودع الرئيسي</option>
          <option [ngValue]="2">مستودع فرعي 1</option>
        </select>
      </div>
      <div class="form-group">
        <label>الفئة:</label>
        <select formControlName="categoryId" class="form-control">
          <option [ngValue]="null">كل الفئات</option>
          <option [ngValue]="1">إلكترونيات</option>
          <option [ngValue]="2">مكاتب</option>
        </select>
      </div>
      <button class="btn btn-primary" (click)="applyFilters()">تطبيق</button>
    </div>
  `,
  styles: [`
    .filter-panel-mock {
      padding: 15px;
      border: 1px solid #eee;
      border-radius: 8px;
      margin-bottom: 20px;
      background-color: #f9f9f9;
    }
    .form-group { margin-bottom: 10px; }
    .form-control { width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px; }
    .btn-primary { background-color: #007bff; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px; }
  `]
})
class MockFilterPanelComponent implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;

  ngOnInit() {
    this.form = this.fb.group({
      startDate: [null],
      endDate: [null],
      warehouseId: [null],
      categoryId: [null],
    });
  }

  applyFilters() {
    // محاكاة إرسال الفلاتر
    console.log('Filters applied:', this.form.value);
  }
}

@Component({
  selector: 'app-inventory-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="data-table-mock">
      <h5 class="text-secondary">عرض بيانات التقرير (جدول)</h5>
      <table class="table table-striped">
        <thead>
          <tr>
            <th *ngFor="let col of columns">{{ col }}</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of data">
            <td *ngFor="let colKey of columnKeys">{{ row[colKey] }}</td>
          </tr>
          <tr *ngIf="data.length === 0">
            <td [attr.colspan]="columns.length" class="text-center">لا توجد بيانات لعرضها.</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .data-table-mock { overflow-x: auto; }
    .table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: right; }
    .table th { background-color: #f2f2f2; }
  `],
  inputs: ['data', 'columns', 'columnKeys']
})
export class MockDataTableComponent {
  data: any[] = [];
  columns: string[] = [];
  columnKeys: string[] = [];
}

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="charts-mock">
      <h5 class="text-secondary">عرض بيانات التقرير (مخطط بياني)</h5>
      <div class="chart-placeholder">
        <p class="text-center">مخطط بياني وهمي لـ {{ reportName }}</p>
      </div>
    </div>
  `,
  styles: [`
    .chart-placeholder {
      height: 300px;
      background-color: #e9ecef;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 10px;
    }
  `],
  inputs: ['reportName']
})
export class MockChartsComponent {
  reportName: string = '';
}

// -------------------------------------------------------------------
// 4. المكون الرئيسي (ReportsPageComponent)
// -------------------------------------------------------------------

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // المكونات الوهمية المستوردة
    MockFilterPanelComponent,
    MockDataTableComponent,
    MockChartsComponent,
  ],
  templateUrl: './reports-page.component.html',
  styleUrls: ['./reports-page.component.scss'],
  providers: [
    // توفير الخدمة الوهمية
    { provide: MockInventoryService, useClass: MockInventoryService }
  ]
})
export class ReportsPageComponent implements OnInit {
  // حقن الخدمات
  private inventoryService = inject(MockInventoryService);
  private fb = inject(FormBuilder);

  // -------------------------------------------------------------------
  // إدارة الحالة باستخدام RxJS
  // -------------------------------------------------------------------

  /**
   * @description قائمة التقارير المتاحة.
   */
  readonly availableReports: Report[] = [
    { id: 'inventory-stock', nameAr: 'تقرير المخزون الحالي', descriptionAr: 'عرض تفصيلي للمخزون المتوفر في المستودعات.', icon: 'warehouse', componentType: 'table' },
    { id: 'item-movement', nameAr: 'حركة الأصناف', descriptionAr: 'تتبع حركات الإدخال والإخراج للأصناف خلال فترة.', icon: 'swap-horiz', componentType: 'table' },
    { id: 'low-stock', nameAr: 'الأصناف الناقصة', descriptionAr: 'قائمة بالأصناف التي وصلت إلى حد إعادة الطلب.', icon: 'warning', componentType: 'table' },
    { id: 'stagnant-items', nameAr: 'الأصناف الراكدة', descriptionAr: 'الأصناف التي لم تشهد حركة لفترة طويلة.', icon: 'hourglass_empty', componentType: 'table' },
    { id: 'inventory-valuation', nameAr: 'تقييم المخزون', descriptionAr: 'تقييم مالي للمخزون الحالي.', icon: 'monetization_on', componentType: 'chart' },
  ];

  /**
   * @description السلوك الذي يحمل التقرير المحدد حالياً.
   */
  private selectedReportSubject = new BehaviorSubject<Report>(this.availableReports[0]);
  selectedReport$ = this.selectedReportSubject.asObservable();

  /**
   * @description السلوك الذي يحمل خيارات الفلترة الحالية.
   */
  private filterSubject = new BehaviorSubject<ReportFilters>({
    dateRange: [null, null],
    warehouseId: null,
    categoryId: null,
  });
  filters$ = this.filterSubject.asObservable();

  /**
   * @description حالة التحميل (Loading State).
   */
  isLoading$ = new BehaviorSubject<boolean>(false);

  /**
   * @description رسالة الخطأ في حالة فشل جلب البيانات.
   */
  error$ = new BehaviorSubject<string | null>(null);

  /**
   * @description Observable لبيانات التقرير الناتجة.
   */
  reportData$: Observable<any> | undefined;

  /**
   * @description نموذج الفلترة المتقدمة.
   */
  filterForm!: FormGroup;

  // -------------------------------------------------------------------
  // دورة حياة المكون (Lifecycle Hooks)
  // -------------------------------------------------------------------

  ngOnInit(): void {
    // تهيئة نموذج الفلترة
    this.filterForm = this.fb.group({
      startDate: [null],
      endDate: [null],
      warehouseId: [null],
      categoryId: [null],
    });

    // دمج Observable التقرير المحدد والفلاتر
    this.reportData$ = combineLatest([
      this.selectedReport$,
      this.filters$.pipe(startWith(this.filterSubject.value)) // تأكد من بدء الفلاتر بقيمة أولية
    ]).pipe(
      tap(() => {
        this.isLoading$.next(true); // بدء التحميل
        this.error$.next(null); // مسح الأخطاء السابقة
      }),
      switchMap(([report, filters]) => {
        // استدعاء الخدمة لجلب البيانات
        return this.inventoryService.getReportData(report.id, filters).pipe(
          catchError(err => {
            // معالجة الأخطاء وعرض إشعار (Toast)
            const errorMessage = `خطأ في جلب بيانات التقرير: ${err.message}`;
            console.error(errorMessage, err);
            // هنا يتم استدعاء خدمة الـ Toast
            // this.toastService.showError(errorMessage);
            this.error$.next(errorMessage);
            return of([]); // إرجاع مصفوفة فارغة لعدم كسر الـ Observable
          })
        );
      }),
      tap(() => this.isLoading$.next(false)) // إنهاء التحميل
    );
  }

  // -------------------------------------------------------------------
  // وظائف إدارة التقرير
  // -------------------------------------------------------------------

  /**
   * @description تحديد التقرير المراد عرضه.
   * @param report التقرير المحدد.
   */
  selectReport(report: Report): void {
    this.selectedReportSubject.next(report);
    // إعادة تطبيق الفلاتر الحالية على التقرير الجديد
    this.applyFilters();
  }

  /**
   * @description تطبيق خيارات الفلترة من النموذج.
   */
  applyFilters(): void {
    const formValue = this.filterForm.value;
    const filters: ReportFilters = {
      dateRange: [formValue.startDate, formValue.endDate],
      warehouseId: formValue.warehouseId,
      categoryId: formValue.categoryId,
    };
    this.filterSubject.next(filters);
  }

  /**
   * @description وظيفة وهمية لتصدير التقرير إلى PDF.
   */
  exportToPdf(): void {
    console.log('تصدير التقرير إلى PDF...');
    // منطق التصدير الفعلي
  }

  /**
   * @description وظيفة وهمية لتصدير التقرير إلى Excel.
   */
  exportToExcel(): void {
    console.log('تصدير التقرير إلى Excel...');
    // منطق التصدير الفعلي
  }

  /**
   * @description وظيفة وهمية لطباعة التقرير.
   */
  printReport(): void {
    console.log('طباعة التقرير...');
    // منطق الطباعة الفعلي
  }

  /**
   * @description وظيفة وهمية لجدولة التقرير.
   */
  scheduleReport(): void {
    console.log('جدولة التقرير...');
    // منطق الجدولة الفعلي (فتح نافذة منبثقة للخيارات)
  }

  // -------------------------------------------------------------------
  // وظائف مساعدة لعرض البيانات
  // -------------------------------------------------------------------

  /**
   * @description جلب مفاتيح الأعمدة لـ DataTableComponent.
   * @returns مصفوفة بأسماء الأعمدة.
   */
  getReportColumns(reportId: string): string[] {
    switch (reportId) {
      case 'inventory-stock':
      case 'low-stock':
      case 'item-movement':
        return ['الصنف', 'الفئة', 'المستودع', 'الكمية الحالية', 'قيمة المخزون', 'آخر حركة'];
      default:
        return [];
    }
  }

  /**
   * @description جلب مفاتيح البيانات لـ DataTableComponent.
   * @returns مصفوفة بمفاتيح البيانات.
   */
  getReportColumnKeys(reportId: string): string[] {
    switch (reportId) {
      case 'inventory-stock':
      case 'low-stock':
      case 'item-movement':
        return ['itemName', 'category', 'warehouse', 'currentStock', 'stockValue', 'lastMovement'];
      default:
        return [];
    }
  }
}
