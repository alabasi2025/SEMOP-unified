import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Item, Category, Unit } from '../../models'; // افتراض أن الملف في نفس المجلد
import { Observable, of } from 'rxjs';

// تعريف رسائل الأخطاء باللغة العربية
const AR_ERROR_MESSAGES: { [key: string]: string } = {
  required: 'هذا الحقل مطلوب.',
  minlength: 'الحد الأدنى لعدد الأحرف هو {requiredLength}.',
  maxlength: 'الحد الأقصى لعدد الأحرف هو {requiredLength}.',
  min: 'القيمة يجب أن تكون أكبر من أو تساوي {min}.',
  max: 'القيمة يجب أن تكون أصغر من أو تساوي {max}.',
  email: 'صيغة البريد الإلكتروني غير صحيحة.',
  pattern: 'صيغة الإدخال غير صحيحة.',
  priceRange: 'سعر البيع يجب أن يكون أكبر من سعر التكلفة.',
  stockRange: 'الحد الأقصى للمخزون يجب أن يكون أكبر من الحد الأدنى.',
};

/**
 * دالة تحقق مخصصة للتأكد من أن سعر البيع أكبر من سعر التكلفة.
 * @param control FormGroup
 * @returns ValidationErrors | null
 */
function priceRangeValidator(control: AbstractControl): { [key: string]: any } | null {
  const costPrice = control.get('costPrice')?.value;
  const salePrice = control.get('salePrice')?.value;

  if (costPrice !== null && salePrice !== null && salePrice <= costPrice) {
    return { priceRange: true };
  }
  return null;
}

/**
 * دالة تحقق مخصصة للتأكد من أن الحد الأقصى للمخزون أكبر من الحد الأدنى.
 * @param control FormGroup
 * @returns ValidationErrors | null
 */
function stockRangeValidator(control: AbstractControl): { [key: string]: any } | null {
  const minStockLevel = control.get('minStockLevel')?.value;
  const maxStockLevel = control.get('maxStockLevel')?.value;

  if (minStockLevel !== null && maxStockLevel !== null && maxStockLevel < minStockLevel) {
    return { stockRange: true };
  }
  return null;
}

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss'],
  // إضافة host binding لدعم RTL
  host: {
    'dir': 'rtl'
  }
})
export class ItemFormComponent implements OnInit, OnChanges {
  // ----------------------------------------------------------------
  // المدخلات (Inputs)
  // ----------------------------------------------------------------

  /** الصنف الحالي المراد تعديله، أو null للإضافة. */
  @Input() item: Item | null = null;

  /** قائمة الفئات المتاحة للاختيار. */
  @Input() categories: Category[] = [];

  /** قائمة وحدات القياس المتاحة للاختيار. */
  @Input() units: Unit[] = [];

  /** وضع النموذج: 'create' للإضافة، 'edit' للتعديل. */
  @Input() mode: 'create' | 'edit' = 'create';

  // ----------------------------------------------------------------
  // المخرجات (Outputs)
  // ----------------------------------------------------------------

  /** حدث يتم إطلاقه عند إرسال النموذج بنجاح. */
  @Output() formSubmit = new EventEmitter<Item>();

  /** حدث يتم إطلاقه عند إلغاء عملية الإضافة/التعديل. */
  @Output() formCancel = new EventEmitter<void>();

  // ----------------------------------------------------------------
  // الخصائص الداخلية
  // ----------------------------------------------------------------

  /** مجموعة النموذج التفاعلي (Reactive Form Group). */
  itemForm!: FormGroup;

  /** حالة التحميل (Loading state) عند إرسال النموذج. */
  isLoading: boolean = false;

  /** عنوان النموذج بناءً على وضع التشغيل. */
  formTitle: string = '';

  /** مسار الصورة المرفوعة مؤقتاً. */
  tempImageUrl: string | null = null;

  // ----------------------------------------------------------------
  // البناء (Constructor)
  // ----------------------------------------------------------------

  constructor(private fb: FormBuilder) {}

  // ----------------------------------------------------------------
  // دورة حياة المكون (Lifecycle Hooks)
  // ----------------------------------------------------------------

  /** يتم استدعاؤها عند تهيئة المكون. */
  ngOnInit(): void {
    this.initializeForm();
    this.updateFormTitle();
  }

  /** يتم استدعاؤها عند تغيير قيم المدخلات. */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item'] && this.itemForm) {
      this.patchFormValue();
    }
    if (changes['mode']) {
      this.updateFormTitle();
    }
  }

  // ----------------------------------------------------------------
  // منطق النموذج (Form Logic)
  // ----------------------------------------------------------------

  /** تهيئة مجموعة النموذج التفاعلي (FormGroup) مع المحققين (Validators). */
  private initializeForm(): void {
    this.itemForm = this.fb.group({
      // معلومات أساسية
      name: [this.item?.name || '', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: [this.item?.description || null, [Validators.maxLength(500)]],
      categoryId: [this.item?.categoryId || null, [Validators.required]],
      unitId: [this.item?.unitId || null, [Validators.required]],

      // معلومات المخزون والباركود
      sku: [this.item?.sku || null, [Validators.maxLength(50)]],
      barcode: [this.item?.barcode || null, [Validators.maxLength(50)]],

      // معلومات الأسعار (مجموعة فرعية للتحقق المخصص)
      pricing: this.fb.group({
        costPrice: [this.item?.costPrice || 0, [Validators.required, Validators.min(0.01)]],
        salePrice: [this.item?.salePrice || 0, [Validators.required, Validators.min(0.01)]],
      }, { validators: priceRangeValidator }),

      // معلومات الحدود (مجموعة فرعية للتحقق المخصص)
      stockLimits: this.fb.group({
        minStockLevel: [this.item?.minStockLevel || 0, [Validators.required, Validators.min(0)]],
        maxStockLevel: [this.item?.maxStockLevel || 0, [Validators.required, Validators.min(0)]],
      }, { validators: stockRangeValidator }),

      // معلومات إضافية
      imageUrl: [this.item?.imageUrl || null],
      isActive: [this.item?.isActive ?? true],
    });

    this.patchFormValue();
  }

  /** تحديث قيم النموذج بناءً على مدخل 'item'. */
  private patchFormValue(): void {
    if (this.item && this.itemForm) {
      this.itemForm.patchValue({
        name: this.item.name,
        description: this.item.description,
        categoryId: this.item.categoryId,
        unitId: this.item.unitId,
        sku: this.item.sku,
        barcode: this.item.barcode,
        isActive: this.item.isActive,
        pricing: {
          costPrice: this.item.costPrice,
          salePrice: this.item.salePrice,
        },
        stockLimits: {
          minStockLevel: this.item.minStockLevel,
          maxStockLevel: this.item.maxStockLevel,
        }
      });
      this.tempImageUrl = this.item.imageUrl;
    }
  }

  /** تحديث عنوان النموذج. */
  private updateFormTitle(): void {
    this.formTitle = this.mode === 'create' ? 'إضافة صنف جديد' : 'تعديل بيانات الصنف';
  }

  /**
   * معالجة إرسال النموذج.
   * يتم تجميع البيانات وإطلاق حدث formSubmit.
   */
  onSubmit(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    // تجميع البيانات من النموذج
    const formValue = this.itemForm.value;
    const newItem: Item = {
      id: this.item?.id || null, // الاحتفاظ بالمعرف في وضع التعديل
      name: formValue.name,
      description: formValue.description,
      categoryId: formValue.categoryId,
      unitId: formValue.unitId,
      sku: formValue.sku,
      barcode: formValue.barcode,
      costPrice: formValue.pricing.costPrice,
      salePrice: formValue.pricing.salePrice,
      minStockLevel: formValue.stockLimits.minStockLevel,
      maxStockLevel: formValue.stockLimits.maxStockLevel,
      imageUrl: this.tempImageUrl, // استخدام الصورة المؤقتة
      isActive: formValue.isActive,
    };

    // محاكاة عملية حفظ (يمكن استبدالها بـ RxJS)
    of(newItem).subscribe({
      next: (savedItem) => {
        this.formSubmit.emit(savedItem);
        this.isLoading = false;
        // يمكن إضافة منطق "حفظ ومتابعة" هنا، مثل إعادة تعيين النموذج
        if (this.mode === 'create') {
          this.itemForm.reset({ isActive: true, pricing: { costPrice: 0, salePrice: 0 }, stockLimits: { minStockLevel: 0, maxStockLevel: 0 } });
          this.tempImageUrl = null;
        }
      },
      error: (err) => {
        console.error('خطأ في عملية الحفظ:', err);
        this.isLoading = false;
        // يمكن إضافة معالجة أخطاء أكثر تفصيلاً للمستخدم
      }
    });
  }

  /**
   * معالجة إلغاء النموذج.
   * يتم إطلاق حدث formCancel.
   */
  onCancel(): void {
    this.formCancel.emit();
  }

  /**
   * دالة مساعدة للحصول على رسالة الخطأ المناسبة لحقل معين.
   * @param controlName اسم الحقل في النموذج.
   * @param groupName اسم مجموعة النموذج (اختياري).
   * @returns رسالة الخطأ أو null.
   */
  getErrorMessage(controlName: string, groupName?: string): string | null {
    let control: AbstractControl | null;

    if (groupName) {
      const group = this.itemForm.get(groupName) as FormGroup;
      control = group?.get(controlName);
      // التحقق من أخطاء المجموعة أولاً
      if (group?.errors && group.errors['priceRange'] && groupName === 'pricing') {
        return AR_ERROR_MESSAGES['priceRange'];
      }
      if (group?.errors && group.errors['stockRange'] && groupName === 'stockLimits') {
        return AR_ERROR_MESSAGES['stockRange'];
      }
    } else {
      control = this.itemForm.get(controlName);
    }

    if (control && control.invalid && (control.dirty || control.touched)) {
      const errors = control.errors;
      if (errors) {
        const errorKey = Object.keys(errors)[0];
        let message = AR_ERROR_MESSAGES[errorKey];

        if (errorKey === 'minlength' || errorKey === 'maxlength') {
          const requiredLength = errors[errorKey].requiredLength;
          message = message.replace('{requiredLength}', requiredLength);
        } else if (errorKey === 'min') {
          const min = errors[errorKey].min;
          message = message.replace('{min}', min);
        } else if (errorKey === 'max') {
          const max = errors[errorKey].max;
          message = message.replace('{max}', max);
        }

        return message;
      }
    }
    return null;
  }

  /**
   * معالجة اختيار ملف الصورة.
   * @param event حدث تغيير الملف.
   */
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      // محاكاة رفع الصورة والحصول على رابط مؤقت
      const reader = new FileReader();
      reader.onload = () => {
        this.tempImageUrl = reader.result as string;
        // لا نقوم بتحديث حقل imageUrl في النموذج مباشرة، بل نستخدم tempImageUrl
        // لتجنب مشاكل التحقق من الصحة لملف الصورة
      };
      reader.readAsDataURL(file);
    }
  }

  /** إزالة الصورة المرفوعة. */
  removeImage(): void {
    this.tempImageUrl = null;
    // إعادة تعيين حقل الملف في النموذج إذا كان موجوداً
    const imageControl = document.getElementById('imageUpload') as HTMLInputElement;
    if (imageControl) {
      imageControl.value = '';
    }
  }
}
