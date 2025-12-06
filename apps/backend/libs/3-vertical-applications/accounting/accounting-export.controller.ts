import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  BadRequestException,
  Res,
  StreamableFile,
  Injectable,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { AccountingExportService } from './accounting-export.service'; // افتراض وجود الخدمة في نفس المجلد

// افتراض وجود DTOs في مكتبة العقود
// يجب استبدال هذا بالاستيراد الفعلي عند التنفيذ
// import { ExportDataDto } from '@semop/contracts';

// تعريف DTO وهمي للاستخدام في هذا المثال
// في التطبيق الحقيقي، سيتم استيراد هذا من @semop/contracts
class ExportDataDto {
  /**
   * نوع التقرير المطلوب تصديره (مثال: 'trial-balance', 'ledger')
   * @example 'trial-balance'
   */
  reportType: string;

  /**
   * تاريخ بداية الفترة المالية
   * @example '2024-01-01'
   */
  startDate: Date;

  /**
   * تاريخ نهاية الفترة المالية
   * @example '2024-12-31'
   */
  endDate: Date;

  /**
   * معرفات الحسابات المراد تضمينها (اختياري)
   * @example ['101', '205']
   */
  accountIds?: string[];
}

/**
 * وحدة التحكم (Controller) المسؤولة عن عمليات تصدير البيانات المحاسبية.
 * تستخدم المسار الأساسي 'accounting/export'.
 */
@Controller('accounting/export')
@ApiTags('Accounting')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true })) // تطبيق ValidationPipe على مستوى Controller
export class AccountingExportController {
  /**
   * حقن خدمة التصدير المحاسبي في الباني (Constructor).
   * @param accountingExportService - خدمة التصدير المحاسبي.
   */
  constructor(private readonly accountingExportService: AccountingExportService) {}

  /**
   * تصدير تقرير محاسبي بصيغة PDF.
   * المسار: POST /accounting/export/pdf
   * @param exportDataDto - بيانات التقرير المطلوبة.
   * @param res - كائن الاستجابة من Express لتعيين رؤوس الملف.
   * @returns ملف PDF كـ StreamableFile.
   */
  @Post('pdf')
  @HttpCode(HttpStatus.OK) // استخدام 200 OK لعمليات POST التي لا تنشئ موردًا جديدًا
  @ApiOperation({ summary: 'تصدير تقرير محاسبي بصيغة PDF', description: 'توليد وتصدير تقرير محاسبي محدد (مثل ميزان المراجعة أو دفتر الأستاذ) بصيغة PDF.' })
  @ApiBody({ type: ExportDataDto, description: 'بيانات التقرير المطلوبة للتصدير' })
  @ApiResponse({ status: 200, description: 'تم التصدير بنجاح. يتم إرجاع ملف PDF.', content: { 'application/pdf': { schema: { type: 'string', format: 'binary' } } } })
  @ApiResponse({ status: 400, description: 'خطأ في البيانات المدخلة. تحقق من صحة الحقول.' })
  @ApiResponse({ status: 500, description: 'خطأ داخلي في الخادم أثناء عملية التصدير.' })
  async exportToPdf(@Body() exportDataDto: ExportDataDto, @Res({ passthrough: true }) res: Response): Promise<StreamableFile> {
    try {
      // افتراض أن الخدمة تقوم بالتحقق من صحة البيانات وتوليد Buffer للملف
      const fileBuffer = await this.accountingExportService.exportToPdf(exportDataDto);

      // تعيين رؤوس الاستجابة لتمكين تنزيل الملف
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="accounting-report-${Date.now()}.pdf"`,
        'Content-Length': fileBuffer.length,
      });

      // إرجاع الملف كـ StreamableFile
      return new StreamableFile(fileBuffer);
    } catch (error) {
      // معالجة الأخطاء
      if (error instanceof BadRequestException) {
        // خطأ في منطق العمل (مثل نوع تقرير غير مدعوم)
        throw new BadRequestException(`خطأ في طلب التصدير: ${error.message}`);
      }
      // خطأ غير متوقع
      throw new InternalServerErrorException('حدث خطأ غير متوقع أثناء تصدير ملف PDF. يرجى المحاولة لاحقاً.');
    }
  }

  /**
   * تصدير تقرير محاسبي بصيغة Excel (xlsx).
   * المسار: POST /accounting/export/excel
   * @param exportDataDto - بيانات التقرير المطلوبة.
   * @param res - كائن الاستجابة من Express لتعيين رؤوس الملف.
   * @returns ملف Excel كـ StreamableFile.
   */
  @Post('excel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'تصدير تقرير محاسبي بصيغة Excel', description: 'توليد وتصدير تقرير محاسبي محدد بصيغة جدول بيانات Excel (xlsx).' })
  @ApiBody({ type: ExportDataDto, description: 'بيانات التقرير المطلوبة للتصدير' })
  @ApiResponse({ status: 200, description: 'تم التصدير بنجاح. يتم إرجاع ملف Excel.', content: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { schema: { type: 'string', format: 'binary' } } } })
  @ApiResponse({ status: 400, description: 'خطأ في البيانات المدخلة. تحقق من صحة الحقول.' })
  @ApiResponse({ status: 500, description: 'خطأ داخلي في الخادم أثناء عملية التصدير.' })
  async exportToExcel(@Body() exportDataDto: ExportDataDto, @Res({ passthrough: true }) res: Response): Promise<StreamableFile> {
    try {
      const fileBuffer = await this.accountingExportService.exportToExcel(exportDataDto);

      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="accounting-report-${Date.now()}.xlsx"`,
        'Content-Length': fileBuffer.length,
      });

      return new StreamableFile(fileBuffer);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(`خطأ في طلب التصدير: ${error.message}`);
      }
      throw new InternalServerErrorException('حدث خطأ غير متوقع أثناء تصدير ملف Excel. يرجى المحاولة لاحقاً.');
    }
  }

  /**
   * تصدير تقرير محاسبي بصيغة CSV.
   * المسار: POST /accounting/export/csv
   * @param exportDataDto - بيانات التقرير المطلوبة.
   * @param res - كائن الاستجابة من Express لتعيين رؤوس الملف.
   * @returns ملف CSV كـ StreamableFile.
   */
  @Post('csv')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'تصدير تقرير محاسبي بصيغة CSV', description: 'توليد وتصدير تقرير محاسبي محدد بصيغة قيم مفصولة بفواصل (CSV).' })
  @ApiBody({ type: ExportDataDto, description: 'بيانات التقرير المطلوبة للتصدير' })
  @ApiResponse({ status: 200, description: 'تم التصدير بنجاح. يتم إرجاع ملف CSV.', content: { 'text/csv': { schema: { type: 'string', format: 'binary' } } } })
  @ApiResponse({ status: 400, description: 'خطأ في البيانات المدخلة. تحقق من صحة الحقول.' })
  @ApiResponse({ status: 500, description: 'خطأ داخلي في الخادم أثناء عملية التصدير.' })
  async exportToCsv(@Body() exportDataDto: ExportDataDto, @Res({ passthrough: true }) res: Response): Promise<StreamableFile> {
    try {
      const fileBuffer = await this.accountingExportService.exportToCsv(exportDataDto);

      res.set({
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="accounting-report-${Date.now()}.csv"`,
        'Content-Length': fileBuffer.length,
      });

      return new StreamableFile(fileBuffer);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(`خطأ في طلب التصدير: ${error.message}`);
      }
      throw new InternalServerErrorException('حدث خطأ غير متوقع أثناء تصدير ملف CSV. يرجى المحاولة لاحقاً.');
    }
  }
}

// ملاحظة: يجب إنشاء ملف accounting-export.service.ts و ExportDataDto الفعليين ليعمل هذا الكود بشكل صحيح.
// تم افتراض وجودهما هنا لتلبية متطلبات حقن التبعية واستخدام DTO.
