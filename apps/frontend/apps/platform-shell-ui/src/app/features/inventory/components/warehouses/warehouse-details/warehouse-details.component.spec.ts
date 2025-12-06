import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WarehouseDetailsComponent } from './warehouse-details.component';
import { Warehouse, WarehouseItem, StockMovement } from './inventory.models';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { By } from '@angular/platform-browser';

// مكونات وهمية للمكونات المشتركة
import { Component, Input } from '@angular/core';

@Component({ selector: 'app-stats-card', standalone: true, template: '' })
class MockStatsCardComponent {
  @Input() icon!: string;
  @Input() title!: string;
  @Input() value!: string;
  @Input() unit!: string;
  @Input() isPercentage: boolean = false;
}

@Component({ selector: 'app-data-table', standalone: true, template: '' })
class MockDataTableComponent {
  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  @Input() rows: number = 5;
  @Input() emptyMessage: string = '';
}

describe('WarehouseDetailsComponent', () => {
  let component: WarehouseDetailsComponent;
  let fixture: ComponentFixture<WarehouseDetailsComponent>;

  // بيانات وهمية للاختبار
  const mockWarehouse: Warehouse = {
    id: 1,
    name: 'المستودع الرئيسي',
    location: 'الرياض، المنطقة الصناعية',
    capacity: 1000,
    occupiedSpace: 350,
    totalValue: 150000.75,
    itemCount: 50,
  };

  const mockStockItems: WarehouseItem[] = [
    { id: 101, name: 'كمبيوتر محمول', sku: 'LAP-001', quantity: 10, unitPrice: 3000, totalValue: 30000, lastRestock: new Date() },
    { id: 102, name: 'شاشة عرض', sku: 'MON-005', quantity: 25, unitPrice: 1500, totalValue: 37500, lastRestock: new Date() },
  ];

  const mockMovements: StockMovement[] = [
    { id: 1, itemId: 101, itemName: 'كمبيوتر محمول', type: 'IN', quantity: 5, movementDate: new Date(), responsible: 'أحمد' },
    { id: 2, itemId: 102, itemName: 'شاشة عرض', type: 'OUT', quantity: 2, movementDate: new Date(), responsible: 'سارة' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        WarehouseDetailsComponent,
        CommonModule,
        ChartModule, // يجب استيرادها لاختبار وجودها
      ],
      // استبدال المكونات المشتركة بمكونات وهمية
      providers: [
        { provide: MockStatsCardComponent, useClass: MockStatsCardComponent },
        { provide: MockDataTableComponent, useClass: MockDataTableComponent },
      ],
    })
    .overrideComponent(WarehouseDetailsComponent, {
        remove: { imports: [StatsCardComponent, DataTableComponent] },
        add: { imports: [MockStatsCardComponent, MockDataTableComponent] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseDetailsComponent);
    component = fixture.componentInstance;
    component.warehouse = mockWarehouse;
    component.stockItems = mockStockItems;
    component.recentMovements = mockMovements;
    fixture.detectChanges(); // تشغيل ngOnChanges
  });

  it('يجب إنشاء المكون بنجاح', () => {
    expect(component).toBeTruthy();
  });

  it('يجب أن يحسب الإحصائيات المشتقة بشكل صحيح عند التهيئة', () => {
    // نسبة الإشغال: (350 / 1000) * 100 = 35%
    expect(component.stats.itemCount).toBe(mockWarehouse.itemCount);
    expect(component.stats.totalValue).toBe(mockWarehouse.totalValue);
    expect(component.stats.occupancyPercentage).toBe(35.00);
  });

  it('يجب أن يعرض اسم المستودع وموقعه', () => {
    const nameElement = fixture.debugElement.query(By.css('.details-header h1')).nativeElement;
    expect(nameElement.textContent).toContain(mockWarehouse.name);

    const locationElement = fixture.debugElement.query(By.css('.basic-info p:nth-child(2)')).nativeElement;
    expect(locationElement.textContent).toContain(mockWarehouse.location);
  });

  it('يجب أن يطلق حدث editWarehouse عند النقر على زر التعديل', () => {
    spyOn(component.editWarehouse, 'emit');
    const editButton = fixture.debugElement.query(By.css('.btn-primary')).nativeElement;
    editButton.click();
    expect(component.editWarehouse.emit).toHaveBeenCalledWith(mockWarehouse);
  });

  it('يجب أن يطلق حدث deleteWarehouse عند النقر على زر الحذف', () => {
    spyOn(component.deleteWarehouse, 'emit');
    const deleteButton = fixture.debugElement.query(By.css('.btn-danger')).nativeElement;
    deleteButton.click();
    expect(component.deleteWarehouse.emit).toHaveBeenCalledWith(mockWarehouse);
  });

  it('يجب أن يعرض مؤشر التحميل عند loading = true', () => {
    component.loading = true;
    fixture.detectChanges();
    const loadingOverlay = fixture.debugElement.query(By.css('.loading-overlay'));
    expect(loadingOverlay).toBeTruthy();
  });

  it('يجب أن يمرر البيانات الصحيحة إلى MockDataTableComponent للأصناف', () => {
    const dataTable = fixture.debugElement.query(By.css('.stock-balance-section app-data-table')).componentInstance as MockDataTableComponent;
    expect(dataTable.data).toEqual(mockStockItems);
    expect(dataTable.columns).toEqual(component.stockTableColumns);
  });

  it('يجب أن يمرر البيانات الصحيحة إلى MockDataTableComponent للحركات', () => {
    const dataTable = fixture.debugElement.query(By.css('.recent-movements-section app-data-table')).componentInstance as MockDataTableComponent;
    expect(dataTable.data).toEqual(mockMovements);
    expect(dataTable.columns).toEqual(component.movementsTableColumns);
  });

  it('يجب أن يطلق حدث viewStock عند النقر على زر عرض كل الأصناف', () => {
    spyOn(component.viewStock, 'emit');
    const viewStockButton = fixture.debugElement.query(By.css('.stock-balance-section .btn-secondary')).nativeElement;
    viewStockButton.click();
    expect(component.viewStock.emit).toHaveBeenCalledWith(mockWarehouse);
  });

  it('يجب أن يطلق حدث viewMovements عند النقر على زر عرض كل الحركات', () => {
    spyOn(component.viewMovements, 'emit');
    const viewMovementsButton = fixture.debugElement.query(By.css('.recent-movements-section .btn-secondary')).nativeElement;
    viewMovementsButton.click();
    expect(component.viewMovements.emit).toHaveBeenCalledWith(mockWarehouse);
  });
});
