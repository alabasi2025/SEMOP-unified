import { Module } from '@nestjs/common';
import { MultiWarehouseTransferService } from './multi-warehouse-transfer.service';
import { MultiWarehouseTransferController } from './multi-warehouse-transfer.controller';

@Module({
  controllers: [MultiWarehouseTransferController],
  providers: [MultiWarehouseTransferService],
  exports: [MultiWarehouseTransferService],
})
export class MultiWarehouseTransferModule {}
