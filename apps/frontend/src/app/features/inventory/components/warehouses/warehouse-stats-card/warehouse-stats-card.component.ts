import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { Warehouse } from '../inventory.models'; // نفترض أن الملف في مجلد أعلى

/**
 * @description
 * مكون بطاقة إحصائيات المستودع.
 * يعرض إحصائيات المستودع الرئيسية مثل عدد الأصناف، القيمة الإجمالية، ونسبة الإشغال.
 *
 * @usage
 * <app-warehouse-stats-card
 *   [warehouse]="myWarehouse"
 *   [totalItems]="150"
 *   [totalValue]="250000"
 *   [occupancyRate]="85"
 *   [loading]="false"
 *   [clickable]="true"
 *   (cardClick)="handleCardClick($event)">
 * </app-warehouse-stats-card>
 */
@Component({
  selector: 'app-warehouse-stats-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DecimalPipe],
  templateUrl: './warehouse-stats-card.component.html',
  styleUrls: ['./warehouse-stats-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WarehouseStatsCardComponent {
  // @Input()
  // المدخلات المطلوبة للمكون

  /**
   * @description
   * بيانات المستودع الأساسية.
   */
  @Input({ required: true }) warehouse!: Warehouse;

  /**
   * @description
   * إجمالي عدد الأصناف المخزنة في المستودع.
   */
  @Input({ required: true }) totalItems!: number;

  /**
   * @description
   * القيمة الإجمالية للمخزون في المستودع.
   */
  @Input({ required: true }) totalValue!: number;

  /**
   * @description
   * نسبة إشغال المستودع (0-100).
   */
  @Input({ required: true }) occupancyRate!: number;

  /**
   * @description
   * حالة التحميل. إذا كانت صحيحة، يتم عرض هيكل عظمي (skeleton) بدلاً من البيانات.
   */
  @Input() loading: boolean = false;

  /**
   * @description
   * يحدد ما إذا كانت البطاقة قابلة للنقر.
   */
  @Input() clickable: boolean = false;

  // @Output()
  // المخرجات المطلوبة للمكون

  /**
   * @description
   * حدث يتم إطلاقه عند النقر على البطاقة، إذا كانت قابلة للنقر.
   * يحمل بيانات المستودع كقيمة.
   */
  @Output() cardClick = new EventEmitter<Warehouse>();

  /**
   * @description
   * دالة مساعدة لحساب لون نسبة الإشغال بناءً على القواعد:
   * - أخضر: < 70%
   * - أصفر: 70% - 90%
   * - أحمر: > 90%
   * @returns {string} اسم فئة CSS للون (e.g., 'green', 'yellow', 'red').
   */
  get occupancyColor(): string {
    if (this.occupancyRate < 70) {
      return 'green'; // إشغال منخفض/آمن
    } else if (this.occupancyRate <= 90) {
      return 'yellow'; // إشغال متوسط/تحذيري
    } else {
      return 'red'; // إشغال مرتفع/خطر
    }
  }

  /**
   * @description
   * معالج النقر على البطاقة. يطلق الحدث cardClick إذا كانت البطاقة قابلة للنقر.
   */
  onCardClick(): void {
    if (this.clickable && !this.loading) {
      this.cardClick.emit(this.warehouse);
    }
  }
}
