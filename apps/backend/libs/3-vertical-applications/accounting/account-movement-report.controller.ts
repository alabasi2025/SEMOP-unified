import {
  Controller,
  Get,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
  NotFoundException,
  InternalServerErrorException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';

// افتراض وجود DTOs في @semop/contracts
// يجب استبدال هذه بـ DTOs الفعلية عند توفرها
class AccountMovementReportParamsDto {
  accountId: string;
}

class AccountMovementReportQueryDto {
  startDate: Date;
  endDate: Date;
  pageSize: number;
  pageNumber: number;
}

class AccountMovementReportExportQueryDto {
  startDate: Date;
  endDate: Date;
}

class AccountMovementReportResponseDto {
  // هيكل افتراضي للاستجابة
  totalRecords: number;
  reportData: any[];
}

// افتراض وجود Service لمعالجة منطق الأعمال
class AccountMovementReportService {
  async getAccountMovementReport(accountId: string, query: AccountMovementReportQueryDto): Promise<AccountMovementReportResponseDto> {
    // منطق جلب التقرير
    if (accountId === 'non-existent') {
      throw new NotFoundException('الحساب غير موجود.');
    }
    // ...
    return { totalRecords: 100, reportData: [] };
  }

  async exportAccountMovementReport(accountId: string, query: AccountMovementReportExportQueryDto): Promise<Buffer> {
    // منطق تصدير التقرير (مثلاً إلى CSV أو PDF)
    if (accountId === 'non-existent') {
      throw new NotFoundException('الحساب غير موجود.');
    }
    // افتراض إرجاع ملف CSV كـ Buffer
    const csvContent = 'Date,Description,Debit,Credit\n2023-01-01,Opening Balance,0,0';
    return Buffer.from(csvContent, 'utf-8');
  }
}

// تطبيق ValidationPipe على مستوى Controller لضمان التحقق من صحة جميع المدخلات
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
@Controller('accounting/reports/account-movement')
@ApiTags('Accounting')
export class AccountMovementReportController {
  // حقن الخدمة المطلوبة في constructor
  // يجب استبدال AccountMovementReportService بالخدمة الفعلية المحقونة
  constructor(private readonly reportService: AccountMovementReportService = new AccountMovementReportService()) {}

  /**
   * @description جلب تقرير حركة حساب معين
   * @param accountId معرف الحساب
   * @param query معايير الاستعلام (التاريخ، التصفح)
   * @returns تقرير حركة الحساب
   */
  @Get('/:accountId')
  @ApiOperation({ summary: 'جلب تقرير حركة حساب', description: 'يسترجع تقرير حركة حساب معين بناءً على معرف الحساب ومعايير التصفية.' })
  @ApiParam({ name: 'accountId', description: 'معرف الحساب المطلوب', type: String })
  @ApiQuery({ name: 'startDate', description: 'تاريخ بداية الفترة', required: false, type: Date })
  @ApiQuery({ name: 'endDate', description: 'تاريخ نهاية الفترة', required: false, type: Date })
  @ApiQuery({ name: 'pageSize', description: 'عدد السجلات في الصفحة', required: false, type: Number })
  @ApiQuery({ name: 'pageNumber', description: 'رقم الصفحة', required: false, type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: 'نجاح العملية', type: AccountMovementReportResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'الحساب غير موجود' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'خطأ داخلي في الخادم' })
  async getAccountMovementReport(
    @Param('accountId') accountId: string,
    @Query() query: AccountMovementReportQueryDto,
  ): Promise<AccountMovementReportResponseDto> {
    try {
      // التحقق من صحة accountId يمكن أن يتم في Pipe أو Service
      if (!accountId) {
        throw new NotFoundException('معرف الحساب مفقود.');
      }

      const report = await this.reportService.getAccountMovementReport(accountId, query);
      
      // يمكن إضافة منطق للتحقق من عدم وجود بيانات (مثلاً إذا كان التقرير فارغاً)
      // ولكن NotFoundException عادةً ما تكون للحساب نفسه
      return report;
    } catch (error) {
      // معالجة الأخطاء
      if (error instanceof NotFoundException) {
        throw error; // رمي الاستثناء كما هو
      }
      // رمي خطأ عام في حال وجود مشكلة غير متوقعة
      throw new InternalServerErrorException('حدث خطأ أثناء جلب تقرير حركة الحساب: ' + error.message);
    }
  }

  /**
   * @description تصدير تقرير حركة حساب معين
   * @param accountId معرف الحساب
   * @param query معايير الاستعلام (التاريخ)
   * @param res كائن الاستجابة للتحكم في رأس الملف
   */
  @Get('/:accountId/export')
  @ApiOperation({ summary: 'تصدير تقرير حركة حساب', description: 'يقوم بتصدير تقرير حركة حساب معين كملف (مثل CSV).' })
  @ApiParam({ name: 'accountId', description: 'معرف الحساب المطلوب', type: String })
  @ApiQuery({ name: 'startDate', description: 'تاريخ بداية الفترة', required: false, type: Date })
  @ApiQuery({ name: 'endDate', description: 'تاريخ نهاية الفترة', required: false, type: Date })
  @ApiResponse({ status: HttpStatus.OK, description: 'نجاح عملية التصدير (إرجاع ملف)' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'الحساب غير موجود' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'خطأ داخلي في الخادم' })
  async exportAccountMovementReport(
    @Param('accountId') accountId: string,
    @Query() query: AccountMovementReportExportQueryDto,
    @Res() res: Response,
  ): Promise<void> {
    try {
      if (!accountId) {
        throw new NotFoundException('معرف الحساب مفقود.');
      }

      const fileBuffer = await this.reportService.exportAccountMovementReport(accountId, query);

      // إعداد رؤوس الاستجابة لتنزيل الملف
      res.set({
        'Content-Type': 'text/csv', // افتراض تصدير CSV
        'Content-Disposition': `attachment; filename="account_movement_report_${accountId}.csv"`,
        'Content-Length': fileBuffer.length,
      });

      res.end(fileBuffer);
    } catch (error) {
      // معالجة الأخطاء
      if (error instanceof NotFoundException) {
        // يجب إرسال الخطأ يدوياً عند استخدام @Res()
        res.status(HttpStatus.NOT_FOUND).send({
          statusCode: HttpStatus.NOT_FOUND,
          message: error.message,
          error: 'Not Found',
        });
        return;
      }
      // رمي خطأ عام في حال وجود مشكلة غير متوقعة
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'حدث خطأ أثناء تصدير تقرير حركة الحساب: ' + error.message,
        error: 'Internal Server Error',
      });
    }
  }
}
