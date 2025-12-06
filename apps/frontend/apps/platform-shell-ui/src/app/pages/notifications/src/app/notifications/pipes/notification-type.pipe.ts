import { Pipe, PipeTransform } from '@angular/core';
import { NotificationType } from '../models/notification.model';

@Pipe({
  name: 'translateNotificationType'
})
export class NotificationTypePipe implements PipeTransform {

  transform(value: NotificationType): string {
    switch (value) {
      case NotificationType.SYSTEM:
        return 'نظام';
      case NotificationType.ALERT:
        return 'تنبيه';
      case NotificationType.INFO:
        return 'معلومة';
      default:
        return 'غير محدد';
    }
  }

}
