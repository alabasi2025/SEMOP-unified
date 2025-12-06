import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * واجهة تكوين العمود
 */
export interface ColumnConfig {
  field: string;
  header: string;
  sortable?: boolean;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'custom';
  width?: string;
  align?: 'left' | 'center' | 'right';
  format?: (value: any) => string;
}

/**
 * واجهة إجراء الصف
 */
export interface RowAction {
  icon: string;
  label: string;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  visible?: (row: any) => boolean;
  disabled?: (row: any) => boolean;
}

/**
 * واجهة حدث الفرز
 */
export interface SortEvent {
  field: string;
  direction: 'asc' | 'desc' | null;
}

/**
 * مكون جدول بيانات عام قابل لإعادة الاستخدام
 * يدعم الفرز، التصفح، الإجراءات، والتحميل
 */
@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, OnChanges {
  @Input() columns: ColumnConfig[] = [];
  @Input() data: any[] = [];
  @Input() loading: boolean = false;
  @Input() pageSize: number = 10;
  @Input() currentPage: number = 1;
  @Input() totalItems: number = 0;
  @Input() actions: RowAction[] = [];
  @Input() selectable: boolean = false;
  @Input() multiSelect: boolean = false;
  @Input() emptyMessage: string = 'لا توجد بيانات';
  @Input() responsive: boolean = true;

  @Output() rowClick = new EventEmitter<any>();
  @Output() actionClick = new EventEmitter<{ action: RowAction; row: any }>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<SortEvent>();
  @Output() selectionChange = new EventEmitter<any[]>();

  selectedRows: any[] = [];
  sortField: string | null = null;
  sortDirection: 'asc' | 'desc' | null = null;

  ngOnInit(): void {
    this.calculateTotalPages();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['pageSize']) {
      this.calculateTotalPages();
    }
  }

  /**
   * حساب إجمالي الصفحات
   */
  calculateTotalPages(): void {
    if (this.totalItems === 0) {
      this.totalItems = this.data.length;
    }
  }

  /**
   * معالجة النقر على الصف
   */
  onRowClick(row: any): void {
    if (!this.selectable) {
      this.rowClick.emit(row);
    }
  }

  /**
   * معالجة النقر على الإجراء
   */
  onActionClick(action: RowAction, row: any, event: Event): void {
    event.stopPropagation();
    if (!this.isActionDisabled(action, row)) {
      this.actionClick.emit({ action, row });
    }
  }

  /**
   * معالجة الفرز
   */
  onSort(column: ColumnConfig): void {
    if (!column.sortable) return;

    if (this.sortField === column.field) {
      // تغيير الاتجاه
      if (this.sortDirection === 'asc') {
        this.sortDirection = 'desc';
      } else if (this.sortDirection === 'desc') {
        this.sortDirection = null;
        this.sortField = null;
      }
    } else {
      // فرز جديد
      this.sortField = column.field;
      this.sortDirection = 'asc';
    }

    this.sortChange.emit({
      field: this.sortField || '',
      direction: this.sortDirection
    });
  }

  /**
   * معالجة تغيير الصفحة
   */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.pageChange.emit(page);
  }

  /**
   * معالجة اختيار الصف
   */
  onRowSelect(row: any, event: Event): void {
    event.stopPropagation();
    
    if (this.multiSelect) {
      const index = this.selectedRows.indexOf(row);
      if (index > -1) {
        this.selectedRows.splice(index, 1);
      } else {
        this.selectedRows.push(row);
      }
    } else {
      this.selectedRows = [row];
    }

    this.selectionChange.emit(this.selectedRows);
  }

  /**
   * معالجة اختيار الكل
   */
  onSelectAll(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    
    if (checkbox.checked) {
      this.selectedRows = [...this.data];
    } else {
      this.selectedRows = [];
    }

    this.selectionChange.emit(this.selectedRows);
  }

  /**
   * التحقق من اختيار الصف
   */
  isRowSelected(row: any): boolean {
    return this.selectedRows.includes(row);
  }

  /**
   * التحقق من اختيار الكل
   */
  isAllSelected(): boolean {
    return this.data.length > 0 && this.selectedRows.length === this.data.length;
  }

  /**
   * التحقق من رؤية الإجراء
   */
  isActionVisible(action: RowAction, row: any): boolean {
    return action.visible ? action.visible(row) : true;
  }

  /**
   * التحقق من تعطيل الإجراء
   */
  isActionDisabled(action: RowAction, row: any): boolean {
    return action.disabled ? action.disabled(row) : false;
  }

  /**
   * الحصول على قيمة الخلية
   */
  getCellValue(row: any, column: ColumnConfig): any {
    const value = row[column.field];
    
    if (column.format) {
      return column.format(value);
    }

    if (column.type === 'date' && value) {
      return new Date(value).toLocaleDateString('ar-SA');
    }

    if (column.type === 'boolean') {
      return value ? 'نعم' : 'لا';
    }

    return value;
  }

  /**
   * الحصول على أيقونة الفرز
   */
  getSortIcon(column: ColumnConfig): string {
    if (!column.sortable || this.sortField !== column.field) {
      return 'sort';
    }

    return this.sortDirection === 'asc' ? 'sort-up' : 'sort-down';
  }

  /**
   * الحصول على صفوف الهيكل التحميلي
   */
  get skeletonRows(): number[] {
    return Array(this.pageSize).fill(0);
  }

  /**
   * الحصول على إجمالي الصفحات
   */
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  /**
   * الحصول على رقم الصف
   */
  getRowNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }
}
