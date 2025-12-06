import {
  Controller,
  Get,
  Query,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString, IsIn } from 'class-validator';

// =================================================================================================
// DTOs الوهمية (Mock DTOs) - نفترض أنها مستوردة من @semop/contracts
// =================================================================================================

/**
 * DTO للاستعلام عن تقرير أرصدة الحسابات
 */
export class AccountBalanceReportQueryDto {
  @ApiQuery({
    name: 'startDate',
    description: 'تاريخ بداية الفترة (بصيغة YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @IsDateString({}, { message: 'يجب أن يكون تاريخ البداية بصيغة تاريخ صالحة.' })
  startDate: string;

  @ApiQuery({
    name: 'endDate',
    description: 'تاريخ نهاية الفترة (بصيغة YYYY-MM-DD)',
    example: '2024-12-31',
  })
  @IsDateString({}, { message: 'يجب أن يكون تاريخ النهاية بصيغة تاريخ صالحة.' })
  endDate: string;

  @ApiQuery({
    name: 'currencyId',
    description: 'معرف العملة المراد تصفية التقرير بها (اختياري)',
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber({}, { message: 'يجب أن يكون معرف العملة رقماً.' })
  currencyId?: number;

  @ApiQuery({
    name: 'accountId',
    description: 'معرف الحساب المراد تصفية التقرير به (اختياري)',
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber({}, { message: 'يجب أن يكون معرف الحساب رقماً.' })
  accountId?: number;
}

/**
 * DTO للاستعلام عن تقرير أرصدة الحسابات مع خيار التصدير
 */
export class AccountBalanceReportExportQueryDto extends AccountBalanceReportQueryDto {
  @ApiQuery({
    name: 'format',
    description: 'صيغة التصدير المطلوبة',
    enum: ['pdf', 'excel'],
    example: 'excel',
  })
  @IsString({ message: 'يجب تحديد صيغة التصدير.' })
  @IsIn(['pdf', 'excel'], { message: 'صيغة التصدير غير صالحة. يجب أن تكون "pdf" أو "excel".' })
  format: 'pdf' | 'excel';
}

/**
 * DTO لنموذج استجابة تقرير أرصدة الحسابات
 */
export class AccountBalanceReportResponseDto {
  accountId: number;
  accountName: string;
  openingBalance: number;
  debit: number;
  credit: number;
  closingBalance: number;
}

// =================================================================================================
// الخدمة الوهمية (Mock Service) - نفترض أنها موجودة في ملف آخر
// =================================================================================================

/**
 * خدمة وهمية لإدارة تقارير أرصدة الحسابات
 */
@Injectable()
export class AccountBalanceReportService {
  /**
   * يجلب تقرير أرصدة الحسابات
   */
  async getAccountBalances(
    query: AccountBalanceReportQueryDto,
  ): Promise<AccountBalanceReportResponseDto[]> {
    // منطق وهمي: في التطبيق الحقيقي، سيتم استدعاء مستودع البيانات (Repository)
    console.log('Fetching account balances with query:', query);
    return [
      {
        accountId: 101,
        accountName: 'الصندوق الرئيسي',
        openingBalance: 50000,
        debit: 15000,
        credit: 5000,
        closingBalance: 60000,
      },
    ];
  }

  /**
   * يصدر تقرير أرصدة الحسابات إلى ملف
   */
  async exportAccountBalances(
    query: AccountBalanceReportExportQueryDto,
  ): Promise<string> {
    // منطق وهمي: إنشاء ملف وإرجاع مساره
    console.log('Exporting account balances with query:', query);
    if (query.format === 'pdf') {
      return '/tmp/account-balances-report.pdf';
    }
    return '/tmp/account-balances-report.xlsx';
  }

  /**
   * يجلب تقرير أرصدة الحسابات مجمّعاً حسب نوع الحساب
   */
  async getAccountBalancesByType(
    query: AccountBalanceReportQueryDto,
  ): Promise<AccountBalanceReportResponseDto[]> {
    // منطق وهمي
    console.log('Fetching account balances by type with query:', query);
    return [
      {
        accountId: 1,
        accountName: 'الأصول (إجمالي)',
        openingBalance: 100000,
        debit: 30000,
        credit: 10000,
        closingBalance: 120000,
      },
    ];
  }
}

// =================================================================================================
// Controller الرئيسي
// =================================================================================================

@Controller('accounting/reports/account-balances')
@ApiTags('Accounting')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true })) // تطبيق ValidationPipe على مستوى Controller
export class AccountBalanceReportController {
  constructor(
    private readonly accountBalanceReportService: AccountBalanceReportService,
  ) {}

  /**
   * @api {get} /accounting/reports/account-balances جلب تقرير أرصدة الحسابات
   * @apiDescription يجلب تقرير أرصدة الحسابات للفترة المحددة مع خيارات التصفية.
   */
  @Get()
  @ApiOperation({ summary: 'جلب تقرير أرصدة الحسابات' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'تم جلب التقرير بنجاح.',
    type: [AccountBalanceReportResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'خطأ في بيانات الاستعلام المدخلة.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'حدث خطأ غير متوقع أثناء معالجة الطلب.',
  })
  async getAccountBalances(
    @Query() query: AccountBalanceReportQueryDto,
  ): Promise<AccountBalanceReportResponseDto[]> {
    try {
      // التحقق من منطقية التواريخ
      if (new Date(query.startDate) > new Date(query.endDate)) {
        throw new BadRequestException('تاريخ البداية يجب أن يكون قبل أو يساوي تاريخ النهاية.');
      }

      const report = await this.accountBalanceReportService.getAccountBalances(query);

      if (!report || report.length === 0) {
        throw new NotFoundException('لم يتم العثور على أرصدة حسابات للفترة المحددة.');
      }

      return report;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      // تسجيل الخطأ الداخلي للمراجعة
      console.error('Internal server error in getAccountBalances:', error);
      throw new InternalServerErrorException('فشل داخلي في الخادم أثناء جلب التقرير.');
    }
  }

  /**
   * @api {get} /accounting/reports/account-balances/export تصدير تقرير أرصدة الحسابات
   * @apiDescription يقوم بتصدير تقرير أرصدة الحسابات إلى ملف (PDF أو Excel).
   */
  @Get('export')
  @ApiOperation({ summary: 'تصدير تقرير أرصدة الحسابات' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'تم إنشاء ملف التصدير بنجاح. يتم إرجاع مسار الملف أو دفق البيانات.',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'خطأ في بيانات الاستعلام أو صيغة التصدير غير صالحة.',
  })
  async exportAccountBalances(
    @Query() query: AccountBalanceReportExportQueryDto,
  ): Promise<{ filePath: string; message: string }> {
    try {
      // التحقق من منطقية التواريخ
      if (new Date(query.startDate) > new Date(query.endDate)) {
        throw new BadRequestException('تاريخ البداية يجب أن يكون قبل أو يساوي تاريخ النهاية.');
      }

      const filePath = await this.accountBalanceReportService.exportAccountBalances(query);

      return {
        filePath,
        message: `تم تصدير التقرير بنجاح إلى المسار: ${filePath}`,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Internal server error in exportAccountBalances:', error);
      throw new InternalServerErrorException('فشل داخلي في الخادم أثناء تصدير التقرير.');
    }
  }

  /**
   * @api {get} /accounting/reports/account-balances/by-type جلب تقرير أرصدة الحسابات مجمّعاً حسب النوع
   * @apiDescription يجلب تقرير أرصدة الحسابات مجمّعاً حسب نوع الحساب للفترة المحددة.
   */
  @Get('by-type')
  @ApiOperation({ summary: 'جلب تقرير أرصدة الحسابات مجمّعاً حسب النوع' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'تم جلب التقرير المجمّع بنجاح.',
    type: [AccountBalanceReportResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'خطأ في بيانات الاستعلام المدخلة.',
  })
  async getAccountBalancesByType(
    @Query() query: AccountBalanceReportQueryDto,
  ): Promise<AccountBalanceReportResponseDto[]> {
    try {
      // التحقق من منطقية التواريخ
      if (new Date(query.startDate) > new Date(query.endDate)) {
        throw new BadRequestException('تاريخ البداية يجب أن يكون قبل أو يساوي تاريخ النهاية.');
      }

      const report = await this.accountBalanceReportService.getAccountBalancesByType(query);

      if (!report || report.length === 0) {
        throw new NotFoundException('لم يتم العثور على أرصدة حسابات مجمّعة للفترة المحددة.');
      }

      return report;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      console.error('Internal server error in getAccountBalancesByType:', error);
      throw new InternalServerErrorException('فشل داخلي في الخادم أثناء جلب التقرير المجمّع.');
    }
  }
}
