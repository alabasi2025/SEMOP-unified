// /root/task_outputs/Task2_Advanced_Search_Filters/backend/items.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemDto } from './item.dto';
import { AdvancedSearchFilterDto } from './advanced-search-filter.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  /**
   * نقطة نهاية للبحث المتقدم عن الأصناف.
   * تستقبل معايير البحث في جسم الطلب (POST).
   * @param filterDto معايير البحث المتقدم.
   * @returns قائمة الأصناف المفلترة.
   */
  @Post('search')
  advancedSearch(@Body() filterDto: AdvancedSearchFilterDto): ItemDto[] {
    return this.itemsService.advancedSearch(filterDto);
  }
}
