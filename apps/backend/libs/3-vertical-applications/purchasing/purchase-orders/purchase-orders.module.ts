// PHASE: DTO_QUALITY_FIX
// /home/ubuntu/purchase_orders/src/purchase-orders.module.ts

import { Module } from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { PurchaseOrdersController } from './purchase-orders.controller';
import { } from '@semop/contracts';

import { PrismaService } from '../../../1-core-services/prisma/prisma.service'; // افتراض مسار PrismaService

@Module({
  controllers: [PurchaseOrdersController],
  providers: [PurchaseOrdersService, PrismaService], // يجب توفير PrismaService هنا
})
export class PurchaseOrdersModule {}
