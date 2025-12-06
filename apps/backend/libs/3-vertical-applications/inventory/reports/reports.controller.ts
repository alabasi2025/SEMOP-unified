import { Controller, Get, Query, Res, HttpStatus } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { GetReportDto } from './dto/get-report.dto';
import { Response } from 'express';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('inventory-summary')
  async getInventorySummaryReport(@Query() getReportDto: GetReportDto, @Res() res: Response) {
    try {
      const reportData = await this.reportsService.generateInventorySummary(getReportDto);
      // في بيئة الإنتاج، يجب أن يتم إرسال الملف كـ Buffer أو Stream
      // هنا نفترض أن الخدمة تعيد بيانات جاهزة للعرض أو التنزيل
      res.status(HttpStatus.OK).json({
        message: 'تم إنشاء تقرير ملخص المخزون بنجاح',
        reportType: 'InventorySummary',
        data: reportData,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'فشل في إنشاء تقرير ملخص المخزون',
        error: error.message,
      });
    }
  }

  @Get('sales-by-item')
  async getSalesByItemReport(@Query() getReportDto: GetReportDto, @Res() res: Response) {
    try {
      const reportData = await this.reportsService.generateSalesByItem(getReportDto);
      res.status(HttpStatus.OK).json({
        message: 'تم إنشاء تقرير المبيعات حسب الصنف بنجاح',
        reportType: 'SalesByItem',
        data: reportData,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'فشل في إنشاء تقرير المبيعات حسب الصنف',
        error: error.message,
      });
    }
  }

  @Get('stock-movement')
  async getStockMovementReport(@Query() getReportDto: GetReportDto, @Res() res: Response) {
    try {
      const reportData = await this.reportsService.generateStockMovement(getReportDto);
      res.status(HttpStatus.OK).json({
        message: 'تم إنشاء تقرير حركة المخزون بنجاح',
        reportType: 'StockMovement',
        data: reportData,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'فشل في إنشاء تقرير حركة المخزون',
        error: error.message,
      });
    }
  }
}
