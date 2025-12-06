import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
// افتراض مسار النماذج الهيكلية
import { Item, Category, InventoryStats } from '../inventory.models';

// افتراض استيراد المكونات المشتركة (يجب استبدالها بالمسارات الصحيحة)
// لأغراض هذا المكون، سنفترض وجود هذه المكونات كـ Standalone
import { DataTableComponent } from '../shared/data-table/data-table.component';
import { SearchBarComponent } from '../shared/search-bar/search-bar.component';
import { StatsCardComponent } from '../shared/stats-card/stats-card.component';

/**
 * @description مكون قائمة الأصناف (ItemListComponent)
 * يعرض قائمة بالأصناف مع ميزات البحث، التصفية، والتنقل بين الصفحات.
 * وهو مكون مستقل (Standalone Component) متوافق مع Angular 15+.
 */
@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    // المكونات المشتركة
    DataTableComponent,
    SearchBarComponent,
    StatsCardComponent
  ],
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit, OnDestroy {

  // -------------------------------------------------------------------
  // المدخلات (Inputs)
  // -------------------------------------------------------------------

  /**
   * @description قائمة الأصناف المراد عرضها
   */
  @Input({ required: true }) items: Item[] = [];

  /**
   * @description حالة التحميل (لعرض مؤشر التحميل)
   */
  @Input() loading: boolean = false;

  /**
   * @description عدد العناصر في الصفحة الواحدة
   */
  @Input() pageSize: number = 10;

  /**
   * @description رقم الصفحة الحالية
   */
  @Input() currentPage: number = 1;

  /**
   * @description إجمالي عدد العناصر
   */
  @Input() totalItems: number = 0;

  /**
   * @description إحصائيات المخزون لعرضها في بطاقات الإحصائيات
   */
  @Input() inventoryStats: InventoryStats | null = null;

  /**
   * @description قائمة الفئات المتاحة للفلترة
   */
  @Input() categories: Category[] = [];

  // -------------------------------------------------------------------
  // المخرجات (Outputs)
  // -------------------------------------------------------------------

  /**
   * @description ينبعث عند النقر على صنف معين (لفتح تفاصيل الصنف مثلاً)
   */
  @Output() itemClick = new EventEmitter<Item>();

  /**
   * @description ينبعث عند النقر على زر إضافة صنف جديد
   */
  @Output() addItem = new new EventEmitter<void>();

  /**
   * @description ينبعث عند النقر على زر تعديل صنف
   */
  @Output() editItem = new EventEmitter<Item>();

  /**
   * @description ينبعث عند النقر على زر حذف صنف
   */
  @Output() deleteItem = new EventEmitter<Item>();

  /**
   * @description ينبعث عند تغيير نص البحث
   */
  @Output() searchChange = new EventEmitter<string>();

  /**
   * @description ينبعث عند تغيير رقم الصفحة
   */
  @Output() pageChange = new EventEmitter<number>();

  /**
   * @description ينبعث عند اختيار فئة للفلترة
   */
  @Output() categoryFilterChange = new EventEmitter<number | null>();

  // -------------------------------------------------------------------
  // الخصائص الداخلية (Internal Properties)
  // -------------------------------------------------------------------

  /**
   * @description الموضوع المستخدم لمعالجة البحث بشكل تفاعلي (RxJS)
   */
  private searchTerms = new Subject<string>();

  /**
   * @description الاشتراك في موضوع البحث لإلغائه عند تدمير المكون
   */
  private searchSubscription!: Subscription;

  /**
   * @description القيمة الحالية لنص البحث
   */
  public currentSearchTerm: string = '';

  /**
   * @description القيمة الحالية للفئة المختارة للفلترة
   */
  public selectedCategoryId: number | null = null;

  // -------------------------------------------------------------------
  // دورة حياة المكون (Lifecycle Hooks)
  // -------------------------------------------------------------------

  ngOnInit(): void {
    // تطبيق البرمجة التفاعلية (Reactive Programming) على حقل البحث
    // يتم تأخير الانبعاث بـ 300 مللي ثانية وتجاهل القيم المتكررة
    this.searchSubscription = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(term => {
      // إرسال قيمة البحث النهائية إلى المكون الأب
      this.searchChange.emit(term);
    });
  }

  ngOnDestroy(): void {
    // إلغاء الاشتراك لتجنب تسرب الذاكرة
    this.searchSubscription.unsubscribe();
  }

  // -------------------------------------------------------------------
  // معالجات الأحداث (Event Handlers)
  // -------------------------------------------------------------------

  /**
   * @description معالجة تغيير نص البحث من مكون SearchBarComponent
   * @param term نص البحث الجديد
   */
  onSearch(term: string): void {
    this.currentSearchTerm = term;
    // إرسال النص إلى الموضوع لمعالجته تفاعلياً
    this.searchTerms.next(term);
  }

  /**
   * @description معالجة تغيير الفئة المختارة للفلترة
   * @param categoryId معرف الفئة الجديدة
   */
  onCategoryChange(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    this.categoryFilterChange.emit(categoryId);
  }

  /**
   * @description معالجة تغيير الصفحة
   * @param page رقم الصفحة الجديدة
   */
  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }

  /**
   * @description معالجة النقر على زر إضافة صنف
   */
  onAddItem(): void {
    this.addItem.emit();
  }

  /**
   * @description معالجة النقر على زر تعديل صنف
   * @param item الصنف المراد تعديله
   */
  onEditItem(item: Item): void {
    this.editItem.emit(item);
  }

  /**
   * @description معالجة النقر على زر حذف صنف
   * @param item الصنف المراد حذفه
   */
  onDeleteItem(item: Item): void {
    this.deleteItem.emit(item);
  }

  /**
   * @description معالجة النقر على صنف في الجدول
   * @param item الصنف الذي تم النقر عليه
   */
  onItemClick(item: Item): void {
    this.itemClick.emit(item);
  }

  /**
   * @description معالجة النقر على زر تصدير Excel
   */
  onExportToExcel(): void {
    // منطق تصدير البيانات إلى Excel (يمكن أن يكون EventEmitter آخر)
    console.log('Exporting items to Excel...');
    // في تطبيق حقيقي، قد يتم إرسال حدث أو استدعاء خدمة
  }

  // -------------------------------------------------------------------
  // خصائص مساعدة (Helper Properties)
  // -------------------------------------------------------------------

  /**
   * @description تعريف أعمدة الجدول
   */
  public tableColumns = [
    { key: 'name', label: 'اسم الصنف' },
    { key: 'sku', label: 'الرمز' },
    { key: 'category.name', label: 'الفئة' },
    { key: 'stockQuantity', label: 'الرصيد الحالي' },
    { key: 'price', label: 'السعر' },
    { key: 'actions', label: 'الإجراءات' }
  ];
}
