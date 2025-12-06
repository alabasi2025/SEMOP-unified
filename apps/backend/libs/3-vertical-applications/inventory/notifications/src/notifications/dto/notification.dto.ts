import { IsNumber, IsString, IsBoolean, IsDate, IsEnum } from 'class-validator';

export enum NotificationType {
  SYSTEM = 'SYSTEM', // نظام
  ALERT = 'ALERT',   // تنبيه
  INFO = 'INFO',     // معلومة
}

export class NotificationDto {
  @IsNumber()
  id: number;

  @IsString()
  title: string; // عنوان الإشعار

  @IsString()
  message: string; // نص الإشعار

  @IsEnum(NotificationType)
  type: NotificationType; // نوع الإشعار

  @IsBoolean()
  isRead: boolean; // هل تمت القراءة

  @IsDate()
  createdAt: Date; // تاريخ الإنشاء

  @IsNumber()
  recipientId: number; // معرف المستلم
}
