import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  NotFoundException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import {
  CreateCurrencyDto,
  UpdateCurrencyDto,
  UpdateExchangeRateDto,
  FindCurrencyDto,
  CurrencyResponseDto,
  BaseCurrencyResponseDto,
} from '@semop/contracts';

// افتراض وجود خدمة CurrenciesService لتنفيذ منطق الأعمال
// في بيئة NestJS حقيقية، سيتم حقن هذه الخدمة في constructor
class CurrenciesService {
  // دالة وهمية للبحث عن جميع العملات
  async findAll(query: FindCurrencyDto): Promise<CurrencyResponseDto[]> {
    // منطق البحث
    return [];
  }

  // دالة وهمية للبحث عن عملة واحدة
  async findOne(id: string): Promise<CurrencyResponseDto> {
    // منطق البحث
    if (id === 'not-found') {
      throw new NotFoundException(`لم يتم العثور على العملة بالمعرف: ${id}`);
    }
    return { id, name: 'ريال سعودي', code: 'SAR', rate: 1, isBase: true };
  }

  // دالة وهمية لإنشاء عملة
  async create(dto: CreateCurrencyDto): Promise<CurrencyResponseDto> {
    // منطق الإنشاء
    return { id: 'new-id', name: dto.name, code: dto.code, rate: 1, isBase: false };
  }

  // دالة وهمية لتحديث عملة
  async update(id: string, dto: UpdateCurrencyDto): Promise<CurrencyResponseDto> {
    // منطق التحديث
    if (id === 'not-found') {
      throw new NotFoundException(`لم يتم العثور على العملة بالمعرف: ${id}`);
    }
    return { id, name: dto.name, code: 'USD', rate: 3.75, isBase: false };
  }

  // دالة وهمية لحذف عملة
  async remove(id: string): Promise<void> {
    // منطق الحذف
    if (id === 'not-found') {
      throw new NotFoundException(`لم يتم العثور على العملة بالمعرف: ${id}`);
    }
  }

  // دالة وهمية لتحديث سعر الصرف
  async updateExchangeRate(id: string, dto: UpdateExchangeRateDto): Promise<CurrencyResponseDto> {
    // منطق تحديث سعر الصرف
    if (id === 'not-found') {
      throw new NotFoundException(`لم يتم العثور على العملة بالمعرف: ${id}`);
    }
    if (dto.rate <= 0) {
      throw new BadRequestException('يجب أن يكون سعر الصرف قيمة موجبة.');
    }
    return { id, name: 'يورو', code: 'EUR', rate: dto.rate, isBase: false };
  }

  // دالة وهمية للحصول على العملة الأساسية
  async getBaseCurrency(): Promise<BaseCurrencyResponseDto> {
    return { code: 'SAR', name: 'الريال السعودي' };
  }
}

// يجب أن يتم حقن الخدمة الحقيقية في constructor
// هذا مجرد تعريف مؤقت لتجنب أخطاء التحويل البرمجي
const currenciesService = new CurrenciesService();

/**
 * Controller خاص بإدارة العملات وأسعار الصرف في نظام المحاسبة.
 * يتبع معايير RESTful API ويوفر توثيق Swagger شامل.
 */
@Controller('accounting/currencies')
@ApiTags('Accounting - Currencies')
export class CurrenciesController {
  /**
   * حقن خدمة العملات (CurrenciesService) في constructor.
   * @param currenciesService خدمة العملات
   */
  constructor(private readonly currenciesService: CurrenciesService) {}

  /**
   * استرجاع قائمة بجميع العملات.
   * يمكن تصفية النتائج باستخدام معاملات الاستعلام (Query Parameters).
   */
  @Get()
  @ApiOperation({ summary: 'استرجاع قائمة بجميع العملات', description: 'يسمح بالتصفية والترتيب والتقسيم (Pagination) عبر معاملات الاستعلام.' })
  @ApiQuery({ type: FindCurrencyDto, required: false, description: 'معاملات التصفية والبحث' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'تم استرجاع قائمة العملات بنجاح.',
    type: [CurrencyResponseDto],
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'خطأ داخلي في الخادم.' })
  async findAll(@Query() query: FindCurrencyDto): Promise<CurrencyResponseDto[]> {
    try {
      // تطبيق منطق البحث
      return await this.currenciesService.findAll(query);
    } catch (error) {
      // معالجة الأخطاء العامة
      throw new BadRequestException(`فشل في استرجاع قائمة العملات: ${error.message}`);
    }
  }

  /**
   * استرجاع تفاصيل عملة محددة باستخدام معرفها (ID).
   * @param id معرف العملة
   */
  @Get(':id')
  @ApiOperation({ summary: 'استرجاع تفاصيل عملة محددة', description: 'البحث عن عملة باستخدام معرفها الفريد.' })
  @ApiParam({ name: 'id', description: 'المعرف الفريد للعملة', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'تم استرجاع تفاصيل العملة بنجاح.',
    type: CurrencyResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'لم يتم العثور على العملة.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'صيغة المعرف غير صحيحة.' })
  async findOne(@Param('id') id: string): Promise<CurrencyResponseDto> {
    try {
      const currency = await this.currenciesService.findOne(id);
      if (!currency) {
        throw new NotFoundException(`لم يتم العثور على العملة بالمعرف: ${id}`);
      }
      return currency;
    } catch (error) {
      // إعادة رمي الاستثناءات المعروفة أو تحويل الأخطاء غير المتوقعة
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`فشل في استرجاع العملة: ${error.message}`);
    }
  }

  /**
   * إنشاء عملة جديدة.
   * @param createDto بيانات إنشاء العملة
   */
  @Post()
  @ApiOperation({ summary: 'إنشاء عملة جديدة', description: 'إضافة عملة جديدة إلى النظام.' })
  @ApiBody({ type: CreateCurrencyDto, description: 'بيانات العملة الجديدة' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'تم إنشاء العملة بنجاح.',
    type: CurrencyResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'بيانات الإدخال غير صالحة (مثل تكرار رمز العملة).' })
  async create(@Body() createDto: CreateCurrencyDto): Promise<CurrencyResponseDto> {
    try {
      // تطبيق منطق الإنشاء
      return await this.currenciesService.create(createDto);
    } catch (error) {
      // معالجة الأخطاء المتعلقة بالتحقق من صحة البيانات أو تكرارها
      throw new BadRequestException(`فشل في إنشاء العملة: ${error.message}`);
    }
  }

  /**
   * تحديث تفاصيل عملة موجودة.
   * @param id معرف العملة
   * @param updateDto بيانات التحديث
   */
  @Put(':id')
  @ApiOperation({ summary: 'تحديث تفاصيل عملة موجودة', description: 'تعديل اسم العملة أو رمزها أو حالتها الأساسية.' })
  @ApiParam({ name: 'id', description: 'المعرف الفريد للعملة المراد تحديثها', type: 'string' })
  @ApiBody({ type: UpdateCurrencyDto, description: 'البيانات المراد تحديثها' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'تم تحديث العملة بنجاح.',
    type: CurrencyResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'لم يتم العثور على العملة.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'بيانات التحديث غير صالحة.' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateCurrencyDto,
  ): Promise<CurrencyResponseDto> {
    try {
      const updatedCurrency = await this.currenciesService.update(id, updateDto);
      if (!updatedCurrency) {
        throw new NotFoundException(`لم يتم العثور على العملة بالمعرف: ${id}`);
      }
      return updatedCurrency;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`فشل في تحديث العملة: ${error.message}`);
    }
  }

  /**
   * حذف عملة من النظام.
   * @param id معرف العملة
   */
  @Delete(':id')
  @ApiOperation({ summary: 'حذف عملة', description: 'حذف عملة بشكل دائم من النظام.' })
  @ApiParam({ name: 'id', description: 'المعرف الفريد للعملة المراد حذفها', type: 'string' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'تم حذف العملة بنجاح.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'لم يتم العثور على العملة.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'لا يمكن حذف العملة الأساسية أو عملة مرتبطة بسجلات.' })
  async remove(@Param('id') id: string): Promise<void> {
    try {
      await this.currenciesService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      // افتراض أن الخدمة ترمي BadRequestException إذا كانت العملة مرتبطة بسجلات
      throw new BadRequestException(`فشل في حذف العملة: ${error.message}`);
    }
  }

  /**
   * تحديث سعر الصرف لعملة محددة.
   * @param id معرف العملة
   * @param updateRateDto بيانات سعر الصرف الجديد
   */
  @Put(':id/exchange-rate')
  @ApiOperation({ summary: 'تحديث سعر الصرف لعملة محددة', description: 'تحديث سعر الصرف مقابل العملة الأساسية.' })
  @ApiParam({ name: 'id', description: 'المعرف الفريد للعملة المراد تحديث سعر صرفها', type: 'string' })
  @ApiBody({ type: UpdateExchangeRateDto, description: 'سعر الصرف الجديد (يجب أن يكون أكبر من صفر)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'تم تحديث سعر الصرف بنجاح.',
    type: CurrencyResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'لم يتم العثور على العملة.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'سعر الصرف غير صالح.' })
  async updateExchangeRate(
    @Param('id') id: string,
    @Body() updateRateDto: UpdateExchangeRateDto,
  ): Promise<CurrencyResponseDto> {
    try {
      // يجب أن يتم التحقق من صحة سعر الصرف في الـ DTO والـ Service
      const updatedCurrency = await this.currenciesService.updateExchangeRate(id, updateRateDto);
      return updatedCurrency;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`فشل في تحديث سعر الصرف: ${error.message}`);
    }
  }

  /**
   * استرجاع معلومات العملة الأساسية للنظام.
   */
  @Get('base')
  @ApiOperation({ summary: 'استرجاع معلومات العملة الأساسية', description: 'الحصول على رمز واسم العملة الأساسية المستخدمة في النظام.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'تم استرجاع العملة الأساسية بنجاح.',
    type: BaseCurrencyResponseDto,
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'خطأ في إعدادات النظام (لم يتم تحديد عملة أساسية).' })
  async getBaseCurrency(): Promise<BaseCurrencyResponseDto> {
    try {
      return await this.currenciesService.getBaseCurrency();
    } catch (error) {
      throw new BadRequestException(`فشل في استرجاع العملة الأساسية: ${error.message}`);
    }
  }
}
