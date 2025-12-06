// warehouses-page.component.spec.ts

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { WarehousesPageComponent, InventoryService, ToastService, Warehouse, WarehouseStats } from './warehouses-page.component';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

// محاكاة للخدمات والمكونات
class MockInventoryService {
  getWarehouses = () => of([
    { id: 1, name: 'W1', location: 'L1', isActive: true, totalValue: 1000, itemCount: 10, lastUpdated: new Date() }
  ] as Warehouse[]);
  getWarehouseStats = () => of({ totalWarehouses: 1, activeWarehouses: 1, totalInventoryValue: 1000 } as WarehouseStats);
  deleteWarehouse = (id: number) => of(undefined);
}

class MockToastService {
  showSuccess = jasmine.createSpy('showSuccess');
  showError = jasmine.createSpy('showError');
}

class MockMatDialog {
  open = jasmine.createSpy('open').and.returnValue({
    afterClosed: () => of(true) // افتراض نجاح الإغلاق
  } as MatDialogRef<any>);
}

describe('WarehousesPageComponent', () => {
  let component: WarehousesPageComponent;
  let fixture: ComponentFixture<WarehousesPageComponent>;
  let inventoryService: MockInventoryService;
  let toastService: MockToastService;
  let dialog: MockMatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehousesPageComponent, MatDialogModule, NoopAnimationsModule],
      providers: [
        { provide: InventoryService, useClass: MockInventoryService },
        { provide: ToastService, useClass: MockToastService },
        { provide: MatDialog, useClass: MockMatDialog },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WarehousesPageComponent);
    component = fixture.componentInstance;
    inventoryService = TestBed.inject(InventoryService) as unknown as MockInventoryService;
    toastService = TestBed.inject(ToastService) as unknown as MockToastService;
    dialog = TestBed.inject(MatDialog) as unknown as MockMatDialog;

    // تهيئة البيانات الأولية
    fixture.detectChanges();
  });

  it('يجب إنشاء المكون بنجاح', () => {
    expect(component).toBeTruthy();
  });

  it('يجب تحميل البيانات والإحصائيات عند التهيئة', fakeAsync(() => {
    // Spy على خدمات جلب البيانات
    const getWarehousesSpy = spyOn(inventoryService, 'getWarehouses').and.callThrough();
    const getStatsSpy = spyOn(inventoryService, 'getWarehouseStats').and.callThrough();

    // إعادة تهيئة المكون بعد التجسس
    component.ngOnInit();
    tick(1); // لضمان تشغيل switchMap

    // يجب أن تكون حالة التحميل صحيحة في البداية
    component.loading$.subscribe(loading => expect(loading).toBeTrue());

    // محاكاة اكتمال الطلبات
    tick(500); // تأخير محاكاة الخدمة

    // يجب أن تكون حالة التحميل خاطئة بعد اكتمال الطلبات
    component.loading$.subscribe(loading => expect(loading).toBeFalse());

    // يجب أن يتم استدعاء الخدمات
    expect(getWarehousesSpy).toHaveBeenCalled();
    expect(getStatsSpy).toHaveBeenCalled();

    // يجب أن يتم تحديث قائمة المستودعات والإحصائيات
    component.warehouses$.subscribe(warehouses => expect(warehouses.length).toBe(1));
    component.stats$.subscribe(stats => expect(stats?.totalWarehouses).toBe(1));
  }));

  it('يجب معالجة خطأ جلب البيانات وعرض إشعار خطأ', fakeAsync(() => {
    // إعداد الخدمة لإرجاع خطأ
    spyOn(inventoryService, 'getWarehouses').and.returnValue(throwError(() => new Error('API Error')));
    spyOn(inventoryService, 'getWarehouseStats').and.returnValue(of({ totalWarehouses: 0, activeWarehouses: 0, totalInventoryValue: 0 }));

    // إعادة تهيئة المكون
    component.ngOnInit();
    tick(1);

    // محاكاة اكتمال الطلبات
    tick(500);

    // يجب أن تكون حالة التحميل خاطئة
    component.loading$.subscribe(loading => expect(loading).toBeFalse());

    // يجب أن يتم تحديث رسالة الخطأ
    component.error$.subscribe(error => expect(error).toContain('فشل في جلب بيانات المستودعات'));

    // يجب أن يتم عرض إشعار خطأ
    expect(toastService.showError).toHaveBeenCalled();
  }));

  it('يجب تحديث المستودع المحدد عند استدعاء onWarehouseSelected', fakeAsync(() => {
    const mockWarehouse: Warehouse = { id: 2, name: 'W2', location: 'L2', isActive: true, totalValue: 500, itemCount: 5, lastUpdated: new Date() };
    component.onWarehouseSelected(mockWarehouse);

    component.selectedWarehouse$.subscribe(selected => expect(selected).toEqual(mockWarehouse));
  }));

  it('يجب فتح نموذج الإضافة/التعديل عند استدعاء openWarehouseForm وتحديث البيانات عند النجاح', fakeAsync(() => {
    const refreshSpy = spyOn(component, 'refreshData');

    // 1. اختبار الإضافة (بدون تمرير مستودع)
    component.openWarehouseForm();
    tick(); // لانتظار afterClosed

    expect(dialog.open).toHaveBeenCalled();
    expect(toastService.showSuccess).toHaveBeenCalledWith('تم إضافة المستودع بنجاح.');
    expect(refreshSpy).toHaveBeenCalledTimes(1);

    // 2. اختبار التعديل (مع تمرير مستودع)
    const mockWarehouse: Warehouse = { id: 1, name: 'W1', location: 'L1', isActive: true, totalValue: 1000, itemCount: 10, lastUpdated: new Date() };
    component.openWarehouseForm(mockWarehouse);
    tick();

    expect(dialog.open).toHaveBeenCalledWith(jasmine.anything(), {
      width: '600px',
      data: { warehouse: mockWarehouse },
      direction: 'rtl',
    });
    expect(toastService.showSuccess).toHaveBeenCalledWith('تم تعديل المستودع بنجاح.');
    expect(refreshSpy).toHaveBeenCalledTimes(2);
  }));

  it('يجب حذف المستودع عند التأكيد وتحديث البيانات', fakeAsync(() => {
    const mockWarehouse: Warehouse = { id: 1, name: 'W1', location: 'L1', isActive: true, totalValue: 1000, itemCount: 10, lastUpdated: new Date() };
    const deleteSpy = spyOn(inventoryService, 'deleteWarehouse').and.callThrough();
    const refreshSpy = spyOn(component, 'refreshData');
    spyOn(window, 'confirm').and.returnValue(true); // محاكاة التأكيد

    component.deleteWarehouse(mockWarehouse);
    tick(300); // تأخير محاكاة الخدمة

    expect(deleteSpy).toHaveBeenCalledWith(1);
    expect(toastService.showSuccess).toHaveBeenCalled();
    expect(refreshSpy).toHaveBeenCalled();
  }));

  it('يجب عرض إشعار خطأ عند فشل الحذف', fakeAsync(() => {
    const mockWarehouse: Warehouse = { id: 1, name: 'W1', location: 'L1', isActive: true, totalValue: 1000, itemCount: 10, lastUpdated: new Date() };
    spyOn(inventoryService, 'deleteWarehouse').and.returnValue(throwError(() => new Error('Delete Failed')));
    spyOn(window, 'confirm').and.returnValue(true);

    component.deleteWarehouse(mockWarehouse);
    tick(1);

    expect(toastService.showError).toHaveBeenCalled();
  }));

  it('يجب إلغاء جميع الاشتراكات عند ngOnDestroy', () => {
    const unsubscribeSpy = spyOn((component as any).subscriptions, 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
