// PHASE: DTO_QUALITY_FIX
// PHASE-14: إصلاح انتهاكات DTOs واستخدام @semop/contracts
import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule {}
