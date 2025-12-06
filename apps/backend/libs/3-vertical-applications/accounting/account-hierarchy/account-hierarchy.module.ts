// PHASE: DTO_QUALITY_FIX
import { Module } from '@nestjs/common';
import { AccountHierarchyController } from './account_hierarchy.controller';
import { AccountHierarchyService } from './account_hierarchy.service';
import { } from '@semop/contracts';

import { PrismaModule } from '../../../1-core-services/prisma/prisma.module'; // افتراض وجود PrismaModule

@Module({
  imports: [PrismaModule], // استيراد PrismaModule لتوفير PrismaService
  controllers: [AccountHierarchyController],
  providers: [AccountHierarchyService],
  exports: [AccountHierarchyService],
})
export class AccountHierarchyModule {}
