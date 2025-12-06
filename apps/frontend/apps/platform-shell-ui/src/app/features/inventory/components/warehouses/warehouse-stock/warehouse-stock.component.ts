import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, map, Observable, startWith } from 'rxjs';
import { WarehouseItem, DataTableColumn, StatsCardData } from '../../models'; // تم افتراض المسار

// *************************************************************************************************
// ملاحظة: في مشروع حقيقي، سيتم استيراد المكونات المشتركة (DataTableComponent, StatsCardComponent)
// من مسارها الفعلي. هنا سنفترض وجودها ونضيفها إلى مصفوفة imports.
// *************************************************************************************************

// مكونات وهمية للاستيراد (يجب استبدالها بالمكونات الحقيقية)
const SHARED_COMPONENTS: any[] = [
  // DataTableComponent,
  // StatsCardComponent,
];

/**
 * @description مكون عرض رصيد المستودع.
 * يعرض جدولاً بأصناف المخزون، وحالة التحميل، وإحصائيات إجمالية.
 */
@Component({
  selector: 'app-warehouse-stock',
  standalone: true,
  imports: [CommonModule, FormsModule, ...SHARED_COMPONENTS],
  templateUrl: './warehouse-stock.component.html',
  styleUrls: ['./warehouse-stock.component.scss'],
})
export class WarehouseStockComponent implements OnInit, OnChanges {

  // *************************************************************************************************
  // المدخلات (Inputs)
  // *************************************************************************************************

  /**
   * @description مُعرّف المستودع الحالي.
   */
  @Input() warehouseId: string | undefined;

  /**
   * @description قائمة أصناف المخزون لعرضها في الجدول.
   */
  @Input() stockItems: WarehouseItem[] = [];

  /**
   * @description حالة التحميل (Loading state) لعرض مؤشر التحميل.
   */
  @Input() loading: boolean = false;

  // *************************************************************************************************
  // المخرجات (Outputs)
  // *************************************************************************************************

  /**
   * @description حدث عند النقر على صنف في الجدول.
   */
  @Output() itemClick = new EventEmitter<WarehouseItem>();

  /**
   * @description حدث عند طلب تصدير البيانات إلى Excel.
   */
  @Output() exportExcel = new EventEmitter<void>();

  /**
   * @description حدث عند طلب تحديث البيانات.
   */
  @Output() refresh = new EventEmitter<void>();

  // *************************************************************************************************
  // حالة المكون الداخلية (Internal State)
  // *************************************************************************************************

  /**
   * @description موضوع سلوكي (BehaviorSubject) لتخزين قائمة الأصناف المدخلة.
   * يستخدم لتمكين البرمجة التفاعلية (Reactive Programming).
   */
  private itemsSubject = new BehaviorSubject<WarehouseItem[]>([]);

  /**
   * @description موضوع سلوكي لتخزين نص البحث/التصفية.
   */
  public filterTextSubject = new BehaviorSubject<string>('');

  /**
   * @description قائمة الأصناف المفلترة والمعروضة في الجدول (Observable).
   */
  public filteredItems$!: Observable<WarehouseItem[]>;

  /**
   * @description إحصائيات المخزون لعرضها في بطاقات (StatsCardComponent).
   */
  public statsData$!: Observable<StatsCardData[]>;

  /**
   * @description تعريف أعمدة جدول البيانات (DataTableComponent).
   */
  public columns: DataTableColumn[] = [
    { field: 'name', header: 'الصنف', sortable: true, filterable: true },
    { field: 'sku', header: 'رمز الصنف', sortable: true, filterable: true },
    { field: 'currentStock', header: 'الكمية', sortable: true, type: 'number' },
    { field: 'unitPrice', header: 'سعر الوحدة', sortable: true, type: 'number' },
    { field: 'totalValue', header: 'القيمة الإجمالية', sortable: true, type: 'number' },
    { field: 'status', header: 'الحالة', sortable: true, type: 'status' },
  ];

  /**
   * @description نص البحث الذي يدخله المستخدم (يرتبط بـ ngModel).
   */
  public searchTerm: string = '';

  // *************************************************************************************************
  // دورة حياة المكون (Lifecycle Hooks)
  // *************************************************************************************************

  ngOnInit(): void {
    this.setupReactiveDataFlow();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // تحديث قائمة الأصناف في الـ Subject عند تغيير المدخل stockItems
    if (changes['stockItems'] && this.stockItems) {
      // حساب القيمة الإجمالية وحالة المخزون لكل صنف قبل إرسالها إلى الـ Subject
      const processedItems = this.stockItems.map(item => ({
        ...item,
        totalValue: item.currentStock * item.unitPrice,
        status: this.getStockStatus(item),
      }));
      this.itemsSubject.next(processedItems);
    }
  }

  // *************************************************************************************************
  // منطق البرمجة التفاعلية (Reactive Logic)
  // *************************************************************************************************

  /**
   * @description إعداد تدفق البيانات التفاعلي (Reactive Data Flow) باستخدام RxJS.
   * يجمع بين قائمة الأصناف ونص البحث لتوليد قائمة مفلترة وإحصائيات.
   */
  private setupReactiveDataFlow(): void {
    // تدفق الأصناف المفلترة
    this.filteredItems$ = combineLatest([
      this.itemsSubject.asObservable(),
      this.filterTextSubject.asObservable().pipe(startWith('')),
    ]).pipe(
      map(([items, filterText]) => this.applyFilter(items, filterText)),
    );

    // تدفق بيانات الإحصائيات
    this.statsData$ = this.filteredItems$.pipe(
      map(items => this.calculateStats(items)),
    );
  }

  /**
   * @description تطبيق التصفية على قائمة الأصناف بناءً على نص البحث.
   * @param items قائمة أصناف المخزون.
   * @param filterText نص البحث.
   * @returns قائمة الأصناف المفلترة.
   */
  private applyFilter(items: WarehouseItem[], filterText: string): WarehouseItem[] {
    if (!filterText) {
      return items;
    }
    const lowerCaseFilter = filterText.toLowerCase();
    return items.filter(item =>
      item.name.toLowerCase().includes(lowerCaseFilter) ||
      item.sku.toLowerCase().includes(lowerCaseFilter) ||
      item.itemId.toLowerCase().includes(lowerCaseFilter)
    );
  }

  /**
   * @description حساب الإحصائيات الإجمالية من قائمة الأصناف.
   * @param items قائمة أصناف المخزون.
   * @returns مصفوفة من بيانات بطاقات الإحصائيات.
   */
  private calculateStats(items: WarehouseItem[]): StatsCardData[] {
    const totalValue = items.reduce((sum, item) => sum + item.totalValue, 0);
    const totalQuantity = items.reduce((sum, item) => sum + item.currentStock, 0);
    const lowStockCount = items.filter(item => item.status === 'low').length;

    return [
      {
        title: 'القيمة الإجمالية للمخزون',
        value: totalValue,
        unit: 'ريال',
        icon: 'money',
        color: 'var(--primary-color)',
      },
      {
        title: 'إجمالي الكمية',
        value: totalQuantity,
        unit: 'وحدة',
        icon: 'inventory',
        color: 'var(--info-color)',
      },
      {
        title: 'أصناف ذات مخزون منخفض',
        value: lowStockCount,
        unit: 'صنف',
        icon: 'warning',
        color: 'var(--danger-color)',
      },
    ];
  }

  /**
   * @description تحديد حالة المخزون (ناقص/عادي/زائد) بناءً على المستويات المحددة.
   * @param item صنف المخزون.
   * @returns حالة المخزون.
   */
  public getStockStatus(item: WarehouseItem): 'low' | 'normal' | 'excess' {
    if (item.currentStock <= item.minStockLevel) {
      return 'low'; // ناقص
    }
    if (item.currentStock >= item.maxStockLevel) {
      return 'excess'; // زائد
    }
    return 'normal'; // عادي
  }

  /**
   * @description الحصول على اسم فئة CSS بناءً على حالة المخزون.
   * @param status حالة المخزون.
   * @returns اسم فئة CSS.
   */
  public getStatusClass(status: 'low' | 'normal' | 'excess'): string {
    switch (status) {
      case 'low':
        return 'status-low';
      case 'excess':
        return 'status-excess';
      case 'normal':
      default:
        return 'status-normal';
    }
  }

  // *************************************************************************************************
  // معالجات الأحداث (Event Handlers)
  // *************************************************************************************************

  /**
   * @description معالجة حدث تغيير نص البحث.
   * @param event قيمة نص البحث الجديدة.
   */
  public onSearchChange(event: string): void {
    this.filterTextSubject.next(event);
  }

  /**
   * @description معالجة حدث النقر على صنف في الجدول.
   * @param item صنف المخزون الذي تم النقر عليه.
   */
  public onItemClick(item: WarehouseItem): void {
    this.itemClick.emit(item);
  }

  /**
   * @description معالجة حدث طلب تصدير Excel.
   */
  public onExportExcel(): void {
    this.exportExcel.emit();
  }

  /**
   * @description معالجة حدث طلب تحديث البيانات.
   */
  public onRefresh(): void {
    this.refresh.emit();
  }
}
