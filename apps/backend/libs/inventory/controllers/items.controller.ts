import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ItemsService } from '../services/items.service';
import { CreateItemDto } from '../dto/create-item.dto';
import { UpdateItemDto } from '../dto/update-item.dto';

/**
 * Controller إدارة الأصناف
 */
@ApiTags('Inventory - Items')
@Controller('inventory/items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  /**
   * جلب جميع الأصناف
   */
  @Get()
  @ApiOperation({ summary: 'جلب جميع الأصناف' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('isActive') isActive?: boolean,
  ) {
    return this.itemsService.findAll(
      page ? +page : 1,
      limit ? +limit : 50,
      { search, categoryId, isActive },
    );
  }

  /**
   * جلب صنف واحد
   */
  @Get(':id')
  @ApiOperation({ summary: 'جلب صنف واحد' })
  async findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  /**
   * البحث في الأصناف
   */
  @Get('search/:query')
  @ApiOperation({ summary: 'البحث في الأصناف' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async search(
    @Param('query') query: string,
    @Query('limit') limit?: number,
  ) {
    return this.itemsService.search(query, limit ? +limit : 20);
  }

  /**
   * جلب صنف بالباركود
   */
  @Get('barcode/:barcode')
  @ApiOperation({ summary: 'جلب صنف بالباركود' })
  async findByBarcode(@Param('barcode') barcode: string) {
    return this.itemsService.findByBarcode(barcode);
  }

  /**
   * جلب أصناف حسب الفئة
   */
  @Get('category/:categoryId')
  @ApiOperation({ summary: 'جلب أصناف حسب الفئة' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findByCategory(
    @Param('categoryId') categoryId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.itemsService.findByCategory(
      categoryId,
      page ? +page : 1,
      limit ? +limit : 50,
    );
  }

  /**
   * جلب رصيد صنف في جميع المستودعات
   */
  @Get(':id/stock')
  @ApiOperation({ summary: 'جلب رصيد صنف في جميع المستودعات' })
  async getItemStock(@Param('id') id: string) {
    return this.itemsService.getItemStock(id);
  }

  /**
   * جلب الأصناف الناقصة
   */
  @Get('reports/low-stock')
  @ApiOperation({ summary: 'جلب الأصناف الناقصة' })
  @ApiQuery({ name: 'warehouseId', required: false, type: String })
  async getLowStockItems(@Query('warehouseId') warehouseId?: string) {
    return this.itemsService.getLowStockItems(warehouseId);
  }

  /**
   * إنشاء صنف جديد
   */
  @Post()
  @ApiOperation({ summary: 'إنشاء صنف جديد' })
  @ApiResponse({ status: 201, description: 'تم إنشاء الصنف بنجاح' })
  @ApiResponse({ status: 409, description: 'الكود أو الباركود مستخدم بالفعل' })
  async create(@Body() createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto);
  }

  /**
   * تحديث صنف
   */
  @Put(':id')
  @ApiOperation({ summary: 'تحديث صنف' })
  @ApiResponse({ status: 200, description: 'تم تحديث الصنف بنجاح' })
  @ApiResponse({ status: 404, description: 'الصنف غير موجود' })
  async update(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    return this.itemsService.update(id, updateItemDto);
  }

  /**
   * حذف صنف
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'حذف صنف' })
  @ApiResponse({ status: 204, description: 'تم حذف الصنف بنجاح' })
  @ApiResponse({ status: 400, description: 'لا يمكن حذف الصنف لأنه يحتوي على رصيد' })
  async delete(@Param('id') id: string) {
    await this.itemsService.delete(id);
  }
}
