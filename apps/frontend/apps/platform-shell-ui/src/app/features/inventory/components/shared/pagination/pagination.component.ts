import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * @title PaginationComponent
 * @description مكون تقسيم الصفحات (Pagination) عام وقابل لإعادة الاستخدام.
 * يدعم الميزات الأساسية مثل التنقل بين الصفحات، تغيير حجم الصفحة، وعرض معلومات الإجمالي.
 * @inputs
 * - totalItems: العدد الكلي للعناصر.
 * - pageSize: عدد العناصر في الصفحة الواحدة.
 * - currentPage: رقم الصفحة الحالية (يبدأ من 1).
 * - pageSizeOptions: خيارات أحجام الصفحات المتاحة.
 * - showFirstLast: إظهار أزرار الصفحة الأولى والأخيرة.
 * - showPageNumbers: إظهار أرقام الصفحات مع علامات الحذف (...).
 * @outputs
 * - pageChange: ينبعث عند تغيير الصفحة.
 * - pageSizeChange: ينبعث عند تغيير حجم الصفحة.
 */
@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit, OnChanges {

  // الخصائص المدخلة (Inputs)

  /**
   * @description العدد الكلي للعناصر.
   */
  @Input() totalItems: number = 0;

  /**
   * @description عدد العناصر في الصفحة الواحدة.
   */
  @Input() pageSize: number = 10;

  /**
   * @description رقم الصفحة الحالية (يبدأ من 1).
   */
  @Input() currentPage: number = 1;

  /**
   * @description خيارات أحجام الصفحات المتاحة. القيمة الافتراضية: [10, 25, 50, 100].
   */
  @Input() pageSizeOptions: number[] = [10, 25, 50, 100];

  /**
   * @description إظهار أزرار الصفحة الأولى والأخيرة. القيمة الافتراضية: true.
   */
  @Input() showFirstLast: boolean = true;

  /**
   * @description إظهار أرقام الصفحات مع علامات الحذف (...). القيمة الافتراضية: true.
   */
  @Input() showPageNumbers: boolean = true;

  // الأحداث المخرجة (Outputs)

  /**
   * @description حدث ينبعث عند تغيير الصفحة. يحمل رقم الصفحة الجديدة.
   */
  @Output() pageChange = new EventEmitter<number>();

  /**
   * @description حدث ينبعث عند تغيير حجم الصفحة. يحمل حجم الصفحة الجديد.
   */
  @Output() pageSizeChange = new EventEmitter<number>();

  // الخصائص الداخلية للمكون

  /**
   * @description العدد الكلي للصفحات.
   */
  totalPages: number = 0;

  /**
   * @description مصفوفة أرقام الصفحات المعروضة في شريط التنقل.
   */
  pages: (number | string)[] = [];

  /**
   * @description رقم الصفحة الذي يتم إدخاله في حقل "القفز إلى صفحة".
   */
  jumpToPageNumber: number = 1;

  /**
   * @description عدد أرقام الصفحات المراد عرضها حول الصفحة الحالية.
   */
  private pageRange = 2;

  constructor() { }

  /**
   * @description تهيئة المكون عند التحميل.
   */
  ngOnInit(): void {
    this.calculatePagination();
  }

  /**
   * @description معالجة التغييرات في الخصائص المدخلة.
   * @param changes التغييرات التي حدثت في الخصائص.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalItems'] || changes['pageSize'] || changes['currentPage']) {
      this.calculatePagination();
    }
  }

  /**
   * @description حساب العدد الكلي للصفحات وتوليد مصفوفة أرقام الصفحات المعروضة.
   */
  calculatePagination(): void {
    // 1. حساب العدد الكلي للصفحات
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);

    // التأكد من أن الصفحة الحالية ضمن النطاق الصحيح
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages > 0 ? this.totalPages : 1;
    }
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }

    // تحديث رقم القفز إلى الصفحة
    this.jumpToPageNumber = this.currentPage;

    // 2. توليد مصفوفة أرقام الصفحات المعروضة
    if (!this.showPageNumbers || this.totalPages <= 1) {
      this.pages = [];
      return;
    }

    const pages: (number | string)[] = [];
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;
    const range = this.pageRange;

    // إضافة الصفحة الأولى
    pages.push(1);

    // حساب بداية ونهاية النطاق حول الصفحة الحالية
    let start = Math.max(2, currentPage - range);
    let end = Math.min(totalPages - 1, currentPage + range);

    // إضافة علامة الحذف الأولى إذا كانت البداية بعيدة عن الصفحة 1
    if (start > 2) {
      pages.push('...');
    }

    // إضافة أرقام الصفحات في النطاق
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // إضافة علامة الحذف الثانية إذا كانت النهاية بعيدة عن الصفحة الأخيرة
    if (end < totalPages - 1) {
      pages.push('...');
    }

    // إضافة الصفحة الأخيرة (إذا لم تكن هي الصفحة الأولى)
    if (totalPages > 1) {
      if (pages[pages.length - 1] !== totalPages) {
        pages.push(totalPages);
      }
    }

    // إزالة التكرارات الناتجة عن تداخل النطاقات
    this.pages = pages.filter((value, index, self) => {
      // إزالة التكرارات الرقمية
      if (typeof value === 'number' && self.indexOf(value) !== index) {
        return false;
      }
      // إزالة تكرار علامات الحذف المتجاورة
      if (value === '...' && self[index - 1] === '...') {
        return false;
      }
      return true;
    });
  }

  // طرق معالجة الأحداث

  /**
   * @description الانتقال إلى صفحة محددة.
   * @param page رقم الصفحة المراد الانتقال إليها.
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.pageChange.emit(this.currentPage);
      this.calculatePagination(); // إعادة حساب أرقام الصفحات المعروضة
    }
  }

  /**
   * @description الانتقال إلى الصفحة السابقة.
   */
  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  /**
   * @description الانتقال إلى الصفحة التالية.
   */
  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  /**
   * @description الانتقال إلى الصفحة الأولى.
   */
  firstPage(): void {
    this.goToPage(1);
  }

  /**
   * @description الانتقال إلى الصفحة الأخيرة.
   */
  lastPage(): void {
    this.goToPage(this.totalPages);
  }

  /**
   * @description معالجة تغيير حجم الصفحة.
   * @param event حدث التغيير من حقل الاختيار.
   */
  onPageSizeChange(event: Event): void {
    const newSize = +(event.target as HTMLSelectElement).value;
    if (newSize !== this.pageSize) {
      this.pageSize = newSize;
      // إعادة تعيين الصفحة الحالية إلى 1 عند تغيير حجم الصفحة
      this.currentPage = 1;
      this.pageSizeChange.emit(this.pageSize);
      this.calculatePagination();
    }
  }

  /**
   * @description معالجة القفز إلى صفحة محددة.
   */
  onJumpToPage(): void {
    const page = Math.floor(this.jumpToPageNumber);
    if (page >= 1 && page <= this.totalPages) {
      this.goToPage(page);
    } else {
      // إعادة تعيين القيمة في حقل الإدخال إلى الصفحة الحالية إذا كانت القيمة غير صالحة
      this.jumpToPageNumber = this.currentPage;
    }
  }

  /**
   * @description معالجة ضغط مفتاح Enter في حقل القفز إلى صفحة.
   * @param event حدث لوحة المفاتيح.
   */
  onJumpToPageKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onJumpToPage();
    }
  }

  /**
   * @description معالجة التنقل باستخدام مفاتيح الأسهم (Accessibility).
   * @param event حدث لوحة المفاتيح.
   */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // التحقق من أن التركيز ليس على حقل إدخال لمنع تداخل التنقل
    if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT')) {
      return;
    }

    switch (event.key) {
      case 'ArrowLeft': // السهم الأيسر: الصفحة السابقة (في سياق RTL، قد يكون العكس)
        // نفترض أن السهم الأيسر يعني "الخلف"
        this.prevPage();
        break;
      case 'ArrowRight': // السهم الأيمن: الصفحة التالية (في سياق RTL، قد يكون العكس)
        // نفترض أن السهم الأيمن يعني "الأمام"
        this.nextPage();
        break;
      case 'Home': // مفتاح Home: الصفحة الأولى
        this.firstPage();
        event.preventDefault(); // منع السلوك الافتراضي للمتصفح
        break;
      case 'End': // مفتاح End: الصفحة الأخيرة
        this.lastPage();
        event.preventDefault(); // منع السلوك الافتراضي للمتصفح
        break;
    }
  }

  /**
   * @description حساب نطاق العناصر المعروضة في الصفحة الحالية.
   * @returns سلسلة نصية تمثل نطاق العناصر (مثال: 1-10).
   */
  get itemRange(): string {
    if (this.totalItems === 0) {
      return '0';
    }
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalItems);
    return `${start}-${end}`;
  }

  /**
   * @description التحقق مما إذا كان زر التنقل معطلاً.
   * @param page رقم الصفحة المراد التحقق منه.
   * @returns القيمة المنطقية (true إذا كان معطلاً).
   */
  isPageDisabled(page: number): boolean {
    return page < 1 || page > this.totalPages;
  }
}
