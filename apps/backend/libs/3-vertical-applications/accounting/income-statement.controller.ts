import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { Response } from 'express';

// ---------------------------------------------------------------------
// افتراض وجود DTOs في @semop/contracts
// في بيئة عمل حقيقية، يجب استيراد هذه الملفات من الحزمة المحددة.
// لأغراض هذا التمرين، سنقوم بتعريفها بشكل مبسط هنا.
// ---------------------------------------------------------------------

// DTOs الافتراضية (يجب استبدالها بالاستيراد الفعلي من @semop/contracts)
class GetIncomeStatementQueryDto {
  /** تاريخ بداية الفترة (مثال: 2024-01-01) */
  startDate: string;

  /** تاريخ نهاية الفترة (مثال: 2024-12-31) */
  endDate: string;

  /** رمز العملة (مثال: SAR) */
  currency: string;
}

class GetComparativeIncomeStatementQueryDto extends GetIncomeStatementQueryDto {
  /** تاريخ بداية الفترة المقارنة (مثال: 2023-01-01) */
  compareStartDate: string;

  /** تاريخ نهاية الفترة المقارنة (مثال: 2023-12-31) */
  compareEndDate: string;
}

// Service الافتراضي (يجب استبداله بالاستيراد الفعلي)
class IncomeStatementService {
  // دالة افتراضية لجلب قائمة الدخل
  async getIncomeStatement(query: GetIncomeStatementQueryDto): Promise<any> {
    // منطق العمل هنا: استدعاء طبقة البيانات أو المنطق
    // محاكاة لخطأ في حالة عدم العثور على بيانات
    if (query.startDate === '1900-01-01') {
      throw new NotFoundException('لم يتم العثور على بيانات قائمة الدخل للفترة المحددة.');
    }
    // محاكاة لخطأ في حالة خطأ داخلي
    if (query.startDate === 'error') {
      throw new Error('خطأ غير متوقع أثناء معالجة قائمة الدخل.');
    }
    return {
      reportName: 'قائمة الدخل',
      period: `${query.startDate} - ${query.endDate}`,
      currency: query.currency,
      data: {
        revenues: 500000,
        expenses: 300000,
        netIncome: 200000,
      },
    };
  }

  // دالة افتراضية لتصدير قائمة الدخل
  async exportIncomeStatement(query: GetIncomeStatementQueryDto): Promise<Buffer> {
    // منطق العمل هنا: توليد ملف Excel أو PDF
    // محاكاة لعدم وجود بيانات للتصدير
    if (query.startDate === '1900-01-01') {
      throw new NotFoundException('لا توجد بيانات لتصدير قائمة الدخل للفترة المحددة.');
    }
    // محاكاة لتوليد ملف
    return Buffer.from('Excel File Content for Income Statement');
  }

  // دالة افتراضية لجلب قائمة الدخل المقارنة
  async getComparativeIncomeStatement(query: GetComparativeIncomeStatementQueryDto): Promise<any> {
    // منطق العمل هنا
    if (query.startDate === '1900-01-01') {
      throw new NotFoundException('لم يتم العثور على بيانات قائمة الدخل المقارنة للفترات المحددة.');
    }
    return {
      reportName: 'قائمة الدخل المقارنة',
      period1: `${query.startDate} - ${query.endDate}`,
      period2: `${query.compareStartDate} - ${query.compareEndDate}`,
      currency: query.currency,
      data: {
        period1: { netIncome: 200000 },
        period2: { netIncome: 150000 },
      },
    };
  }
}

// ---------------------------------------------------------------------
// Controller الفعلي
// ---------------------------------------------------------------------

@Controller('accounting/income-statement')
@ApiTags('Accounting')
@UsePipes(new ValidationPipe({ transform: true })) // تطبيق ValidationPipe على مستوى Controller
@ApiExtraModels(GetIncomeStatementQueryDto, GetComparativeIncomeStatementQueryDto)
export class IncomeStatementController {
  // حقن الخدمة المطلوبة في constructor
  constructor(private readonly incomeStatementService: IncomeStatementService) {}

  /**
   * @api {get} /accounting/income-statement جلب قائمة الدخل
   * @apiDescription يجلب قائمة الدخل للفترة الزمنية المحددة.
   * @apiName GetIncomeStatement
   * @apiGroup Accounting
   */
  @Get()
  @ApiOperation({ summary: 'جلب قائمة الدخل', description: 'يجلب قائمة الدخل التفصيلية للفترة الزمنية المحددة.' })
  @ApiQuery({ name: 'startDate', description: 'تاريخ بداية الفترة', example: '2024-01-01', type: String })
  @ApiQuery({ name: 'endDate', description: 'تاريخ نهاية الفترة', example: '2024-12-31', type: String })
  @ApiQuery({ name: 'currency', description: 'رمز العملة المطلوب عرض التقرير بها', example: 'SAR', type: String })
  @ApiResponse({ status: 200, description: 'نجاح العملية، تم إرجاع قائمة الدخل.', schema: { example: { reportName: 'قائمة الدخل', data: { netIncome: 200000 } } } })
  @ApiResponse({ status: 400, description: 'خطأ في إدخال البيانات (مثل تنسيق التاريخ غير صحيح).', schema: { example: { statusCode: 400, message: 'خطأ في تنسيق تاريخ البداية.', error: 'Bad Request' } } })
  @ApiResponse({ status: 404, description: 'لم يتم العثور على بيانات للفترة المحددة.', schema: { example: { statusCode: 404, message: 'لم يتم العثور على بيانات قائمة الدخل للفترة المحددة.', error: 'Not Found' } } })
  @ApiResponse({ status: 500, description: 'خطأ داخلي في الخادم.', schema: { example: { statusCode: 500, message: 'حدث خطأ غير متوقع أثناء جلب قائمة الدخل.', error: 'Internal Server Error' } } })
  async getIncomeStatement(@Query() query: GetIncomeStatementQueryDto) {
    try {
      // التحقق من صحة البيانات يتم تلقائياً عبر ValidationPipe
      // يمكن إضافة تحققات منطقية إضافية هنا
      if (new Date(query.startDate) >= new Date(query.endDate)) {
        throw new BadRequestException('يجب أن يكون تاريخ البداية أقدم من تاريخ النهاية.');
      }

      const result = await this.incomeStatementService.getIncomeStatement(query);
      return result;
    } catch (error) {
      // معالجة الأخطاء وإلقاء الاستثناءات المناسبة برسائل عربية واضحة
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        // إعادة إلقاء الاستثناءات المحددة
        throw error;
      }

      // معالجة الأخطاء العامة والداخلية
      console.error('خطأ في جلب قائمة الدخل:', error.message);
      throw new InternalServerErrorException('حدث خطأ غير متوقع أثناء جلب قائمة الدخل. يرجى المحاولة لاحقاً.');
    }
  }

  /**
   * @api {get} /accounting/income-statement/export تصدير قائمة الدخل
   * @apiDescription يقوم بتصدير قائمة الدخل إلى ملف (مثل Excel أو PDF).
   * @apiName ExportIncomeStatement
   * @apiGroup Accounting
   */
  @Get('export')
  @ApiOperation({ summary: 'تصدير قائمة الدخل', description: 'يقوم بتصدير قائمة الدخل للفترة المحددة إلى ملف (Excel/PDF).' })
  @ApiQuery({ name: 'startDate', description: 'تاريخ بداية الفترة', example: '2024-01-01', type: String })
  @ApiQuery({ name: 'endDate', description: 'تاريخ نهاية الفترة', example: '2024-12-31', type: String })
  @ApiQuery({ name: 'currency', description: 'رمز العملة', example: 'SAR', type: String })
  @ApiResponse({ status: 200, description: 'نجاح التصدير، يتم إرجاع الملف.', content: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { schema: { type: 'string', format: 'binary' } } } })
  @ApiResponse({ status: 404, description: 'لا توجد بيانات للتصدير للفترة المحددة.', schema: { example: { statusCode: 404, message: 'لا توجد بيانات لتصدير قائمة الدخل للفترة المحددة.', error: 'Not Found' } } })
  async exportIncomeStatement(@Query() query: GetIncomeStatementQueryDto, @Res() res: Response) {
    try {
      // التحقق من صحة البيانات يتم تلقائياً عبر ValidationPipe
      if (new Date(query.startDate) >= new Date(query.endDate)) {
        throw new BadRequestException('يجب أن يكون تاريخ البداية أقدم من تاريخ النهاية لتصدير التقرير.');
      }

      const fileBuffer = await this.incomeStatementService.exportIncomeStatement(query);

      // إعداد رؤوس الاستجابة لتنزيل الملف
      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // مثال لملف Excel
        'Content-Disposition': `attachment; filename="income_statement_${query.startDate}_to_${query.endDate}.xlsx"`,
        'Content-Length': fileBuffer.length,
      });

      res.send(fileBuffer);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      console.error('خطأ في تصدير قائمة الدخل:', error.message);
      throw new InternalServerErrorException('حدث خطأ غير متوقع أثناء تصدير قائمة الدخل. يرجى المحاولة لاحقاً.');
    }
  }

  /**
   * @api {get} /accounting/income-statement/comparative جلب قائمة الدخل المقارنة
   * @apiDescription يجلب قائمة الدخل لفترتين زمنيتين للمقارنة.
   * @apiName GetComparativeIncomeStatement
   * @apiGroup Accounting
   */
  @Get('comparative')
  @ApiOperation({ summary: 'جلب قائمة الدخل المقارنة', description: 'يجلب قائمة الدخل لفترتين زمنيتين مختلفتين لإجراء المقارنة.' })
  @ApiQuery({ name: 'startDate', description: 'تاريخ بداية الفترة الأولى', example: '2024-01-01', type: String })
  @ApiQuery({ name: 'endDate', description: 'تاريخ نهاية الفترة الأولى', example: '2024-12-31', type: String })
  @ApiQuery({ name: 'compareStartDate', description: 'تاريخ بداية الفترة الثانية للمقارنة', example: '2023-01-01', type: String })
  @ApiQuery({ name: 'compareEndDate', description: 'تاريخ نهاية الفترة الثانية للمقارنة', example: '2023-12-31', type: String })
  @ApiQuery({ name: 'currency', description: 'رمز العملة', example: 'SAR', type: String })
  @ApiResponse({ status: 200, description: 'نجاح العملية، تم إرجاع قائمة الدخل المقارنة.', schema: { example: { reportName: 'قائمة الدخل المقارنة', data: { period1: { netIncome: 200000 }, period2: { netIncome: 150000 } } } } })
  @ApiResponse({ status: 400, description: 'خطأ في إدخال البيانات.', schema: { example: { statusCode: 400, message: 'خطأ في تنسيق تاريخ الفترة المقارنة.', error: 'Bad Request' } } })
  @ApiResponse({ status: 404, description: 'لم يتم العثور على بيانات للفترات المحددة.', schema: { example: { statusCode: 404, message: 'لم يتم العثور على بيانات قائمة الدخل المقارنة للفترات المحددة.', error: 'Not Found' } } })
  async getComparativeIncomeStatement(@Query() query: GetComparativeIncomeStatementQueryDto) {
    try {
      // التحقق من صحة البيانات يتم تلقائياً عبر ValidationPipe
      if (new Date(query.startDate) >= new Date(query.endDate) || new Date(query.compareStartDate) >= new Date(query.compareEndDate)) {
        throw new BadRequestException('يجب أن يكون تاريخ البداية أقدم من تاريخ النهاية لكل فترة.');
      }

      const result = await this.incomeStatementService.getComparativeIncomeStatement(query);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      console.error('خطأ في جلب قائمة الدخل المقارنة:', error.message);
      throw new InternalServerErrorException('حدث خطأ غير متوقع أثناء جلب قائمة الدخل المقارنة. يرجى المحاولة لاحقاً.');
    }
  }
}
