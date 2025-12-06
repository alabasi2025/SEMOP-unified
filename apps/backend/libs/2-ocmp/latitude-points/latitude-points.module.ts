// PHASE: DTO_QUALITY_FIX
// PHASE-14: تحسين جودة DTOs - إضافة تعليقات PHASE للتوثيق
/**
 * PHASE-11: Complete Backend Fixes
 * COMPONENT: Latitude Points Module
 * IMPACT: Critical
 * 
 * Changes:
 * - Fixed imports to use correct file names
 * - Removed PrismaService import (provided by PrismaModule)
 * 
 * Date: 2025-12-03
 * Author: Development Team
 */

import { Module } from '@nestjs/common';
import { LatitudePointsService } from './latitude-points.service';
import { LatitudePointsController } from './latitude-points.controller';
import { PrismaModule } from '../../1-core-services/prisma/prisma.module';
import { } from '@semop/contracts';


@Module({
  imports: [PrismaModule],
  controllers: [LatitudePointsController],
  providers: [LatitudePointsService],
  exports: [LatitudePointsService],
})
export class LatitudePointsModule {}
