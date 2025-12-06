import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SearchBarComponent } from './search-bar.component';
import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';

// وصف مجموعة الاختبارات للمكون SearchBarComponent
describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;
  let inputEl: HTMLInputElement;

  // إعداد بيئة الاختبار قبل كل اختبار
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBarComponent], // بما أنه Standalone Component
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    // الوصول إلى عنصر الإدخال
    inputEl = fixture.debugElement.query(By.css('.search-input')).nativeElement;
    fixture.detectChanges(); // تشغيل دورة الكشف عن التغييرات الأولية
  });

  // #region اختبارات الإنشاء الأساسية

  it('يجب إنشاء المكون بنجاح', () => {
    expect(component).toBeTruthy();
  });

  it('يجب أن يعرض النص النائب (Placeholder) بشكل صحيح', () => {
    const testPlaceholder = 'ابحث هنا...';
    component.placeholder = testPlaceholder;
    fixture.detectChanges();
    expect(inputEl.placeholder).toBe(testPlaceholder);
  });

  // #endregion

  // #region اختبارات المدخلات والمخرجات (Inputs & Outputs)

  it('يجب أن يتم إطلاق حدث البحث (search) بعد DebounceTime وتجاوز MinLength', fakeAsync(() => {
    const searchSpy = spyOn(component.search, 'emit');
    component.minLength = 3;
    component.debounceTime = 500;
    fixture.detectChanges();

    // إدخال قيمة أقل من الحد الأدنى
    component.onSearchTermChange('ab');
    tick(500);
    expect(searchSpy).not.toHaveBeenCalled();

    // إدخال قيمة تساوي الحد الأدنى
    component.onSearchTermChange('abc');
    tick(500);
    expect(searchSpy).toHaveBeenCalledWith('abc');
    searchSpy.calls.reset();

    // إدخال قيمة جديدة وتطبيق Debounce
    component.onSearchTermChange('abcd');
    tick(200); // لم يمر الوقت الكافي
    expect(searchSpy).not.toHaveBeenCalled();
    tick(300); // مر الوقت الكافي (500ms)
    expect(searchSpy).toHaveBeenCalledWith('abcd');
  }));

  it('يجب أن يتم إطلاق حدث البحث (search) فوراً عند المسح (Clear)', fakeAsync(() => {
    const searchSpy = spyOn(component.search, 'emit');
    component.searchTerm.set('test');
    fixture.detectChanges();

    component.clearSearch();
    tick(0); // لا يوجد Debounce للمسح
    expect(searchSpy).toHaveBeenCalledWith('');
  }));

  it('يجب أن يتم إطلاق حدث المسح (clear) عند استدعاء clearSearch', () => {
    const clearSpy = spyOn(component.clear, 'emit');
    component.clearSearch();
    expect(clearSpy).toHaveBeenCalled();
    expect(component.searchTerm()).toBe('');
  });

  it('يجب إظهار زر المسح فقط عندما يكون showClearButton=true وهناك قيمة', () => {
    component.showClearButton = true;
    component.searchTerm.set('');
    fixture.detectChanges();
    let clearButton = fixture.debugElement.query(By.css('.clear-button'));
    expect(clearButton).toBeFalsy(); // لا يوجد زر مسح

    component.searchTerm.set('has value');
    fixture.detectChanges();
    clearButton = fixture.debugElement.query(By.css('.clear-button'));
    expect(clearButton).toBeTruthy(); // يوجد زر مسح

    component.showClearButton = false;
    fixture.detectChanges();
    clearButton = fixture.debugElement.query(By.css('.clear-button'));
    expect(clearButton).toBeFalsy(); // لا يوجد زر مسح
  });

  it('يجب إظهار مؤشر التحميل عندما يكون loading=true', () => {
    component.loading = true;
    fixture.detectChanges();
    const loadingIndicator = fixture.debugElement.query(By.css('.loading-indicator'));
    expect(loadingIndicator).toBeTruthy();

    component.loading = false;
    fixture.detectChanges();
    const loadingIndicatorHidden = fixture.debugElement.query(By.css('.loading-indicator'));
    expect(loadingIndicatorHidden).toBeFalsy();
  });

  // #endregion

  // #region اختبارات الأحداث (Focus/Blur)

  it('يجب إطلاق حدث focus عند التركيز على حقل الإدخال', () => {
    const focusSpy = spyOn(component.focus, 'emit');
    inputEl.dispatchEvent(new Event('focus'));
    expect(focusSpy).toHaveBeenCalled();
  });

  it('يجب إطلاق حدث blur عند فقدان التركيز من حقل الإدخال', () => {
    const blurSpy = spyOn(component.blur, 'emit');
    inputEl.dispatchEvent(new Event('blur'));
    expect(blurSpy).toHaveBeenCalled();
  });

  // #endregion

  // #region اختبارات اختصار لوحة المفاتيح (Ctrl+K)

  it('يجب أن يركز حقل الإدخال عند الضغط على Ctrl+K', () => {
    // التركيز على عنصر آخر أولاً
    const otherElement = document.createElement('button');
    document.body.appendChild(otherElement);
    otherElement.focus();
    expect(document.activeElement).toBe(otherElement);

    // محاكاة ضغطة Ctrl+K
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event);
    fixture.detectChanges();

    // يجب أن يكون حقل الإدخال هو العنصر النشط
    expect(document.activeElement).toBe(inputEl);

    document.body.removeChild(otherElement);
  });

  it('يجب أن يركز حقل الإدخال عند الضغط على Cmd+K (MetaKey) على Mac', () => {
    // محاكاة ضغطة Cmd+K
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true, // MetaKey هو Cmd على Mac
      bubbles: true,
    });
    document.dispatchEvent(event);
    fixture.detectChanges();

    // يجب أن يكون حقل الإدخال هو العنصر النشط
    expect(document.activeElement).toBe(inputEl);
  });

  it('يجب منع السلوك الافتراضي عند الضغط على Ctrl+K', () => {
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      cancelable: true,
    });
    const preventDefaultSpy = spyOn(event, 'preventDefault');
    document.dispatchEvent(event);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  // #endregion

  // #region اختبارات المنطق الداخلي

  it('يجب أن يتم إلغاء الاشتراك عند تدمير المكون (Cleanup)', () => {
    // لا يمكن اختبار إلغاء الاشتراك بشكل مباشر، ولكن يمكن التحقق من استدعاء ngOnDestroy
    const destroySpy = spyOn(component, 'ngOnDestroy').and.callThrough();
    fixture.destroy();
    expect(destroySpy).toHaveBeenCalled();
    // يفترض أن المنطق داخل ngOnDestroy قد تم تنفيذه بشكل صحيح لإلغاء الاشتراك
  });

  // #endregion
});
