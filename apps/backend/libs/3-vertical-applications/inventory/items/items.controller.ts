import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto, UpdateItemDto } from './items.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  create(@Body() createDto: CreateItemDto) {
    return this.itemsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.itemsService.findAll();
  }

  @Get('low-stock')
  getLowStock() {
    return this.itemsService.getLowStockItems();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  @Get(':id/stock')
  getStock(@Param('id') id: string) {
    return this.itemsService.getItemStock(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateItemDto) {
    return this.itemsService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(id);
  }
}
