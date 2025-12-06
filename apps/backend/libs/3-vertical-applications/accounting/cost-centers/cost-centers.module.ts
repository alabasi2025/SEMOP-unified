// PHASE: DTO_QUALITY_FIX
// PHASE-11: إصلاح انتهاكات DTOs والبنية المعمارية - استخدام @semop/contracts
import { Module } from '@nestjs/common';
import { CostCentersController } from './cost-centers.controller';
import { CostCentersService } from './cost-centers.service';

@Module({
  controllers: [CostCentersController],
  providers: [CostCentersService],
  exports: [CostCentersService]
})
export class CostCentersModule {}
