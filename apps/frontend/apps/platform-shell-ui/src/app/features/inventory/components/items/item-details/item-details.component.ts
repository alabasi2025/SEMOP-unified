// /home/ubuntu/item-details.component.ts
// مكون ItemDetailsComponent - تفاصيل الصنف
// Angular 15+ Standalone Component مع استخدام RxJS و Reactive Programming

import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, combineLatest, map, Observable, filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// استيراد النماذج المطلوبة من ملف النماذج الوهمي
import { Item, WarehouseItem, StockMovement, ItemStatistics } from '../../models';

// استيراد المكونات المشتركة (افتراضياً موجودة في مسار معين)
// نفترض أنها مكونات مستقلة (Standalone)
import { DataTableComponent, StatsCardComponent, SearchBarComponent } from '../../../shared';

@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [CommonModule, DataTableComponent, StatsCardComponent, SearchBarComponent],
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss'],
})
export class ItemDetailsComponent implements OnInit, OnChanges {
  // حقن DestroyRef لإدارة الاشتراكات في RxJS
  private destroyRef = inject(DestroyRef);

  // ------------------------------------------------------------------
  // المدخلات (Inputs)
  // ------------------------------------------------------------------

  // بيانات الصنف الأساسية
  @Input({ required: true }) item!: Item;
  // أرصدة الصنف في المستودعات
  @Input() stockBalance: WarehouseItem[] = [];
  // حركات الصنف الأخيرة (10 حركات)
  @Input() recentMovements: StockMovement[] = [];
  // حالة التحميل
  @Input() loading: boolean = false;

  // ------------------------------------------------------------------
  // المخرجات (Outputs)
  // ------------------------------------------------------------------

  // حدث طلب تعديل الصنف
  @Output() editItem = new EventEmitter<Item>();
  // حدث طلب حذف الصنف
  @Output() deleteItem = new EventEmitter<Item>();
  // حدث طلب عرض جميع الحركات
  @Output() viewMovements = new EventEmitter<number>(); // يرسل معرف الصنف

  // ------------------------------------------------------------------
  // منطق RxJS والحالة المشتقة (Derived State)
  // ------------------------------------------------------------------

  // Subject لتتبع التغييرات في أرصدة وحركات الصنف بشكل تفاعلي
  private balanceSubject = new Subject<WarehouseItem[]>();
  private movementsSubject = new Subject<StockMovement[]>();

  // Observable لإحصائيات الصنف المشتقة
  itemStatistics$!: Observable<ItemStatistics>;

  // رؤوس أعمدة جدول أرصدة المستودعات
  warehouseColumns = [
    { key: 'warehouseName', header: 'المستودع' },
    { key: 'balance', header: 'الرصيد', type: 'number' },
    { key: 'value', header: 'القيمة', type: 'currency' },
  ];

  // رؤوس أعمدة جدول الحركات الأخيرة
  movementColumns = [
    { key: 'movementDate', header: 'التاريخ', type: 'date' },
    { key: 'movementType', header: 'النوع' },
    { key: 'quantity', header: 'الكمية', type: 'number' },
    { key: 'source', header: 'المصدر' },
  ];

  /**
   * @description تهيئة المكون وتحديد منطق RxJS
   */
  ngOnInit(): void {
    // دمج Observable الأرصدة والحركات لحساب الإحصائيات بشكل تفاعلي
    this.itemStatistics$ = combineLatest([
      this.balanceSubject.asObservable(),
      this.movementsSubject.asObservable(),
    ]).pipe(
      // فلترة للتأكد من وجود بيانات قبل الحساب
      filter(([balance, movements]) => !!balance && !!movements),
      // حساب الإحصائيات
      map(([balance, movements]) => this.calculateStatistics(balance, movements)),
      // إدارة الاشتراك تلقائياً
      takeUntilDestroyed(this.destroyRef)
    );
  }

  /**
   * @description معالجة التغييرات في المدخلات وإرسالها إلى Subjects
   * @param changes - التغييرات البسيطة في المدخلات
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['stockBalance'] && this.stockBalance) {
      this.balanceSubject.next(this.stockBalance);
    }
    if (changes['recentMovements'] && this.recentMovements) {
      this.movementsSubject.next(this.recentMovements);
    }
  }

  /**
   * @description حساب إحصائيات الصنف (إجمالي الرصيد، القيمة، عدد الحركات)
   * @param balance - أرصدة المستودعات
   * @param movements - حركات الصنف
   * @returns إحصائيات الصنف
   */
  private calculateStatistics(balance: WarehouseItem[], movements: StockMovement[]): ItemStatistics {
    const totalBalance = balance.reduce((sum, item) => sum + item.balance, 0);
    const totalValue = balance.reduce((sum, item) => sum + item.value, 0);
    const movementCount = movements.length;

    return {
      totalBalance,
      totalValue,
      movementCount,
    };
  }

  // ------------------------------------------------------------------
  // معالجات الأحداث (Event Handlers)
  // ------------------------------------------------------------------

  /**
   * @description إطلاق حدث طلب تعديل الصنف
   */
  onEdit(): void {
    this.editItem.emit(this.item);
  }

  /**
   * @description إطلاق حدث طلب حذف الصنف
   */
  onDelete(): void {
    this.deleteItem.emit(this.item);
  }

  /**
   * @description إطلاق حدث طلب عرض جميع الحركات
   */
  onViewAllMovements(): void {
    this.viewMovements.emit(this.item.id);
  }
}
