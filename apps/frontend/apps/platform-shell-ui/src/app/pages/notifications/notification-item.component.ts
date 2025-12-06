import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Notification } from './notification.contracts';

/**
 * NotificationItemComponent
 * 
 * @description
 * Component for displaying a single notification item.
 * Shows notification icon, title, message, and timestamp.
 * Provides actions for marking as read and deleting.
 */
@Component({
  selector: 'app-notification-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.css']
})
export class NotificationItemComponent {
  @Input() notification!: Notification;
  @Output() read = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();

  /**
   * Get icon class based on notification type
   */
  getIconClass(): string {
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    };
    return icons[this.notification.type] || 'ℹ️';
  }

  /**
   * Get background color class based on notification type
   */
  getTypeClass(): string {
    return `notification-${this.notification.type}`;
  }

  /**
   * Format timestamp to relative time
   */
  getRelativeTime(): string {
    const date = new Date(this.notification.createdAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    return `منذ ${diffDays} يوم`;
  }

  /**
   * Mark notification as read
   */
  markAsRead(): void {
    if (!this.notification.isRead) {
      this.read.emit(this.notification.id);
    }
  }

  /**
   * Delete notification
   */
  deleteNotification(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.notification.id);
  }
}
