/*
  ملف: warehouse-list.component.spec.ts
  الوصف: اختبارات الوحدة لمكون قائمة المستودعات (WarehouseListComponent).
  التركيز: اختبار منطق RxJS، معالجة المدخلات والمخرجات، وحساب الإحصائيات.
*/

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WarehouseListComponent, Warehouse } from './warehouse-list.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

// =================================================================================================
// بيانات وهمية للاختبار
// =================================================================================================
const MOCK_WAREHOUSES: Warehouse[] = [
  {
    id: 1,
    name: 'المستودع الرئيسي',
    location: 'الرياض',
    capacity: 1000,
    occupiedSpace: 750,
    totalValue: 500000,
    itemCount: 150,
    items: [],
    occupancyRate: 75,
  },
  {
    id: 2,
    name: 'مستودع جدة الفرعي',
    location: 'جدة',
    capacity: 500,
    occupiedSpace: 100,
    totalValue: 100000,
    itemCount: 50,
    items: [],
    occupancyRate: 20,
  },
];

// =================================================================================================
// إعداد بيئة الاختبار
// =================================================================================================
describe('WarehouseListComponent', () => {
  let component: WarehouseListComponent;
  let fixture: ComponentFixture<WarehouseListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        WarehouseListComponent, // بما أنه مكون مستقل (Standalone)
        CommonModule,
        ReactiveFormsModule,
      ],
      // يمكن إضافة Mock Services هنا إذا لزم الأمر
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseListComponent);
    component = fixture.componentInstance;
    // تعيين المدخلات الافتراضية
    component.warehouses = MOCK_WAREHOUSES;
    fixture.detectChanges(); // تشغيل ngOnInit
  });

  it('يجب إنشاء المكون بنجاح', () => {
    expect(component).toBeTruthy();
  });

  // =================================================================================================
  // اختبار المدخلات والمخرجات
  // =================================================================================================

  it('يجب أن يعرض قائمة المستودعات عند تمريرها كمدخل', (done) => {
    component.filteredWarehouses$.subscribe(warehouses => {
      expect(warehouses.length).toBe(MOCK_WAREHOUSES.length);
      expect(warehouses[0].name).toBe('المستودع الرئيسي');
      done();
    });
  });

  it('يجب أن ينبعث حدث warehouseClick عند النقر على مستودع', () => {
    spyOn(component.warehouseClick, 'emit');
    const mockWarehouse = MOCK_WAREHOUSES[0];
    component.onWarehouseClick(mockWarehouse);
    expect(component.warehouseClick.emit).toHaveBeenCalledWith(mockWarehouse);
  });

  it('يجب أن ينبعث حدث addWarehouse عند استدعاء onAdd', () => {
    spyOn(component.addWarehouse, 'emit');
    component.onAdd();
    expect(component.addWarehouse.emit).toHaveBeenCalled();
  });

  it('يجب أن ينبعث حدث editWarehouse عند استدعاء onEdit', () => {
    spyOn(component.editWarehouse, 'emit');
    const mockWarehouse = MOCK_WAREHOUSES[1];
    component.onEdit(mockWarehouse);
    expect(component.editWarehouse.emit).toHaveBeenCalledWith(mockWarehouse);
  });

  it('يجب أن ينبعث حدث deleteWarehouse عند استدعاء onDelete', () => {
    spyOn(component.deleteWarehouse, 'emit');
    const mockWarehouse = MOCK_WAREHOUSES[1];
    component.onDelete(mockWarehouse);
    expect(component.deleteWarehouse.emit).toHaveBeenCalledWith(mockWarehouse);
  });

  // =================================================================================================
  // اختبار منطق RxJS والتصفية
  // =================================================================================================

  it('يجب أن يقوم بتصفية المستودعات بناءً على مصطلح البحث', (done) => {
    // إدخال مصطلح بحث يطابق المستودع الأول
    component.searchControl.setValue('الرياض');

    // يجب الانتظار قليلاً بسبب debounceTime(300)
    setTimeout(() => {
      component.filteredWarehouses$.subscribe(warehouses => {
        expect(warehouses.length).toBe(1);
        expect(warehouses[0].name).toBe('المستودع الرئيسي');
        done();
      });
    }, 350);
  });

  it('يجب أن يعرض قائمة فارغة إذا لم يكن هناك تطابق', (done) => {
    component.searchControl.setValue('مستودع غير موجود');

    setTimeout(() => {
      component.filteredWarehouses$.subscribe(warehouses => {
        expect(warehouses.length).toBe(0);
        done();
      });
    }, 350);
  });

  // =================================================================================================
  // اختبار حساب الإحصائيات
  // =================================================================================================

  it('يجب أن يحسب الإحصائيات المجمعة بشكل صحيح', (done) => {
    component.statsData$.subscribe(stats => {
      // إجمالي المستودعات
      expect(stats[0].value).toBe(2);
      // إجمالي الأصناف (150 + 50)
      expect(stats[1].value).toBe(200);
      // القيمة الإجمالية (500000 + 100000)
      expect(stats[2].value).toContain('600,000'); // يجب أن يحتوي على القيمة المنسقة
      // متوسط الإشغال ((750+100) / (1000+500)) * 100 = (850/1500) * 100 = 56.66%
      expect(stats[3].value).toBe('56.7%');
      done();
    });
  });

  it('يجب أن يعرض إحصائيات صفرية عند عدم وجود مستودعات', (done) => {
    component.warehouses = [];
    component.ngOnChanges({ warehouses: { currentValue: [], previousValue: MOCK_WAREHOUSES, firstChange: false, isFirstChange: () => false } } as any);
    fixture.detectChanges();

    component.statsData$.subscribe(stats => {
      expect(stats[0].value).toBe(0);
      expect(stats[1].value).toBe(0);
      expect(stats[3].value).toBe('0%');
      done();
    });
  });

  // =================================================================================================
  // اختبار تغيير وضع العرض
  // =================================================================================================

  it('يجب أن ينبعث viewModeChange عند تغيير وضع العرض', () => {
    spyOn(component.viewModeChange, 'emit');
    component.viewModeControl.setValue('grid');
    expect(component.viewModeChange.emit).toHaveBeenCalledWith('grid');
  });

  it('يجب أن يتم تعيين viewModeControl بناءً على مدخل viewMode', () => {
    component.viewMode = 'grid';
    // لا نحتاج لـ fixture.detectChanges() لأن setter يعمل مباشرة
    expect(component.viewModeControl.value).toBe('grid');
  });

  // =================================================================================================
  // اختبار القالب (HTML)
  // =================================================================================================

  it('يجب عرض رسالة التحميل عند loading = true', () => {
    component.loading = true;
    fixture.detectChanges();
    const loadingElement = fixture.debugElement.query(By.css('.loading-overlay'));
    expect(loadingElement).not.toBeNull();
    expect(loadingElement.nativeElement.textContent).toContain('جاري تحميل');
  });

  it('يجب عرض وضع الجدول افتراضياً', () => {
    component.viewModeControl.setValue('table');
    fixture.detectChanges();
    const tableView = fixture.debugElement.query(By.css('.table-view'));
    const gridView = fixture.debugElement.query(By.css('.grid-view'));
    expect(tableView).not.toBeNull();
    expect(gridView).toBeNull();
  });

  it('يجب عرض وضع الشبكة عند التبديل', () => {
    component.viewModeControl.setValue('grid');
    fixture.detectChanges();
    const tableView = fixture.debugElement.query(By.css('.table-view'));
    const gridView = fixture.debugElement.query(By.css('.grid-view'));
    expect(tableView).toBeNull();
    expect(gridView).not.toBeNull();
  });

  it('يجب عرض رسالة "لا توجد بيانات" عند عدم وجود مستودعات', (done) => {
    component.warehouses = [];
    component.ngOnChanges({ warehouses: { currentValue: [], previousValue: MOCK_WAREHOUSES, firstChange: false, isFirstChange: () => false } } as any);
    component.searchControl.setValue(''); // مسح البحث

    component.filteredWarehouses$.subscribe(() => {
      fixture.detectChanges();
      const noDataElement = fixture.debugElement.query(By.css('.no-data-message'));
      expect(noDataElement).not.toBeNull();
      expect(noDataElement.nativeElement.textContent).toContain('لا توجد مستودعات');
      done();
    });
  });
});
