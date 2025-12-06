import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StockCountService } from '../services/stock-count.service';
import { CreateCountDto } from '../dto/create-count.dto';
import { AddCountRecordsDto, CompleteCountDto } from '../dto/count-record.dto';

/**
 * Controller إدارة الجرد
 */
@ApiTags('Inventory - Stock Count')
@Controller('inventory/stock-count')
export class StockCountController {
  constructor(private readonly countService: StockCountService) {}

  /**
   * إنشاء عملية جرد جديدة
   */
  @Post()
  @ApiOperation({ summary: 'إنشاء عملية جرد جديدة' })
  @ApiResponse({ status: 201, description: 'تم إنشاء الجرد بنجاح' })
  async createCount(@Body() dto: CreateCountDto) {
    return this.countService.createCount(dto);
  }

  /**
   * إضافة سجلات الجرد (الكميات المعدودة)
   */
  @Post(':id/records')
  @ApiOperation({ summary: 'إضافة سجلات الجرد' })
  @ApiResponse({ status: 200, description: 'تم تحديث سجلات الجرد بنجاح' })
  async addCountRecords(
    @Param('id') id: string,
    @Body() dto: AddCountRecordsDto,
  ) {
    return this.countService.addCountRecords(id, dto);
  }

  /**
   * حساب الفروقات
   */
  @Get(':id/differences')
  @ApiOperation({ summary: 'حساب الفروقات' })
  async calculateDifferences(@Param('id') id: string) {
    return this.countService.calculateDifferences(id);
  }

  /**
   * إتمام الجرد
   */
  @Put(':id/complete')
  @ApiOperation({ summary: 'إتمام الجرد' })
  @ApiResponse({ status: 200, description: 'تم إتمام الجرد بنجاح' })
  async completeCount(
    @Param('id') id: string,
    @Body() dto: CompleteCountDto,
  ) {
    return this.countService.completeCount(id, dto);
  }

  /**
   * جلب تقرير الجرد
   */
  @Get(':id/report')
  @ApiOperation({ summary: 'جلب تقرير الجرد' })
  async getCountReport(@Param('id') id: string) {
    return this.countService.getCountReport(id);
  }
}
