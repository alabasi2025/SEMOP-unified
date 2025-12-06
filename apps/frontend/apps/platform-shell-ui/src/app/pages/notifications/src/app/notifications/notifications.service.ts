import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification, UnreadCount, ReadNotificationRequest } from './models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private apiUrl = '/api/notifications'; // يجب تعديل المسار حسب إعدادات الـ Proxy

  constructor(private http: HttpClient) { }

  // الحصول على جميع الإشعارات
  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl);
  }

  // الحصول على عدد الإشعارات غير المقروءة
  getUnreadCount(): Observable<UnreadCount> {
    return this.http.get<UnreadCount>(`${this.apiUrl}/unread-count`);
  }

  // تعليم إشعار معين كمقروء/غير مقروء
  markAsRead(notificationId: number, isRead: boolean): Observable<Notification> {
    const body: ReadNotificationRequest = { notificationId, isRead };
    return this.http.post<Notification>(`${this.apiUrl}/read`, body);
  }

  // تعليم جميع الإشعارات كمقروءة
  markAllAsRead(): Observable<{ count: number }> {
    return this.http.post<{ count: number }>(`${this.apiUrl}/read-all`, {});
  }
}
