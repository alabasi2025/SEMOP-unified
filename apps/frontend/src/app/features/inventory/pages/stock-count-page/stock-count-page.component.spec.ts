import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockCountPageComponent } from './stock-count-page.component';
import { InventoryService } from './inventory.service';
import { ToastService } from './toast.service';
import { of, throwError } from 'rxjs';
import { StockCountStatus } from './inventory.interfaces';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// إنشاء Mock Services
class MockInventoryService {
  getStockCounts = jasmine.createSpy('getStockCounts').and.returnValue(of([
    { id: 1, number: 'SC-001', date: new Date(), warehouse: 'A', status: StockCountStatus.APPROVED, itemCount: 10, totalDifferences: 0 },
  ]));
  getStockCountStats = jasmine.createSpy('getStockCountStats').and.returnValue(of({ totalCounts: 1, inProgress: 0, completed: 1, totalDifferenceValue: 0 }));
  createStockCount = jasmine.createSpy('createStockCount').and.returnValue(of({ id: 2, number: 'SC-002', date: new Date(), warehouse: 'B', status: StockCountStatus.DRAFT, itemCount: 0, totalDifferences: 0 }));
  approveStockCount = jasmine.createSpy('approveStockCount').and.returnValue(of({ id: 1, number: 'SC-001', date: new Date(), warehouse: 'A', status: StockCountStatus.APPROVED, itemCount: 10, totalDifferences: 0 }));
}

class MockToastService {
  showSuccess = jasmine.createSpy('showSuccess');
  showError = jasmine.createSpy('showError');
  showInfo = jasmine.createSpy('showInfo');
}

describe('StockCountPageComponent', () => {
  let component: StockCountPageComponent;
  let fixture: ComponentFixture<StockCountPageComponent>;
  let inventoryService: InventoryService;
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockCountPageComponent, FormsModule, CommonModule], // استيراد المكون Standalone
      providers: [
        { provide: InventoryService, useClass: MockInventoryService },
        { provide: ToastService, useClass: MockToastService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StockCountPageComponent);
    component = fixture.componentInstance;
    inventoryService = TestBed.inject(InventoryService);
    toastService = TestBed.inject(ToastService);
    fixture.detectChanges(); // تشغيل ngOnInit
  });

  it('يجب إنشاء المكون بنجاح', () => {
    expect(component).toBeTruthy();
  });

  it('يجب تحميل قائمة الجرد والإحصائيات عند التهيئة', (done) => {
    // التحقق من استدعاء الخدمات
    expect(inventoryService.getStockCounts).toHaveBeenCalled();
    expect(inventoryService.getStockCountStats).toHaveBeenCalled();

    // التحقق من تحميل البيانات
    component.stockCounts$.subscribe(counts => {
      expect(counts.length).toBe(1);
      done();
    });
  });

  it('يجب أن تقوم applyFilter بتحديث قائمة الجرد', () => {
    // تهيئة المرشحات
    component.currentFilter.status = StockCountStatus.DRAFT;
    component.applyFilter();

    // التحقق من استدعاء الخدمة مرة أخرى مع المرشحات الجديدة
    expect(inventoryService.getStockCounts).toHaveBeenCalledTimes(2);
  });

  it('يجب أن تقوم clearFilter بمسح المرشحات وإعادة تحميل القائمة', () => {
    component.currentFilter.status = StockCountStatus.DRAFT;
    component.clearFilter();

    // التحقق من مسح المرشحات
    expect(component.currentFilter.status).toBeNull();
    // التحقق من استدعاء الخدمة مرة أخرى
    expect(inventoryService.getStockCounts).toHaveBeenCalledTimes(2);
  });

  it('يجب أن تقوم createNewCount بإنشاء جرد جديد وإظهار إشعار نجاح', () => {
    component.createNewCount();

    expect(inventoryService.createStockCount).toHaveBeenCalled();
    // يجب أن يتم استدعاء showSuccess بعد نجاح العملية
    expect(toastService.showSuccess).toHaveBeenCalledWith(jasmine.stringContaining('تم إنشاء جرد جديد بنجاح'));
    // يجب إعادة تحميل القائمة بعد الإنشاء
    expect(inventoryService.getStockCounts).toHaveBeenCalledTimes(2);
  });

  it('يجب أن تتعامل createNewCount مع الأخطاء وتظهر إشعار خطأ', () => {
    (inventoryService.createStockCount as jasmine.Spy).and.returnValue(throwError(() => new Error('فشل وهمي')));
    component.createNewCount();

    expect(toastService.showError).toHaveBeenCalledWith(jasmine.stringContaining('فشل في إنشاء جرد جديد'));
  });

  it('يجب أن تقوم approveCount باعتماد الجرد وإظهار إشعار نجاح', () => {
    const mockCount = { id: 1, number: 'SC-001', date: new Date(), warehouse: 'A', status: StockCountStatus.COMPLETED, itemCount: 10, totalDifferences: 0 };
    component.approveCount(mockCount as any);

    expect(inventoryService.approveStockCount).toHaveBeenCalledWith(1);
    expect(toastService.showSuccess).toHaveBeenCalledWith(jasmine.stringContaining('تم اعتماد الجرد'));
  });

  it('يجب أن تمنع approveCount اعتماد جرد غير مكتمل', () => {
    const mockCount = { id: 1, number: 'SC-001', date: new Date(), warehouse: 'A', status: StockCountStatus.IN_PROGRESS, itemCount: 10, totalDifferences: 0 };
    component.approveCount(mockCount as any);

    expect(inventoryService.approveStockCount).not.toHaveBeenCalled();
    expect(toastService.showInfo).toHaveBeenCalled();
  });

  it('يجب أن تقوم viewDetails بفتح نافذة التفاصيل', () => {
    const mockCount = { id: 1, number: 'SC-001', date: new Date(), warehouse: 'A', status: StockCountStatus.APPROVED, itemCount: 10, totalDifferences: 0 };
    component.viewDetails(mockCount as any);

    expect(component.isDetailsDialogOpen).toBeTrue();
    component.selectedCountDetails$.subscribe(details => {
      expect(details).toEqual(mockCount as any);
    });
  });

  it('يجب أن تقوم closeDetailsDialog بإغلاق نافذة التفاصيل', () => {
    component.isDetailsDialogOpen = true;
    component.closeDetailsDialog();

    expect(component.isDetailsDialogOpen).toBeFalse();
    component.selectedCountDetails$.subscribe(details => {
      expect(details).toBeNull();
    });
  });

  it('يجب أن تقوم getStatusClass بإرجاع الفئة الصحيحة للحالة', () => {
    expect(component.getStatusClass(StockCountStatus.APPROVED)).toBe('status-approved');
    expect(component.getStatusClass(StockCountStatus.IN_PROGRESS)).toBe('status-in-progress');
    expect(component.getStatusClass(StockCountStatus.DRAFT)).toBe('status-draft');
  });
});
