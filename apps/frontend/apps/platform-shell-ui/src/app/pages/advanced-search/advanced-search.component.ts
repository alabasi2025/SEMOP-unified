// /root/task_outputs/Task2_Advanced_Search_Filters/frontend/advanced-search.component.ts
import { Component, OnInit } from '@angular/core';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InventoryService as ItemsService } from '../../features/inventory/services/inventory.service';
import { Item, AdvancedSearchFilter } from '../../features/inventory/models';


@Component({
  imports: [
    MultiSelectModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    InputNumberModule,
    AccordionModule,
    TableModule,
    FormsModule,
    TagModule
  ],
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
    
  ) { }

  ngOnInit(): void {
    // إعداد PrimeNG للغة العربية
    

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
