import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WarehouseStockComponent } from './warehouse-stock.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WarehouseItem } from './inventory.models';
import { By } from '@angular/platform-browser';

/**
 * @description مجموعة اختبارات لمكون WarehouseStockComponent.
 */
describe('WarehouseStockComponent', () => {
  let component: WarehouseStockComponent;
  let fixture: ComponentFixture<WarehouseStockComponent>;

  // بيانات وهمية للاختبار
  const mockItems: WarehouseItem[] = [
    { id: '1', itemId: 'ITM001', name: 'صنف أ', sku: 'SKU001', currentStock: 10, minStockLevel: 5, maxStockLevel: 20, unitPrice: 50, totalValue: 500, status: 'normal' },
    { id: '2', itemId: 'ITM002', name: 'صنف ب', sku: 'SKU002', currentStock: 2, minStockLevel: 5, maxStockLevel: 15, unitPrice: 100, totalValue: 200, status: 'low' },
    { id: '3', itemId: 'ITM003', name: 'صنف ج', sku: 'SKU003', currentStock: 25, minStockLevel: 10, maxStockLevel: 20, unitPrice: 20, totalValue: 500, status: 'excess' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseStockComponent, CommonModule, FormsModule], // بما أنه مكون مستقل
    }).compileComponents();

    fixture = TestBed.createComponent(WarehouseStockComponent);
    component = fixture.componentInstance;
    // تهيئة المدخلات
    component.warehouseId = 'WH001';
    component.stockItems = mockItems;
    fixture.detectChanges(); // تشغيل دورة الكشف عن التغييرات
  });

  /**
   * @description التأكد من إنشاء المكون بنجاح.
   */
  it('يجب إنشاء المكون بنجاح', () => {
    expect(component).toBeTruthy();
  });

  /**
   * @description اختبار حساب حالة المخزون (getStockStatus).
   */
  it('يجب أن يحسب حالة المخزون بشكل صحيح', () => {
    // حالة عادي
    expect(component.getStockStatus(mockItems[0])).toBe('normal');
    // حالة ناقص
    expect(component.getStockStatus(mockItems[1])).toBe('low');
    // حالة زائد
    expect(component.getStockStatus(mockItems[2])).toBe('excess');
  });

  /**
   * @description اختبار تطبيق التصفية على الأصناف.
   */
  it('يجب أن يقوم بتصفية الأصناف بناءً على نص البحث', (done) => {
    // إرسال نص البحث
    component.onSearchChange('صنف أ');
    fixture.detectChanges();

    component.filteredItems$.subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].name).toBe('صنف أ');
      done();
    });
  });

  /**
   * @description اختبار حساب الإحصائيات الإجمالية.
   */
  it('يجب أن يحسب الإحصائيات الإجمالية بشكل صحيح', (done) => {
    component.statsData$.subscribe(stats => {
      // القيمة الإجمالية: 500 + 200 + 500 = 1200
      expect(stats[0].value).toBe(1200);
      // إجمالي الكمية: 10 + 2 + 25 = 37
      expect(stats[1].value).toBe(37);
      // أصناف ذات مخزون منخفض: 1 (صنف ب)
      expect(stats[2].value).toBe(1);
      done();
    });
  });

  /**
   * @description اختبار إطلاق حدث النقر على صنف.
   */
  it('يجب أن يطلق حدث itemClick عند النقر على صف في الجدول', () => {
    spyOn(component.itemClick, 'emit');
    // افتراض النقر على الصف الأول (صنف أ)
    const row = fixture.debugElement.query(By.css('.stock-table tbody tr'));
    row.triggerEventHandler('click', null);

    expect(component.itemClick.emit).toHaveBeenCalledWith(jasmine.objectContaining({ name: 'صنف أ' }));
  });

  /**
   * @description اختبار إطلاق حدث تصدير Excel.
   */
  it('يجب أن يطلق حدث exportExcel عند النقر على زر التصدير', () => {
    spyOn(component.exportExcel, 'emit');
    const exportButton = fixture.debugElement.query(By.css('.export-button'));
    exportButton.triggerEventHandler('click', null);

    expect(component.exportExcel.emit).toHaveBeenCalled();
  });

  /**
   * @description اختبار عرض حالة التحميل.
   */
  it('يجب عرض مؤشر التحميل عند loading=true', () => {
    component.loading = true;
    fixture.detectChanges();
    const loadingOverlay = fixture.debugElement.query(By.css('.loading-overlay'));
    expect(loadingOverlay).toBeTruthy();

    component.loading = false;
    fixture.detectChanges();
    const loadingOverlayAfter = fixture.debugElement.query(By.css('.loading-overlay'));
    expect(loadingOverlayAfter).toBeFalsy();
  });
});
