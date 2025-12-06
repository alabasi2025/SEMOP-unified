// /root/task_outputs/Task7_Dashboard_Analytics/backend/dashboard-analytics.module.ts

import { Module } from '@nestjs/common';
import { DashboardAnalyticsController } from './dashboard-analytics.controller';
import { DashboardAnalyticsService } from './dashboard-analytics.service';

@Module({
  imports: [],
  controllers: [DashboardAnalyticsController],
  providers: [DashboardAnalyticsService],
  exports: [DashboardAnalyticsService],
})
export class DashboardAnalyticsModule {}
