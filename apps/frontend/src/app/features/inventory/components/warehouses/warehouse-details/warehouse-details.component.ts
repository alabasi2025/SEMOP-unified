import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Warehouse, WarehouseItem, StockMovement } from './inventory.models'; // افتراض أن الملف في نفس المجلد أو تم تعديل المسار
import { StatsCardComponent } from '../stats-card/stats-card.component'; // مكون مشترك مفترض
import { DataTableComponent } from '../data-table/data-table.component'; // مكون مشترك مفترض
import { ChartModule } from 'primeng/chart'; // افتراض استخدام مكتبة رسوم بيانية مثل PrimeNG أو Chart.js

/**
 * واجهة لتمثيل الإحصائيات المشتقة.
 */
interface WarehouseStats {
  itemCount: number;
  totalValue: number;
  occupancyPercentage: number;
}

/**
 * مكون تفاصيل المستودع.
 * يعرض البيانات الأساسية للمستودع، الإحصائيات، قائمة الأصناف، وحركات المخزون الأخيرة.
 */
@Component({
  selector: 'app-warehouse-details',
  standalone: true,
  imports: [CommonModule, StatsCardComponent, DataTableComponent, ChartModule],
  templateUrl: './warehouse-details.component.html',
  styleUrls: ['./warehouse-details.component.scss'],
})
export class WarehouseDetailsComponent implements OnChanges {
  // #region المدخلات (Inputs)

  /**
   * بيانات المستودع الأساسية.
   */
  @Input({ required: true }) warehouse!: Warehouse;

  /**
   * قائمة الأصناف الموجودة في المستودع.
   */
  @Input() stockItems: WarehouseItem[] = [];

  /**
   * قائمة بحركات المخزون الأخيرة.
   */
  @Input() recentMovements: StockMovement[] = [];

  /**
   * حالة التحميل (لعرض مؤشر التحميل).
   */
  @Input() loading: boolean = false;

  // #endregion

  // #region المخرجات (Outputs)

  /**
   * حدث يطلق عند طلب تعديل بيانات المستودع.
   */
  @Output() editWarehouse = new EventEmitter<Warehouse>();

  /**
   * حدث يطلق عند طلب حذف المستودع.
   */
  @Output() deleteWarehouse = new EventEmitter<Warehouse>();

  /**
   * حدث يطلق عند طلب عرض تفاصيل المخزون بالكامل.
   */
  @Output() viewStock = new EventEmitter<Warehouse>();

  /**
   * حدث يطلق عند طلب عرض جميع حركات المخزون.
   */
  @Output() viewMovements = new EventEmitter<Warehouse>();

  // #endregion

  // #region الخصائص المشتقة (Derived Properties)

  /**
   * إحصائيات المستودع المحسوبة.
   */
  stats: WarehouseStats = {
    itemCount: 0,
    totalValue: 0,
    occupancyPercentage: 0,
  };

  /**
   * بيانات الرسم البياني الدائري لنسبة الإشغال.
   */
  occupancyChartData: any;

  /**
   * خيارات الرسم البياني الدائري.
   */
  occupancyChartOptions: any;

  /**
   * تعريف أعمدة جدول الأصناف.
   */
  stockTableColumns = [
    { field: 'sku', header: 'رمز المنتج' },
    { field: 'name', header: 'اسم الصنف' },
    { field: 'quantity', header: 'الكمية' },
    { field: 'unitPrice', header: 'سعر الوحدة' },
    { field: 'totalValue', header: 'القيمة الإجمالية' },
  ];

  /**
   * تعريف أعمدة جدول الحركات.
   */
  movementsTableColumns = [
    { field: 'movementDate', header: 'التاريخ' },
    { field: 'itemName', header: 'الصنف' },
    { field: 'type', header: 'النوع' },
    { field: 'quantity', header: 'الكمية' },
    { field: 'responsible', header: 'المسؤول' },
  ];

  // #endregion

  /**
   * يتم استدعاؤها عند تغيير قيم المدخلات. تستخدم لحساب الإحصائيات المشتقة.
   * @param changes التغييرات التي حدثت على المدخلات.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['warehouse'] && this.warehouse) {
      this.calculateStats();
      this.prepareChartData();
    }
  }

  /**
   * حساب الإحصائيات المشتقة من بيانات المستودع.
   */
  private calculateStats(): void {
    if (!this.warehouse) return;

    const { capacity, occupiedSpace, itemCount, totalValue } = this.warehouse;

    // حساب نسبة الإشغال
    const occupancy = capacity > 0 ? (occupiedSpace / capacity) * 100 : 0;

    this.stats = {
      itemCount: itemCount,
      totalValue: totalValue,
      occupancyPercentage: parseFloat(occupancy.toFixed(2)), // تقريب لخانتي عشر
    };
  }

  /**
   * إعداد بيانات الرسم البياني الدائري لنسبة الإشغال.
   */
  private prepareChartData(): void {
    const occupied = this.warehouse.occupiedSpace;
    const available = this.warehouse.capacity - occupied;

    this.occupancyChartData = {
      labels: ['المساحة المشغولة', 'المساحة المتاحة'],
      datasets: [
        {
          data: [occupied, available],
          backgroundColor: ['#42A5F5', '#FF6384'], // ألوان افتراضية
          hoverBackgroundColor: ['#64B5F6', '#FF9F40'],
        },
      ],
    };

    this.occupancyChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
          },
        },
      },
    };
  }

  // #region معالجات الأحداث (Event Handlers)

  /**
   * يطلق حدث طلب تعديل المستودع.
   */
  onEdit(): void {
    this.editWarehouse.emit(this.warehouse);
  }

  /**
   * يطلق حدث طلب حذف المستودع.
   */
  onDelete(): void {
    this.deleteWarehouse.emit(this.warehouse);
  }

  /**
   * يطلق حدث طلب عرض المخزون.
   */
  onViewStock(): void {
    this.viewStock.emit(this.warehouse);
  }

  /**
   * يطلق حدث طلب عرض الحركات.
   */
  onViewMovements(): void {
    this.viewMovements.emit(this.warehouse);
  }

  // #endregion
}
