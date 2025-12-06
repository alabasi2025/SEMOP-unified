// item-form.component.spec.ts
// اختبارات الوحدة لمكون ItemFormComponent

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ItemFormComponent } from './item-form.component';
import { Item, Category, Unit } from './inventory.models';
import { CommonModule } from '@angular/common';

describe('ItemFormComponent', () => {
  let component: ItemFormComponent;
  let fixture: ComponentFixture<ItemFormComponent>;
  let formBuilder: FormBuilder;

  // بيانات وهمية للاختبار
  const mockCategories: Category[] = [{ id: 1, name: 'إلكترونيات' }, { id: 2, name: 'ملابس' }];
  const mockUnits: Unit[] = [{ id: 1, name: 'قطعة' }, { id: 2, name: 'كرتون' }];
  const mockItem: Item = {
    id: 101,
    name: 'هاتف ذكي',
    description: 'هاتف حديث بمواصفات عالية',
    categoryId: 1,
    unitId: 1,
    sku: 'SMART-PH-001',
    barcode: '1234567890123',
    costPrice: 500,
    salePrice: 650,
    minStockLevel: 10,
    maxStockLevel: 50,
    imageUrl: 'http://example.com/image.jpg',
    isActive: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemFormComponent, ReactiveFormsModule, CommonModule], // استيراد المكون كـ Standalone
      providers: [FormBuilder]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemFormComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    // تهيئة المدخلات
    component.categories = mockCategories;
    component.units = mockUnits;
    component.item = null; // البدء بوضع الإضافة
    component.mode = 'create';

    fixture.detectChanges(); // تشغيل ngOnInit
  });

  it('يجب إنشاء المكون بنجاح', () => {
    expect(component).toBeTruthy();
  });

  it('يجب تهيئة النموذج في وضع الإضافة (create)', () => {
    expect(component.itemForm).toBeDefined();
    expect(component.itemForm.get('name')?.value).toBe('');
    expect(component.itemForm.get('categoryId')?.value).toBe(null);
    expect(component.formTitle).toBe('إضافة صنف جديد');
  });

  it('يجب تهيئة النموذج في وضع التعديل (edit) وتعبئة البيانات', () => {
    component.item = mockItem;
    component.mode = 'edit';
    component.ngOnChanges({
      item: { currentValue: mockItem, previousValue: null, firstChange: true, isFirstChange: () => true },
      mode: { currentValue: 'edit', previousValue: 'create', firstChange: false, isFirstChange: () => false }
    });
    fixture.detectChanges();

    expect(component.itemForm.get('name')?.value).toBe(mockItem.name);
    expect(component.itemForm.get('pricing.costPrice')?.value).toBe(mockItem.costPrice);
    expect(component.formTitle).toBe('تعديل بيانات الصنف');
  });

  // ----------------------------------------------------------------
  // اختبارات التحقق من الصحة (Validation Tests)
  // ----------------------------------------------------------------

  it('يجب أن يكون النموذج غير صالح عند ترك الحقول المطلوبة فارغة', () => {
    component.itemForm.get('name')?.setValue('');
    component.itemForm.get('categoryId')?.setValue(null);
    component.itemForm.get('pricing.costPrice')?.setValue(null);
    component.itemForm.get('pricing.salePrice')?.setValue(null);

    expect(component.itemForm.invalid).toBeTrue();
    expect(component.itemForm.get('name')?.hasError('required')).toBeTrue();
  });

  it('يجب أن يفشل التحقق من طول الاسم (minlength)', () => {
    component.itemForm.get('name')?.setValue('AB');
    expect(component.itemForm.get('name')?.hasError('minlength')).toBeTrue();
  });

  it('يجب أن يفشل التحقق من نطاق الأسعار (salePrice <= costPrice)', () => {
    component.itemForm.get('pricing.costPrice')?.setValue(100);
    component.itemForm.get('pricing.salePrice')?.setValue(99);
    // يجب أن يكون الخطأ على مستوى المجموعة
    expect(component.itemForm.get('pricing')?.hasError('priceRange')).toBeTrue();
  });

  it('يجب أن يفشل التحقق من نطاق المخزون (maxStockLevel < minStockLevel)', () => {
    component.itemForm.get('stockLimits.minStockLevel')?.setValue(50);
    component.itemForm.get('stockLimits.maxStockLevel')?.setValue(49);
    // يجب أن يكون الخطأ على مستوى المجموعة
    expect(component.itemForm.get('stockLimits')?.hasError('stockRange')).toBeTrue();
  });

  // ----------------------------------------------------------------
  // اختبارات الإرسال والإلغاء (Submit/Cancel Tests)
  // ----------------------------------------------------------------

  it('يجب أن يطلق حدث formSubmit عند إرسال نموذج صالح', (done) => {
    // تعبئة النموذج ببيانات صالحة
    component.itemForm.patchValue({
      name: 'منتج جديد',
      categoryId: 1,
      unitId: 1,
      pricing: { costPrice: 10, salePrice: 20 },
      stockLimits: { minStockLevel: 5, maxStockLevel: 100 },
      isActive: true
    });

    let submittedItem: Item | undefined;
    component.formSubmit.subscribe((item) => {
      submittedItem = item;
      expect(submittedItem).toBeDefined();
      expect(submittedItem?.name).toBe('منتج جديد');
      expect(submittedItem?.salePrice).toBe(20);
      done();
    });

    component.onSubmit();
  });

  it('يجب أن يطلق حدث formCancel عند النقر على إلغاء', () => {
    spyOn(component.formCancel, 'emit');
    component.onCancel();
    expect(component.formCancel.emit).toHaveBeenCalled();
  });

  // ----------------------------------------------------------------
  // اختبارات الدوال المساعدة (Helper Function Tests)
  // ----------------------------------------------------------------

  it('يجب أن يعرض رسالة الخطأ المطلوبة للحقل name', () => {
    const nameControl = component.itemForm.get('name');
    nameControl?.setValue('');
    nameControl?.markAsTouched();
    fixture.detectChanges();

    expect(component.getErrorMessage('name')).toBe('هذا الحقل مطلوب.');

    nameControl?.setValue('A');
    nameControl?.markAsTouched();
    fixture.detectChanges();
    expect(component.getErrorMessage('name')).toBe('الحد الأدنى لعدد الأحرف هو 3.');
  });

  it('يجب أن يعرض رسالة الخطأ لنطاق الأسعار', () => {
    const pricingGroup = component.itemForm.get('pricing');
    pricingGroup?.get('costPrice')?.setValue(100);
    pricingGroup?.get('salePrice')?.setValue(50);
    pricingGroup?.markAsTouched();
    fixture.detectChanges();

    expect(component.getErrorMessage('', 'pricing')).toBe('سعر البيع يجب أن يكون أكبر من سعر التكلفة.');
  });
});
