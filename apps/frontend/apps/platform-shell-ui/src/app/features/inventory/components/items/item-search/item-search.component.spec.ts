/* item-search.component.spec.ts */

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ItemSearchComponent, SearchBarComponent, SearchField } from './item-search.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Item } from '../inventory.models';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

// ********************************************************************
// Mock InventoryService
// ********************************************************************
class MockInventoryService {
  mockItems: Item[] = [
    { id: 1, code: 'A001', name: 'لابتوب ديل', barcode: '1234567890123', category: { id: 1, name: 'إلكترونيات' }, unit: { id: 1, name: 'قطعة' }, stockQuantity: 15 },
    { id: 2, code: 'B002', name: 'شاشة سامسونج', barcode: '2345678901234', category: { id: 1, name: 'إلكترونيات' }, unit: { id: 1, name: 'قطعة' }, stockQuantity: 22 },
    { id: 3, code: 'C003', name: 'طابعة إبسون', barcode: '3456789012345', category: { id: 2, name: 'مكتبية' }, unit: { id: 1, name: 'قطعة' }, stockQuantity: 8 },
  ];

  searchItems(term: string, fields: SearchField[]): any {
    if (!term || term.length < 2) {
      return of([]);
    }
    const lowerTerm = term.toLowerCase();
    const results = this.mockItems.filter(item => {
      return fields.some(field => {
        const value = item[field as keyof Item] as string;
        return value && value.toLowerCase().includes(lowerTerm);
      });
    });
    return of(results);
  }
}

describe('ItemSearchComponent', () => {
  let component: ItemSearchComponent;
  let fixture: ComponentFixture<ItemSearchComponent>;
  let mockInventoryService: MockInventoryService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemSearchComponent, CommonModule, FormsModule, ReactiveFormsModule],
      // توفير Mock Service بدلاً من الخدمة الحقيقية
      providers: [
        { provide: 'InventoryService', useClass: MockInventoryService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemSearchComponent);
    component = fixture.componentInstance;
    // الوصول إلى الخدمة الوهمية
    mockInventoryService = TestBed.inject('InventoryService') as unknown as MockInventoryService;
    fixture.detectChanges();
  });

  it('يجب إنشاء المكون بنجاح', () => {
    expect(component).toBeTruthy();
  });

  it('يجب أن تكون المدخلات الافتراضية صحيحة', () => {
    expect(component.placeholder).toBe('ابحث عن صنف...');
    expect(component.searchFields).toEqual(['code', 'name', 'barcode']);
    expect(component.showResults).toBe(true);
  });

  it('يجب أن يطلق حدث search بعد تأخير (debounce)', fakeAsync(() => {
    spyOn(component.search, 'emit');
    const searchTerm = 'لابتوب';

    component.onSearchChange(searchTerm);
    tick(200); // قبل التأخير
    expect(component.search.emit).not.toHaveBeenCalled();

    tick(101); // بعد التأخير (300ms)
    expect(component.search.emit).toHaveBeenCalledWith(searchTerm);
  }));

  it('يجب أن يعرض نتائج البحث بعد الإدخال', fakeAsync(() => {
    const searchTerm = 'A001';
    component.onSearchChange(searchTerm);
    tick(300);
    fixture.detectChanges();

    // التحقق من أن قائمة النتائج مرئية
    const resultsList = fixture.debugElement.query(By.css('.results-list'));
    expect(resultsList).toBeTruthy();

    // التحقق من عدد العناصر
    component.items$.subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].code).toBe('A001');
    });
  }));

  it('يجب أن يطلق حدث itemSelect عند اختيار صنف', fakeAsync(() => {
    spyOn(component.itemSelect, 'emit');
    const itemToSelect = mockInventoryService.mockItems[0];

    component.selectItem(itemToSelect);
    fixture.detectChanges();

    expect(component.itemSelect.emit).toHaveBeenCalledWith(itemToSelect);
    expect(component.selectedItem).toBe(itemToSelect);
    expect(component.currentSearchTerm).toBe(`${itemToSelect.code} - ${itemToSelect.name}`);
  }));

  it('يجب أن يطلق حدث clear عند مسح البحث', () => {
    spyOn(component.clear, 'emit');
    component.currentSearchTerm = 'test';
    component.selectedItem = mockInventoryService.mockItems[0];

    component.clearSearch();
    fixture.detectChanges();

    expect(component.clear.emit).toHaveBeenCalled();
    expect(component.currentSearchTerm).toBe('');
    expect(component.selectedItem).toBeNull();
  });

  // ********************************************************************
  // اختبار التنقل بلوحة المفاتيح (Keyboard Navigation)
  // ********************************************************************
  describe('Keyboard Navigation', () => {
    let items: Item[];

    beforeEach(fakeAsync(() => {
      // تهيئة قائمة النتائج
      component.onSearchChange('ل'); // مصطلح بحث يعطي نتائج
      tick(300);
      fixture.detectChanges();
      component.items$.subscribe(res => items = res);
      fixture.detectChanges();
    }));

    it('يجب أن يزيد selectedIndex عند ضغط ArrowDown', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      component.handleKeyDown(event, items);
      expect(component.selectedIndex).toBe(0);

      component.handleKeyDown(event, items);
      expect(component.selectedIndex).toBe(1);

      component.handleKeyDown(event, items);
      expect(component.selectedIndex).toBe(2);

      // يجب أن يعود إلى البداية (wrap around)
      component.handleKeyDown(event, items);
      expect(component.selectedIndex).toBe(0);
    });

    it('يجب أن ينقص selectedIndex عند ضغط ArrowUp', () => {
      // البدء من العنصر الأول
      component.selectedIndex = 0;
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });

      // يجب أن يعود إلى النهاية (wrap around)
      component.handleKeyDown(event, items);
      expect(component.selectedIndex).toBe(items.length - 1); // 2

      component.handleKeyDown(event, items);
      expect(component.selectedIndex).toBe(items.length - 2); // 1
    });

    it('يجب أن يختار الصنف عند ضغط Enter', () => {
      spyOn(component, 'selectItem');
      component.selectedIndex = 1; // اختيار العنصر الثاني
      const event = new KeyboardEvent('keydown', { key: 'Enter' });

      component.handleKeyDown(event, items);
      expect(component.selectItem).toHaveBeenCalledWith(items[1]);
    });

    it('يجب أن يمنع السلوك الافتراضي لـ ArrowDown و ArrowUp و Enter', () => {
      const preventDefaultSpy = spyOn(KeyboardEvent.prototype, 'preventDefault');
      const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      const upEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });

      component.handleKeyDown(downEvent, items);
      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);

      component.handleKeyDown(upEvent, items);
      expect(preventDefaultSpy).toHaveBeenCalledTimes(2);

      component.selectedIndex = 0;
      component.handleKeyDown(enterEvent, items);
      expect(preventDefaultSpy).toHaveBeenCalledTimes(3);
    });
  });

  // ********************************************************************
  // اختبار تمييز النص (Highlighting)
  // ********************************************************************
  it('يجب أن يقوم بتمييز النص المطابق بشكل صحيح', () => {
    const text = 'لابتوب ديل';
    const term = 'لابتوب';
    const highlighted = component.highlightMatch(text, term);
    expect(highlighted).toBe('<span class="highlight">لابتوب</span> ديل');

    const text2 = 'A001';
    const term2 = '00';
    const highlighted2 = component.highlightMatch(text2, term2);
    expect(highlighted2).toBe('A<span class="highlight">00</span>1');

    const text3 = 'طابعة إبسون';
    const term3 = '';
    const highlighted3 = component.highlightMatch(text3, term3);
    expect(highlighted3).toBe('طابعة إبسون');
  });
});
