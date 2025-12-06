import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationDto, NotificationType } from './dto/notification.dto';
import { ReadNotificationDto } from './dto/read-notification.dto';
import { MarkAllAsReadDto } from './dto/mark-all-as-read.dto';

@Injectable()
export class NotificationsService {
  private notifications: NotificationDto[] = [
    {
      id: 1,
      title: 'تحديث النظام',
      message: 'تم تحديث النظام بنجاح إلى الإصدار الأخير.',
      type: NotificationType.SYSTEM,
      isRead: false,
      createdAt: new Date(Date.now() - 3600000), // قبل ساعة
      recipientId: 1,
    },
    {
      id: 2,
      title: 'تنبيه مخزون',
      message: 'انخفاض مستوى المخزون للصنف "هاتف ذكي".',
      type: NotificationType.ALERT,
      isRead: false,
      createdAt: new Date(Date.now() - 7200000), // قبل ساعتين
      recipientId: 1,
    },
    {
      id: 3,
      title: 'معلومة جديدة',
      message: 'تم إضافة ميزة جديدة لإدارة الفواتير.',
      type: NotificationType.INFO,
      isRead: true,
      createdAt: new Date(Date.now() - 10800000), // قبل 3 ساعات
      recipientId: 1,
    },
  ];

  // دالة للحصول على جميع الإشعارات لمستخدم معين
  findAll(userId: number): NotificationDto[] {
    // في بيئة حقيقية، سيتم استخدام قاعدة بيانات
    return this.notifications.filter(n => n.recipientId === userId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // دالة للحصول على عدد الإشعارات غير المقروءة
  getUnreadCount(userId: number): number {
    return this.notifications.filter(n => n.recipientId === userId && !n.isRead).length;
  }

  // دالة لتغيير حالة قراءة إشعار معين
  markAsRead(readDto: ReadNotificationDto): NotificationDto {
    const notification = this.notifications.find(n => n.id === readDto.notificationId);
    if (!notification) {
      throw new NotFoundException('الإشعار غير موجود');
    }
    notification.isRead = readDto.isRead;
    return notification;
  }

  // دالة لتعليم جميع الإشعارات كمقروءة
  markAllAsRead(markAllDto: MarkAllAsReadDto): { count: number } {
    let count = 0;
    this.notifications = this.notifications.map(n => {
      if (n.recipientId === markAllDto.userId && !n.isRead) {
        n.isRead = true;
        count++;
      }
      return n;
    });
    return { count };
  }

  // دالة لإضافة إشعار جديد (لأغراض المحاكاة)
  addNotification(notification: Omit<NotificationDto, 'id' | 'createdAt'>): NotificationDto {
    const newNotification: NotificationDto = {
      ...notification,
      id: this.notifications.length + 1,
      createdAt: new Date(),
    };
    this.notifications.push(newNotification);
    return newNotification;
  }
}
