// PHASE: DTO_QUALITY_FIX
// PHASE-11: إصلاح انتهاكات DTOs والبنية المعمارية - استخدام @semop/contracts
import { Module } from '@nestjs/common';
import { FiscalPeriodsController } from './fiscal-periods.controller';
import { FiscalPeriodsService } from './fiscal-periods.service';

@Module({
  controllers: [FiscalPeriodsController],
  providers: [FiscalPeriodsService],
  exports: [FiscalPeriodsService]
})
export class FiscalPeriodsModule {}
