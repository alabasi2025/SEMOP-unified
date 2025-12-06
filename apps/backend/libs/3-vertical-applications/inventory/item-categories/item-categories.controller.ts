import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ItemCategoriesService } from './item-categories.service';

@Controller('item-categories')
export class ItemCategoriesController {
  constructor(private readonly itemCategoriesService: ItemCategoriesService) {}

  @Post()
  async create(@Body() data: any) {
    return this.itemCategoriesService.create(data);
  }

  @Get()
  async findAll() {
    return this.itemCategoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.itemCategoriesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.itemCategoriesService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.itemCategoriesService.remove(id);
  }
}
