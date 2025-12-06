import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { StockMovementsService } from './stock-movements.service';
import { CreateStockMovementDto } from './stock-movements.dto';

@Controller('stock-movements')
export class StockMovementsController {
  constructor(private readonly stockMovementsService: StockMovementsService) {}

  @Post()
  create(@Body() createDto: CreateStockMovementDto) {
    return this.stockMovementsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.stockMovementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockMovementsService.findOne(id);
  }

  @Get('warehouse/:warehouseId')
  findByWarehouse(@Param('warehouseId') warehouseId: string) {
    return this.stockMovementsService.findByWarehouse(warehouseId);
  }

  @Get('item/:itemId')
  findByItem(@Param('itemId') itemId: string) {
    return this.stockMovementsService.findByItem(itemId);
  }
}
