import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, Observable, combineLatest, startWith, map, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

// =================================================================================================
// نماذج البيانات (يفترض أنها مستوردة من 'inventory.models.ts' في مشروع حقيقي)
// تم تعريفها هنا لغرض اكتمال الكود.
// =================================================================================================

/**
 * @interface WarehouseItem
 * @description يمثل صنفًا واحدًا داخل المستودع.
 */
export interface WarehouseItem {
  id: number;
  name: string;
  quantity: number;
  value: number; // القيمة المالية للصنف
}

/**
 * @interface StockMovement
 * @description يمثل حركة مخزون (إدخال/إخراج).
 */
export interface StockMovement {
  id: number;
  type: 'in' | 'out';
  date: Date;
  itemId: number;
  quantity: number;
}

/**
 * @interface Warehouse
 * @description يمثل كيان المستودع.
 */
export interface Warehouse {
  id: number;
  name: string;
  location: string;
  capacity: number; // السعة الكلية للمستودع (لنسبة الإشغال)
  occupiedSpace: number; // المساحة المشغولة حاليًا
  totalValue: number; // القيمة الإجمالية للمخزون
  itemCount: number; // عدد الأصناف المختلفة
  items: WarehouseItem[];
  // خاصية محسوبة لسهولة العرض
  occupancyRate: number; // نسبة الإشغال (occupiedSpace / capacity)
}

// =================================================================================================
// تعريف المكون
// =================================================================================================

/**
 * @interface StatsCardData
 * @description نموذج بيانات لبطاقة الإحصائيات.
 */
interface StatsCardData {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-warehouse-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // يجب إضافة المكونات المشتركة هنا (DataTableComponent, StatsCardComponent)
  templateUrl: './warehouse-list.component.html',
  styleUrls: ['./warehouse-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WarehouseListComponent implements OnInit, OnDestroy, OnChanges {
  // =================================================================================================
  // المدخلات (Inputs)
  // =================================================================================================

  /**
   * @input warehouses
   * @description قائمة المستودعات المراد عرضها.
   */
  @Input() warehouses: Warehouse[] | null = [];

  /**
   * @input loading
   * @description حالة التحميل، تستخدم لعرض مؤشر التحميل.
   */
  @Input() loading: boolean = false;

  /**
   * @input viewMode
   * @description وضع العرض الافتراضي (جدول 'table' أو شبكة 'grid').
   */
  @Input() set viewMode(mode: 'table' | 'grid') {
    if (mode && this.viewModeControl) {
      this.viewModeControl.setValue(mode, { emitEvent: false });
    }
  }

  // =================================================================================================
  // المخرجات (Outputs)
  // =================================================================================================

  /**
   * @output warehouseClick
   * @description ينبعث عند النقر على مستودع معين.
   */
  @Output() warehouseClick = new EventEmitter<Warehouse>();

  /**
   * @output addWarehouse
   * @description ينبعث عند النقر على زر إضافة مستودع جديد.
   */
  @Output() addWarehouse = new EventEmitter<void>();

  /**
   * @output editWarehouse
   * @description ينبعث عند النقر على زر تعديل مستودع.
   */
  @Output() editWarehouse = new EventEmitter<Warehouse>();

  /**
   * @output deleteWarehouse
   * @description ينبعث عند النقر على زر حذف مستودع.
   */
  @Output() deleteWarehouse = new EventEmitter<Warehouse>();

  /**
   * @output viewModeChange
   * @description ينبعث عند تغيير وضع العرض (جدول/شبكة).
   */
  @Output() viewModeChange = new EventEmitter<'table' | 'grid'>();

  // =================================================================================================
  // الخصائص الداخلية ومنطق RxJS
  // =================================================================================================

  /**
   * @property searchControl
   * @description عنصر تحكم النموذج للبحث والتصفية.
   */
  searchControl = new FormControl<string>('');

  /**
   * @property warehouses$
   * @description مصدر البيانات الرئيسي للمستودعات كـ Observable.
   */
  private warehouses$ = new Subject<Warehouse[] | null>();

  /**
   * @property filteredWarehouses$
   * @description قائمة المستودعات المفلترة والجاهزة للعرض.
   */
  filteredWarehouses$: Observable<Warehouse[]>;

  /**
   * @property statsData$
   * @description بيانات الإحصائيات المجمعة للعرض في بطاقات الإحصائيات.
   */
  statsData$: Observable<StatsCardData[]>;

  /**
   * @property viewModeControl
   * @description عنصر تحكم داخلي لوضع العرض.
   */
  viewModeControl = new FormControl<'table' | 'grid'>('table');

  /**
   * @property destroy$
   * @description Subject يستخدم لإلغاء الاشتراك عند تدمير المكون.
   */
  private destroy$ = new Subject<void>();

  // =================================================================================================
  // دورة حياة المكون (Lifecycle Hooks)
  // =================================================================================================

  ngOnInit(): void {
    // تحديث مصدر البيانات عند تغيير المدخلات
    this.warehouses$.next(this.warehouses);

    // معالجة تغيير وضع العرض
    this.viewModeControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((mode) => {
        if (mode) {
          this.viewModeChange.emit(mode);
        }
      });

    // دمج قائمة المستودعات مع قيمة البحث لإنشاء قائمة مفلترة
    this.filteredWarehouses$ = combineLatest([
      this.warehouses$.pipe(startWith(this.warehouses)), // ابدأ بالقيمة الأولية
      this.searchControl.valueChanges.pipe(
        startWith(''), // ابدأ بسلسلة فارغة
        debounceTime(300), // تأخير البحث لتحسين الأداء
        distinctUntilChanged(), // لا تبحث إذا لم تتغير القيمة
        map(term => term ? term.toLowerCase() : '')
      )
    ]).pipe(
      map(([warehouses, term]) => {
        if (!warehouses) return [];
        if (!term) return warehouses;

        // منطق التصفية: البحث في اسم المستودع والموقع
        return warehouses.filter(warehouse =>
          warehouse.name.toLowerCase().includes(term) ||
          warehouse.location.toLowerCase().includes(term)
        );
      })
    );

    // حساب الإحصائيات المجمعة
    this.statsData$ = this.warehouses$.pipe(
      map(warehouses => this.calculateStats(warehouses))
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // =================================================================================================
  // الدوال المساعدة (Helper Functions)
  // =================================================================================================

  /**
   * @function calculateStats
   * @description تحسب الإحصائيات المجمعة من قائمة المستودعات.
   * @param warehouses قائمة المستودعات.
   * @returns مصفوفة من بيانات بطاقة الإحصائيات.
   */
  private calculateStats(warehouses: Warehouse[] | null): StatsCardData[] {
    if (!warehouses || warehouses.length === 0) {
      return [
        { title: 'إجمالي المستودعات', value: 0, icon: 'storage', color: 'primary' },
        { title: 'إجمالي الأصناف', value: 0, icon: 'inventory', color: 'info' },
        { title: 'القيمة الإجمالية', value: '0 ر.س', icon: 'attach_money', color: 'success' },
        { title: 'متوسط الإشغال', value: '0%', icon: 'assessment', color: 'warning' },
      ];
    }

    const totalWarehouses = warehouses.length;
    const totalItems = warehouses.reduce((sum, w) => sum + w.itemCount, 0);
    const totalValue = warehouses.reduce((sum, w) => sum + w.totalValue, 0);
    const totalCapacity = warehouses.reduce((sum, w) => sum + w.capacity, 0);
    const totalOccupied = warehouses.reduce((sum, w) => sum + w.occupiedSpace, 0);
    const avgOccupancy = totalCapacity > 0 ? (totalOccupied / totalCapacity) * 100 : 0;

    return [
      { title: 'إجمالي المستودعات', value: totalWarehouses, icon: 'storage', color: 'primary' },
      { title: 'إجمالي الأصناف', value: totalItems, icon: 'inventory', color: 'info' },
      { title: 'القيمة الإجمالية', value: `${totalValue.toLocaleString('ar-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 })}`, icon: 'attach_money', color: 'success' },
      { title: 'متوسط الإشغال', value: `${avgOccupancy.toFixed(1)}%`, icon: 'assessment', color: 'warning' },
    ];
  }

  /**
   * @function onWarehouseClick
   * @description ينبعث بحدث النقر على المستودع.
   * @param warehouse المستودع الذي تم النقر عليه.
   */
  onWarehouseClick(warehouse: Warehouse): void {
    this.warehouseClick.emit(warehouse);
  }

  /**
   * @function onAdd
   * @description ينبعث بحدث إضافة مستودع.
   */
  onAdd(): void {
    this.addWarehouse.emit();
  }

  /**
   * @function onEdit
   * @description ينبعث بحدث تعديل مستودع.
   * @param warehouse المستودع المراد تعديله.
   */
  onEdit(warehouse: Warehouse): void {
    this.editWarehouse.emit(warehouse);
  }

  /**
   * @function onDelete
   * @description ينبعث بحدث حذف مستودع.
   * @param warehouse المستودع المراد حذفه.
   */
  onDelete(warehouse: Warehouse): void {
    this.deleteWarehouse.emit(warehouse);
  }

  // =================================================================================================
  // معالجة المدخلات المتغيرة
  // =================================================================================================

  /**
   * @function ngOnChanges
   * @description يستجيب لتغييرات المدخلات.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['warehouses']) {
      // نستخدم next() لتحديث الـ Observable حتى لو كانت القيمة الأولية
      this.warehouses$.next(changes['warehouses'].currentValue);
    }
  }
}
