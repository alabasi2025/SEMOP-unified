// PHASE: DTO_QUALITY_FIX
// PHASE-14: إصلاح جميع any types واستخدام DTOs من @semop/contracts
/**
 * PHASE-11: Organizational Structure Development
 * COMPONENT: Organizational Structure Module
 * IMPACT: High
 * 
 * Changes:
 * - Added PrismaModule import for database access
 * - Fixed module configuration
 * 
 * Date: 2025-12-03
 * Author: Development Team
 */
import { Module } from '@nestjs/common';
import { OrganizationalStructureController } from './organizational-structure.controller';
import { OrganizationalStructureService } from './organizational-structure.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OrganizationalStructureController],
  providers: [OrganizationalStructureService],
  exports: [OrganizationalStructureService],
})
export class OrganizationalStructureModule {}
