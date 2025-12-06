import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

/**
 * @description مجموعة اختبارات لمكون PaginationComponent.
 */
describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  // تهيئة بيئة الاختبار
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent, FormsModule] // تضمين المكون والموديل المطلوب
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    // تعيين قيم افتراضية للمدخلات
    component.totalItems = 100;
    component.pageSize = 10;
    component.currentPage = 1;
    component.pageSizeOptions = [10, 25, 50];
    fixture.detectChanges(); // تشغيل دورة الكشف عن التغييرات
  });

  /**
   * @description اختبار إنشاء المكون بنجاح.
   */
  it('يجب إنشاء المكون بنجاح', () => {
    expect(component).toBeTruthy();
  });

  /**
   * @description اختبار حساب العدد الكلي للصفحات.
   */
  it('يجب حساب العدد الكلي للصفحات بشكل صحيح', () => {
    // 100 عنصر / 10 في الصفحة = 10 صفحات
    expect(component.totalPages).toBe(10);

    component.totalItems = 101;
    component.pageSize = 10;
    component.calculatePagination();
    // 101 عنصر / 10 في الصفحة = 10.1 -> 11 صفحة
    expect(component.totalPages).toBe(11);
  });

  /**
   * @description اختبار وظيفة الانتقال إلى صفحة (goToPage) وانبعاث الحدث.
   */
  it('يجب أن ينتقل إلى الصفحة المحددة وينبعث حدث pageChange', () => {
    spyOn(component.pageChange, 'emit'); // التجسس على انبعاث الحدث

    component.goToPage(5);
    fixture.detectChanges();

    expect(component.currentPage).toBe(5);
    expect(component.pageChange.emit).toHaveBeenCalledWith(5);
  });

  /**
   * @description اختبار أزرار التنقل (السابق/التالي).
   */
  it('يجب أن يعمل زر الصفحة التالية (nextPage) بشكل صحيح', () => {
    spyOn(component, 'goToPage');
    component.currentPage = 5;
    component.nextPage();
    expect(component.goToPage).toHaveBeenCalledWith(6);
  });

  it('يجب أن يعمل زر الصفحة السابقة (prevPage) بشكل صحيح', () => {
    spyOn(component, 'goToPage');
    component.currentPage = 5;
    component.prevPage();
    expect(component.goToPage).toHaveBeenCalledWith(4);
  });

  /**
   * @description اختبار أزرار الأولى/الأخيرة.
   */
  it('يجب أن يعمل زر الصفحة الأولى (firstPage) بشكل صحيح', () => {
    spyOn(component, 'goToPage');
    component.currentPage = 5;
    component.firstPage();
    expect(component.goToPage).toHaveBeenCalledWith(1);
  });

  it('يجب أن يعمل زر الصفحة الأخيرة (lastPage) بشكل صحيح', () => {
    spyOn(component, 'goToPage');
    component.currentPage = 5;
    component.lastPage();
    // totalPages = 10
    expect(component.goToPage).toHaveBeenCalledWith(10);
  });

  /**
   * @description اختبار تغيير حجم الصفحة (onPageSizeChange).
   */
  it('يجب أن ينبعث حدث pageSizeChange عند تغيير حجم الصفحة', () => {
    spyOn(component.pageSizeChange, 'emit');
    const selectElement = fixture.debugElement.query(By.css('#pageSizeSelect')).nativeElement;

    // محاكاة تغيير القيمة إلى 25
    selectElement.value = '25';
    selectElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.pageSize).toBe(25);
    expect(component.currentPage).toBe(1); // يجب أن تعود الصفحة إلى 1
    expect(component.pageSizeChange.emit).toHaveBeenCalledWith(25);
  });

  /**
   * @description اختبار عرض أرقام الصفحات مع علامات الحذف (...).
   */
  it('يجب عرض أرقام الصفحات مع علامات الحذف بشكل صحيح', () => {
    component.totalItems = 100; // 10 صفحات
    component.pageSize = 5; // 20 صفحة
    component.currentPage = 10; // الصفحة العاشرة
    component.pageRange = 2; // نطاق العرض
    component.calculatePagination();
    fixture.detectChanges();

    // يجب أن تكون مصفوفة الصفحات: [1, '...', 8, 9, 10, 11, 12, '...', 20]
    // (10 - 2 = 8), (10 + 2 = 12)
    expect(component.pages).toEqual([1, '...', 8, 9, 10, 11, 12, '...', 20]);

    // اختبار عدم وجود علامات حذف إذا كانت الصفحات قليلة
    component.totalItems = 50;
    component.pageSize = 10; // 5 صفحات
    component.currentPage = 3;
    component.calculatePagination();
    expect(component.pages).toEqual([1, 2, 3, 4, 5]);
  });

  /**
   * @description اختبار القفز إلى صفحة (onJumpToPage).
   */
  it('يجب أن ينتقل إلى الصفحة المحددة عند القفز إلى صفحة', () => {
    spyOn(component, 'goToPage');
    component.jumpToPageNumber = 7;
    component.onJumpToPage();
    expect(component.goToPage).toHaveBeenCalledWith(7);
  });

  it('يجب أن يتجاهل القفز إلى صفحة إذا كانت القيمة غير صالحة', () => {
    spyOn(component, 'goToPage');
    component.currentPage = 5;
    component.jumpToPageNumber = 15; // خارج النطاق (1-10)
    component.onJumpToPage();
    expect(component.goToPage).not.toHaveBeenCalled();
    expect(component.jumpToPageNumber).toBe(5); // يجب أن تعود القيمة إلى الصفحة الحالية
  });

  /**
   * @description اختبار عرض نطاق العناصر (itemRange).
   */
  it('يجب عرض نطاق العناصر بشكل صحيح', () => {
    component.totalItems = 100;
    component.pageSize = 10;
    component.currentPage = 1;
    expect(component.itemRange).toBe('1-10');

    component.currentPage = 5;
    expect(component.itemRange).toBe('41-50');

    component.currentPage = 10;
    expect(component.itemRange).toBe('91-100');

    component.totalItems = 95;
    component.currentPage = 10; // الصفحة الأخيرة
    component.calculatePagination();
    expect(component.itemRange).toBe('91-95');
  });

  /**
   * @description اختبار حالة عدم وجود عناصر.
   */
  it('يجب عرض رسالة "لا توجد عناصر" عند totalItems = 0', () => {
    component.totalItems = 0;
    component.calculatePagination();
    fixture.detectChanges();
    const infoElement = fixture.debugElement.query(By.css('.total-items')).nativeElement;
    expect(infoElement.textContent).toContain('لا توجد عناصر للعرض');
  });

  /**
   * @description اختبار التنقل باستخدام لوحة المفاتيح (HostListener).
   */
  it('يجب أن ينتقل إلى الصفحة التالية عند ضغط ArrowRight', () => {
    spyOn(component, 'nextPage');
    const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    component.handleKeyboardEvent(event);
    expect(component.nextPage).toHaveBeenCalled();
  });

  it('يجب أن ينتقل إلى الصفحة السابقة عند ضغط ArrowLeft', () => {
    spyOn(component, 'prevPage');
    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    component.handleKeyboardEvent(event);
    expect(component.prevPage).toHaveBeenCalled();
  });

  it('يجب أن ينتقل إلى الصفحة الأولى عند ضغط Home', () => {
    spyOn(component, 'firstPage');
    const event = new KeyboardEvent('keydown', { key: 'Home' });
    component.handleKeyboardEvent(event);
    expect(component.firstPage).toHaveBeenCalled();
  });

  it('يجب أن ينتقل إلى الصفحة الأخيرة عند ضغط End', () => {
    spyOn(component, 'lastPage');
    const event = new KeyboardEvent('keydown', { key: 'End' });
    component.handleKeyboardEvent(event);
    expect(component.lastPage).toHaveBeenCalled();
  });
});
