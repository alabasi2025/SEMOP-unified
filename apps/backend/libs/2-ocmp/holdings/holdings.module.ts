// PHASE: DTO_QUALITY_FIX
// PHASE-14: إصلاح جميع any types واستخدام DTOs من @semop/contracts
import { Module } from '@nestjs/common';
import { HoldingsController } from './holdings.controller';
import { HoldingsService } from './holdings.service';

@Module({
  controllers: [HoldingsController],
  providers: [HoldingsService],
  exports: [HoldingsService]
})
export class HoldingsModule {}
