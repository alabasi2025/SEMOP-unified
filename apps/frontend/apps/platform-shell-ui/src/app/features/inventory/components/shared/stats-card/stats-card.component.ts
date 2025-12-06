// /home/ubuntu/stats-card.component.ts

import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Subscription, timer } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';

// تعريف أنواع المدخلات لضمان سلامة النوع
export type StatsCardColor = 'primary' | 'success' | 'warning' | 'danger';
export type StatsCardTrend = 'up' | 'down' | null;

/**
 * @title StatsCardComponent
 * @description مكون بطاقة إحصائيات عامة وقابلة لإعادة الاستخدام.
 * يستخدم لعرض مقاييس وإحصائيات رئيسية مع أيقونات ومؤشرات اتجاه.
 */
@Component({
  selector: 'app-inventory-stats-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsCardComponent implements OnInit, OnDestroy {
  // --- المدخلات (Inputs) ---

  /**
   * @description عنوان البطاقة.
   */
  @Input({ required: true }) title!: string;

  /**
   * @description القيمة الرئيسية للبطاقة. يمكن أن تكون رقمًا أو نصًا.
   */
  @Input() set value(newValue: number | string) {
    // تحديث القيمة الجديدة وتفعيل مؤشر التغيير
    this._value = newValue;
    this.animateValueChange();
  }
  get value(): number | string {
    return this._value;
  }
  private _value: number | string = '';

  /**
   * @description اسم الأيقونة المراد عرضها (مثال: 'trending_up', 'group').
   * يفترض استخدام مكتبة أيقونات مثل Material Icons أو Font Awesome.
   */
  @Input() icon: string | null = null;

  /**
   * @description لون البطاقة لتحديد التنسيق (primary, success, warning, danger).
   */
  @Input() color: StatsCardColor = 'primary';

  /**
   * @description مؤشر الاتجاه (up: سهم للأعلى, down: سهم للأسفل, null: لا يوجد مؤشر).
   */
  @Input() trend: StatsCardTrend = null;

  /**
   * @description حالة التحميل. عند true، يتم عرض هيكل (skeleton) بدلاً من المحتوى.
   */
  @Input() loading: boolean = false;

  /**
   * @description يحدد ما إذا كانت البطاقة قابلة للنقر. يغير شكل المؤشر ويضيف تنسيق النقر.
   */
  @Input() clickable: boolean = false;

  // --- المخرجات (Outputs) ---

  /**
   * @description حدث يتم إطلاقه عند النقر على البطاقة (إذا كانت clickable = true).
   */
  @Output() cardClick = new EventEmitter<void>();

  // --- الخصائص الداخلية ---

  /**
   * @description موضوع سلوكي لتتبع حالة وميض القيمة (للتأثير البصري عند التغيير).
   */
  valueChange$ = new BehaviorSubject<boolean>(false);

  private valueChangeSubscription: Subscription | undefined;

  // --- دورة حياة المكون (Lifecycle Hooks) ---

  constructor() {
    // تهيئة الاشتراك في BehaviorSubject لتأثير الوميض
    this.valueChangeSubscription = this.valueChange$
      .pipe(
        // عند تغيير القيمة إلى true (بدء الوميض)، انتظر 500 مللي ثانية
        switchMap(isChanging => isChanging ? timer(500).pipe(startWith(true)) : [false])
      )
      .subscribe(shouldReset => {
        // إذا كان يجب إعادة التعيين، قم بتعيين القيمة إلى false لإيقاف الوميض
        if (shouldReset) {
          this.valueChange$.next(false);
        }
      });
  }

  ngOnInit(): void {
    // لا يوجد منطق تهيئة إضافي حاليًا
  }

  ngOnDestroy(): void {
    // إلغاء الاشتراك لتجنب تسرب الذاكرة
    this.valueChangeSubscription?.unsubscribe();
  }

  // --- الطرق (Methods) ---

  /**
   * @description معالجة النقر على البطاقة. يتم إطلاق الحدث cardClick إذا كانت البطاقة قابلة للنقر.
   */
  onCardClick(): void {
    if (this.clickable && !this.loading) {
      this.cardClick.emit();
    }
  }

  /**
   * @description تفعيل تأثير الوميض عند تغيير القيمة.
   */
  private animateValueChange(): void {
    // تفعيل الوميض (true) إذا كانت القيمة الجديدة مختلفة عن القيمة الحالية
    // يتم التعامل مع منطق إيقاف الوميض داخل الاشتراك في valueChange$
    this.valueChange$.next(true);
  }

  /**
   * @description الحصول على اسم الأيقونة المناسب للاتجاه.
   * @returns اسم الأيقونة (مثال: 'arrow_upward' أو 'arrow_downward').
   */
  get trendIcon(): string {
    return this.trend === 'up' ? 'arrow_upward' : 'arrow_downward';
  }
}
