import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FilterPanelComponent, FilterConfig } from './filter-panel.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// وصف مجموعة الاختبارات لمكون FilterPanelComponent
describe('FilterPanelComponent', () => {
  let component: FilterPanelComponent;
  let fixture: ComponentFixture<FilterPanelComponent>;

  // إعدادات الفلاتر التجريبية
  const mockFilters: FilterConfig[] = [
    { key: 'name', label: 'الاسم', type: 'text', defaultValue: '' },
    { key: 'status', label: 'الحالة', type: 'select', options: [{ label: 'نشط', value: 'active' }, { label: 'غير نشط', value: 'inactive' }], defaultValue: null },
    { key: 'is_admin', label: 'مسؤول', type: 'checkbox', defaultValue: false },
    { key: 'date_from', label: 'من تاريخ', type: 'date', required: true },
  ];

  // تهيئة بيئة الاختبار
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      // المكون مستقل، لذا ندرجه مباشرة
      imports: [FilterPanelComponent, ReactiveFormsModule, CommonModule],
      // لا حاجة لـ declarations أو providers إضافية في هذا المثال البسيط
    }).compileComponents();
  }));

  // إنشاء المكون قبل كل اختبار
  beforeEach(() => {
    fixture = TestBed.createComponent(FilterPanelComponent);
    component = fixture.componentInstance;
    component.filters = mockFilters;
    // تهيئة المكون لضمان بناء النموذج
    fixture.detectChanges();
  });

  // 1. اختبار إنشاء المكون
  it('يجب أن يتم إنشاء المكون بنجاح', () => {
    expect(component).toBeTruthy();
  });

  // 2. اختبار تهيئة النموذج
  it('يجب أن يتم تهيئة النموذج (FormGroup) بشكل صحيح بناءً على إعدادات الفلاتر', () => {
    expect(component.filterForm).toBeDefined();
    expect(Object.keys(component.filterForm.controls).length).toBe(mockFilters.length);
    expect(component.filterForm.get('name')).toBeTruthy();
    expect(component.filterForm.get('status')).toBeTruthy();
    expect(component.filterForm.get('is_admin')).toBeTruthy();
    expect(component.filterForm.get('date_from')).toBeTruthy();
  });

  // 3. اختبار القيم الافتراضية
  it('يجب أن يتم تعيين القيم الافتراضية بشكل صحيح', () => {
    expect(component.filterForm.get('name')?.value).toBe('');
    expect(component.filterForm.get('status')?.value).toBe(null);
    expect(component.filterForm.get('is_admin')?.value).toBe(false);
  });

  // 4. اختبار التحقق من الصحة (Validation)
  it('يجب أن يكون النموذج غير صالح إذا كان حقل مطلوب فارغاً', () => {
    // 'date_from' مطلوب ولا يحتوي على قيمة أولية
    expect(component.filterForm.valid).toBeFalse();
    expect(component.filterForm.get('date_from')?.errors?.['required']).toBeTrue();
  });

  // 5. اختبار الطي/التوسيع
  it('يجب أن تكون اللوحة مطوية افتراضياً إذا كان collapsible = true', () => {
    expect(component.isCollapsed).toBeTrue();
    component.toggleCollapse();
    expect(component.isCollapsed).toBeFalse();
  });

  it('يجب ألا تتغير حالة الطي إذا كان collapsible = false', () => {
    component.collapsible = false;
    component.isCollapsed = true;
    component.toggleCollapse();
    expect(component.isCollapsed).toBeTrue(); // يجب أن تبقى true
  });

  // 6. اختبار حساب الفلاتر النشطة
  it('يجب أن يحسب عدد الفلاتر النشطة بشكل صحيح', () => {
    // لا يوجد فلاتر نشطة في البداية (باستثناء المطلوب)
    component.calculateActiveFilters();
    expect(component.activeFiltersCount).toBe(0);

    // تعيين قيمة لفلتر الاسم
    component.filterForm.get('name')?.setValue('test');
    component.calculateActiveFilters();
    expect(component.activeFiltersCount).toBe(1);

    // تعيين قيمة لفلتر checkbox
    component.filterForm.get('is_admin')?.setValue(true);
    component.calculateActiveFilters();
    expect(component.activeFiltersCount).toBe(2);
  });

  // 7. اختبار إطلاق حدث filterApply
  it('يجب أن يطلق filterApply مع القيم الصحيحة عند تطبيق الفلاتر', () => {
    spyOn(component.filterApply, 'emit');
    // يجب تعيين قيمة للحقل المطلوب أولاً ليصبح النموذج صالحاً
    component.filterForm.get('date_from')?.setValue('2025-01-01');
    component.filterForm.get('name')?.setValue('test');

    component.applyFilters();

    // يجب أن يتم إطلاق الحدث
    expect(component.filterApply.emit).toHaveBeenCalled();
    // يجب أن يحتوي الإخراج على الفلاتر النشطة فقط
    expect(component.filterApply.emit).toHaveBeenCalledWith({
      name: 'test',
      date_from: '2025-01-01'
    });
  });

  // 8. اختبار إعادة تعيين الفلاتر
  it('يجب أن يعيد resetFilters تعيين النموذج إلى القيم الافتراضية ويطلق filterReset', () => {
    spyOn(component.filterReset, 'emit');

    // تعيين قيم مختلفة
    component.filterForm.get('name')?.setValue('changed');
    component.filterForm.get('date_from')?.setValue('2025-01-01');

    component.resetFilters();

    // يجب أن تعود القيم الافتراضية
    expect(component.filterForm.get('name')?.value).toBe('');
    expect(component.filterForm.get('date_from')?.value).toBe(null);
    // يجب أن يتم إطلاق الحدث
    expect(component.filterReset.emit).toHaveBeenCalled();
    // يجب أن يكون عدد الفلاتر النشطة صفر
    expect(component.activeFiltersCount).toBe(0);
  });

  // 9. اختبار مسح جميع الفلاتر
  it('يجب أن يمسح clearAllFilters جميع القيم ويطلق filterChange', () => {
    spyOn(component.filterChange, 'emit');

    // تعيين قيم مختلفة
    component.filterForm.get('name')?.setValue('changed');
    component.filterForm.get('is_admin')?.setValue(true);

    component.clearAllFilters();

    // يجب أن تكون جميع القيم null أو false
    expect(component.filterForm.get('name')?.value).toBe(null);
    expect(component.filterForm.get('is_admin')?.value).toBe(false);
    // يجب أن يتم إطلاق الحدث مع كائن فارغ
    expect(component.filterChange.emit).toHaveBeenCalledWith({});
    // يجب أن يكون عدد الفلاتر النشطة صفر
    expect(component.activeFiltersCount).toBe(0);
  });

  // 10. اختبار إطلاق filterChange عند تغيير قيمة النموذج
  it('يجب أن يطلق filterChange بعد تغيير قيمة النموذج وتأخير (debounce)', waitForAsync(() => {
    spyOn(component.filterChange, 'emit');

    component.filterForm.get('name')?.setValue('new value');
    
    // يجب الانتظار لمدة أطول من debounceTime (300ms)
    fixture.whenStable().then(() => {
      // يجب أن يتم إطلاق الحدث
      expect(component.filterChange.emit).toHaveBeenCalled();
      // يجب أن يحتوي الإخراج على الفلاتر النشطة فقط
      expect(component.filterChange.emit).toHaveBeenCalledWith({ name: 'new value' });
    });
  }));
});
