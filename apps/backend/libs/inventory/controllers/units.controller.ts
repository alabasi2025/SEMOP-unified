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
import { UnitsService } from '../services/units.service';
import { CreateUnitDto } from '../dto/create-unit.dto';
import { UpdateUnitDto } from '../dto/update-unit.dto';

/**
 * Controller إدارة وحدات القياس
 */
@ApiTags('Inventory - Units')
@Controller('inventory/units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  /**
   * جلب جميع الوحدات
   */
  @Get()
  @ApiOperation({ summary: 'جلب جميع الوحدات' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.unitsService.findAll(
      page ? +page : 1,
      limit ? +limit : 50,
    );
  }

  /**
   * جلب وحدة واحدة
   */
  @Get(':id')
  @ApiOperation({ summary: 'جلب وحدة واحدة' })
  async findOne(@Param('id') id: string) {
    return this.unitsService.findOne(id);
  }

  /**
   * إنشاء وحدة جديدة
   */
  @Post()
  @ApiOperation({ summary: 'إنشاء وحدة جديدة' })
  @ApiResponse({ status: 201, description: 'تم إنشاء الوحدة بنجاح' })
  async create(@Body() dto: CreateUnitDto) {
    return this.unitsService.create(dto);
  }

  /**
   * تحديث وحدة
   */
  @Put(':id')
  @ApiOperation({ summary: 'تحديث وحدة' })
  @ApiResponse({ status: 200, description: 'تم تحديث الوحدة بنجاح' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUnitDto,
  ) {
    return this.unitsService.update(id, dto);
  }

  /**
   * حذف وحدة
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'حذف وحدة' })
  @ApiResponse({ status: 204, description: 'تم حذف الوحدة بنجاح' })
  async delete(@Param('id') id: string) {
    await this.unitsService.delete(id);
  }
}
