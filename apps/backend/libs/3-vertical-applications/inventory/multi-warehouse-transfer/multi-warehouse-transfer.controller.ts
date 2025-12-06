import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { MultiWarehouseTransferService } from './multi-warehouse-transfer.service';
import { CreateMultiWarehouseTransferDto, UpdateMultiWarehouseTransferDto, MultiWarehouseTransferResponseDto } from './dto/multi-warehouse-transfer.dto';

@Controller('multi-warehouse-transfer')
export class MultiWarehouseTransferController {
  constructor(private readonly multiWarehouseTransferService: MultiWarehouseTransferService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createMultiWarehouseTransferDto: CreateMultiWarehouseTransferDto): MultiWarehouseTransferResponseDto {
    return this.multiWarehouseTransferService.create(createMultiWarehouseTransferDto);
  }

  @Get()
  findAll(): MultiWarehouseTransferResponseDto[] {
    return this.multiWarehouseTransferService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): MultiWarehouseTransferResponseDto {
    return this.multiWarehouseTransferService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMultiWarehouseTransferDto: UpdateMultiWarehouseTransferDto,
  ): MultiWarehouseTransferResponseDto {
    return this.multiWarehouseTransferService.update(id, updateMultiWarehouseTransferDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): void {
    this.multiWarehouseTransferService.remove(id);
  }

  @Patch(':id/complete')
  completeTransfer(@Param('id', ParseIntPipe) id: number): MultiWarehouseTransferResponseDto {
    return this.multiWarehouseTransferService.completeTransfer(id);
  }

  @Patch(':id/cancel')
  cancelTransfer(@Param('id', ParseIntPipe) id: number): MultiWarehouseTransferResponseDto {
    return this.multiWarehouseTransferService.cancelTransfer(id);
  }
}
