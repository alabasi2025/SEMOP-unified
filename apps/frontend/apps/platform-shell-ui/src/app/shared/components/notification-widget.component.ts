import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Notification {
  id: number;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

@Component({
  selector: 'app-notification-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-widget">
      <!-- Bell Icon with Badge -->
      <button class="notification-bell" (click)="togglePanel()" [class.has-unread]="unreadCount > 0">
        <span class="bell-icon">🔔</span>
        <span class="badge" *ngIf="unreadCount > 0">{{unreadCount}}</span>
      </button>

      <!-- Notification Panel (Modal) -->
      <div class="notification-panel" *ngIf="isPanelOpen" [@slideIn]>
        <div class="panel-header">
          <h3>الإشعارات</h3>
          <div class="header-actions">
            <button class="mark-all-read" (click)="markAllAsRead()" *ngIf="unreadCount > 0">
              ✓ تحديد الكل كمقروء
            </button>
            <button class="close-btn" (click)="togglePanel()">×</button>
          </div>
        </div>

        <div class="panel-body">
          <div class="notifications-list" *ngIf="notifications.length > 0">
            <div *ngFor="let notification of notifications" 
                 class="notification-item"
                 [class.unread]="!notification.isRead"
                 [class]="notification.type">
              <div class="notification-content">
                <div class="notification-header">
                  <span class="notification-title">{{notification.title}}</span>
                  <span class="notification-time">{{getTimeAgo(notification.timestamp)}}</span>
                </div>
                <p class="notification-message">{{notification.message}}</p>
              </div>
              <div class="notification-actions">
                <button *ngIf="!notification.isRead" 
                        (click)="markAsRead(notification.id)"
                        class="mark-read-btn" 
                        title="تحديد كمقروء">
                  ✓
                </button>
                <button (click)="deleteNotification(notification.id)" 
                        class="delete-btn"
                        title="حذف">
                  🗑️
                </button>
              </div>
            </div>
          </div>

          <div class="empty-state" *ngIf="notifications.length === 0">
            <span class="empty-icon">📭</span>
            <p>لا توجد إشعارات</p>
          </div>
        </div>

        <div class="panel-footer">
          <button class="view-all-btn" (click)="viewAll()">
            عرض جميع الإشعارات
          </button>
        </div>
      </div>

      <!-- Backdrop -->
      <div class="backdrop" *ngIf="isPanelOpen" (click)="togglePanel()"></div>
    </div>
  `,
  styles: [`
    .notification-widget {
      position: relative;
    }

    .notification-bell {
      position: relative;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .notification-bell:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .bell-icon {
      font-size: 20px;
      display: block;
    }

    .badge {
      position: absolute;
      top: 4px;
      right: 4px;
      background: #ef4444;
      color: white;
      font-size: 11px;
      font-weight: bold;
      padding: 2px 6px;
      border-radius: 10px;
      min-width: 18px;
      text-align: center;
    }

    .notification-panel {
      position: fixed;
      top: 60px;
      right: 20px;
      width: 400px;
      max-height: 600px;
      background: #1e293b;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .panel-header {
      padding: 16px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .panel-header h3 {
      margin: 0;
      font-size: 18px;
      color: #f1f5f9;
    }

    .header-actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .mark-all-read {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .mark-all-read:hover {
      background: #2563eb;
    }

    .close-btn {
      background: transparent;
      border: none;
      color: #94a3b8;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      transition: all 0.2s;
    }

    .close-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #f1f5f9;
    }

    .panel-body {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
    }

    .notifications-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .notification-item {
      background: #0f172a;
      border-radius: 8px;
      padding: 12px;
      border-left: 3px solid transparent;
      display: flex;
      gap: 12px;
      transition: all 0.2s;
    }

    .notification-item:hover {
      background: #1e293b;
    }

    .notification-item.unread {
      background: rgba(59, 130, 246, 0.1);
    }

    .notification-item.info { border-left-color: #3b82f6; }
    .notification-item.success { border-left-color: #10b981; }
    .notification-item.warning { border-left-color: #f59e0b; }
    .notification-item.error { border-left-color: #ef4444; }

    .notification-content {
      flex: 1;
    }

    .notification-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    .notification-title {
      font-weight: 600;
      color: #f1f5f9;
      font-size: 14px;
    }

    .notification-time {
      font-size: 11px;
      color: #64748b;
    }

    .notification-message {
      margin: 0;
      font-size: 13px;
      color: #94a3b8;
      line-height: 1.4;
    }

    .notification-actions {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .mark-read-btn, .delete-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      font-size: 14px;
      transition: all 0.2s;
    }

    .mark-read-btn:hover {
      background: rgba(16, 185, 129, 0.2);
    }

    .delete-btn:hover {
      background: rgba(239, 68, 68, 0.2);
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #64748b;
    }

    .empty-icon {
      font-size: 48px;
      display: block;
      margin-bottom: 12px;
    }

    .panel-footer {
      padding: 12px 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .view-all-btn {
      width: 100%;
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #3b82f6;
      padding: 10px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
    }

    .view-all-btn:hover {
      background: rgba(59, 130, 246, 0.1);
      border-color: #3b82f6;
    }

    .backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
      z-index: 999;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .notification-panel {
        right: 10px;
        left: 10px;
        width: auto;
      }
    }
  `]
})
export class NotificationWidgetComponent implements OnInit {
  isPanelOpen = false;
  notifications: Notification[] = [];
  unreadCount = 0;

  ngOnInit() {
    this.loadMockNotifications();
    this.updateUnreadCount();
  }

  togglePanel() {
    this.isPanelOpen = !this.isPanelOpen;
  }

  loadMockNotifications() {
    // Generate 10 mock notifications
    const types: Array<'info' | 'success' | 'warning' | 'error'> = ['info', 'success', 'warning', 'error'];
    const titles = [
      'تحديث جديد متاح',
      'تم إكمال العملية بنجاح',
      'تحذير: مهلة قريبة',
      'خطأ في النظام',
      'رسالة جديدة',
      'تم الموافقة على الطلب',
      'انتباه: تحديث مطلوب',
      'فشل في الاتصال',
      'معلومة مهمة',
      'تم الحفظ بنجاح'
    ];
    
    const messages = [
      'يوجد تحديث جديد للنظام. يرجى التحديث في أقرب وقت.',
      'تمت العملية بنجاح وتم حفظ جميع التغييرات.',
      'لديك مهمة يجب إكمالها قبل نهاية اليوم.',
      'حدث خطأ أثناء معالجة الطلب. يرجى المحاولة مرة أخرى.',
      'لديك رسالة جديدة من أحمد محمد.',
      'تمت الموافقة على طلبك رقم #12345.',
      'يجب تحديث معلومات الملف الشخصي الخاص بك.',
      'فشل الاتصال بالخادم. يرجى التحقق من الاتصال.',
      'تم إضافة ميزة جديدة إلى النظام.',
      'تم حفظ المستند بنجاح في المجلد المحدد.'
    ];

    this.notifications = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      type: types[i % types.length],
      title: titles[i],
      message: messages[i],
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 3), // Random time in last 3 days
      isRead: Math.random() > 0.4 // 40% unread
    }));

    // Sort by timestamp (newest first)
    this.notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  updateUnreadCount() {
    this.unreadCount = this.notifications.filter(n => !n.isRead).length;
  }

  markAsRead(id: number) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = true;
      this.updateUnreadCount();
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.isRead = true);
    this.updateUnreadCount();
  }

  deleteNotification(id: number) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.updateUnreadCount();
  }

  getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${days} يوم`;
  }

  viewAll() {
    this.isPanelOpen = false;
    // Navigate to full notifications page
    // this.router.navigate(['/notifications']);
  }
}
