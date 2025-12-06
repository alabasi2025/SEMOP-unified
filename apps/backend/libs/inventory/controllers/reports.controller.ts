import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ReportsService } from '../services/reports.service';

/**
 * Controller التقارير
 */
@ApiTags('Inventory - Reports')
@Controller('inventory/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  /**
   * تقرير حركة صنف
   */
  @Get('item-movement')
  @ApiOperation({ summary: 'تقرير حركة صنف' })
  @ApiQuery({ name: 'itemId', required: true, type: String })
  @ApiQuery({ name: 'startDate', required: true, type: String })
  @ApiQuery({ name: 'endDate', required: true, type: String })
  async getItemMovementReport(
    @Query('itemId') itemId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getItemMovementReport(
      itemId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  /**
   * تقرير حركة مستودع
   */
  @Get('warehouse-movement')
  @ApiOperation({ summary: 'تقرير حركة مستودع' })
  @ApiQuery({ name: 'warehouseId', required: true, type: String })
  @ApiQuery({ name: 'startDate', required: true, type: String })
  @ApiQuery({ name: 'endDate', required: true, type: String })
  async getWarehouseMovementReport(
    @Query('warehouseId') warehouseId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getWarehouseMovementReport(
      warehouseId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  /**
   * تقرير الأصناف الناقصة
   */
  @Get('low-stock')
  @ApiOperation({ summary: 'تقرير الأصناف الناقصة' })
  @ApiQuery({ name: 'warehouseId', required: false, type: String })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  async getLowStockReport(
    @Query('warehouseId') warehouseId?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.reportsService.getLowStockReport(warehouseId, categoryId);
  }

  /**
   * تقرير الأصناف الراكدة
   */
  @Get('inactive-items')
  @ApiOperation({ summary: 'تقرير الأصناف الراكدة' })
  @ApiQuery({ name: 'warehouseId', required: false, type: String })
  @ApiQuery({ name: 'daysWithoutMovement', required: false, type: Number })
  async getInactiveItemsReport(
    @Query('warehouseId') warehouseId?: string,
    @Query('daysWithoutMovement') daysWithoutMovement?: number,
  ) {
    return this.reportsService.getInactiveItemsReport(
      warehouseId,
      daysWithoutMovement ? +daysWithoutMovement : 90,
    );
  }

  /**
   * تقرير قيمة المخزون
   */
  @Get('stock-value')
  @ApiOperation({ summary: 'تقرير قيمة المخزون' })
  @ApiQuery({ name: 'warehouseId', required: false, type: String })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiQuery({ name: 'asOfDate', required: false, type: String })
  async getStockValueReport(
    @Query('warehouseId') warehouseId?: string,
    @Query('categoryId') categoryId?: string,
    @Query('asOfDate') asOfDate?: string,
  ) {
    return this.reportsService.getStockValueReport(
      warehouseId,
      categoryId,
      asOfDate ? new Date(asOfDate) : undefined,
    );
  }

  /**
   * تقرير الرصيد الحالي
   */
  @Get('stock-balance')
  @ApiOperation({ summary: 'تقرير الرصيد الحالي' })
  @ApiQuery({ name: 'warehouseId', required: false, type: String })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  async getStockBalanceReport(
    @Query('warehouseId') warehouseId?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.reportsService.getStockBalanceReport(warehouseId, categoryId);
  }
}
