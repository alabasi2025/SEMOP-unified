import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationType } from './notification.contracts';

export interface NotificationFilter {
  types: NotificationType[];
  status: 'all' | 'read' | 'unread';
  dateRange: 'all' | 'today' | 'week' | 'month' | 'custom';
  priority: 'all' | 'low' | 'medium' | 'high';
  dateFrom?: Date;
  dateTo?: Date;
}

@Component({
  selector: 'app-notification-filter-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notification-filter-panel.component.html',
  styleUrls: ['./notification-filter-panel.component.css']
})
export class NotificationFilterPanelComponent {
  @Output() filterChange = new EventEmitter<NotificationFilter>();

  // Filter state
  selectedTypes: NotificationType[] = [];
  selectedStatus: 'all' | 'read' | 'unread' = 'all';
  selectedDateRange: 'all' | 'today' | 'week' | 'month' | 'custom' = 'all';
  selectedPriority: 'all' | 'low' | 'medium' | 'high' = 'all';
  customDateFrom?: Date;
  customDateTo?: Date;

  // Available options
  notificationTypes: NotificationType[] = ['info', 'success', 'warning', 'error'];
  statusOptions = [
    { value: 'all', label: 'الكل' },
    { value: 'read', label: 'مقروء' },
    { value: 'unread', label: 'غير مقروء' }
  ];
  dateRangeOptions = [
    { value: 'all', label: 'كل الأوقات' },
    { value: 'today', label: 'اليوم' },
    { value: 'week', label: 'آخر 7 أيام' },
    { value: 'month', label: 'آخر 30 يوم' },
    { value: 'custom', label: 'تخصيص' }
  ];
  priorityOptions = [
    { value: 'all', label: 'الكل' },
    { value: 'high', label: 'عالي' },
    { value: 'medium', label: 'متوسط' },
    { value: 'low', label: 'منخفض' }
  ];

  /**
   * Toggle type filter
   */
  toggleType(type: NotificationType): void {
    const index = this.selectedTypes.indexOf(type);
    if (index > -1) {
      this.selectedTypes.splice(index, 1);
    } else {
      this.selectedTypes.push(type);
    }
    this.emitFilter();
  }

  /**
   * Check if type is selected
   */
  isTypeSelected(type: NotificationType): boolean {
    return this.selectedTypes.includes(type);
  }

  /**
   * Change status filter
   */
  onStatusChange(): void {
    this.emitFilter();
  }

  /**
   * Change date range filter
   */
  onDateRangeChange(): void {
    this.emitFilter();
  }

  /**
   * Change priority filter
   */
  onPriorityChange(): void {
    this.emitFilter();
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.selectedTypes = [];
    this.selectedStatus = 'all';
    this.selectedDateRange = 'all';
    this.selectedPriority = 'all';
    this.customDateFrom = undefined;
    this.customDateTo = undefined;
    this.emitFilter();
  }

  /**
   * Get active filters count
   */
  getActiveFiltersCount(): number {
    let count = 0;
    if (this.selectedTypes.length > 0) count++;
    if (this.selectedStatus !== 'all') count++;
    if (this.selectedDateRange !== 'all') count++;
    if (this.selectedPriority !== 'all') count++;
    return count;
  }

  /**
   * Emit filter change event
   */
  private emitFilter(): void {
    const filter: NotificationFilter = {
      types: this.selectedTypes,
      status: this.selectedStatus,
      dateRange: this.selectedDateRange,
      priority: this.selectedPriority,
      dateFrom: this.customDateFrom,
      dateTo: this.customDateTo
    };
    this.filterChange.emit(filter);
  }

  /**
   * Get type icon
   */
  getTypeIcon(type: NotificationType): string {
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    };
    return icons[type];
  }

  /**
   * Get type label
   */
  getTypeLabel(type: NotificationType): string {
    const labels = {
      info: 'معلومات',
      success: 'نجاح',
      warning: 'تحذير',
      error: 'خطأ'
    };
    return labels[type];
  }
}
