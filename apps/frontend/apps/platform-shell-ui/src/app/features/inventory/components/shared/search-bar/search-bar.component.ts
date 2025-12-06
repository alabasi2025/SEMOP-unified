import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  HostListener,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

/**
 * @title SearchBarComponent
 * @description مكون شريط بحث عام وقابل لإعادة الاستخدام.
 * يدعم ميزات مثل الـ Debounce، مؤشر التحميل، زر المسح، والتحقق من الحد الأدنى للطول.
 *
 * @usageNotes
 * <app-search-bar
 *   [placeholder]="'البحث عن مستخدمين...'"
 *   [debounceTime]="500"
 *   [minLength]="3"
 *   [loading]="isLoading"
 *   (search)="onSearch($event)"
 *   (clear)="onClear()"
 * ></app-search-bar>
 */
@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent implements OnInit, OnDestroy {
  // #region المدخلات (Inputs)

  /**
   * @description النص النائب (Placeholder) لحقل البحث.
   */
  @Input() placeholder: string = 'البحث...';

  /**
   * @description المدة بالمللي ثانية لتأخير إطلاق حدث البحث (Debounce).
   * القيمة الافتراضية هي 300 مللي ثانية.
   */
  @Input() debounceTime: number = 300;

  /**
   * @description الحد الأدنى لعدد الأحرف المطلوبة لإطلاق حدث البحث.
   * القيمة الافتراضية هي 2.
   */
  @Input() minLength: number = 2;

  /**
   * @description يحدد ما إذا كان يجب عرض زر المسح (Clear Button) أم لا.
   * القيمة الافتراضية هي true.
   */
  @Input() showClearButton: boolean = true;

  /**
   * @description يحدد ما إذا كان المكون في حالة تحميل (Loading) لعرض مؤشر التحميل.
   */
  @Input() loading: boolean = false;

  /**
   * @description يحدد ما إذا كان يجب تفعيل دعم الإكمال التلقائي (Autocomplete) أم لا.
   * (هذا المدخل هيكلي ويفترض أن يتم التعامل مع قائمة النتائج خارج المكون).
   */
  @Input() autocomplete: boolean = false;

  // #endregion

  // #region المخرجات (Outputs)

  /**
   * @description يُطلق عند اكتمال عملية الـ Debounce وتجاوز الحد الأدنى للطول.
   * يحمل قيمة حقل البحث الحالية.
   */
  @Output() search = new EventEmitter<string>();

  /**
   * @description يُطلق عند مسح حقل البحث بواسطة المستخدم (عبر الزر أو الكود).
   */
  @Output() clear = new EventEmitter<void>();

  /**
   * @description يُطلق عند تركيز المستخدم على حقل البحث.
   */
  @Output() focus = new EventEmitter<void>();

  /**
   * @description يُطلق عند فقدان حقل البحث للتركيز (Blur).
   */
  @Output() blur = new EventEmitter<void>();

  // #endregion

  // #region الخصائص الداخلية

  /**
   * @description القيمة الحالية لحقل البحث (باستخدام ngModel).
   */
  searchTerm = signal<string>('');

  /**
   * @description Subject لإدارة تدفق قيم البحث وتطبيق الـ Debounce.
   */
  private searchSubject = new Subject<string>();

  /**
   * @description Subject لإدارة عملية إلغاء الاشتراك (Cleanup) عند تدمير المكون.
   */
  private destroy$ = new Subject<void>();

  /**
   * @description مرجع لعنصر الإدخال (input) في القالب للتحكم في التركيز.
   */
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  // #endregion

  /**
   * @description تهيئة المكون.
   * يتم الاشتراك في تدفق قيم البحث لتطبيق الـ Debounce والتحقق من الحد الأدنى للطول.
   */
  ngOnInit(): void {
    this.searchSubject
      .pipe(
        // تطبيق تأخير (Debounce) قبل إطلاق الحدث
        debounceTime(this.debounceTime),
        // التأكد من أن القيمة الجديدة مختلفة عن القيمة السابقة
        distinctUntilChanged(),
        // إيقاف الاشتراك عند تدمير المكون
        takeUntil(this.destroy$)
      )
      .subscribe((term) => {
        // إذا كانت القيمة فارغة أو تجاوزت الحد الأدنى للطول، يتم إطلاق حدث البحث
        if (term.length === 0 || term.length >= this.minLength) {
          this.search.emit(term);
        }
      });
  }

  /**
   * @description يتم استدعاؤها عند تغيير قيمة حقل البحث.
   * تدفع القيمة الجديدة إلى الـ Subject لتطبيق الـ Debounce.
   * @param value القيمة الجديدة لحقل البحث.
   */
  onSearchTermChange(value: string): void {
    this.searchTerm.set(value);
    this.searchSubject.next(value);
  }

  /**
   * @description مسح حقل البحث وإطلاق حدث المسح.
   */
  clearSearch(): void {
    this.searchTerm.set('');
    // إطلاق قيمة فارغة فوراً في الـ Subject لإيقاف أي بحث معلق
    this.searchSubject.next('');
    this.search.emit('');
    this.clear.emit();
    this.searchInput.nativeElement.focus(); // إعادة التركيز بعد المسح
  }

  /**
   * @description معالج حدث التركيز (Focus) على حقل البحث.
   */
  onFocus(): void {
    this.focus.emit();
  }

  /**
   * @description معالج حدث فقدان التركيز (Blur) من حقل البحث.
   */
  onBlur(): void {
    this.blur.emit();
  }

  /**
   * @description معالج اختصار لوحة المفاتيح (Ctrl+K) لتركيز حقل البحث.
   * يتم استخدام @HostListener للاستماع إلى أحداث لوحة المفاتيح على مستوى المستند.
   * @param event حدث لوحة المفاتيح.
   */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardShortcut(event: KeyboardEvent): void {
    // التحقق من الضغط على Ctrl (أو Cmd في Mac) وحرف K
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault(); // منع السلوك الافتراضي للمتصفح
      this.searchInput.nativeElement.focus();
    }
  }

  /**
   * @description تدمير المكون.
   * يتم إطلاق قيمة في الـ destroy$ Subject لإلغاء جميع الاشتراكات.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
