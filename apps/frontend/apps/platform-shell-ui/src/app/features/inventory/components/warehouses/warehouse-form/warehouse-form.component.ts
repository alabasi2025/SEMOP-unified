import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Warehouse, User } from '../../models'; // افتراض وجود ملف inventory.models.ts

// =================================================================================
// تعريف النماذج (لأغراض العرض التوضيحي، يجب استيرادها من inventory.models.ts)
// =================================================================================
/**
 * @description نموذج المستودع
 */
export interface Warehouse {
  id?: number;
  code: string; // الكود
  nameAr: string; // الاسم بالعربية
  nameEn: string; // الاسم بالإنجليزية
  location: string; // الموقع
  address: string; // العنوان التفصيلي
  capacity: number; // السعة
  managerId: number | null; // معرف المدير
  description: string; // الوصف
  isActive: boolean; // نشط/غير نشط
}

/**
 * @description نموذج مبسط للمستخدمين (لأغراض اختيار المدير)
 */
export interface User {
  id: number;
  name: string;
}

// بيانات مديري وهمية للاختبار
const MOCK_MANAGERS: User[] = [
  { id: 1, name: 'أحمد علي' },
  { id: 2, name: 'فاطمة محمد' },
  { id: 3, name: 'خالد إبراهيم' },
];

// =================================================================================
// تعريف المكون
// =================================================================================

@Component({
  selector: 'app-warehouse-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './warehouse-form.component.html',
  styleUrls: ['./warehouse-form.component.scss'],
})
export class WarehouseFormComponent implements OnInit, OnChanges {
  // المدخلات
  /**
   * @description بيانات المستودع المراد تعديله. يكون null في وضع الإنشاء.
   */
  @Input() warehouse: Warehouse | null = null;

  /**
   * @description وضع النموذج: 'create' للإنشاء، 'edit' للتعديل.
   */
  @Input() mode: 'create' | 'edit' = 'create';

  // المخرجات
  /**
   * @description ينبعث عند إرسال النموذج بنجاح مع بيانات المستودع.
   */
  @Output() formSubmit = new EventEmitter<Warehouse>();

  /**
   * @description ينبعث عند إلغاء عملية الإضافة/التعديل.
   */
  @Output() formCancel = new EventEmitter<void>();

  // خصائص النموذج
  warehouseForm!: FormGroup;
  private fb = inject(FormBuilder);

  /**
   * @description قائمة المديرين المتاحة للاختيار (Observable لاستخدام RxJS).
   */
  managers$: Observable<User[]> = of(MOCK_MANAGERS);

  /**
   * @description عنوان النموذج بناءً على الوضع.
   */
  formTitle: string = '';

  /**
   * @description خريطة رسائل الأخطاء باللغة العربية.
   */
  errorMessages: { [key: string]: { [key: string]: string } } = {
    required: { ar: 'هذا الحقل مطلوب.' },
    minlength: { ar: 'الحد الأدنى للطول هو ' },
    maxlength: { ar: 'الحد الأقصى للطول هو ' },
    min: { ar: 'القيمة يجب أن تكون أكبر من أو تساوي ' },
  };

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * @description يتم استدعاؤها عند تغيير المدخلات (warehouse أو mode).
   * @param changes التغييرات البسيطة في المدخلات.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mode']) {
      this.updateFormTitle();
    }
    if (changes['warehouse'] && this.warehouseForm) {
      this.patchFormValue();
    }
  }

  /**
   * @description تهيئة النموذج التفاعلي (Reactive Form) وتحديد قواعد التحقق.
   */
  private initializeForm(): void {
    this.warehouseForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(10)]],
      nameAr: ['', [Validators.required, Validators.maxLength(100)]],
      nameEn: ['', [Validators.required, Validators.maxLength(100)]],
      location: ['', [Validators.required, Validators.maxLength(255)]],
      address: ['', [Validators.required, Validators.maxLength(255)]],
      capacity: [0, [Validators.required, Validators.min(1)]],
      managerId: [null, [Validators.required]],
      description: [''], // اختياري
      isActive: [true, [Validators.required]],
    });

    this.updateFormTitle();
    this.patchFormValue();
  }

  /**
   * @description تحديث عنوان النموذج بناءً على وضع التشغيل (إنشاء/تعديل).
   */
  private updateFormTitle(): void {
    this.formTitle = this.mode === 'create' ? 'إضافة مستودع جديد' : 'تعديل بيانات المستودع';
  }

  /**
   * @description تعبئة النموذج بقيم المستودع المدخلة في وضع التعديل.
   */
  private patchFormValue(): void {
    if (this.mode === 'edit' && this.warehouse) {
      this.warehouseForm.patchValue(this.warehouse);
    } else if (this.mode === 'create' && this.warehouseForm) {
      // التأكد من إعادة تعيين النموذج في وضع الإنشاء
      this.warehouseForm.reset({
        code: '',
        nameAr: '',
        nameEn: '',
        location: '',
        address: '',
        capacity: 0,
        managerId: null,
        description: '',
        isActive: true,
      });
    }
  }

  /**
   * @description معالجة إرسال النموذج.
   */
  onSubmit(): void {
    if (this.warehouseForm.valid) {
      const formValue = this.warehouseForm.value;
      const submittedWarehouse: Warehouse = {
        ...this.warehouse, // الاحتفاظ بالـ id في وضع التعديل
        ...formValue,
        managerId: Number(formValue.managerId), // التأكد من أن managerId رقم
      };
      this.formSubmit.emit(submittedWarehouse);
    } else {
      // تحديد جميع الحقول كـ 'touched' لعرض رسائل الأخطاء
      this.warehouseForm.markAllAsTouched();
      console.error('النموذج غير صالح. يرجى مراجعة الحقول المطلوبة.');
    }
  }

  /**
   * @description معالجة إلغاء النموذج.
   */
  onCancel(): void {
    this.formCancel.emit();
  }

  /**
   * @description الحصول على رسالة الخطأ المناسبة لحقل معين.
   * @param control الحقل المراد التحقق من أخطائه.
   * @returns رسالة الخطأ باللغة العربية أو null.
   */
  getErrorMessage(control: AbstractControl | null): string | null {
    if (!control || !control.errors || !control.touched) {
      return null;
    }

    if (control.hasError('required')) {
      return this.errorMessages['required'].ar;
    }
    if (control.hasError('min')) {
      const requiredValue = control.getError('min').min;
      return `${this.errorMessages['min'].ar} ${requiredValue}.`;
    }
    if (control.hasError('maxlength')) {
      const requiredValue = control.getError('maxlength').requiredLength;
      return `${this.errorMessages['maxlength'].ar} ${requiredValue}.`;
    }
    // يمكن إضافة المزيد من التحققات هنا (مثل minlength, pattern, إلخ)

    return 'خطأ في الإدخال.';
  }

  // دوال مساعدة للوصول السريع للحقول في القالب
  get code() { return this.warehouseForm.get('code'); }
  get nameAr() { return this.warehouseForm.get('nameAr'); }
  get nameEn() { return this.warehouseForm.get('nameEn'); }
  get location() { return this.warehouseForm.get('location'); }
  get address() { return this.warehouseForm.get('address'); }
  get capacity() { return this.warehouseForm.get('capacity'); }
  get managerId() { return this.warehouseForm.get('managerId'); }
  get description() { return this.warehouseForm.get('description'); }
  get isActive() { return this.warehouseForm.get('isActive'); }
}
