import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject, Subscription, of, debounceTime, distinctUntilChanged, switchMap, catchError, tap } from 'rxjs';
import { Item, Category, Unit } from '../inventory.models'; // افتراض أن الملف في المجلد الأب

// تعريف واجهة حقل البحث المسموح به
export type SearchField = 'code' | 'name' | 'barcode';

// ********************************************************************
// مكون وهمي لـ SearchBarComponent - يجب استبداله بالاستيراد الفعلي
// ********************************************************************
@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <input
      #input
      [placeholder]="placeholder"
      [value]="searchTerm"
      (input)="onInput($event)"
      (keydown)="onKeyDown($event)"
      class="search-input"
      type="text"
    />
  `,
  styles: [
    `
      .search-input {
        width: 100%;
        padding: 10px;
        border: 1px solid var(--border-color, #ccc);
        border-radius: 4px;
        box-sizing: border-box;
        font-size: 16px;
      }
    `,
  ],
})
export class SearchBarComponent {
  @Input() placeholder: string = '';
  @Input() searchTerm: string = '';
  @Output() searchChange = new EventEmitter<string>();
  @Output() keyDown = new EventEmitter<KeyboardEvent>();

  @ViewChild('input') inputRef!: ElementRef<HTMLInputElement>;

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchChange.emit(value);
  }

  onKeyDown(event: KeyboardEvent): void {
    this.keyDown.emit(event);
  }

  focus(): void {
    this.inputRef.nativeElement.focus();
  }
}

// ********************************************************************
// خدمة وهمية للبحث - يجب استبدالها بالخدمة الفعلية
// ********************************************************************
class InventoryService {
  // بيانات وهمية
  private mockItems: Item[] = [
    { id: 1, code: 'A001', name: 'لابتوب ديل', barcode: '1234567890123', category: { id: 1, name: 'إلكترونيات' }, unit: { id: 1, name: 'قطعة' }, stockQuantity: 15 },
    { id: 2, code: 'B002', name: 'شاشة سامسونج', barcode: '2345678901234', category: { id: 1, name: 'إلكترونيات' }, unit: { id: 1, name: 'قطعة' }, stockQuantity: 22 },
    { id: 3, code: 'C003', name: 'طابعة إبسون', barcode: '3456789012345', category: { id: 2, name: 'مكتبية' }, unit: { id: 1, name: 'قطعة' }, stockQuantity: 8 },
    { id: 4, code: 'D004', name: 'ورق A4', barcode: '4567890123456', category: { id: 2, name: 'مكتبية' }, unit: { id: 2, name: 'حزمة' }, stockQuantity: 150 },
    { id: 5, code: 'E005', name: 'ماوس لاسلكي', barcode: '5678901234567', category: { id: 1, name: 'إلكترونيات' }, unit: { id: 1, name: 'قطعة' }, stockQuantity: 40 },
  ];

  /**
   * @description محاكاة لعملية البحث عن الأصناف بناءً على مصطلح البحث وحقول البحث المحددة.
   * @param term مصطلح البحث.
   * @param fields حقول البحث المحددة.
   * @returns Observable<Item[]> قائمة الأصناف المطابقة.
   */
  searchItems(term: string, fields: SearchField[]): Observable<Item[]> {
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
    // محاكاة تأخير الشبكة
    return of(results).pipe(debounceTime(100));
  }
}

// ********************************************************************
// المكون الرئيسي: ItemSearchComponent
// ********************************************************************
@Component({
  selector: 'app-item-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SearchBarComponent],
  templateUrl: './item-search.component.html',
  styleUrls: ['./item-search.component.scss'],
  providers: [InventoryService], // توفير الخدمة محلياً
})
export class ItemSearchComponent implements OnInit, OnDestroy {
  // ********************************************************************
  // المدخلات (Inputs)
  // ********************************************************************
  /** @description النص الظاهر في حقل البحث. */
  @Input() placeholder: string = 'ابحث عن صنف...';
  /** @description حقول البحث التي سيتم البحث فيها. */
  @Input() searchFields: SearchField[] = ['code', 'name', 'barcode'];
  /** @description هل يجب عرض قائمة النتائج المنسدلة. */
  @Input() showResults: boolean = true;

  // ********************************************************************
  // المخرجات (Outputs)
  // ********************************************************************
  /** @description يُطلق عند تغيير مصطلح البحث. */
  @Output() search = new EventEmitter<string>();
  /** @description يُطلق عند اختيار صنف من قائمة النتائج. */
  @Output() itemSelect = new EventEmitter<Item>();
  /** @description يُطلق عند مسح حقل البحث أو إلغاء الاختيار. */
  @Output() clear = new EventEmitter<void>();

  // ********************************************************************
  // الخصائص الداخلية
  // ********************************************************************
  /** @description الموضوع الذي يحمل مصطلح البحث الحالي. */
  private searchTerms = new Subject<string>();
  /** @description قائمة الأصناف الناتجة عن البحث. */
  public items$!: Observable<Item[]>;
  /** @description حالة التحميل (Loading state). */
  public isLoading: boolean = false;
  /** @description الصنف المختار حالياً (للتنقل بلوحة المفاتيح). */
  public selectedIndex: number = -1;
  /** @description مصطلح البحث الحالي. */
  public currentSearchTerm: string = '';
  /** @description الصنف الذي تم اختياره وتثبيته. */
  public selectedItem: Item | null = null;
  /** @description اشتراكات RxJS. */
  private subscriptions: Subscription = new Subscription();

  @ViewChild(SearchBarComponent) searchBar!: SearchBarComponent;
  @ViewChild('resultsList') resultsList!: ElementRef;

  constructor(private inventoryService: InventoryService) {}

  // ********************************************************************
  // دورة حياة المكون
  // ********************************************************************
  ngOnInit(): void {
    // إعداد تدفق البحث التفاعلي
    this.items$ = this.searchTerms.pipe(
      // تأخير البحث لتجنب الضغط المفرط على الخادم
      debounceTime(300),
      // التأكد من أن المصطلح قد تغير
      distinctUntilChanged(),
      // إظهار حالة التحميل
      tap(() => {
        this.isLoading = true;
        this.selectedIndex = -1; // إعادة تعيين المؤشر عند بدء بحث جديد
      }),
      // التبديل إلى Observable جديد للبحث
      switchMap((term: string) => {
        this.currentSearchTerm = term;
        this.search.emit(term); // إطلاق حدث البحث
        if (!term) {
          this.isLoading = false;
          return of([]); // إرجاع قائمة فارغة إذا كان المصطلح فارغاً
        }
        // استدعاء خدمة البحث
        return this.inventoryService.searchItems(term, this.searchFields).pipe(
          tap(() => this.isLoading = false), // إخفاء حالة التحميل عند الانتهاء
          catchError(error => {
            console.error('Error during item search:', error);
            this.isLoading = false;
            // معالجة الأخطاء: يمكن إرجاع Observable فارغ أو رسالة خطأ
            return of([]);
          })
        );
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // ********************************************************************
  // معالجة الأحداث
  // ********************************************************************

  /**
   * @description يتم استدعاؤها عند إدخال نص في حقل البحث.
   * @param term مصطلح البحث الجديد.
   */
  onSearchChange(term: string): void {
    this.selectedItem = null; // إلغاء اختيار الصنف المثبت
    this.searchTerms.next(term);
  }

  /**
   * @description يتم استدعاؤها عند اختيار صنف من قائمة النتائج.
   * @param item الصنف المختار.
   */
  selectItem(item: Item): void {
    this.selectedItem = item;
    this.currentSearchTerm = `${item.code} - ${item.name}`; // عرض الصنف المختار في حقل البحث
    this.itemSelect.emit(item);
    this.searchTerms.next(''); // إفراغ الموضوع لإخفاء النتائج
    this.selectedIndex = -1; // إعادة تعيين المؤشر
  }

  /**
   * @description مسح حقل البحث وإعادة تعيين الحالة.
   */
  clearSearch(): void {
    this.currentSearchTerm = '';
    this.selectedItem = null;
    this.searchTerms.next('');
    this.clear.emit();
    this.searchBar.focus();
  }

  /**
   * @description تمييز النص المطابق في النتيجة.
   * @param text النص الأصلي.
   * @param term مصطلح البحث.
   * @returns سلسلة HTML مع تمييز النص.
   */
  highlightMatch(text: string, term: string): string {
    if (!term) {
      return text;
    }
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  }

  // ********************************************************************
  // التنقل بلوحة المفاتيح (Keyboard Navigation)
  // ********************************************************************

  /**
   * @description معالجة ضغطات المفاتيح للتنقل في قائمة النتائج.
   * @param event حدث لوحة المفاتيح.
   * @param items قائمة الأصناف الحالية.
   */
  handleKeyDown(event: KeyboardEvent, items: Item[] | null): void {
    if (!items || items.length === 0) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault(); // منع تحريك المؤشر في حقل الإدخال
        this.selectedIndex = (this.selectedIndex + 1) % items.length;
        this.scrollToSelected();
        break;
      case 'ArrowUp':
        event.preventDefault(); // منع تحريك المؤشر في حقل الإدخال
        this.selectedIndex = (this.selectedIndex - 1 + items.length) % items.length;
        this.scrollToSelected();
        break;
      case 'Enter':
        if (this.selectedIndex >= 0) {
          event.preventDefault();
          this.selectItem(items[this.selectedIndex]);
        }
        break;
      case 'Escape':
        this.searchTerms.next(''); // إخفاء قائمة النتائج
        this.selectedIndex = -1;
        break;
    }
  }

  /**
   * @description تمرير القائمة لعرض العنصر المختار.
   */
  private scrollToSelected(): void {
    if (this.resultsList && this.selectedIndex >= 0) {
      const listElement = this.resultsList.nativeElement;
      const selectedElement = listElement.children[this.selectedIndex] as HTMLElement;

      if (selectedElement) {
        const listRect = listElement.getBoundingClientRect();
        const selectedRect = selectedElement.getBoundingClientRect();

        // التمرير للأعلى إذا كان العنصر المختار أعلى منطقة العرض
        if (selectedRect.top < listRect.top) {
          listElement.scrollTop -= (listRect.top - selectedRect.top);
        }
        // التمرير للأسفل إذا كان العنصر المختار أسفل منطقة العرض
        else if (selectedRect.bottom > listRect.bottom) {
          listElement.scrollTop += (selectedRect.bottom - listRect.bottom);
        }
      }
    }
  }
}
