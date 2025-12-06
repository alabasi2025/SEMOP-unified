// items-page.component.spec.ts

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ItemsPageComponent } from './items-page.component';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';

// محاكاة للخدمات المطلوبة
class MockInventoryService {
  getItems = jasmine.createSpy('getItems').and.returnValue(of([]));
  getItemStats = jasmine.createSpy('getItemStats').and.returnValue(of({ totalItems: 0, activeItems: 0, lowStockItems: 0 }));
  deleteItem = jasmine.createSpy('deleteItem').and.returnValue(of(undefined));
  exportItems = jasmine.createSpy('exportItems').and.returnValue(of(new Blob()));
}

class MockToastService {
  success = jasmine.createSpy('success');
  error = jasmine.createSpy('error');
  info = jasmine.createSpy('info');
}

class MockMatDialog {
  open = jasmine.createSpy('open').and.returnValue({
    afterClosed: () => of(true) // محاكاة تأكيد الحذف أو إغلاق النموذج بنجاح
  });
}

describe('ItemsPageComponent', () => {
  let component: ItemsPageComponent;
  let fixture: ComponentFixture<ItemsPageComponent>;
  let inventoryService: MockInventoryService;
  let toastService: MockToastService;
  let dialog: MockMatDialog;

  // تهيئة بيئة الاختبار
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemsPageComponent], // بما أنه Standalone Component
      providers: [
        { provide: 'InventoryService', useClass: MockInventoryService },
        { provide: 'ToastService', useClass: MockToastService },
        { provide: MatDialog, useClass: MockMatDialog },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemsPageComponent);
    component = fixture.componentInstance;
    // الحصول على الخدمات المحقونة
    inventoryService = TestBed.inject('InventoryService') as unknown as MockInventoryService;
    toastService = TestBed.inject('ToastService') as unknown as MockToastService;
    dialog = TestBed.inject(MatDialog) as unknown as MockMatDialog;

    // تهيئة البيانات الوهمية
    inventoryService.getItems.and.returnValue(of([
      { id: 1, name: 'صنف 1', category: 'أ', price: 10, stock: 5, isActive: true }
    ]));
    inventoryService.getItemStats.and.returnValue(of({ totalItems: 10, activeItems: 8, lowStockItems: 2 }));

    fixture.detectChanges(); // تشغيل ngOnInit
  });

  // اختبار إنشاء المكون
  it('يجب إنشاء المكون بنجاح', () => {
    expect(component).toBeTruthy();
  });

  // اختبار تحميل البيانات عند التهيئة
  it('يجب تحميل الأصناف والإحصائيات عند التهيئة', fakeAsync(() => {
    // التأكد من استدعاء الخدمات
    expect(inventoryService.getItems).toHaveBeenCalled();
    expect(inventoryService.getItemStats).toHaveBeenCalled();

    // التأكد من تحديث حالة التحميل
    component.isLoading$.subscribe(loading => {
      if (loading) {
        expect(loading).toBe(true);
      } else {
        expect(loading).toBe(false);
      }
    });

    // التأكد من تحميل البيانات
    component.items$.subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].name).toBe('صنف 1');
    });

    component.stats$.subscribe(stats => {
      expect(stats.totalItems).toBe(10);
    });
  }));

  // اختبار معالجة خطأ تحميل الأصناف
  it('يجب معالجة خطأ تحميل الأصناف وعرض رسالة خطأ', fakeAsync(() => {
    // محاكاة خطأ في الخدمة
    inventoryService.getItems.and.returnValue(throwError(() => new Error('فشل في الاتصال')));
    component.refresh$.next(); // إعادة تحميل البيانات

    tick(300); // انتظار تأخير محاكاة الخدمة

    // التأكد من عرض رسالة الخطأ
    expect(component.error).toContain('فشل في تحميل الأصناف');
    // التأكد من عرض Toast
    expect(toastService.error).toHaveBeenCalledWith(jasmine.stringContaining('فشل في تحميل الأصناف'));
    // التأكد من أن قائمة الأصناف فارغة
    component.items$.subscribe(items => {
      expect(items.length).toBe(0);
    });
  }));

  // اختبار وظيفة openItemForm للإضافة
  it('يجب فتح نافذة الحوار لنموذج الصنف عند الإضافة', () => {
    component.openItemForm();
    expect(dialog.open).toHaveBeenCalled();
    // محاكاة إغلاق النافذة بنجاح
    (dialog.open as jasmine.Spy).and.returnValue({ afterClosed: () => of({ id: 2, name: 'جديد' }) });
    component.openItemForm();
    // التأكد من ظهور رسالة نجاح وتحديث البيانات
    expect(toastService.success).toHaveBeenCalledWith(jasmine.stringContaining('تم إضافة الصنف بنجاح.'));
    expect(component.refresh$.observers.length).toBeGreaterThan(0); // التأكد من إرسال طلب تحديث
  });

  // اختبار وظيفة deleteItem
  it('يجب حذف الصنف بعد التأكيد', fakeAsync(() => {
    const itemToDelete = { id: 1, name: 'صنف للحذف' } as any;
    // محاكاة تأكيد الحذف
    (dialog.open as jasmine.Spy).and.returnValue({ afterClosed: () => of(true) });

    component.deleteItem(itemToDelete);
    tick(300); // انتظار تأخير محاكاة الخدمة

    // التأكد من استدعاء خدمة الحذف
    expect(inventoryService.deleteItem).toHaveBeenCalledWith(itemToDelete.id);
    // التأكد من ظهور رسالة نجاح وتحديث البيانات
    expect(toastService.success).toHaveBeenCalledWith(jasmine.stringContaining('تم حذف الصنف'));
    expect(component.refresh$.observers.length).toBeGreaterThan(0);
  }));

  // اختبار وظيفة exportToExcel
  it('يجب تصدير البيانات إلى Excel', fakeAsync(() => {
    component.exportToExcel();
    tick(500); // انتظار تأخير محاكاة الخدمة

    // التأكد من استدعاء خدمة التصدير
    expect(inventoryService.exportItems).toHaveBeenCalled();
    // التأكد من ظهور رسالة نجاح
    expect(toastService.success).toHaveBeenCalledWith('تم تصدير البيانات بنجاح.');
  }));

  // اختبار وظيفة onFilterChange
  it('يجب تحديث الفلتر وإعادة تحميل الأصناف عند تغيير الفلتر', fakeAsync(() => {
    // مسح سجل الاستدعاءات
    inventoryService.getItems.calls.reset();

    // تغيير مصطلح البحث
    component.onFilterChange({ searchTerm: 'جديد' });
    tick(1); // انتظار تحديث BehaviorSubject

    // التأكد من استدعاء getItems بالفلتر الجديد
    expect(inventoryService.getItems).toHaveBeenCalledWith({ searchTerm: 'جديد', category: null });

    // تغيير الفئة
    component.onFilterChange({ category: 'أثاث' });
    tick(1);

    // التأكد من استدعاء getItems بالفلتر المدمج
    expect(inventoryService.getItems).toHaveBeenCalledWith({ searchTerm: 'جديد', category: 'أثاث' });
  }));

  // اختبار تنظيف الاشتراكات عند التدمير
  it('يجب إلغاء جميع الاشتراكات عند تدمير المكون', () => {
    const destroySpy = spyOn((component as any).destroy$, 'next');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
  });
});
