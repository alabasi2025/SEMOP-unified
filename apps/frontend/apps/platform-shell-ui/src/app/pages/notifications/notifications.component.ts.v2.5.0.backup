import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService } from './notification.service';
import { NotificationSoundService } from './notification-sound.service';
import { NotificationRealtimeService } from './notification-realtime.service';
import { NotificationListComponent } from './notification-list.component';
import { NotificationBadgeComponent } from './notification-badge.component';
import { Notification } from './notification.contracts';

/**
 * NotificationsComponent
 * 
 * @description
 * Main integration component for the notification system.
 * Combines all services and components into a working system.
 */
@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule,
    NotificationListComponent,
    NotificationBadgeComponent
  ],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  // Services
  private notificationService = inject(NotificationService);
  private soundService = inject(NotificationSoundService);
  private realtimeService = inject(NotificationRealtimeService);

  // State
  notifications: Notification[] = [];
  unreadCount: number = 0;
  loading: boolean = false;
  showPanel: boolean = false;
  soundEnabled: boolean = true;

  // Subscriptions
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.loadNotifications();
    this.subscribeToUnreadCount();
    this.subscribeToRealtimeNotifications();
    this.connectRealtime();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.realtimeService.disconnect();
  }

  /**
   * Load all notifications
   */
  loadNotifications(): void {
    this.loading = true;
    const sub = this.notificationService.getNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
        this.loading = false;
      }
    });
    this.subscriptions.push(sub);
  }

  /**
   * Subscribe to unread count changes
   */
  subscribeToUnreadCount(): void {
    const sub = this.notificationService.unreadCount$.subscribe(count => {
      this.unreadCount = count;
    });
    this.subscriptions.push(sub);
  }

  /**
   * Subscribe to real-time notifications
   */
  subscribeToRealtimeNotifications(): void {
    const sub = this.realtimeService.notifications$.subscribe(notification => {
      // Add new notification to the list
      this.notifications = [notification, ...this.notifications];
      
      // Play sound if enabled
      if (this.soundEnabled) {
        this.soundService.playNotificationSound(notification.type);
      }
      
      // Show notification panel
      this.showPanel = true;
    });
    this.subscriptions.push(sub);
  }

  /**
   * Connect to realtime service
   */
  connectRealtime(): void {
    this.realtimeService.connect();
  }

  /**
   * Toggle notification panel
   */
  togglePanel(): void {
    this.showPanel = !this.showPanel;
  }

  /**
   * Handle notification read
   */
  handleNotificationRead(id: number): void {
    const sub = this.notificationService.markAsRead(id).subscribe({
      next: (updatedNotification) => {
        // Update notification in list
        const index = this.notifications.findIndex(n => n.id === id);
        if (index !== -1) {
          this.notifications[index] = updatedNotification;
        }
      },
      error: (error) => {
        console.error('Error marking notification as read:', error);
      }
    });
    this.subscriptions.push(sub);
  }

  /**
   * Handle notification delete
   */
  handleNotificationDelete(id: number): void {
    const sub = this.notificationService.deleteNotification(id).subscribe({
      next: () => {
        // Remove notification from list
        this.notifications = this.notifications.filter(n => n.id !== id);
      },
      error: (error) => {
        console.error('Error deleting notification:', error);
      }
    });
    this.subscriptions.push(sub);
  }

  /**
   * Mark all as read
   */
  markAllAsRead(): void {
    const sub = this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.loadNotifications();
      },
      error: (error) => {
        console.error('Error marking all as read:', error);
      }
    });
    this.subscriptions.push(sub);
  }

  /**
   * Toggle sound
   */
  toggleSound(): void {
    this.soundEnabled = !this.soundEnabled;
    this.soundService.toggleSound(this.soundEnabled);
  }

  /**
   * Refresh notifications
   */
  refresh(): void {
    this.loadNotifications();
  }
}
