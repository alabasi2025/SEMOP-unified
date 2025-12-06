// PHASE: DTO_QUALITY_FIX
// PHASE-14: إصلاح انتهاكات DTOs واستخدام @semop/contracts
/**
 * PHASE 10: Shared Prisma Service
 * Centralized database access for all layers
 */

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
