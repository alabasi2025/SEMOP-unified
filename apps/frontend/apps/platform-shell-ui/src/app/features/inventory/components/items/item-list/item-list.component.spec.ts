import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemListComponent } from './item-list.component';
import { Item, Category, InventoryStats } from '../inventory.models';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';

// مكونات وهمية للمكونات المشتركة
@Component({ selector: 'app-data-table', standalone: true, template: '' })
class MockDataTableComponent {
  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  @Input() pageSize: number = 10;
  @Input() currentPage: number = 1;
  @Input() totalItems: number = 0;
  @Output() rowClick = new EventEmitter<any>();
  @Output() pageChange = new EventEmitter<number>();
}

@Component({ selector: 'app-search-bar', standalone: true, template: '' })
class MockSearchBarComponent {
  @Input() placeholder: string = '';
  @Output() searchChange = new EventEmitter<string>();
}

@Component({ selector: 'app-inventory-stats-card', standalone: true, template: '' })
class MockStatsCardComponent {
  @Input() title: string = '';
  @Input() value: any;
  @Input() icon: string = '';
}

describe('ItemListComponent', () => {
  let component: ItemListComponent;
  let fixture: ComponentFixture<ItemListComponent>;

  // بيانات وهمية للاختبار
  const mockItem: Item = {
    id: 1,
    name: 'صنف تجريبي',
    sku: 'SKU001',
    description: 'وصف',
    price: 100,
    stockQuantity: 50,
    category: { id: 1, name: 'فئة 1', description: '' },
    unit: { id: 1, name: 'وحدة', symbol: 'و' },
    isActive: true,
    lastUpdated: new Date(),
  };

  const mockItems: Item[] = [mockItem];
  const mockCategories: Category[] = [{ id: 1, name: 'فئة 1', description: '' }];
  const mockStats: InventoryStats = { totalItems: 1, totalStockValue: 100, lowStockItems: 0 };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemListComponent, FormsModule, CommonModule],
      // استبدال المكونات المشتركة بالمكونات الوهمية
      providers: [
        { provide: MockDataTableComponent, useClass: MockDataTableComponent },
        { provide: MockSearchBarComponent, useClass: MockSearchBarComponent },
        { provide: MockStatsCardComponent, useClass: MockStatsCardComponent },
      ]
    })
    .overrideComponent(ItemListComponent, {
      set: {
        imports: [
          CommonModule,
          FormsModule,
          MockDataTableComponent,
          MockSearchBarComponent,
          MockStatsCardComponent
        ]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemListComponent);
    component = fixture.componentInstance;

    // تهيئة المدخلات
    component.items = mockItems;
    component.categories = mockCategories;
    component.inventoryStats = mockStats;
    component.totalItems = 1;
    component.pageSize = 10;
    component.currentPage = 1;

    fixture.detectChanges();
  });

  it('يجب إنشاء المكون بنجاح', () => {
    expect(component).toBeTruthy();
  });

  it('يجب عرض الإحصائيات عند توفرها', () => {
    const statsCards = fixture.debugElement.queryAll(By.directive(MockStatsCardComponent));
    expect(statsCards.length).toBe(3);
  });

  it('يجب عرض جدول البيانات عند توفر الأصناف', () => {
    const dataTable = fixture.debugElement.query(By.directive(MockDataTableComponent));
    expect(dataTable).toBeTruthy();
    expect(dataTable.componentInstance.data).toEqual(mockItems);
  });

  it('يجب أن ينبعث حدث addItem عند النقر على زر الإضافة', () => {
    spyOn(component.addItem, 'emit');
    const addButton = fixture.debugElement.query(By.css('.btn-primary'));
    addButton.triggerEventHandler('click', null);
    expect(component.addItem.emit).toHaveBeenCalled();
  });

  it('يجب أن ينبعث حدث editItem عند النقر على زر التعديل في الجدول', () => {
    spyOn(component.editItem, 'emit');
    // نحتاج إلى محاكاة النقر على زر التعديل داخل ng-template
    // بما أننا نستخدم مكون وهمي، سنختبر الدالة مباشرة
    component.onEditItem(mockItem);
    expect(component.editItem.emit).toHaveBeenCalledWith(mockItem);
  });

  it('يجب أن ينبعث حدث deleteItem عند النقر على زر الحذف في الجدول', () => {
    spyOn(component.deleteItem, 'emit');
    // نحتاج إلى محاكاة النقر على زر الحذف داخل ng-template
    // بما أننا نستخدم مكون وهمي، سنختبر الدالة مباشرة
    component.onDeleteItem(mockItem);
    expect(component.deleteItem.emit).toHaveBeenCalledWith(mockItem);
  });

  it('يجب أن يتم معالجة البحث بشكل تفاعلي (RxJS)', (done) => {
    spyOn(component.searchChange, 'emit');
    const searchTerm = 'اختبار';

    // استدعاء onSearch مرتين بسرعة
    component.onSearch(searchTerm + '1');
    component.onSearch(searchTerm);

    // الانتظار لمدة أطول من debounceTime (300ms)
    setTimeout(() => {
      // يجب أن يتم استدعاء emit مرة واحدة فقط بالقيمة النهائية
      expect(component.searchChange.emit).toHaveBeenCalledTimes(1);
      expect(component.searchChange.emit).toHaveBeenCalledWith(searchTerm);
      done();
    }, 350);
  });

  it('يجب أن ينبعث حدث pageChange عند تغيير الصفحة', () => {
    spyOn(component.pageChange, 'emit');
    const newPage = 2;
    component.onPageChange(newPage);
    expect(component.pageChange.emit).toHaveBeenCalledWith(newPage);
  });

  it('يجب أن ينبعث حدث categoryFilterChange عند تغيير الفلتر', () => {
    spyOn(component.categoryFilterChange, 'emit');
    const newCategoryId = 1;
    component.onCategoryChange(newCategoryId);
    expect(component.categoryFilterChange.emit).toHaveBeenCalledWith(newCategoryId);
  });

  it('يجب عرض رسالة "لا توجد أصناف" عند عدم وجود بيانات', () => {
    component.items = [];
    component.totalItems = 0;
    fixture.detectChanges();
    const noItemsDiv = fixture.debugElement.query(By.css('.no-items'));
    expect(noItemsDiv).toBeTruthy();
  });

  it('يجب عرض مؤشر التحميل عند loading = true', () => {
    component.loading = true;
    fixture.detectChanges();
    const loadingOverlay = fixture.debugElement.query(By.css('.loading-overlay'));
    expect(loadingOverlay).toBeTruthy();
  });
});
