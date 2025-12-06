import { Injectable } from '@angular/core';
import { Observable, Subject, interval } from 'rxjs';
import { INotificationRealtimeService, Notification } from './notification.contracts';

/**
 * NotificationRealtimeService
 * 
 * @description
 * Service for real-time notification updates in the SEMOP ERP system.
 * Implements INotificationRealtimeService from API Contract.
 * Simulates WebSocket connection for demo purposes.
 * 
 * @implements {INotificationRealtimeService}
 * @see notification.contracts.ts
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationRealtimeService implements INotificationRealtimeService {
  private notificationsSubject = new Subject<Notification>();
  private connected = false;
  private simulationInterval: any;
  private notificationId = 100;

  /**
   * Observable للإشعارات الجديدة
   * Observable for new notifications
   */
  notifications$: Observable<Notification> = this.notificationsSubject.asObservable();

  /**
   * Sample notification messages for simulation
   */
  private sampleNotifications = [
    { type: 'info' as const, title: 'تحديث النظام', message: 'تم تحديث النظام بنجاح' },
    { type: 'success' as const, title: 'عملية ناجحة', message: 'تمت العملية بنجاح' },
    { type: 'warning' as const, title: 'تحذير', message: 'يرجى مراجعة البيانات' },
    { type: 'error' as const, title: 'خطأ', message: 'حدث خطأ في النظام' },
    { type: 'info' as const, title: 'رسالة جديدة', message: 'لديك رسالة جديدة' },
    { type: 'success' as const, title: 'تم الحفظ', message: 'تم حفظ التغييرات' },
  ];

  /**
   * الاتصال بالخادم
   * Connect to server (simulated)
   */
  connect(): void {
    if (this.connected) {
      console.warn('Already connected to notification service');
      return;
    }

    this.connected = true;
    console.log('Connected to notification realtime service');

    // Simulate receiving notifications every 30 seconds
    this.simulationInterval = setInterval(() => {
      this.simulateNotification();
    }, 30000);
  }

  /**
   * قطع الاتصال
   * Disconnect from server
   */
  disconnect(): void {
    if (!this.connected) {
      console.warn('Not connected to notification service');
      return;
    }

    this.connected = false;
    console.log('Disconnected from notification realtime service');

    // Clear simulation interval
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }

  /**
   * هل متصل؟
   * Check if connected
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Simulate receiving a notification (for demo purposes)
   * In production, this would be replaced with actual WebSocket/SSE logic
   */
  private simulateNotification(): void {
    const random = Math.floor(Math.random() * this.sampleNotifications.length);
    const sample = this.sampleNotifications[random];

    const notification: Notification = {
      id: this.notificationId++,
      type: sample.type,
      title: sample.title,
      message: sample.message,
      isRead: false,
      createdAt: new Date().toISOString(),
      userId: 1
    };

    this.notificationsSubject.next(notification);
    console.log('New notification received:', notification);
  }

  /**
   * Manually trigger a notification (for testing)
   */
  triggerTestNotification(): void {
    this.simulateNotification();
  }
}
