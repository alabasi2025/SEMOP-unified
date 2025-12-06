import { Controller, Get, Query, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { BalanceSheetService } from './balance-sheet.service';

@Controller('accounting/balance-sheet')
@ApiTags('Accounting - Reports')
export class BalanceSheetController {
  constructor(private readonly balanceSheetService: BalanceSheetService) {}

  /**
   * الحصول على الميزانية العمومية
   */
  @Get()
  @ApiOperation({ 
    summary: 'الحصول على الميزانية العمومية',
    description: 'إنشاء تقرير الميزانية العمومية (قائمة المركز المالي) لتاريخ محدد'
  })
  @ApiQuery({ name: 'date', required: false, description: 'تاريخ التقرير (افتراضياً: اليوم)' })
  @ApiQuery({ name: 'fiscalYearId', required: false, description: 'معرف السنة المالية' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'تم إنشاء الميزانية العمومية بنجاح'
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'خطأ في المعاملات المدخلة'
  })
  async getBalanceSheet(
    @Query('date') date?: string,
    @Query('fiscalYearId') fiscalYearId?: string,
  ) {
    try {
      const reportDate = date ? new Date(date) : new Date();
      return await this.balanceSheetService.generateBalanceSheet(reportDate, fiscalYearId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * تصدير الميزانية العمومية
   */
  @Get('export')
  @ApiOperation({ 
    summary: 'تصدير الميزانية العمومية',
    description: 'تصدير الميزانية العمومية بصيغة PDF أو Excel'
  })
  @ApiQuery({ name: 'date', required: false, description: 'تاريخ التقرير' })
  @ApiQuery({ name: 'format', required: true, enum: ['pdf', 'excel'], description: 'صيغة التصدير' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'تم تصدير الميزانية العمومية بنجاح'
  })
  async exportBalanceSheet(
    @Query('date') date?: string,
    @Query('format') format: 'pdf' | 'excel' = 'pdf',
  ) {
    try {
      const reportDate = date ? new Date(date) : new Date();
      const data = await this.balanceSheetService.generateBalanceSheet(reportDate);
      
      // TODO: تنفيذ منطق التصدير الفعلي
      return {
        message: `سيتم تصدير الميزانية العمومية بصيغة ${format}`,
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * الميزانية العمومية المقارنة
   */
  @Get('comparative')
  @ApiOperation({ 
    summary: 'الميزانية العمومية المقارنة',
    description: 'مقارنة الميزانية العمومية بين فترتين'
  })
  @ApiQuery({ name: 'startDate', required: true, description: 'تاريخ البداية' })
  @ApiQuery({ name: 'endDate', required: true, description: 'تاريخ النهاية' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'تم إنشاء الميزانية المقارنة بنجاح'
  })
  async getComparativeBalanceSheet(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      const startReport = await this.balanceSheetService.generateBalanceSheet(start);
      const endReport = await this.balanceSheetService.generateBalanceSheet(end);
      
      return {
        startDate: start,
        endDate: end,
        startReport,
        endReport,
        variance: {
          assets: endReport.assetsTotal - startReport.assetsTotal,
          liabilities: endReport.liabilitiesTotal - startReport.liabilitiesTotal,
          equity: endReport.equityTotal - startReport.equityTotal,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}
