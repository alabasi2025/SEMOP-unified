import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { Subject, debounceTime, takeUntil } from 'rxjs';

/**
 * @description أنواع الفلاتر المدعومة
 */
export type FilterType = 'text' | 'select' | 'date' | 'range' | 'checkbox';

/**
 * @description واجهة خيار الفلتر (للفلاتر من نوع 'select')
 */
export interface FilterOption {
  label: string;
  value: any;
}

/**
 * @description واجهة إعدادات الفلتر
 */
export interface FilterConfig {
  key: string;
  label: string;
  type: FilterType;
  options?: FilterOption[]; // لفلتر 'select'
  min?: number | Date; // للحد الأدنى في 'range' أو 'date'
  max?: number | Date; // للحد الأقصى في 'range' أو 'date'
  defaultValue?: any; // القيمة الافتراضية للفلتر
  placeholder?: string; // نص العنصر النائب
  required?: boolean; // هل الفلتر إلزامي
}

/**
 * @description مكون لوحة الفلاتر العامة والقابلة لإعادة الاستخدام
 */
@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss'],
})
export class FilterPanelComponent implements OnInit, OnChanges {
  // حقن خدمة بناء النماذج
  private fb = inject(FormBuilder);
  
  /**
   * @description مصفوفة إعدادات الفلاتر لتكوين اللوحة ديناميكياً
   * @type {FilterConfig[]}
   */
  @Input() filters: FilterConfig[] = [];

  /**
   * @description القيم الأولية للفلاتر لملء النموذج عند التحميل
   * @type {any}
   */
  @Input() initialValues: any = {};

  /**
   * @description تحديد ما إذا كانت اللوحة قابلة للطي/التوسيع. القيمة الافتراضية هي true.
   * @type {boolean}
   */
  @Input() collapsible: boolean = true;

  /**
   * @description حدث يتم إطلاقه عند تطبيق الفلاتر (الضغط على زر 'تطبيق')
   * @type {EventEmitter<any>}
   */
  @Output() filterApply = new EventEmitter<any>();

  /**
   * @description حدث يتم إطلاقه عند إعادة تعيين الفلاتر (الضغط على زر 'إعادة تعيين')
   * @type {EventEmitter<void>}
   */
  @Output() filterReset = new EventEmitter<void>();

  /**
   * @description حدث يتم إطلاقه عند تغيير قيمة أي فلتر في النموذج (مع تأخير)
   * @type {EventEmitter<any>}
   */
  @Output() filterChange = new EventEmitter<any>();

  // متغيرات داخلية
  filterForm!: FormGroup;
  isCollapsed: boolean = true;
  activeFiltersCount: number = 0;
  private destroy$ = new Subject<void>();

  /**
   * @description تهيئة النموذج بناءً على إعدادات الفلاتر
   */
  ngOnInit(): void {
    this.initializeForm();
    this.subscribeToFormChanges();
  }

  /**
   * @description معالجة التغييرات في المدخلات (خاصة initialValues أو filters)
   * @param {SimpleChanges} changes - كائن التغييرات
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters'] || changes['initialValues']) {
      // إعادة تهيئة النموذج إذا تغيرت إعدادات الفلاتر أو القيم الأولية
      this.initializeForm();
      this.calculateActiveFilters();
    }
  }

  /**
   * @description بناء FormGroup ديناميكياً من مصفوفة FilterConfig
   */
  private initializeForm(): void {
    const formControls: { [key: string]: AbstractControl } = {};
    
    this.filters.forEach(filter => {
      // تحديد القيمة الأولية: إما من initialValues، أو defaultValue، أو null
      const initialValue = this.initialValues[filter.key] !== undefined
        ? this.initialValues[filter.key]
        : filter.defaultValue !== undefined
          ? filter.defaultValue
          : null;

      // تحديد قواعد التحقق (Validators)
      const validators = [];
      if (filter.required) {
        validators.push(Validators.required);
      }
      // يمكن إضافة المزيد من قواعد التحقق هنا بناءً على نوع الفلتر (مثل min/max)

      formControls[filter.key] = this.fb.control(initialValue, validators);
    });

    this.filterForm = this.fb.group(formControls);
    this.calculateActiveFilters();
  }

  /**
   * @description الاشتراك في تغييرات النموذج لإطلاق حدث filterChange
   */
  private subscribeToFormChanges(): void {
    this.filterForm.valueChanges
      .pipe(
        // تأخير زمني لتجنب إطلاق الحدث بشكل متكرر أثناء الكتابة
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe(values => {
        this.calculateActiveFilters();
        // إطلاق الحدث مع القيم الجديدة للنموذج
        this.filterChange.emit(this.getAppliedValues(values));
      });
  }

  /**
   * @description تبديل حالة الطي/التوسيع للوحة
   */
  toggleCollapse(): void {
    if (this.collapsible) {
      this.isCollapsed = !this.isCollapsed;
    }
  }

  /**
   * @description حساب عدد الفلاتر النشطة (التي تحتوي على قيمة مختلفة عن القيمة الافتراضية أو الفارغة)
   */
  calculateActiveFilters(): void {
    let count = 0;
    const currentValues = this.filterForm.value;

    this.filters.forEach(filter => {
      const currentValue = currentValues[filter.key];
      const defaultValue = filter.defaultValue;

      // تحقق من القيمة
      if (currentValue !== null && currentValue !== undefined && currentValue !== '') {
        // إذا كان الفلتر من نوع 'range' أو 'date' (يتوقع مصفوفة أو كائن)
        if (filter.type === 'range' || filter.type === 'date') {
          // تحقق أكثر تعقيداً للأنواع المركبة
          if (Array.isArray(currentValue) && (currentValue[0] || currentValue[1])) {
            count++;
          } else if (typeof currentValue === 'object' && currentValue !== null) {
            // افتراض أن الكائن يمثل قيمة غير فارغة
            count++;
          }
        } else if (filter.type === 'checkbox') {
          // للـ checkbox، القيمة النشطة هي true
          if (currentValue === true) {
            count++;
          }
        } else {
          // للأنواع البسيطة (text, select)
          if (currentValue !== defaultValue) {
            count++;
          }
        }
      }
    });

    this.activeFiltersCount = count;
  }

  /**
   * @description استخراج القيم التي سيتم تطبيقها (تجاهل القيم الفارغة أو الافتراضية)
   * @param {any} values - قيم النموذج الحالية
   * @returns {any} كائن يحتوي فقط على الفلاتر النشطة
   */
  private getAppliedValues(values: any): any {
    const appliedValues: any = {};
    this.filters.forEach(filter => {
      const value = values[filter.key];
      // تضمين القيمة إذا كانت غير فارغة أو غير افتراضية
      if (value !== null && value !== undefined && value !== '' && value !== filter.defaultValue) {
        // معالجة خاصة للـ checkbox
        if (filter.type === 'checkbox' && value === false) {
          // لا ندرج checkbox بقيمة false ما لم يكن هناك سبب محدد
        } else {
          appliedValues[filter.key] = value;
        }
      }
    });
    return appliedValues;
  }

  /**
   * @description تطبيق الفلاتر وإطلاق حدث filterApply
   */
  applyFilters(): void {
    if (this.filterForm.valid) {
      // إطلاق الحدث مع القيم المطبقة
      this.filterApply.emit(this.getAppliedValues(this.filterForm.value));
      // يمكن إضافة منطق لحفظ الإعدادات هنا (مثل في LocalStorage)
      console.log('تم تطبيق الفلاتر:', this.getAppliedValues(this.filterForm.value));
    } else {
      // عرض رسائل التحقق من الصحة
      this.filterForm.markAllAsTouched();
      console.error('النموذج غير صالح. يرجى مراجعة الحقول المطلوبة.');
    }
  }

  /**
   * @description إعادة تعيين جميع الفلاتر إلى قيمها الأولية/الافتراضية
   */
  resetFilters(): void {
    const resetValues: { [key: string]: any } = {};
    this.filters.forEach(filter => {
      // إعادة التعيين إلى القيمة الافتراضية المحددة أو null
      resetValues[filter.key] = filter.defaultValue !== undefined ? filter.defaultValue : null;
    });

    this.filterForm.reset(resetValues);
    this.calculateActiveFilters();
    this.filterReset.emit();
    console.log('تم إعادة تعيين الفلاتر.');
  }

  /**
   * @description مسح جميع الفلاتر (تعيينها إلى null)
   */
  clearAllFilters(): void {
    const clearValues: { [key: string]: any } = {};
    this.filters.forEach(filter => {
      // تعيين جميع القيم إلى null أو false للـ checkbox
      clearValues[filter.key] = filter.type === 'checkbox' ? false : null;
    });

    this.filterForm.reset(clearValues);
    this.calculateActiveFilters();
    // إطلاق حدث التغيير بعد المسح
    this.filterChange.emit({});
    console.log('تم مسح جميع الفلاتر.');
  }

  /**
   * @description تنظيف الاشتراكات عند تدمير المكون
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
