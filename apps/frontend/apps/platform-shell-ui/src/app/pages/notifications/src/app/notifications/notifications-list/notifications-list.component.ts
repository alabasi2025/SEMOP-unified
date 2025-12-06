import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../notifications.service';
import { Notification, NotificationType } from '../models/notification.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.css'],
  providers: [MessageService]
})
export class NotificationsListComponent implements OnInit {
  notifications: Notification[] = [];
  unreadCount: number = 0;
  loading: boolean = true;
  NotificationType = NotificationType; // لإتاحة Enum في القالب

  constructor(
    private notificationsService: NotificationsService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadNotifications();
    this.loadUnreadCount();
  }

  loadNotifications(): void {
    this.loading = true;
    this.notificationsService.getNotifications().subscribe({
      next: (data) => {
        this.notifications = data;
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل في تحميل الإشعارات.' });
        this.loading = false;
      }
    });
  }

  loadUnreadCount(): void {
    this.notificationsService.getUnreadCount().subscribe({
      next: (data) => {
        this.unreadCount = data.count;
      },
      error: (err) => {
        console.error('فشل في تحميل عدد الإشعارات غير المقروءة', err);
      }
    });
  }

  markAsRead(notification: Notification): void {
    if (notification.isRead) return; // لا حاجة للتعليم إذا كان مقروءاً بالفعل

    this.notificationsService.markAsRead(notification.id, true).subscribe({
      next: (updatedNotification) => {
        notification.isRead = updatedNotification.isRead;
        this.loadUnreadCount();
        this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم تعليم الإشعار كمقروء.' });
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل في تعليم الإشعار كمقروء.' });
      }
    });
  }

  markAllAsRead(): void {
    this.notificationsService.markAllAsRead().subscribe({
      next: (response) => {
        this.notifications.forEach(n => n.isRead = true);
        this.unreadCount = 0;
        this.messageService.add({ severity: 'success', summary: 'نجاح', detail: `تم تعليم ${response.count} إشعار كمقروء.` });
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل في تعليم جميع الإشعارات كمقروءة.' });
      }
    });
  }

  getSeverity(type: NotificationType): string {
    switch (type) {
      case NotificationType.SYSTEM:
        return 'info';
      case NotificationType.ALERT:
        return 'danger';
      case NotificationType.INFO:
        return 'success';
      default:
        return 'secondary';
    }
  }
}
