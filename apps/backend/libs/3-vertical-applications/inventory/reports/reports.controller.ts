import { Controller, Get, Query, HttpStatus } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { GetReportDto } from './dto/get-report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('inventory-summary')
  async getInventorySummaryReport(@Query() getReportDto: GetReportDto) {
    try {
      const reportData = await this.reportsService.generateInventorySummary(getReportDto);
      return {
        message: 'تم إنشاء تقرير ملخص المخزون بنجاح',
        reportType: 'InventorySummary',
        data: reportData,
      };
    } catch (error) {
      return {
        message: 'فشل في إنشاء تقرير ملخص المخزون',
        error: error.message,
      };
    }
  }

  @Get('sales-by-item')
  async getSalesByItemReport(@Query() getReportDto: GetReportDto) {
    try {
      const reportData = await this.reportsService.generateSalesByItem(getReportDto);
      return {
        message: 'تم إنشاء تقرير المبيعات حسب الصنف بنجاح',
        reportType: 'SalesByItem',
        data: reportData,
      };
    } catch (error) {
      return {
        message: 'فشل في إنشاء تقرير المبيعات حسب الصنف',
        error: error.message,
      };
    }
  }

  @Get('stock-movement')
  async getStockMovementReport(@Query() getReportDto: GetReportDto) {
    try {
      const reportData = await this.reportsService.generateStockMovement(getReportDto);
      return {
        message: 'تم إنشاء تقرير حركة المخزون بنجاح',
        reportType: 'StockMovement',
        data: reportData,
      };
    } catch (error) {
      return {
        message: 'فشل في إنشاء تقرير حركة المخزون',
        error: error.message,
      };
    }
  }
}
