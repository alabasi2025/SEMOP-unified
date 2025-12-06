import { IsNumber, IsBoolean } from 'class-validator';

export class ReadNotificationDto {
  @IsNumber()
  notificationId: number; // معرف الإشعار

  @IsBoolean()
  isRead: boolean; // حالة القراءة الجديدة
}
