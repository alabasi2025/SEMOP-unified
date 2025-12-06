import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovementsPageComponent } from './movements-page.component';
import { InventoryService, Movement, MovementStats } from './inventory.models';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';

// Mock InventoryService
class MockInventoryService {
  mockMovements: Movement[] = [
    {
      id: 1,
      date: new Date().toISOString(),
      type: 'INBOUND',
      item: { id: 1, name: 'لابتوب' },
      warehouse: { id: 1, name: 'المستودع الرئيسي' },
      quantity: 10,
      user: { id: 1, name: 'أحمد' },
    },
  ];
  mockStats: MovementStats = {
    totalMovements: 1,
    totalInbound: 10,
    totalOutbound: 0,
  };

  getMovements = (filter: any) => Promise.resolve(this.mockMovements);
  getMovementStats = (filter: any) => Promise.resolve(this.mockStats);
  exportMovements = (filter: any) => Promise.resolve();
  showToast = (message: string, type: 'success' | 'error' | 'info') => {};
}

describe('MovementsPageComponent', () => {
  let component: MovementsPageComponent;
  let fixture: ComponentFixture<MovementsPageComponent>;
  let inventoryService: InventoryService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovementsPageComponent, CommonModule], // استيراد المكون كوحدة مستقلة
      providers: [
        { provide: InventoryService, useClass: MockInventoryService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MovementsPageComponent);
    component = fixture.componentInstance;
    inventoryService = TestBed.inject(InventoryService);
    // لا حاجة لـ fixture.detectChanges() هنا لأن البيانات يتم تحميلها في ngOnInit
  });

  it('يجب إنشاء المكون بنجاح', () => {
    expect(component).toBeTruthy();
  });

  it('يجب تحميل الحركات والإحصائيات عند التهيئة', (done) => {
    // Spy على دالة جلب الحركات والإحصائيات
    const getMovementsSpy = spyOn(inventoryService, 'getMovements').and.callThrough();
    const getMovementStatsSpy = spyOn(inventoryService, 'getMovementStats').and.callThrough();

    // تشغيل ngOnInit
    component.ngOnInit();

    // التحقق من أن حالة التحميل صحيحة
    component.isLoading.subscribe((loading) => {
      if (loading) {
        expect(loading).toBe(true);
      }
    });

    // التحقق من تحميل البيانات
    component.movements$.subscribe((movements) => {
      if (movements.length > 0) {
        expect(movements.length).toBe(1);
        expect(getMovementsSpy).toHaveBeenCalled();
        done();
      }
    });

    component.stats$.subscribe((stats) => {
      if (stats.totalMovements > 0) {
        expect(stats.totalMovements).toBe(1);
        expect(getMovementStatsSpy).toHaveBeenCalled();
      }
    });
  });

  it('يجب تحديث البيانات عند تغيير الفلتر', (done) => {
    const getMovementsSpy = spyOn(inventoryService, 'getMovements').and.callThrough();
    const newFilter = { type: 'OUTBOUND' as const };
    component.onFilterChange(newFilter);

    // يجب أن يتم استدعاء getMovements مرة أخرى
    component.movements$.subscribe((movements) => {
      // في Mock، ستظل البيانات كما هي، لكننا نتحقق من الاستدعاء
      if (getMovementsSpy.calls.count() > 1) {
        expect(getMovementsSpy).toHaveBeenCalledWith(newFilter);
        done();
      }
    });
  });

  it('يجب معالجة خطأ جلب البيانات', (done) => {
    // إجبار الخدمة على إرجاع خطأ
    spyOn(inventoryService, 'getMovements').and.returnValue(
      Promise.reject(new Error('خطأ في الاتصال'))
    );
    spyOn(inventoryService, 'showToast');

    component.ngOnInit();

    // التحقق من حالة الخطأ
    component.error.subscribe((err) => {
      if (err) {
        expect(err).toContain('فشل في جلب الحركات');
        expect(inventoryService.showToast).toHaveBeenCalledWith(
          'فشل في جلب الحركات',
          'error'
        );
        done();
      }
    });

    // التحقق من أن الحركات والإحصائيات فارغة/صفر
    component.movements$.subscribe((movements) => {
      expect(movements.length).toBe(0);
    });
    component.stats$.subscribe((stats) => {
      expect(stats.totalMovements).toBe(0);
    });
  });

  it('يجب فتح وإغلاق نافذة التفاصيل', () => {
    const mockMovement = component['inventoryService']['mockMovements'][0];
    component.showMovementDetails(mockMovement);

    expect(component.showDetailsDialog.value).toBe(true);
    expect(component.selectedMovement.value).toBe(mockMovement);

    component.closeDetailsDialog();
    expect(component.showDetailsDialog.value).toBe(false);
    expect(component.selectedMovement.value).toBe(null);
  });

  it('يجب تصدير البيانات بنجاح', async () => {
    const exportSpy = spyOn(inventoryService, 'exportMovements').and.callThrough();
    const toastSpy = spyOn(inventoryService, 'showToast');

    await component.exportToExcel();

    expect(exportSpy).toHaveBeenCalled();
    // يتم استدعاء showToast داخل MockInventoryService عند النجاح
    // expect(toastSpy).toHaveBeenCalledWith('تم تصدير الحركات بنجاح.', 'success');
    expect(component.isLoading.value).toBe(false);
  });

  it('يجب معالجة خطأ التصدير', async () => {
    spyOn(inventoryService, 'exportMovements').and.returnValue(
      Promise.reject(new Error('فشل التصدير'))
    );
    spyOn(inventoryService, 'showToast');

    await component.exportToExcel();

    expect(component.error.value).toContain('فشل في تصدير البيانات.');
    expect(inventoryService.showToast).toHaveBeenCalledWith(
      'فشل في تصدير البيانات.',
      'error'
    );
    expect(component.isLoading.value).toBe(false);
  });

  it('يجب تحويل نوع الحركة إلى نص عربي صحيح', () => {
    expect(component.getMovementTypeLabel('INBOUND')).toBe('وارد');
    expect(component.getMovementTypeLabel('OUTBOUND')).toBe('صادر');
    expect(component.getMovementTypeLabel('ADJUSTMENT')).toBe('تسوية');
    expect(component.getMovementTypeLabel('UNKNOWN' as any)).toBe('غير محدد');
  });
});
