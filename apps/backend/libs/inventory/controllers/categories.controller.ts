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
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

/**
 * Controller إدارة فئات الأصناف
 */
@ApiTags('Inventory - Categories')
@Controller('inventory/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * جلب جميع الفئات
   */
  @Get()
  @ApiOperation({ summary: 'جلب جميع الفئات' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.categoriesService.findAll(
      page ? +page : 1,
      limit ? +limit : 50,
    );
  }

  /**
   * جلب الهيكل الهرمي للفئات
   */
  @Get('hierarchy')
  @ApiOperation({ summary: 'جلب الهيكل الهرمي للفئات' })
  async getHierarchy() {
    return this.categoriesService.getHierarchy();
  }

  /**
   * جلب فئة واحدة
   */
  @Get(':id')
  @ApiOperation({ summary: 'جلب فئة واحدة' })
  async findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  /**
   * إنشاء فئة جديدة
   */
  @Post()
  @ApiOperation({ summary: 'إنشاء فئة جديدة' })
  @ApiResponse({ status: 201, description: 'تم إنشاء الفئة بنجاح' })
  async create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  /**
   * تحديث فئة
   */
  @Put(':id')
  @ApiOperation({ summary: 'تحديث فئة' })
  @ApiResponse({ status: 200, description: 'تم تحديث الفئة بنجاح' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, dto);
  }

  /**
   * حذف فئة
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'حذف فئة' })
  @ApiResponse({ status: 204, description: 'تم حذف الفئة بنجاح' })
  async delete(@Param('id') id: string) {
    await this.categoriesService.delete(id);
  }
}
