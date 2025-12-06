export enum NotificationType {
  SYSTEM = 'SYSTEM',
  ALERT = 'ALERT',
  INFO = 'INFO',
}

export interface Notification {
  id: number;
  title: string; // عنوان الإشعار
  message: string; // نص الإشعار
  type: NotificationType; // نوع الإشعار
  isRead: boolean; // هل تمت القراءة
  createdAt: Date; // تاريخ الإنشاء
  recipientId: number; // معرف المستلم
}

export interface UnreadCount {
  count: number;
}

export interface ReadNotificationRequest {
  notificationId: number;
  isRead: boolean;
}
