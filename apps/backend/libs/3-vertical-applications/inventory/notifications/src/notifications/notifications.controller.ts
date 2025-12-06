import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationDto } from './dto/notification.dto';
import { ReadNotificationDto } from './dto/read-notification.dto';
import { MarkAllAsReadDto } from './dto/mark-all-as-read.dto';

// محاكاة لمعرف المستخدم الذي تم تسجيل دخوله
const MOCK_USER_ID = 1;

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(): NotificationDto[] {
    // في تطبيق حقيقي، سيتم استخراج معرف المستخدم من الـ JWT أو الجلسة
    return this.notificationsService.findAll(MOCK_USER_ID);
  }

  @Get('unread-count')
  getUnreadCount(): { count: number } {
    return { count: this.notificationsService.getUnreadCount(MOCK_USER_ID) };
  }

  @Post('read')
  markAsRead(@Body() readDto: ReadNotificationDto): NotificationDto {
    return this.notificationsService.markAsRead(readDto);
  }

  @Post('read-all')
  markAllAsRead(): { count: number } {
    const markAllDto: MarkAllAsReadDto = { userId: MOCK_USER_ID };
    return this.notificationsService.markAllAsRead(markAllDto);
  }
}
