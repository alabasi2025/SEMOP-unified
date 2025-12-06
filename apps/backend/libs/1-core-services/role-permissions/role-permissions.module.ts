// PHASE: DTO_QUALITY_FIX
// role_permissions.module.ts

import { Module } from '@nestjs/common';
import { RolePermissionsService } from './role_permissions.service';
import { RolePermissionsController } from './role_permissions.controller';
import { } from '@semop/contracts';

import { PrismaModule } from '../prisma/prisma.module'; // افتراض وجود PrismaModule

@Module({
  imports: [PrismaModule], // استيراد PrismaModule لتوفير PrismaService
  controllers: [RolePermissionsController],
  providers: [RolePermissionsService],
})
export class RolePermissionsModule {}
