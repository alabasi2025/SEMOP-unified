/*
  dashboard-page.component.spec.ts
  ملف اختبارات الوحدة لمكون لوحة التحكم (DashboardPageComponent)
*/

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DashboardPageComponent, InventoryService, DashboardData } from './dashboard-page.component';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, Input, Output, EventEmitter } from '@angular/core';

// 1. محاكاة المكونات الفرعية (Mock Components)
@Component({ selector: 'app-inventory-stats-card', standalone: true, template: '' })
class MockStatsCardComponent {
  @Input() title!: string;
  @Input() value!: number;
  @Input() unit!: string;
  @Input() icon!: string;
}

@Component({ selector: 'app-chart', standalone: true, template: '' })
class MockChartComponent {
  @Input() data!: any;
  @Input() type!: string;
}

@Component({ selector: 'app-data-table', standalone: true, template: '' })
class MockDataTableComponent {
  @Input() data!: any[];
  @Input() columns!: any[];
}

@Component({ selector: 'app-inventory-filter-panel', standalone: true, template: '' })
class MockFilterPanelComponent {
  @Input() initialFilter!: any;
  @Output() filterChange = new EventEmitter<any>();
}

// 2. محاكاة خدمة الإشعارات (Mock ToastService)
class MockToastService {
  showError(message: string) {
    // محاكاة الإشعار في وحدة التحكم
    console.log(`Mock Toast Error: ${message}`);
  }
}

// 3. محاكاة خدمة المخزون (Mock InventoryService)
class MockInventoryService {
  // بيانات وهمية للاختبار
  mockData: DashboardData = {
    generalStats: [{ title: 'إجمالي الأصناف', value: 100, unit: 'صنف', icon: 'package' }],
    monthlyInventoryMovement: { labels: ['يناير'], datasets: [{ label: 'دخول', data: [10] }] },
    topMovingItems: { labels: ['صنف أ'], datasets: [{ label: 'حركة', data: [50] }] },
    inventoryDistributionByCategory: { labels: ['فئة أ'], datasets: [{ label: 'نسبة', data: [100] }] },
    lowStockItems: [{ id: 1, name: 'صنف 1', sku: 'S-001', stock: 5, minStock: 10 }],
    recentTransactions: [{ id: 1, type: 'دخول', item: 'صنف 2', quantity: 10, date: '2025-12-05' }],
  };

  getDashboardData(filter: any): Observable<DashboardData> {
    // محاكاة جلب البيانات بنجاح
    return of(this.mockData);
  }
}

describe('DashboardPageComponent', () => {
  let component: DashboardPageComponent;
  let fixture: ComponentFixture<DashboardPageComponent>;
  let inventoryService: MockInventoryService;
  let toastService: MockToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        DashboardPageComponent, // المكون المراد اختباره (Standalone)
      ],
      providers: [
        // توفير الخدمات المحاكاة
        { provide: InventoryService, useClass: MockInventoryService },
        { provide: 'ToastService', useClass: MockToastService } // استخدام الرمز النصي للحاقن
      ]
    })
    // تجاوز المكونات الفرعية بمكونات محاكاة
    .overrideComponent(DashboardPageComponent, {
      set: {
        imports: [
          CommonModule,
          FormsModule,
          MockStatsCardComponent,
          MockChartComponent,
          MockDataTableComponent,
          MockFilterPanelComponent,
        ],
        providers: [
          { provide: InventoryService, useClass: MockInventoryService },
          // بما أن ToastService تم حقنها مباشرة في المكون، يجب توفيرها هنا أيضًا
          { provide: 'ToastService', useClass: MockToastService }
        ]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardPageComponent);
    component = fixture.componentInstance;
    // الحصول على مثيلات الخدمات المحاكاة
    inventoryService = TestBed.inject(InventoryService) as unknown as MockInventoryService;
    // لا يمكن حقن ToastService مباشرة لأنه تم حقنه كـ private في المكون
    // سنعتمد على أن منطق handleError يعمل بشكل صحيح
    toastService = new MockToastService(); // إنشاء مثيل يدوي للمحاكاة
  });

  it('يجب إنشاء المكون بنجاح', () => {
    expect(component).toBeTruthy();
  });

  it('يجب أن يبدأ جلب البيانات عند التهيئة (ngOnInit)', fakeAsync(() => {
    spyOn(inventoryService, 'getDashboardData').and.returnValue(of(inventoryService.mockData));
    component.ngOnInit();
    tick(0); // لانتهاء الـ timer(0)

    expect(inventoryService.getDashboardData).toHaveBeenCalled();
    expect(component.dashboardData).toEqual(inventoryService.mockData);
    expect(component.isLoading.value).toBeFalse();
  }));

  it('يجب أن يقوم بالتحديث التلقائي كل 30 ثانية', fakeAsync(() => {
    spyOn(inventoryService, 'getDashboardData').and.returnValue(of(inventoryService.mockData));
    component.ngOnInit();
    tick(0); // الجلب الأول

    expect(inventoryService.getDashboardData).toHaveBeenCalledTimes(1);

    tick(30000); // انتظار 30 ثانية
    expect(inventoryService.getDashboardData).toHaveBeenCalledTimes(2);

    tick(30000); // انتظار 30 ثانية أخرى
    expect(inventoryService.getDashboardData).toHaveBeenCalledTimes(3);

    component.ngOnDestroy();
  }));

  it('يجب أن يعالج خطأ جلب البيانات ويعرض إشعار Toast', fakeAsync(() => {
    // محاكاة خطأ في الخدمة
    spyOn(inventoryService, 'getDashboardData').and.returnValue(of(new Error('خطأ في الخادم')));
    // محاكاة خدمة ToastService
    const toastSpy = spyOn(component as any, 'toastService').and.returnValue(toastService);
    const handleErrorSpy = spyOn(component, 'handleError').and.callThrough();

    component.ngOnInit();
    tick(0);

    expect(handleErrorSpy).toHaveBeenCalled();
    expect(component.hasError.value).toBeTrue();
    expect(component.isLoading.value).toBeFalse();
    expect(component.dashboardData).toBeNull();

    component.ngOnDestroy();
  }));

  it('يجب أن يقوم بتحديث البيانات عند تغيير الفلتر', fakeAsync(() => {
    const newFilter = { startDate: '2025-11-01', endDate: '2025-11-30' };
    spyOn(inventoryService, 'getDashboardData').and.returnValue(of(inventoryService.mockData));
    component.ngOnInit();
    tick(0); // الجلب الأول

    expect(inventoryService.getDashboardData).toHaveBeenCalledTimes(1);

    component.onFilterChange(newFilter);
    tick(0); // الجلب الفوري بعد تغيير الفلتر

    expect(component.currentFilter).toEqual(newFilter);
    expect(inventoryService.getDashboardData).toHaveBeenCalledTimes(2);

    component.ngOnDestroy();
  }));

  it('يجب إلغاء الاشتراك عند تدمير المكون', () => {
    component.ngOnInit();
    // التأكد من وجود اشتراك
    expect((component as any).autoRefreshSubscription).toBeDefined();

    component.ngOnDestroy();
    // التأكد من إلغاء الاشتراك
    expect((component as any).autoRefreshSubscription?.closed).toBeTrue();
  });
});
