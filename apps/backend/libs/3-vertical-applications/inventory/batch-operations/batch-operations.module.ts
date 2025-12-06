import { Module } from '@nestjs/common';
import { BatchOperationsController } from './batch-operations.controller';
import { BatchOperationsService } from './batch-operations.service';

@Module({
  imports: [],
  controllers: [BatchOperationsController],
  providers: [BatchOperationsService],
})
export class BatchOperationsModule {}
