import { Module } from '@nestjs/common';
import { MobileDashboardController } from './mobile-dashboard.controller';
import { MobileDashboardService } from './mobile-dashboard.service';

@Module({
  controllers: [MobileDashboardController],
  providers: [MobileDashboardService],
})
export class MobileDashboardModule {}
