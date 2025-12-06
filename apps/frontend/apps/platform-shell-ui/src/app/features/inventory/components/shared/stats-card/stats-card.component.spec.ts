// /home/ubuntu/stats-card.component.spec.ts

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { StatsCardComponent, StatsCardColor, StatsCardTrend } from './stats-card.component';
import { By } from '@angular/platform-browser';

/**
 * مجموعة اختبارات لمكون StatsCardComponent
 */
describe('StatsCardComponent', () => {
  let component: StatsCardComponent;
  let fixture: ComponentFixture<StatsCardComponent>;

  // تهيئة بيئة الاختبار قبل كل اختبار
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsCardComponent], // بما أنه مكون مستقل (standalone)
    }).compileComponents();

    fixture = TestBed.createComponent(StatsCardComponent);
    component = fixture.componentInstance;
    // تعيين مدخل إلزامي
    component.title = 'إجمالي المبيعات';
    fixture.detectChanges(); // تفعيل دورة الكشف عن التغييرات
  });

  // 1. اختبار إنشاء المكون
  it('يجب أن يتم إنشاء المكون بنجاح', () => {
    expect(component).toBeTruthy();
  });

  // 2. اختبار المدخلات الأساسية
  it('يجب أن يعرض العنوان والقيمة بشكل صحيح', () => {
    const testTitle = 'المستخدمون الجدد';
    const testValue = 1500;
    component.title = testTitle;
    component.value = testValue;
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(By.css('.card-title')).nativeElement;
    const valueElement = fixture.debugElement.query(By.css('.card-value')).nativeElement;

    expect(titleElement.textContent).toContain(testTitle);
    expect(valueElement.textContent.trim()).toBe(testValue.toString());
  });

  // 3. اختبار مؤشر الاتجاه (Trend)
  it('يجب أن يعرض أيقونة الاتجاه الصحيحة للاتجاه الصاعد (up)', () => {
    component.trend = 'up';
    fixture.detectChanges();
    expect(component.trendIcon).toBe('arrow_upward');
    const trendElement = fixture.debugElement.query(By.css('.trend-indicator'));
    expect(trendElement).toBeTruthy();
    expect(trendElement.nativeElement.classList).toContain('trend-up');
  });

  it('يجب أن يعرض أيقونة الاتجاه الصحيحة للاتجاه الهابط (down)', () => {
    component.trend = 'down';
    fixture.detectChanges();
    expect(component.trendIcon).toBe('arrow_downward');
    const trendElement = fixture.debugElement.query(By.css('.trend-indicator'));
    expect(trendElement).toBeTruthy();
    expect(trendElement.nativeElement.classList).toContain('trend-down');
  });

  // 4. اختبار حالة التحميل (Loading)
  it('يجب أن يعرض هيكل التحميل (skeleton) عندما تكون loading = true', () => {
    component.loading = true;
    fixture.detectChanges();
    const skeletonElement = fixture.debugElement.query(By.css('.skeleton-content'));
    const contentElement = fixture.debugElement.query(By.css('.card-content'));

    expect(skeletonElement).toBeTruthy();
    expect(contentElement).toBeFalsy();
    expect(fixture.debugElement.query(By.css('.stats-card')).nativeElement.classList).toContain('loading');
  });

  // 5. اختبار النقر (Clickable) والمخرج (Output)
  it('يجب أن يطلق حدث cardClick عند النقر إذا كانت clickable = true', () => {
    component.clickable = true;
    let clicked = false;
    component.cardClick.subscribe(() => (clicked = true));
    fixture.detectChanges();

    const cardElement = fixture.debugElement.query(By.css('.stats-card'));
    cardElement.nativeElement.click();

    expect(clicked).toBeTrue();
    expect(cardElement.nativeElement.classList).toContain('clickable');
  });

  it('يجب ألا يطلق حدث cardClick عند النقر إذا كانت clickable = false', () => {
    component.clickable = false;
    let clicked = false;
    component.cardClick.subscribe(() => (clicked = true));
    fixture.detectChanges();

    const cardElement = fixture.debugElement.query(By.css('.stats-card'));
    cardElement.nativeElement.click();

    expect(clicked).toBeFalse();
    expect(cardElement.nativeElement.classList).not.toContain('clickable');
  });

  it('يجب ألا يطلق حدث cardClick عند النقر إذا كانت loading = true', () => {
    component.clickable = true;
    component.loading = true;
    let clicked = false;
    component.cardClick.subscribe(() => (clicked = true));
    fixture.detectChanges();

    const cardElement = fixture.debugElement.query(By.css('.stats-card'));
    cardElement.nativeElement.click();

    expect(clicked).toBeFalse();
  });

  // 6. اختبار تأثير الوميض عند تغيير القيمة (RxJS logic)
  it('يجب أن يتم تفعيل وإلغاء تفعيل تأثير الوميض عند تغيير القيمة', fakeAsync(() => {
    // القيمة الأولية
    component.value = 100;
    fixture.detectChanges();

    // تغيير القيمة
    component.value = 200;
    fixture.detectChanges();

    // يجب أن يكون الوميض مفعلاً مباشرة بعد التغيير
    expect(component.valueChange$.value).toBeTrue();
    let valueElement = fixture.debugElement.query(By.css('.card-value'));
    expect(valueElement.nativeElement.classList).toContain('value-changed');

    // الانتظار لمدة 500 مللي ثانية (كما هو محدد في switchMap(timer(500)))
    tick(500);
    fixture.detectChanges();

    // يجب أن يتم إلغاء تفعيل الوميض بعد انتهاء المؤقت
    expect(component.valueChange$.value).toBeFalse();
    valueElement = fixture.debugElement.query(By.css('.card-value'));
    expect(valueElement.nativeElement.classList).not.toContain('value-changed');
  }));
});
