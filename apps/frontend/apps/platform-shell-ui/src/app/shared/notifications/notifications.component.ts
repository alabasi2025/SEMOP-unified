import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

interface Notification {
  id: string;
  type: 'idea' | 'conversation' | 'report' | 'task';
  title: string;
  message: string;
  link: string;
  isRead: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notifications-container">
      <button class="notifications-btn" (click)="togglePanel()">
        <span class="icon">🔔</span>
        <span *ngIf="unreadCount > 0" class="badge">{{ unreadCount }}</span>
      </button>

      <div *ngIf="showPanel" class="notifications-panel">
        <div class="panel-header">
          <h3>🔔 الإشعارات</h3>
          <button *ngIf="unreadCount > 0" (click)="markAllAsRead()" class="mark-all-btn">
            ✓ تحديد الكل كمقروء
          </button>
        </div>

        <div class="notifications-list">
          <div *ngIf="notifications.length === 0" class="empty-state">
            <p>✅ لا توجد إشعارات جديدة</p>
          </div>

          <div
            *ngFor="let notification of notifications"
            class="notification-item"
            [class.unread]="!notification.isRead"
            (click)="openNotification(notification)"
          >
            <div class="notification-icon">{{ getTypeIcon(notification.type) }}</div>
            <div class="notification-content">
              <h4>{{ notification.title }}</h4>
              <p>{{ notification.message }}</p>
              <span class="notification-time">{{ formatTime(notification.createdAt) }}</span>
            </div>
            <button
              *ngIf="!notification.isRead"
              (click)="markAsRead(notification, $event)"
              class="mark-read-btn"
            >
              ✓
            </button>
          </div>
        </div>

        <div class="panel-footer">
          <button (click)="viewAll()" class="view-all-btn">عرض جميع الإشعارات</button>
        </div>
      </div>
    </div>

    <div *ngIf="showPanel" class="overlay" (click)="togglePanel()"></div>
  `,
  styles: [`
    .notifications-container {
      position: relative;
    }

    .notifications-btn {
      position: relative;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 8px;
      transition: all 0.3s;
    }

    .notifications-btn:hover {
      background: rgba(102, 126, 234, 0.1);
    }

    .notifications-btn .icon {
      font-size: 1.5rem;
    }

    .badge {
      position: absolute;
      top: 0;
      right: 0;
      background: #ef4444;
      color: white;
      font-size: 0.7rem;
      padding: 0.2rem 0.4rem;
      border-radius: 10px;
      min-width: 18px;
      text-align: center;
    }

    .notifications-panel {
      position: absolute;
      top: 100%;
      right: 0;
      width: 400px;
      max-height: 600px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      margin-top: 0.5rem;
      display: flex;
      flex-direction: column;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .panel-header h3 {
      margin: 0;
      font-size: 1.1rem;
    }

    .mark-all-btn {
      background: transparent;
      border: none;
      color: #667eea;
      cursor: pointer;
      font-size: 0.85rem;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      transition: all 0.3s;
    }

    .mark-all-btn:hover {
      background: rgba(102, 126, 234, 0.1);
    }

    .notifications-list {
      flex: 1;
      overflow-y: auto;
      max-height: 450px;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #718096;
    }

    .notification-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      border-bottom: 1px solid #e2e8f0;
      cursor: pointer;
      transition: all 0.3s;
      position: relative;
    }

    .notification-item:hover {
      background: #f7fafc;
    }

    .notification-item.unread {
      background: #f0f4ff;
    }

    .notification-item.unread::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 70%;
      background: #667eea;
      border-radius: 0 4px 4px 0;
    }

    .notification-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .notification-content {
      flex: 1;
    }

    .notification-content h4 {
      margin: 0 0 0.25rem 0;
      font-size: 0.95rem;
      color: #1a202c;
    }

    .notification-content p {
      margin: 0 0 0.5rem 0;
      font-size: 0.85rem;
      color: #4a5568;
      line-height: 1.4;
    }

    .notification-time {
      font-size: 0.75rem;
      color: #a0aec0;
    }

    .mark-read-btn {
      background: #667eea;
      color: white;
      border: none;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      cursor: pointer;
      flex-shrink: 0;
      transition: all 0.3s;
    }

    .mark-read-btn:hover {
      background: #5568d3;
    }

    .panel-footer {
      padding: 0.75rem;
      border-top: 1px solid #e2e8f0;
    }

    .view-all-btn {
      width: 100%;
      padding: 0.5rem;
      background: transparent;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      cursor: pointer;
      color: #667eea;
      font-weight: 600;
      transition: all 0.3s;
    }

    .view-all-btn:hover {
      background: #f7fafc;
      border-color: #667eea;
    }

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 999;
    }
  `]
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  unreadCount = 0;
  showPanel = false;
  private pollInterval: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadNotifications();
    // Poll for new notifications every 30 seconds
    this.pollInterval = setInterval(() => {
      this.loadNotifications();
    }, 30000);
  }

  ngOnDestroy() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  }

  async loadNotifications() {
    try {
      const response = await this.http.get<Notification[]>(
        `${environment.apiUrl}/api/notifications`
      ).toPromise();

      this.notifications = response || [];
      this.unreadCount = this.notifications.filter(n => !n.isRead).length;
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }

  togglePanel() {
    this.showPanel = !this.showPanel;
  }

  async markAsRead(notification: Notification, event: Event) {
    event.stopPropagation();
    
    try {
      await this.http.patch(
        `${environment.apiUrl}/api/notifications/${notification.id}/read`,
        {}
      ).toPromise();

      notification.isRead = true;
      this.unreadCount = Math.max(0, this.unreadCount - 1);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  async markAllAsRead() {
    try {
      await this.http.patch(
        `${environment.apiUrl}/api/notifications/read-all`,
        {}
      ).toPromise();

      this.notifications.forEach(n => n.isRead = true);
      this.unreadCount = 0;
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }

  openNotification(notification: Notification) {
    if (!notification.isRead) {
      this.markAsRead(notification, new Event('click'));
    }
    
    this.showPanel = false;
    this.router.navigateByUrl(notification.link);
  }

  viewAll() {
    this.showPanel = false;
    this.router.navigate(['/notifications']);
  }

  getTypeIcon(type: string): string {
    const icons: any = {
      idea: '💡',
      conversation: '💬',
      report: '📊',
      task: '✅'
    };
    return icons[type] || '🔔';
  }

  formatTime(date: string): string {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now.getTime() - notifDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays < 7) return `منذ ${diffDays} يوم`;
    
    return notifDate.toLocaleDateString('ar-SA');
  }
}
