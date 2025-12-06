import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WarehouseStatsCardComponent } from './warehouse-stats-card.component';
import { Warehouse } from '../inventory.models';
import { By } from '@angular/platform-browser';

describe('WarehouseStatsCardComponent', () => {
  let component: WarehouseStatsCardComponent;
  let fixture: ComponentFixture<WarehouseStatsCardComponent>;

  // بيانات وهمية للاختبار
  const mockWarehouse: Warehouse = {
    id: 1,
    name: 'المستودع الرئيسي',
    location: 'الرياض، المنطقة الصناعية',
    capacity: 1000,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseStatsCardComponent], // بما أنه مكون مستقل
    }).compileComponents();

    fixture = TestBed.createComponent(WarehouseStatsCardComponent);
    component = fixture.componentInstance;

    // تعيين المدخلات الافتراضية
    component.warehouse = mockWarehouse;
    component.totalItems = 500;
    component.totalValue = 1000000;
    component.occupancyRate = 50;
    component.loading = false;
    component.clickable = false;

    fixture.detectChanges(); // تشغيل دورة الكشف عن التغييرات الأولية
  });

  it('يجب إنشاء المكون بنجاح', () => {
    expect(component).toBeTruthy();
  });

  // اختبار عرض البيانات
  it('يجب عرض اسم وموقع المستودع بشكل صحيح', () => {
    const nameElement = fixture.debugElement.query(By.css('.warehouse-name')).nativeElement;
    const locationElement = fixture.debugElement.query(By.css('.warehouse-location')).nativeElement;
    expect(nameElement.textContent).toContain(mockWarehouse.name);
    expect(locationElement.textContent).toContain(mockWarehouse.location);
  });

  it('يجب عرض إجمالي الأصناف والقيمة الإجمالية بشكل صحيح', () => {
    const itemsElement = fixture.debugElement.queryAll(By.css('.stat-value'))[0].nativeElement;
    const valueElement = fixture.debugElement.queryAll(By.css('.stat-value'))[1].nativeElement;

    // نتحقق من وجود القيمة (التنسيق قد يختلف قليلاً حسب إعدادات Locale)
    expect(itemsElement.textContent).toContain('500');
    expect(valueElement.textContent).toContain('1,000,000'); // أو 1,000,000 SAR
  });

  // اختبار منطق لون نسبة الإشغال
  it('يجب أن يكون لون الإشغال أخضر عندما تكون النسبة أقل من 70%', () => {
    component.occupancyRate = 69;
    expect(component.occupancyColor).toBe('green');
    fixture.detectChanges();
    const chartElement = fixture.debugElement.query(By.css('.occupancy-rate-chart')).nativeElement;
    expect(chartElement.classList).toContain('green');
  });

  it('يجب أن يكون لون الإشغال أصفر عندما تكون النسبة بين 70% و 90%', () => {
    component.occupancyRate = 85;
    expect(component.occupancyColor).toBe('yellow');
    fixture.detectChanges();
    const chartElement = fixture.debugElement.query(By.css('.occupancy-rate-chart')).nativeElement;
    expect(chartElement.classList).toContain('yellow');
  });

  it('يجب أن يكون لون الإشغال أحمر عندما تكون النسبة أكبر من 90%', () => {
    component.occupancyRate = 91;
    expect(component.occupancyColor).toBe('red');
    fixture.detectChanges();
    const chartElement = fixture.debugElement.query(By.css('.occupancy-rate-chart')).nativeElement;
    expect(chartElement.classList).toContain('red');
  });

  // اختبار حالة التحميل (Loading State)
  it('يجب عرض Skeleton Loader وإخفاء المحتوى عند loading=true', () => {
    component.loading = true;
    fixture.detectChanges();

    const skeletonElement = fixture.debugElement.query(By.css('.skeleton-header'));
    const contentElement = fixture.debugElement.query(By.css('.card-header'));

    expect(skeletonElement).toBeTruthy();
    expect(contentElement).toBeFalsy();
  });

  // اختبار قابلية النقر (Clickable) وإطلاق الحدث
  it('يجب إطلاق حدث cardClick عند النقر إذا كان clickable=true', () => {
    component.clickable = true;
    fixture.detectChanges();

    spyOn(component.cardClick, 'emit');

    const cardElement = fixture.debugElement.query(By.css('.warehouse-stats-card')).nativeElement;
    cardElement.click();

    expect(component.cardClick.emit).toHaveBeenCalledWith(mockWarehouse);
  });

  it('يجب عدم إطلاق حدث cardClick عند النقر إذا كان clickable=false', () => {
    component.clickable = false;
    fixture.detectChanges();

    spyOn(component.cardClick, 'emit');

    const cardElement = fixture.debugElement.query(By.css('.warehouse-stats-card')).nativeElement;
    cardElement.click();

    expect(component.cardClick.emit).not.toHaveBeenCalled();
  });

  it('يجب عدم إطلاق حدث cardClick عند النقر إذا كان loading=true', () => {
    component.clickable = true;
    component.loading = true;
    fixture.detectChanges();

    spyOn(component.cardClick, 'emit');

    const cardElement = fixture.debugElement.query(By.css('.warehouse-stats-card')).nativeElement;
    cardElement.click();

    expect(component.cardClick.emit).not.toHaveBeenCalled();
  });
});
