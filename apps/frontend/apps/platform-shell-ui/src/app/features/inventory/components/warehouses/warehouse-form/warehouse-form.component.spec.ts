import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WarehouseFormComponent, Warehouse } from './warehouse-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';

// بيانات مستودع وهمية للاختبار
const MOCK_WAREHOUSE: Warehouse = {
  id: 1,
  code: 'WH001',
  nameAr: 'المستودع الرئيسي',
  nameEn: 'Main Warehouse',
  location: 'المنطقة الصناعية',
  address: 'شارع رقم 5، مبنى 10',
  capacity: 500,
  managerId: 1,
  description: 'مستودع لتخزين البضائع الرئيسية',
  isActive: true,
};

describe('WarehouseFormComponent', () => {
  let component: WarehouseFormComponent;
  let fixture: ComponentFixture<WarehouseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseFormComponent, ReactiveFormsModule, CommonModule], // استيراد المكون Standalone
    }).compileComponents();

    fixture = TestBed.createComponent(WarehouseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // تشغيل ngOnInit
  });

  it('يجب إنشاء المكون بنجاح', () => {
    expect(component).toBeTruthy();
  });

  it('يجب تهيئة النموذج التفاعلي (warehouseForm) عند الإنشاء', () => {
    expect(component.warehouseForm).toBeDefined();
    expect(component.warehouseForm.contains('code')).toBeTrue();
    expect(component.warehouseForm.contains('nameAr')).toBeTrue();
    expect(component.warehouseForm.contains('capacity')).toBeTrue();
  });

  // =================================================================================
  // اختبار وضع الإنشاء ('create')
  // =================================================================================
  describe('وضع الإنشاء (Create Mode)', () => {
    beforeEach(() => {
      component.mode = 'create';
      component.warehouse = null;
      component.ngOnChanges({
        mode: {
          currentValue: 'create',
          previousValue: 'edit',
          firstChange: false,
          isFirstChange: () => false,
        },
      });
      fixture.detectChanges();
    });

    it('يجب أن يكون عنوان النموذج "إضافة مستودع جديد"', () => {
      expect(component.formTitle).toBe('إضافة مستودع جديد');
      const titleElement = fixture.debugElement.query(By.css('.form-title')).nativeElement;
      expect(titleElement.textContent).toContain('إضافة مستودع جديد');
    });

    it('يجب أن يكون زر الإرسال يحمل نص "إضافة"', () => {
      const submitButton: HTMLButtonElement = fixture.debugElement.query(By.css('.btn-primary')).nativeElement;
      expect(submitButton.textContent?.trim()).toBe('إضافة');
    });

    it('يجب أن يكون النموذج غير صالح في البداية (الحقول مطلوبة)', () => {
      expect(component.warehouseForm.valid).toBeFalse();
    });

    it('يجب أن يصبح النموذج صالحًا عند إدخال بيانات صحيحة', () => {
      component.warehouseForm.setValue({
        code: 'NEW01',
        nameAr: 'مستودع جديد',
        nameEn: 'New Warehouse',
        location: 'الرياض',
        address: 'طريق الملك فهد',
        capacity: 100,
        managerId: 1,
        description: 'وصف للمستودع الجديد',
        isActive: true,
      });
      expect(component.warehouseForm.valid).toBeTrue();
    });

    it('يجب عرض رسالة خطأ عند ترك حقل مطلوب فارغًا', () => {
      const codeControl = component.warehouseForm.get('code');
      codeControl?.markAsTouched();
      fixture.detectChanges();

      const errorMessageElement = fixture.debugElement.query(By.css('#code + .error-message'));
      expect(errorMessageElement).not.toBeNull();
      expect(errorMessageElement.nativeElement.textContent?.trim()).toBe('هذا الحقل مطلوب.');
    });
  });

  // =================================================================================
  // اختبار وضع التعديل ('edit')
  // =================================================================================
  describe('وضع التعديل (Edit Mode)', () => {
    beforeEach(() => {
      component.mode = 'edit';
      component.warehouse = MOCK_WAREHOUSE;
      component.ngOnChanges({
        mode: {
          currentValue: 'edit',
          previousValue: 'create',
          firstChange: false,
          isFirstChange: () => false,
        },
        warehouse: {
          currentValue: MOCK_WAREHOUSE,
          previousValue: null,
          firstChange: false,
          isFirstChange: () => false,
        },
      });
      fixture.detectChanges();
    });

    it('يجب أن يكون عنوان النموذج "تعديل بيانات المستودع"', () => {
      expect(component.formTitle).toBe('تعديل بيانات المستودع');
    });

    it('يجب أن يكون زر الإرسال يحمل نص "حفظ التعديلات"', () => {
      const submitButton: HTMLButtonElement = fixture.debugElement.query(By.css('.btn-primary')).nativeElement;
      expect(submitButton.textContent?.trim()).toBe('حفظ التعديلات');
    });

    it('يجب تعبئة النموذج بقيم المستودع المدخلة', () => {
      expect(component.warehouseForm.get('code')?.value).toBe(MOCK_WAREHOUSE.code);
      expect(component.warehouseForm.get('capacity')?.value).toBe(MOCK_WAREHOUSE.capacity);
    });

    it('يجب أن يكون النموذج صالحًا في البداية (بافتراض أن البيانات المدخلة صحيحة)', () => {
      expect(component.warehouseForm.valid).toBeTrue();
    });
  });

  // =================================================================================
  // اختبار المخرجات (Events)
  // =================================================================================
  it('يجب أن ينبعث formSubmit عند إرسال نموذج صالح', () => {
    spyOn(component.formSubmit, 'emit');

    component.warehouseForm.setValue({
      code: 'TEST',
      nameAr: 'اختبار',
      nameEn: 'Test',
      location: 'موقع',
      address: 'عنوان',
      capacity: 10,
      managerId: 1,
      description: 'وصف',
      isActive: true,
    });

    component.onSubmit();
    expect(component.formSubmit.emit).toHaveBeenCalled();
    const emittedValue = component.formSubmit.emit.calls.first().args[0];
    expect(emittedValue.code).toBe('TEST');
    expect(emittedValue.managerId).toBe(1); // التأكد من تحويله إلى رقم
  });

  it('يجب أن ينبعث formCancel عند النقر على زر الإلغاء', () => {
    spyOn(component.formCancel, 'emit');
    const cancelButton: HTMLButtonElement = fixture.debugElement.query(By.css('.btn-secondary')).nativeElement;

    cancelButton.click();
    expect(component.formCancel.emit).toHaveBeenCalled();
  });
});
