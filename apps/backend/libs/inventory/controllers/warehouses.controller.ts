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
import { WarehousesService } from '../services/warehouses.service';
import { CreateWarehouseDto } from '../dto/create-warehouse.dto';
import { UpdateWarehouseDto } from '../dto/update-warehouse.dto';

/**
 * Controller إدارة المستودعات
 */
@ApiTags('Inventory - Warehouses')
@Controller('inventory/warehouses')
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  /**
   * جلب جميع المستودعات
   */
  @Get()
  @ApiOperation({ summary: 'جلب جميع المستودعات' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('isActive') isActive?: boolean,
  ) {
    return this.warehousesService.findAll(
      page ? +page : 1,
      limit ? +limit : 50,
      { search, isActive },
    );
  }

  /**
   * جلب مستودع واحد
   */
  @Get(':id')
  @ApiOperation({ summary: 'جلب مستودع واحد' })
  async findOne(@Param('id') id: string) {
    return this.warehousesService.findOne(id);
  }

  /**
   * جلب رصيد المستودع
   */
  @Get(':id/stock')
  @ApiOperation({ summary: 'جلب رصيد المستودع' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getWarehouseStock(
    @Param('id') id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.warehousesService.getWarehouseStock(
      id,
      page ? +page : 1,
      limit ? +limit : 50,
    );
  }

  /**
   * جلب قيمة المخزون في المستودع
   */
  @Get(':id/value')
  @ApiOperation({ summary: 'جلب قيمة المخزون في المستودع' })
  async getWarehouseValue(@Param('id') id: string) {
    const value = await this.warehousesService.getWarehouseValue(id);
    return { warehouseId: id, totalValue: value };
  }

  /**
   * جلب نسبة الإشغال
   */
  @Get(':id/capacity')
  @ApiOperation({ summary: 'جلب نسبة الإشغال' })
  async getWarehouseCapacity(@Param('id') id: string) {
    return this.warehousesService.getWarehouseCapacity(id);
  }

  /**
   * جلب حركات المستودع
   */
  @Get(':id/movements')
  @ApiOperation({ summary: 'جلب حركات المستودع' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getWarehouseMovements(
    @Param('id') id: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.warehousesService.getWarehouseMovements(
      id,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
      page ? +page : 1,
      limit ? +limit : 50,
    );
  }

  /**
   * جلب إحصائيات المستودع
   */
  @Get(':id/stats')
  @ApiOperation({ summary: 'جلب إحصائيات المستودع' })
  async getWarehouseStats(@Param('id') id: string) {
    return this.warehousesService.getWarehouseStats(id);
  }

  /**
   * إنشاء مستودع جديد
   */
  @Post()
  @ApiOperation({ summary: 'إنشاء مستودع جديد' })
  @ApiResponse({ status: 201, description: 'تم إنشاء المستودع بنجاح' })
  @ApiResponse({ status: 409, description: 'الكود مستخدم بالفعل' })
  async create(@Body() createWarehouseDto: CreateWarehouseDto) {
    return this.warehousesService.create(createWarehouseDto);
  }

  /**
   * تحديث مستودع
   */
  @Put(':id')
  @ApiOperation({ summary: 'تحديث مستودع' })
  @ApiResponse({ status: 200, description: 'تم تحديث المستودع بنجاح' })
  @ApiResponse({ status: 404, description: 'المستودع غير موجود' })
  async update(
    @Param('id') id: string,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ) {
    return this.warehousesService.update(id, updateWarehouseDto);
  }

  /**
   * حذف مستودع
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'حذف مستودع' })
  @ApiResponse({ status: 204, description: 'تم حذف المستودع بنجاح' })
  @ApiResponse({ status: 400, description: 'لا يمكن حذف المستودع لأنه يحتوي على رصيد' })
  async delete(@Param('id') id: string) {
    await this.warehousesService.delete(id);
  }
}
