// /root/task_outputs/Task7_Dashboard_Analytics/backend/dashboard-analytics.controller.ts

import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DashboardAnalyticsService } from './dashboard-analytics.service';
import { DashboardAnalyticsResponseDto, DashboardAnalyticsQueryDto } from './dashboard-analytics.dto';

@ApiTags('Dashboard Analytics')
@Controller('dashboard-analytics')
export class DashboardAnalyticsController {
  constructor(private readonly analyticsService: DashboardAnalyticsService) {}

  @Get()
  @ApiOperation({ summary: 'جلب إحصائيات لوحة التحكم للمخزون' })
  @ApiResponse({ status: 200, description: 'تم جلب البيانات بنجاح', type: DashboardAnalyticsResponseDto })
  @ApiResponse({ status: 400, description: 'خطأ في معلمات الاستعلام' })
  async getAnalytics(
    @Query() query: DashboardAnalyticsQueryDto,
  ): Promise<DashboardAnalyticsResponseDto> {
    return this.analyticsService.getAnalytics(query);
  }
}
