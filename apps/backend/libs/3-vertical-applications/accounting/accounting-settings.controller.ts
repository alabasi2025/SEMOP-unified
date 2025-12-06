import {
  Controller,
  Get,
  Put,
  Body,
  UsePipes,
  ValidationPipe,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

// افتراض أن هذه الـ DTOs مستوردة من حزمة العقود المشتركة
// @semop/contracts
// لغرض المحاكاة، سنقوم بتعريف هياكل وهمية بسيطة
class AccountingSettingsDto {
  readonly fiscalYearStartMonth: number;
  readonly defaultCurrencyId: string;
  readonly enableMultiCurrency: boolean;
}

class UpdateAccountingSettingsDto {
  readonly fiscalYearStartMonth?: number;
  readonly defaultCurrencyId?: string;
  readonly enableMultiCurrency?: boolean;
}

// تعريف واجهة للخدمة (Service) التي سيتم حقنها
// في بيئة NestJS الحقيقية، ستكون هذه الخدمة موجودة في طبقة الخدمات
class AccountingSettingsService {
  async getSettings(): Promise<AccountingSettingsDto> {
    // محاكاة لعملية جلب الإعدادات
    return {
      fiscalYearStartMonth: 1,
      defaultCurrencyId: 'SAR',
      enableMultiCurrency: false,
    };
  }

  async updateSettings(
    data: UpdateAccountingSettingsDto,
  ): Promise<AccountingSettingsDto> {
    // محاكاة لعملية تحديث الإعدادات
    return {
      fiscalYearStartMonth: data.fiscalYearStartMonth || 1,
      defaultCurrencyId: data.defaultCurrencyId || 'SAR',
      enableMultiCurrency: data.enableMultiCurrency || false,
    };
  }

  async getDefaultSettings(): Promise<AccountingSettingsDto> {
    // محاكاة لعملية جلب الإعدادات الافتراضية
    return {
      fiscalYearStartMonth: 1,
      defaultCurrencyId: 'SAR',
      enableMultiCurrency: false,
    };
  }
}

/**
 * @Controller('accounting/settings')
 * المتحكم الخاص بإعدادات نظام المحاسبة.
 * يتعامل مع جلب وتحديث الإعدادات العامة للمحاسبة.
 */
@Controller('accounting/settings')
@ApiTags('Accounting')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true })) // تطبيق ValidationPipe على مستوى المتحكم
export class AccountingSettingsController {
  // حقن الخدمة المطلوبة في constructor
  constructor(
    private readonly accountingSettingsService: AccountingSettingsService,
  ) {}

  /**
   * @Get()
   * جلب إعدادات المحاسبة الحالية.
   */
  @Get()
  @ApiOperation({ summary: 'جلب إعدادات المحاسبة الحالية' })
  @ApiResponse({
    status: 200,
    description: 'تم جلب الإعدادات بنجاح.',
    type: AccountingSettingsDto,
  })
  @ApiResponse({
    status: 500,
    description: 'خطأ داخلي في الخادم.',
  })
  async getSettings(): Promise<AccountingSettingsDto> {
    try {
      // استدعاء الخدمة لجلب الإعدادات
      const settings = await this.accountingSettingsService.getSettings();

      // في حال عدم العثور على إعدادات (قد لا يحدث في هذا السياق، لكن كأفضل ممارسة)
      if (!settings) {
        throw new NotFoundException('لم يتم العثور على إعدادات المحاسبة.');
      }

      return settings;
    } catch (error) {
      // معالجة الأخطاء
      if (error instanceof NotFoundException) {
        throw error;
      }
      // رمي خطأ داخلي في الخادم لأي خطأ غير متوقع
      throw new InternalServerErrorException(
        'حدث خطأ غير متوقع أثناء جلب إعدادات المحاسبة.',
      );
    }
  }

  /**
   * @Put()
   * تحديث إعدادات المحاسبة.
   */
  @Put()
  @ApiOperation({ summary: 'تحديث إعدادات المحاسبة' })
  @ApiBody({ type: UpdateAccountingSettingsDto })
  @ApiResponse({
    status: 200,
    description: 'تم تحديث الإعدادات بنجاح.',
    type: AccountingSettingsDto,
  })
  @ApiResponse({
    status: 400,
    description: 'بيانات الإدخال غير صالحة.',
  })
  @ApiResponse({
    status: 500,
    description: 'خطأ داخلي في الخادم.',
  })
  async updateSettings(
    @Body() updateSettingsDto: UpdateAccountingSettingsDto,
  ): Promise<AccountingSettingsDto> {
    try {
      // التحقق من أن البيانات المدخلة ليست فارغة
      if (Object.keys(updateSettingsDto).length === 0) {
        throw new BadRequestException('يجب تقديم بيانات لتحديث الإعدادات.');
      }

      // استدعاء الخدمة لتحديث الإعدادات
      const updatedSettings = await this.accountingSettingsService.updateSettings(
        updateSettingsDto,
      );

      return updatedSettings;
    } catch (error) {
      // معالجة الأخطاء
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      // رمي خطأ داخلي في الخادم لأي خطأ غير متوقع
      throw new InternalServerErrorException(
        'حدث خطأ غير متوقع أثناء تحديث إعدادات المحاسبة.',
      );
    }
  }

  /**
   * @Get('defaults')
   * جلب إعدادات المحاسبة الافتراضية للنظام.
   */
  @Get('defaults')
  @ApiOperation({ summary: 'جلب إعدادات المحاسبة الافتراضية' })
  @ApiResponse({
    status: 200,
    description: 'تم جلب الإعدادات الافتراضية بنجاح.',
    type: AccountingSettingsDto,
  })
  @ApiResponse({
    status: 500,
    description: 'خطأ داخلي في الخادم.',
  })
  async getDefaultSettings(): Promise<AccountingSettingsDto> {
    try {
      // استدعاء الخدمة لجلب الإعدادات الافتراضية
      const defaultSettings = await this.accountingSettingsService.getDefaultSettings();

      return defaultSettings;
    } catch (error) {
      // معالجة الأخطاء
      // رمي خطأ داخلي في الخادم لأي خطأ غير متوقع
      throw new InternalServerErrorException(
        'حدث خطأ غير متوقع أثناء جلب إعدادات المحاسبة الافتراضية.',
      );
    }
  }
}