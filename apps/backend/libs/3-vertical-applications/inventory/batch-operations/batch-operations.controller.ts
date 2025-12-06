import { Controller, Post, Body, UsePipes, ValidationPipe, HttpStatus, HttpException } from '@nestjs/common';
import { BatchOperationsService } from './batch-operations.service';
import { BatchOperationDto, BatchOperationResponseDto } from './dto/batch-operation.dto';

@Controller('batch-operations')
export class BatchOperationsController {
  constructor(private readonly batchOperationsService: BatchOperationsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async processBatchOperation(@Body() batchOperationDto: BatchOperationDto): Promise<BatchOperationResponseDto> {
    try {
      const result = await this.batchOperationsService.processBatchOperation(batchOperationDto);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('حدث خطأ غير متوقع أثناء معالجة العملية المجمعة', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
