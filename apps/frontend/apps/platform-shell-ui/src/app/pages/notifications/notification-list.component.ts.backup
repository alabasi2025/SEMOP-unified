import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Notification } from './notification.contracts';
import { NotificationItemComponent } from './notification-item.component';

/**
 * NotificationListComponent
 * 
 * @description
 * Component for displaying a list of notifications.
 * Uses NotificationItemComponent for each notification.
 * Handles loading and empty states.
 */
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
  @Output() onNotificationRead = new EventEmitter<number>();
  @Output() onNotificationDelete = new EventEmitter<number>();

  /**
   * Track notifications by ID for performance
   */
  trackByNotificationId(index: number, item: Notification): number {
    return item.id;
  }

  /**
   * Handle notification read event
   */
  handleRead(id: number): void {
    this.onNotificationRead.emit(id);
  }

  /**
   * Handle notification delete event
   */
  handleDelete(id: number): void {
    this.onNotificationDelete.emit(id);
  }
}
