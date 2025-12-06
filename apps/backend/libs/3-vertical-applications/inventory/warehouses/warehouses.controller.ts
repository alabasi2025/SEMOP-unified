import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { CreateWarehouseDto, UpdateWarehouseDto } from './warehouses.dto';

@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Post()
  create(@Body() createDto: CreateWarehouseDto) {
    return this.warehousesService.create(createDto);
  }

  @Get()
  findAll() {
    return this.warehousesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.warehousesService.findOne(id);
  }

  @Get(':id/stock')
  getStock(@Param('id') id: string) {
    return this.warehousesService.getWarehouseStock(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateWarehouseDto) {
    return this.warehousesService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.warehousesService.remove(id);
  }
}
