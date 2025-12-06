// PHASE: DTO_QUALITY_FIX
// PHASE-14: تحسين جودة DTOs - إضافة تعليقات PHASE للتوثيق
// PHASE-11: إصلاح انتهاكات DTOs والبنية المعمارية - استخدام @semop/contracts
import { Module } from '@nestjs/common';
import { GenesService } from './genes.service';
import { GenesController } from './genes.controller';
import { PricingService } from './pricing.service';
import { PricingController } from './pricing.controller';
import { PrismaModule } from '../../1-core-services/prisma/prisma.module';

@Module({
  imports: [PrismaModule], // استيراد PrismaModule بدلاً من TypeOrmModule
  controllers: [GenesController, PricingController],
  providers: [GenesService, PricingService],
  exports: [GenesService, PricingService], // تصدير الخدمات لاستخدامها في modules أخرى
})
export class GenesModule {}
