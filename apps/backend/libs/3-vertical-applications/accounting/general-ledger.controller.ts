import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiProperty,
} from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// DTOs & Service Mocks (يفترض أنها مستوردة من '@semop/contracts' و Service)
// -----------------------------------------------------------------------------

// DTOs Mock - يفترض أنها مستوردة من '@semop/contracts'
class FindGeneralLedgerDto {
  @ApiProperty({ description: 'تاريخ البدء لتصفية القيود', required: false, example: '2024-01-01' })
  startDate?: Date;

  @ApiProperty({ description: 'تاريخ الانتهاء لتصفية القيود', required: false, example: '2024-12-31' })
  endDate?: Date;

  @ApiProperty({ description: 'رقم الصفحة', default: 1, required: false })
  page: number;

  @ApiProperty({ description: 'عدد السجلات في الصفحة', default: 10, required: false })
  limit: number;
}

class GeneralLedgerEntryDto {
  @ApiProperty({ description: 'معرف القيد', example: 'GL-00123' })
  id: string;

  @ApiProperty({ description: 'تاريخ القيد', example: '2024-05-15' })
  date: Date;

  @ApiProperty({ description: 'الوصف', example: 'فاتورة شراء رقم 456' })
  description: string;

  @ApiProperty({ description: 'الجانب المدين', example: 500.00 })
  debit: number;

  @ApiProperty({ description: 'الجانب الدائن', example: 0.00 })
  credit: number;

  @ApiProperty({ description: 'الرصيد', example: 500.00 })
  balance: number;
}

class GeneralLedgerAccountResultDto {
  @ApiProperty({ description: 'معرف الحساب', example: '1010' })
  accountId: string;

  @ApiProperty({ description: 'اسم الحساب', example: 'الصندوق' })
  accountName: string;

  @ApiProperty({ type: [GeneralLedgerEntryDto], description: 'قائمة بقيود دفتر الأستاذ للحساب' })
  entries: GeneralLedgerEntryDto[];
}

class GeneralLedgerExportDto {
  @ApiProperty({ description: 'صيغة الملف المصدر', enum: ['PDF', 'Excel', 'CSV'], example: 'Excel' })
  format: 'PDF' | 'Excel' | 'CSV';

  @ApiProperty({ description: 'رابط الملف المصدر', example: '/exports/general-ledger-2024-05-15.xlsx' })
  fileUrl: string;
}

// Service Mock - يفترض أنه GeneralLedgerService
class GeneralLedgerService {
  async findAll(query: FindGeneralLedgerDto): Promise<GeneralLedgerEntryDto[]> {
    // محاكاة عملية جلب البيانات
    if (query.page > 10) {
      return [];
    }
    return [
      { id: 'GL-001', date: new Date(), description: 'قيد افتتاحي', debit: 1000, credit: 0, balance: 1000 },
      { id: 'GL-002', date: new Date(), description: 'قيد إغلاق', debit: 0, credit: 500, balance: 500 },
    ];
  }

  async findByAccount(accountId: string, query: FindGeneralLedgerDto): Promise<GeneralLedgerAccountResultDto> {
    // محاكاة عملية جلب البيانات لحساب معين
    if (accountId === '9999') {
      throw new NotFoundException('الحساب المطلوب غير موجود في النظام.');
    }
    return {
      accountId,
      accountName: 'حساب تجريبي',
      entries: [
        { id: 'GL-003', date: new Date(), description: 'إيداع نقدي', debit: 200, credit: 0, balance: 200 },
      ],
    };
  }

  async export(query: FindGeneralLedgerDto): Promise<GeneralLedgerExportDto> {
    // محاكاة عملية تصدير البيانات
    if (!query.startDate || !query.endDate) {
      throw new BadRequestException('يجب تحديد تاريخي البدء والانتهاء لعملية التصدير.');
    }
    return {
      format: 'Excel',
      fileUrl: `/exports/general-ledger-${Date.now()}.xlsx`,
    };
  }
}

// -----------------------------------------------------------------------------
// GeneralLedger Controller
// -----------------------------------------------------------------------------

/**
 * GeneralLedgerController
 * يتحكم في عمليات دفتر الأستاذ العام (General Ledger)
 */
@Controller('accounting/general-ledger')
@ApiTags('Accounting')
@UsePipes(new ValidationPipe({ transform: true })) // تطبيق ValidationPipe على مستوى Controller
export class GeneralLedgerController {
  /**
   * حقن الخدمة المطلوبة في الـ constructor
   * @param generalLedgerService خدمة دفتر الأستاذ العام
   */
  constructor(private readonly generalLedgerService: GeneralLedgerService) {
    // في بيئة حقيقية، يتم حقن الخدمة هنا
    // GeneralLedgerService هو Mock لأغراض هذا المثال
  }

  /**
   * جلب جميع قيود دفتر الأستاذ العام مع خيارات التصفية والترقيم.
   * GET /accounting/general-ledger
   * @param query معلمات الاستعلام للتصفية والترقيم
   * @returns قائمة بقيود دفتر الأستاذ العام
   */
  @Get()
  @ApiOperation({ summary: 'جلب جميع قيود دفتر الأستاذ العام', description: 'يسمح بتصفية القيود حسب التاريخ والترقيم.' })
  @ApiResponse({
    status: 200,
    description: 'نجاح العملية. تم إرجاع قائمة بقيود دفتر الأستاذ العام.',
    type: [GeneralLedgerEntryDto],
  })
  @ApiResponse({ status: 500, description: 'خطأ داخلي في الخادم.' })
  async findAll(@Query() query: FindGeneralLedgerDto): Promise<GeneralLedgerEntryDto[]> {
    try {
      // التحقق من صحة المدخلات يتم تلقائيًا بواسطة ValidationPipe
      const entries = await this.generalLedgerService.findAll(query);

      if (entries.length === 0) {
        // يمكن إرجاع قائمة فارغة أو رمي استثناء NotFound حسب سياسة العمل
        return [];
      }

      return entries;
    } catch (error) {
      // معالجة الأخطاء العامة
      console.error('خطأ في جلب قيود دفتر الأستاذ العام:', error.message);
      throw new InternalServerErrorException('حدث خطأ غير متوقع أثناء جلب قيود دفتر الأستاذ العام.');
    }
  }

  /**
   * جلب قيود دفتر الأستاذ لحساب معين.
   * GET /accounting/general-ledger/account/:accountId
   * @param accountId معرف الحساب المطلوب
   * @param query معلمات الاستعلام للتصفية حسب التاريخ
   * @returns قيود دفتر الأستاذ للحساب المحدد
   */
  @Get('account/:accountId')
  @ApiOperation({ summary: 'جلب قيود دفتر الأستاذ لحساب معين', description: 'يسمح بالحصول على تفاصيل حركة حساب محدد خلال فترة زمنية.' })
  @ApiParam({ name: 'accountId', description: 'معرف الحساب (مثل رقم الحساب)', type: 'string', example: '1010' })
  @ApiQuery({ name: 'startDate', description: 'تاريخ البدء لتصفية القيود', required: false, type: 'string' })
  @ApiQuery({ name: 'endDate', description: 'تاريخ الانتهاء لتصفية القيود', required: false, type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'نجاح العملية. تم إرجاع قيود الحساب.',
    type: GeneralLedgerAccountResultDto,
  })
  @ApiResponse({ status: 400, description: 'طلب غير صالح (مثل معرف حساب غير صحيح).' })
  @ApiResponse({ status: 404, description: 'الحساب المطلوب غير موجود.' })
  async findByAccount(
    @Param('accountId') accountId: string,
    @Query() query: FindGeneralLedgerDto,
  ): Promise<GeneralLedgerAccountResultDto> {
    try {
      if (!accountId || accountId.trim() === '') {
        throw new BadRequestException('معرف الحساب (accountId) مطلوب ولا يمكن أن يكون فارغًا.');
      }

      const result = await this.generalLedgerService.findByAccount(accountId, query);

      return result;
    } catch (error) {
      // معالجة الأخطاء المحددة
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`الحساب ذو المعرف ${accountId} غير موجود.`);
      }
      if (error instanceof BadRequestException) {
        throw error; // رمي BadRequestException كما هو
      }
      // معالجة الأخطاء العامة
      console.error(`خطأ في جلب قيود الحساب ${accountId}:`, error.message);
      throw new InternalServerErrorException('حدث خطأ غير متوقع أثناء جلب قيود الحساب.');
    }
  }

  /**
   * تصدير بيانات دفتر الأستاذ العام إلى ملف (مثل Excel أو PDF).
   * GET /accounting/general-ledger/export
   * @param query معلمات الاستعلام للتصفية وصيغة التصدير
   * @returns رابط الملف المصدر
   */
  @Get('export')
  @ApiOperation({ summary: 'تصدير دفتر الأستاذ العام', description: 'تصدير بيانات دفتر الأستاذ العام إلى ملف (Excel, PDF, CSV) مع خيارات التصفية.' })
  @ApiQuery({ name: 'startDate', description: 'تاريخ البدء للتصدير', required: true, type: 'string' })
  @ApiQuery({ name: 'endDate', description: 'تاريخ الانتهاء للتصدير', required: true, type: 'string' })
  @ApiQuery({ name: 'format', description: 'صيغة التصدير المطلوبة', enum: ['PDF', 'Excel', 'CSV'], required: true })
  @ApiResponse({
    status: 200,
    description: 'نجاح عملية التصدير. تم إرجاع رابط الملف المصدر.',
    type: GeneralLedgerExportDto,
  })
  @ApiResponse({ status: 400, description: 'طلب غير صالح (مثل عدم تحديد فترة زمنية).' })
  @ApiResponse({ status: 500, description: 'خطأ في عملية التصدير على الخادم.' })
  async export(@Query() query: FindGeneralLedgerDto): Promise<GeneralLedgerExportDto> {
    try {
      // يجب أن يحتوي FindGeneralLedgerDto على حقل format في الواقع، لكن نستخدمه هنا للتصفية
      if (!query.startDate || !query.endDate) {
        throw new BadRequestException('يجب تحديد تاريخي البدء والانتهاء لعملية التصدير.');
      }

      const exportResult = await this.generalLedgerService.export(query);

      return exportResult;
    } catch (error) {
      // معالجة الأخطاء المحددة
      if (error instanceof BadRequestException) {
        throw error; // رمي BadRequestException كما هو
      }
      // معالجة الأخطاء العامة
      console.error('خطأ في عملية تصدير دفتر الأستاذ العام:', error.message);
      throw new InternalServerErrorException('فشلت عملية التصدير بسبب خطأ داخلي في الخادم.');
    }
  }
}
