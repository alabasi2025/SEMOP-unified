import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, throwError, delay, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  INotificationService,
  Notification,
  CreateNotificationPayload,
  UpdateNotificationPayload
} from './notification.contracts';

/**
 * NotificationService
 * 
 * @description
 * Core service for managing notifications in the SEMOP ERP system.
 * Implements INotificationService from API Contract.
 * 
 * @implements {INotificationService}
 * @see notification.contracts.ts
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService implements INotificationService {
  // Internal state using BehaviorSubject for reactive updates
  private notificationsSubject = new BehaviorSubject<Notification[]>([
    {
      id: 1,
      type: 'info',
      title: 'مرحباً بك في نظام SEMOP',
      message: 'تم تسجيل دخولك بنجاح',
      isRead: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      userId: 1
    },
    {
      id: 2,
      type: 'success',
      title: 'تم حفظ البيانات',
      message: 'تم حفظ بيانات العميل بنجاح',
      isRead: true,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      userId: 1
    },
    {
      id: 3,
      type: 'warning',
      title: 'تنبيه',
      message: 'يوجد فواتير مستحقة الدفع',
      isRead: false,
      createdAt: new Date(Date.now() - 10800000).toISOString(),
      userId: 1
    },
    {
      id: 4,
      type: 'error',
      title: 'خطأ في النظام',
      message: 'فشل الاتصال بقاعدة البيانات',
      isRead: false,
      createdAt: new Date(Date.now() - 14400000).toISOString(),
      userId: 1
    }
  ]);

  private nextId = 5;

  /**
   * Observable للإشعارات
   */
  notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable();

  /**
   * Observable لعدد الإشعارات غير المقروءة
   */
  unreadCount$: Observable<number> = this.notifications$.pipe(
    map(notifications => notifications.filter(n => !n.isRead).length)
  );

  /**
   * الحصول على جميع الإشعارات
   */
  getNotifications(): Observable<Notification[]> {
    return of(this.notificationsSubject.value).pipe(delay(200));
  }

  /**
   * الحصول على إشعار واحد
   */
  getNotificationById(id: number): Notification | undefined {
    return this.notificationsSubject.value.find(n => n.id === id);
  }

  /**
   * إنشاء إشعار جديد
   */
  createNotification(payload: CreateNotificationPayload): Observable<Notification> {
    try {
      const newNotification: Notification = {
        id: this.nextId++,
        type: payload.type,
        title: payload.title,
        message: payload.message,
        isRead: false,
        createdAt: new Date().toISOString(),
        userId: payload.userId,
        link: payload.link
      };

      const current = this.notificationsSubject.value;
      this.notificationsSubject.next([...current, newNotification]);

      return of(newNotification).pipe(delay(300));
    } catch (error) {
      return throwError(() => new Error('فشل في إنشاء الإشعار'));
    }
  }

  /**
   * تحديث إشعار
   */
  updateNotification(id: number, payload: UpdateNotificationPayload): Observable<Notification> {
    try {
      const current = this.notificationsSubject.value;
      const index = current.findIndex(n => n.id === id);

      if (index === -1) {
        return throwError(() => new Error(`الإشعار رقم ${id} غير موجود`));
      }

      const updated = [...current];
      updated[index] = {
        ...updated[index],
        ...payload
      };

      this.notificationsSubject.next(updated);

      return of(updated[index]).pipe(delay(300));
    } catch (error) {
      return throwError(() => new Error('فشل في تحديث الإشعار'));
    }
  }

  /**
   * تحديد إشعار كمقروء
   */
  markAsRead(id: number): Observable<Notification> {
    try {
      const current = this.notificationsSubject.value;
      const index = current.findIndex(n => n.id === id);

      if (index === -1) {
        return throwError(() => new Error(`الإشعار رقم ${id} غير موجود`));
      }

      const updated = [...current];
      updated[index] = {
        ...updated[index],
        isRead: true
      };

      this.notificationsSubject.next(updated);

      return of(updated[index]).pipe(delay(200));
    } catch (error) {
      return throwError(() => new Error('فشل في تحديث حالة الإشعار'));
    }
  }

  /**
   * تحديد جميع الإشعارات كمقروءة
   */
  markAllAsRead(): Observable<void> {
    try {
      const current = this.notificationsSubject.value;
      const updated = current.map(n => ({
        ...n,
        isRead: true
      }));

      this.notificationsSubject.next(updated);

      return of(void 0).pipe(delay(300));
    } catch (error) {
      return throwError(() => new Error('فشل في تحديث حالة الإشعارات'));
    }
  }

  /**
   * حذف إشعار
   */
  deleteNotification(id: number): Observable<void> {
    try {
      const current = this.notificationsSubject.value;
      const index = current.findIndex(n => n.id === id);

      if (index === -1) {
        return throwError(() => new Error(`الإشعار رقم ${id} غير موجود`));
      }

      const updated = current.filter(n => n.id !== id);
      this.notificationsSubject.next(updated);

      return of(void 0).pipe(delay(200));
    } catch (error) {
      return throwError(() => new Error('فشل في حذف الإشعار'));
    }
  }
}
