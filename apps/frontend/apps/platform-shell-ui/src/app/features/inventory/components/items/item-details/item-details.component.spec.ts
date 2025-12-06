// /home/ubuntu/item-details.component.spec.ts
// ملف الاختبارات لمكون ItemDetailsComponent

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ItemDetailsComponent } from './item-details.component';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Item, WarehouseItem, StockMovement } from './inventory.models';

// ------------------------------------------------------------------
// مكونات وهمية (Mock Components) للمكونات المشتركة
// ------------------------------------------------------------------

@Component({
  selector: 'app-data-table',
  standalone: true,
  template: '<div>Mock Data Table</div>',
})
class MockDataTableComponent {
  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  @Input() emptyMessage: string = '';
}

@Component({
  selector: 'app-inventory-stats-card',
  standalone: true,
  template: '<div>Mock Stats Card: {{ title }} - {{ value }}</div>',
})
class MockStatsCardComponent {
  @Input() title: string = '';
  @Input() value: number = 0;
  @Input() icon: string = '';
  @Input() unit: string = '';
  @Input() isCurrency: boolean = false;
}

// ------------------------------------------------------------------
// بيانات وهمية (Mock Data)
// ------------------------------------------------------------------

const mockItem: Item = {
  id: 1,
  code: 'ITM001',
  name: 'صنف تجريبي',
  category: { id: 1, name: 'إلكترونيات' },
  unit: { id: 1, name: 'قطعة', symbol: 'PC' },
  purchasePrice: 100,
  salePrice: 150,
  minStockLevel: 10,
  maxStockLevel: 100,
  isActive: true,
  description: 'وصف مفصل للصنف التجريبي.',
};

const mockStockBalance: WarehouseItem[] = [
  { warehouseId: 1, warehouseName: 'المستودع الرئيسي', balance: 50, value: 5000 },
  { warehouseId: 2, warehouseName: 'مستودع الفرع', balance: 20, value: 2000 },
];

const mockRecentMovements: StockMovement[] = [
  { id: 1, movementType: 'IN', quantity: 10, movementDate: new Date(), source: 'فاتورة شراء 1' },
  { id: 2, movementType: 'OUT', quantity: 5, movementDate: new Date(), source: 'فاتورة بيع 1' },
];

// ------------------------------------------------------------------
// اختبارات المكون (Component Tests)
// ------------------------------------------------------------------

describe('ItemDetailsComponent', () => {
  let component: ItemDetailsComponent;
  let fixture: ComponentFixture<ItemDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ItemDetailsComponent, // المكون المراد اختباره
        MockDataTableComponent,
        MockStatsCardComponent,
      ],
      // لا حاجة لـ providers لأن المكون مستقل
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDetailsComponent);
    component = fixture.componentInstance;
    // تهيئة المدخلات
    component.item = mockItem;
    component.stockBalance = mockStockBalance;
    component.recentMovements = mockRecentMovements;
    component.loading = false;
    fixture.detectChanges(); // تشغيل دورة الكشف عن التغييرات
  });

  it('يجب إنشاء المكون بنجاح', () => {
    expect(component).toBeTruthy();
  });

  it('يجب عرض اسم الصنف بشكل صحيح', () => {
    const nameElement: HTMLElement = fixture.nativeElement.querySelector('.item-name');
    expect(nameElement.textContent).toContain(mockItem.name);
  });

  it('يجب عرض حالة التحميل عند loading=true', () => {
    component.loading = true;
    fixture.detectChanges();
    const loadingElement = fixture.nativeElement.querySelector('.loading-container');
    expect(loadingElement).toBeTruthy();
    const detailsElement = fixture.nativeElement.querySelector('.item-details-container');
    expect(detailsElement).toBeFalsy();
  });

  it('يجب إطلاق حدث editItem عند النقر على زر التعديل', () => {
    spyOn(component.editItem, 'emit');
    const editButton = fixture.debugElement.query(By.css('.btn-primary'));
    editButton.triggerEventHandler('click', null);
    expect(component.editItem.emit).toHaveBeenCalledWith(mockItem);
  });

  it('يجب إطلاق حدث deleteItem عند النقر على زر الحذف', () => {
    spyOn(component.deleteItem, 'emit');
    const deleteButton = fixture.debugElement.query(By.css('.btn-danger'));
    deleteButton.triggerEventHandler('click', null);
    expect(component.deleteItem.emit).toHaveBeenCalledWith(mockItem);
  });

  it('يجب إطلاق حدث viewMovements عند النقر على زر عرض جميع الحركات', () => {
    spyOn(component.viewMovements, 'emit');
    const viewMovementsButton = fixture.debugElement.query(By.css('.btn-link'));
    viewMovementsButton.triggerEventHandler('click', null);
    expect(component.viewMovements.emit).toHaveBeenCalledWith(mockItem.id);
  });

  it('يجب حساب إحصائيات الصنف بشكل صحيح', waitForAsync(() => {
    component.itemStatistics$.subscribe(stats => {
      // إجمالي الرصيد: 50 + 20 = 70
      expect(stats.totalBalance).toBe(70);
      // إجمالي القيمة: 5000 + 2000 = 7000
      expect(stats.totalValue).toBe(7000);
      // عدد الحركات: 2
      expect(stats.movementCount).toBe(2);
    });
  }));

  it('يجب تمرير البيانات الصحيحة إلى MockDataTableComponent لأرصدة المستودعات', () => {
    const dataTableDebugElement = fixture.debugElement.queryAll(By.directive(MockDataTableComponent))[0];
    const dataTableComponent = dataTableDebugElement.injector.get(MockDataTableComponent);
    expect(dataTableComponent.data).toEqual(mockStockBalance);
    expect(dataTableComponent.columns.length).toBe(3);
  });

  it('يجب تمرير البيانات الصحيحة إلى MockDataTableComponent للحركات الأخيرة', () => {
    const dataTableDebugElement = fixture.debugElement.queryAll(By.directive(MockDataTableComponent))[1];
    const dataTableComponent = dataTableDebugElement.injector.get(MockDataTableComponent);
    expect(dataTableComponent.data).toEqual(mockRecentMovements);
    expect(dataTableComponent.columns.length).toBe(4);
  });

  it('يجب تمرير الإحصائيات الصحيحة إلى MockStatsCardComponent', waitForAsync(() => {
    component.itemStatistics$.subscribe(stats => {
      fixture.detectChanges(); // تحديث العرض بعد وصول البيانات
      const statsCards = fixture.debugElement.queryAll(By.directive(MockStatsCardComponent));

      // بطاقة إجمالي الرصيد
      const totalBalanceCard = statsCards.find(card => card.componentInstance.title === 'إجمالي الرصيد')?.componentInstance;
      expect(totalBalanceCard).toBeTruthy();
      expect(totalBalanceCard?.value).toBe(stats.totalBalance);

      // بطاقة القيمة الإجمالية
      const totalValueCard = statsCards.find(card => card.componentInstance.title === 'القيمة الإجمالية')?.componentInstance;
      expect(totalValueCard).toBeTruthy();
      expect(totalValueCard?.value).toBe(stats.totalValue);

      // بطاقة عدد الحركات
      const movementCountCard = statsCards.find(card => card.componentInstance.title === 'عدد الحركات الأخيرة')?.componentInstance;
      expect(movementCountCard).toBeTruthy();
      expect(movementCountCard?.value).toBe(stats.movementCount);
    });
  }));
});
