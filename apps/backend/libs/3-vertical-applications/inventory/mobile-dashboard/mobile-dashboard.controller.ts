import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MobileDashboardService } from './mobile-dashboard.service';
import { MobileDashboardDto } from './mobile-dashboard.dto';

@ApiTags('لوحة التحكم المتجاوبة (Mobile Dashboard)')
@Controller('mobile-dashboard')
export class MobileDashboardController {
  constructor(private readonly mobileDashboardService: MobileDashboardService) {}

  @Get('summary')
  @ApiOperation({ summary: 'جلب ملخص بيانات لوحة التحكم' })
  @ApiResponse({ status: 200, description: 'تم جلب البيانات بنجاح', type: MobileDashboardDto })
  getSummary(): MobileDashboardDto {
    return this.mobileDashboardService.getDashboardData();
  }

  @Get('activities')
  @ApiOperation({ summary: 'جلب قائمة بأحدث الأنشطة' })
  @ApiResponse({ status: 200, description: 'تم جلب الأنشطة بنجاح' })
  getActivities(): any[] {
    return this.mobileDashboardService.getRecentActivities();
  }
}
