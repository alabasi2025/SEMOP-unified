// /root/task_outputs/Task2_Advanced_Search_Filters/frontend/advanced-search.component.ts
import { Component, OnInit } from '@angular/core';
import { ItemsService } from '../items.service';
import { Item, AdvancedSearchFilter } from '../item.interface';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.css']
})
export class AdvancedSearchComponent implements OnInit {
  items: Item[] = [];
  loading: boolean = false;
  filter: AdvancedSearchFilter = {
    page: 1,
    pageSize: 10,
    sortBy: 'id',
    sortOrder: 'ASC'
  };

  // خيارات الفلاتر
  categories: string[] = [];
  statuses: string[] = [];

  constructor(
    private itemsService: ItemsService,
    private primengConfig: PrimeNGConfig // لإعداد PrimeNG
  ) { }

  ngOnInit(): void {
    // إعداد PrimeNG للغة العربية
    this.primengConfig.ripple = true;
    this.primengConfig.setTranslation({
      startsWith: 'يبدأ بـ',
      contains: 'يحتوي على',
      notContains: 'لا يحتوي على',
      endsWith: 'ينتهي بـ',
      equals: 'يساوي',
      notEquals: 'لا يساوي',
      noFilter: 'بدون فلتر',
      // ... المزيد من الترجمات حسب الحاجة
    });

    this.itemsService.getFilterOptions().subscribe(options => {
      this.categories = options.categories;
      this.statuses = options.statuses;
    });

    this.performSearch();
  }

  /**
   * تنفيذ عملية البحث المتقدم.
   */
  performSearch(): void {
    this.loading = true;
    this.itemsService.advancedSearch(this.filter).subscribe({
      next: (data) => {
        this.items = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('خطأ في البحث المتقدم:', err);
        this.loading = false;
        // يمكن إضافة معالجة خطأ أفضل هنا
      }
    });
  }

  /**
   * إعادة تعيين الفلاتر إلى القيم الافتراضية.
   */
  resetFilters(): void {
    this.filter = {
      page: 1,
      pageSize: 10,
      sortBy: 'id',
      sortOrder: 'ASC'
    };
    this.performSearch();
  }

  /**
   * معالجة تغييرات الترتيب والتقسيم (إذا كانت مدمجة في جدول PrimeNG).
   * @param event حدث التغيير.
   */
  onLazyLoad(event: any): void {
    // في حالة استخدام p-table مع خاصية [lazy]="true"
    this.filter.page = (event.first / event.rows) + 1;
    this.filter.pageSize = event.rows;
    this.filter.sortBy = event.sortField || 'id';
    this.filter.sortOrder = event.sortOrder === 1 ? 'ASC' : 'DESC';
    this.performSearch();
  }
}
