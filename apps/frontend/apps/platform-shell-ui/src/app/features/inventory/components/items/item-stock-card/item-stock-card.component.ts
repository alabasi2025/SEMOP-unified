import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * حالة المخزون
 */
export type StockStatus = 'low' | 'normal' | 'high';

/**
 * مكون بطاقة رصيد صنف
 * يعرض معلومات رصيد الصنف مع مؤشرات بصرية للحالة
 */
@Component({
  selector: 'app-item-stock-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-stock-card.component.html',
  styleUrls: ['./item-stock-card.component.scss']
})
export class ItemStockCardComponent {
  @Input() itemCode: string = '';
  @Input() itemName: string = '';
  @Input() quantity: number = 0;
  @Input() minQuantity: number = 0;
  @Input() maxQuantity: number = 0;
  @Input() unit: string = '';
  @Input() warehouseName: string = '';
  @Input() showWarehouse: boolean = true;
  @Input() clickable: boolean = false;
  @Input() loading: boolean = false;

  @Output() cardClick = new EventEmitter<void>();

  /**
   * الحصول على حالة المخزون
   */
  get stockStatus(): StockStatus {
    if (this.quantity < this.minQuantity) {
      return 'low';
    } else if (this.maxQuantity > 0 && this.quantity > this.maxQuantity) {
      return 'high';
    }
    return 'normal';
  }

  /**
   * الحصول على نص حالة المخزون
   */
  get stockStatusText(): string {
    switch (this.stockStatus) {
      case 'low':
        return 'ناقص';
      case 'high':
        return 'زائد';
      default:
        return 'عادي';
    }
  }

  /**
   * الحصول على أيقونة حالة المخزون
   */
  get stockStatusIcon(): string {
    switch (this.stockStatus) {
      case 'low':
        return '⚠️';
      case 'high':
        return '📦';
      default:
        return '✅';
    }
  }

  /**
   * الحصول على لون حالة المخزون
   */
  get stockStatusColor(): string {
    switch (this.stockStatus) {
      case 'low':
        return 'danger';
      case 'high':
        return 'info';
      default:
        return 'success';
    }
  }

  /**
   * حساب نسبة الرصيد (للـ progress bar)
   */
  get stockPercentage(): number {
    if (this.maxQuantity === 0) {
      return 0;
    }
    return Math.min((this.quantity / this.maxQuantity) * 100, 100);
  }

  /**
   * معالجة النقر على البطاقة
   */
  onCardClick(): void {
    if (this.clickable && !this.loading) {
      this.cardClick.emit();
    }
  }

  /**
   * الحصول على نص الكمية المنسق
   */
  get formattedQuantity(): string {
    return `${this.quantity.toLocaleString('ar-SA')} ${this.unit}`;
  }

  /**
   * الحصول على نص الحد الأدنى
   */
  get formattedMinQuantity(): string {
    return `${this.minQuantity.toLocaleString('ar-SA')} ${this.unit}`;
  }

  /**
   * الحصول على نص الحد الأقصى
   */
  get formattedMaxQuantity(): string {
    if (this.maxQuantity === 0) {
      return 'غير محدد';
    }
    return `${this.maxQuantity.toLocaleString('ar-SA')} ${this.unit}`;
  }
}
