import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
  Inject,
  InternalServerErrorException,
  BadRequestException,
  Res,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { Response } from 'express';

// افتراض وجود الخدمات و DTOs في المسارات التالية
// يجب استبدال هذا الاستيراد بالمسار الفعلي للخدمة
import { JournalEntriesReportService } from './journal-entries-report.service';
import {
  JournalEntriesReportQueryDto,
  JournalEntriesReportResponseDto,
  JournalEntriesReportSummaryResponseDto,
} from '@semop/contracts'; // افتراض وجود DTOs في حزمة العقود

/**
 * @Controller JournalEntriesReportController
 * مسؤول عن توفير تقارير القيود اليومية (Journal Entries)
 * يتبع معايير RESTful API ويوفر توثيق Swagger كامل.
 */
@Controller('accounting/reports/journal-entries')
@ApiTags('Accounting')
// تطبيق ValidationPipe على مستوى Controller لضمان التحقق من صحة جميع المدخلات
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class JournalEntriesReportController {
  /**
   * حقن خدمة تقارير القيود اليومية في الـ constructor
   * @param reportService خدمة تقارير القيود اليومية
   */
  constructor(
    @Inject(JournalEntriesReportService)
    private readonly reportService: JournalEntriesReportService,
  ) {}

  /**
   * @Get /
   * نقطة نهاية لجلب تقرير القيود اليومية الرئيسي.
   * تسمح بالتصفية والتقسيم (Pagination) عبر معاملات الاستعلام.
   * @param query معاملات الاستعلام (JournalEntriesReportQueryDto)
   * @returns قائمة بالقيود اليومية التي تطابق معايير التصفية
   */
  @Get()
  @ApiOperation({ summary: 'جلب تقرير القيود اليومية', description: 'يسترجع قائمة بالقيود اليومية مع إمكانية التصفية والتقسيم.' })
  @ApiQuery({ type: JournalEntriesReportQueryDto, description: 'معاملات التصفية والتقسيم للتقرير' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'نجاح العملية. تم استرجاع التقرير بنجاح.',
    type: JournalEntriesReportResponseDto,
    isArray: true,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'خطأ في إدخال البيانات (Validation Error).' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'خطأ داخلي في الخادم.' })
  async getReport(
    @Query() query: JournalEntriesReportQueryDto,
  ): Promise<JournalEntriesReportResponseDto[]> {
    try {
      // استدعاء الخدمة لجلب التقرير
      const reportData = await this.reportService.getJournalEntriesReport(query);
      return reportData;
    } catch (error) {
      // معالجة الأخطاء
      if (error instanceof BadRequestException) {
        throw new BadRequestException(`خطأ في معاملات الاستعلام: ${error.message}`);
      }
      // رمي خطأ داخلي في الخادم لأي خطأ غير متوقع
      throw new InternalServerErrorException('حدث خطأ غير متوقع أثناء جلب تقرير القيود اليومية.');
    }
  }

  /**
   * @Get /summary
   * نقطة نهاية لجلب ملخص تقرير القيود اليومية (مثل الإجماليات).
   * تستخدم نفس معاملات الاستعلام للتصفية.
   * @param query معاملات الاستعلام (JournalEntriesReportQueryDto)
   * @returns ملخص التقرير
   */
  @Get('summary')
  @ApiOperation({ summary: 'جلب ملخص تقرير القيود اليومية', description: 'يسترجع ملخصاً إجمالياً للقيود اليومية المطابقة لمعايير التصفية.' })
  @ApiQuery({ type: JournalEntriesReportQueryDto, description: 'معاملات التصفية والتقسيم للملخص' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'نجاح العملية. تم استرجاع الملخص بنجاح.',
    type: JournalEntriesReportSummaryResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'خطأ في إدخال البيانات (Validation Error).' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'خطأ داخلي في الخادم.' })
  async getSummary(
    @Query() query: JournalEntriesReportQueryDto,
  ): Promise<JournalEntriesReportSummaryResponseDto> {
    try {
      // استدعاء الخدمة لجلب الملخص
      const summaryData = await this.reportService.getJournalEntriesSummary(query);
      return summaryData;
    } catch (error) {
      // معالجة الأخطاء
      if (error instanceof BadRequestException) {
        throw new BadRequestException(`خطأ في معاملات الاستعلام للملخص: ${error.message}`);
      }
      // رمي خطأ داخلي في الخادم لأي خطأ غير متوقع
      throw new InternalServerErrorException('حدث خطأ غير متوقع أثناء جلب ملخص تقرير القيود اليومية.');
    }
  }

  /**
   * @Get /export
   * نقطة نهاية لتصدير تقرير القيود اليومية إلى ملف (مثل Excel أو PDF).
   * تستخدم معاملات الاستعلام لتحديد البيانات المراد تصديرها.
   * @param query معاملات الاستعلام (JournalEntriesReportQueryDto)
   * @param res كائن الاستجابة للتحكم في عملية التنزيل
   */
  @Get('export')
  @ApiOperation({ summary: 'تصدير تقرير القيود اليومية', description: 'يقوم بتصدير التقرير إلى ملف (مثل Excel) وإعادته كملف قابل للتنزيل.' })
  @ApiQuery({ type: JournalEntriesReportQueryDto, description: 'معاملات التصفية للبيانات المراد تصديرها' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'نجاح العملية. تم إنشاء الملف وإرساله للتنزيل.',
    content: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
        schema: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'خطأ في إدخال البيانات (Validation Error).' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'خطأ داخلي في الخادم.' })
  async exportReport(
    @Query() query: JournalEntriesReportQueryDto,
    @Res() res: Response,
  ): Promise<void> {
    try {
      // استدعاء الخدمة لإنشاء ملف التصدير
      const { fileBuffer, fileName, mimeType } = await this.reportService.exportJournalEntriesReport(query);

      // إعداد رؤوس الاستجابة لعملية التنزيل
      res.set({
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileBuffer.length,
      });

      // إرسال الملف كـ Buffer
      res.status(HttpStatus.OK).send(fileBuffer);
    } catch (error) {
      // معالجة الأخطاء
      if (error instanceof BadRequestException) {
        throw new BadRequestException(`خطأ في معاملات التصدير: ${error.message}`);
      }
      // رمي خطأ داخلي في الخادم لأي خطأ غير متوقع
      throw new InternalServerErrorException('حدث خطأ غير متوقع أثناء تصدير تقرير القيود اليومية.');
    }
  }
}
