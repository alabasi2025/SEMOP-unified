import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationItemComponent } from './notification-item.component';
import { Notification } from './notification.contracts';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule, NotificationItemComponent],
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent {
  @Input() notifications: Notification[] = [];
  @Input() loading: boolean = false;
  @Input() viewMode: 'list' | 'grid' = 'list';
  
  @Output() notificationRead = new EventEmitter<number>();
  @Output() notificationDelete = new EventEmitter<number>();
  @Output() bulkMarkAsRead = new EventEmitter<number[]>();
  @Output() bulkDelete = new EventEmitter<number[]>();

  // Bulk selection state
  selectedIds: Set<number> = new Set();
  selectAll: boolean = false;

  /**
   * Toggle select all
   */
  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
    
    if (this.selectAll) {
      // Select all notifications
      this.selectedIds = new Set(this.notifications.map(n => n.id));
    } else {
      // Deselect all
      this.selectedIds.clear();
    }
  }

  /**
   * Toggle individual selection
   */
  toggleSelection(id: number): void {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }

    // Update select all checkbox
    this.selectAll = this.selectedIds.size === this.notifications.length;
  }

  /**
   * Check if notification is selected
   */
  isSelected(id: number): boolean {
    return this.selectedIds.has(id);
  }

  /**
   * Get selected count
   */
  getSelectedCount(): number {
    return this.selectedIds.size;
  }

  /**
   * Has selections
   */
  hasSelections(): boolean {
    return this.selectedIds.size > 0;
  }

  /**
   * Bulk mark as read
   */
  onBulkMarkAsRead(): void {
    const ids = Array.from(this.selectedIds);
    this.bulkMarkAsRead.emit(ids);
    this.clearSelection();
  }

  /**
   * Bulk delete
   */
  onBulkDelete(): void {
    if (confirm(`هل أنت متأكد من حذف ${this.selectedIds.size} إشعار؟`)) {
      const ids = Array.from(this.selectedIds);
      this.bulkDelete.emit(ids);
      this.clearSelection();
    }
  }

  /**
   * Clear selection
   */
  clearSelection(): void {
    this.selectedIds.clear();
    this.selectAll = false;
  }

  /**
   * Handle notification read
   */
  handleNotificationRead(id: number): void {
    this.notificationRead.emit(id);
  }

  /**
   * Handle notification delete
   */
  handleNotificationDelete(id: number): void {
    this.notificationDelete.emit(id);
  }
}
