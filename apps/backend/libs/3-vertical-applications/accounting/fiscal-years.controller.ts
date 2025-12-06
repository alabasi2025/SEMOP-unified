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
  UsePipes,
  ValidationPipe,
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
  FiscalYearDto,
  FindFiscalYearsDto,
  CreateFiscalYearDto,
  UpdateFiscalYearDto,
  IdParamDto,
} from '@semop/contracts';

// افتراض وجود خدمة للتعامل مع منطق الأعمال
// في تطبيق حقيقي، سيتم استيرادها من مكانها الصحيح
class FiscalYearsService {
  // دالة وهمية للبحث عن الكل
  async findAll(query: FindFiscalYearsDto): Promise<FiscalYearDto[]> {
    // منطق البحث
    return [];
  }
  // دالة وهمية للبحث عن واحد
  async findOne(id: string): Promise<FiscalYearDto> {
    // منطق البحث
    if (id === '404') {
      throw new NotFoundException(`السنة المالية بالمعرف ${id} غير موجودة.`);
    }
    return { id, name: 'السنة المالية الحالية', startDate: new Date(), endDate: new Date(), isClosed: false } as FiscalYearDto;
  }
  // دالة وهمية لإنشاء سنة مالية
  async create(data: CreateFiscalYearDto): Promise<FiscalYearDto> {
    // منطق الإنشاء
    return { id: '1', ...data } as FiscalYearDto;
  }
  // دالة وهمية لتحديث سنة مالية
  async update(id: string, data: UpdateFiscalYearDto): Promise<FiscalYearDto> {
    // منطق التحديث
    if (id === '404') {
      throw new NotFoundException(`السنة المالية بالمعرف ${id} غير موجودة.`);
    }
    return { id, ...data } as FiscalYearDto;
  }
  // دالة وهمية لحذف سنة مالية
  async remove(id: string): Promise<void> {
    // منطق الحذف
    if (id === '404') {
      throw new NotFoundException(`السنة المالية بالمعرف ${id} غير موجودة.`);
    }
  }
  // دالة وهمية لإغلاق سنة مالية
  async close(id: string): Promise<FiscalYearDto> {
    // منطق الإغلاق
    if (id === '404') {
      throw new NotFoundException(`السنة المالية بالمعرف ${id} غير موجودة.`);
    }
    if (id === 'closed') {
      throw new BadRequestException(`السنة المالية بالمعرف ${id} مغلقة بالفعل.`);
    }
    return { id, name: 'السنة المالية المغلقة', startDate: new Date(), endDate: new Date(), isClosed: true } as FiscalYearDto;
  }
  // دالة وهمية للحصول على السنة المالية الحالية
  async getCurrent(): Promise<FiscalYearDto> {
    // منطق الحصول على السنة الحالية
    return { id: 'current', name: 'السنة المالية الحالية', startDate: new Date(), endDate: new Date(), isClosed: false } as FiscalYearDto;
  }
}

/**
 * وحدة التحكم (Controller) للسنوات المالية
 * تتعامل مع جميع العمليات المتعلقة بإدارة السنوات المالية في نظام المحاسبة.
 */
@Controller('accounting/fiscal-years')
@ApiTags('Accounting')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true })) // تطبيق ValidationPipe على مستوى Controller
export class FiscalYearsController {
  constructor(private readonly fiscalYearsService: FiscalYearsService) {}

  /**
   * استرجاع قائمة بجميع السنوات المالية
   * @param query - معلمات الاستعلام للتصفية والترتيب والتقسيم
   * @returns قائمة بالسنوات المالية
   */
  @Get()
  @ApiOperation({ summary: 'استرجاع قائمة بجميع السنوات المالية' })
  @ApiQuery({ type: FindFiscalYearsDto, required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'تم استرجاع قائمة السنوات المالية بنجاح.',
    type: [FiscalYearDto],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'حدث خطأ غير متوقع أثناء استرجاع السنوات المالية.',
  })
  async findAll(@Query() query: FindFiscalYearsDto): Promise<FiscalYearDto[]> {
    try {
      // يجب أن يتم تطبيق ValidationPipe تلقائيًا على الـ query
      return await this.fiscalYearsService.findAll(query);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('فشل في استرجاع السنوات المالية. يرجى التحقق من معلمات الاستعلام.');
    }
  }

  /**
   * استرجاع السنة المالية الحالية
   * @returns السنة المالية الحالية
   */
  @Get('current')
  @ApiOperation({ summary: 'استرجاع السنة المالية الحالية' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'تم استرجاع السنة المالية الحالية بنجاح.',
    type: FiscalYearDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'لم يتم العثور على سنة مالية حالية.',
  })
  async getCurrent(): Promise<FiscalYearDto> {
    try {
      const currentYear = await this.fiscalYearsService.getCurrent();
      if (!currentYear) {
        throw new NotFoundException('لم يتم تحديد سنة مالية حالية في النظام.');
      }
      return currentYear;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(error);
      throw new BadRequestException('فشل في استرجاع السنة المالية الحالية.');
    }
  }

  /**
   * استرجاع سنة مالية محددة بواسطة المعرف (ID)
   * @param id - معرف السنة المالية
   * @returns السنة المالية المطلوبة
   */
  @Get(':id')
  @ApiOperation({ summary: 'استرجاع سنة مالية محددة بواسطة المعرف' })
  @ApiParam({ name: 'id', description: 'معرف السنة المالية', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'تم استرجاع السنة المالية بنجاح.',
    type: FiscalYearDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'لم يتم العثور على السنة المالية المطلوبة.',
  })
  async findOne(@Param() params: IdParamDto): Promise<FiscalYearDto> {
    try {
      const fiscalYear = await this.fiscalYearsService.findOne(params.id);
      if (!fiscalYear) {
        throw new NotFoundException(`السنة المالية بالمعرف ${params.id} غير موجودة.`);
      }
      return fiscalYear;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(error);
      throw new BadRequestException('فشل في استرجاع السنة المالية. يرجى التحقق من المعرف.');
    }
  }

  /**
   * إنشاء سنة مالية جديدة
   * @param createFiscalYearDto - بيانات إنشاء السنة المالية
   * @returns السنة المالية التي تم إنشاؤها
   */
  @Post()
  @ApiOperation({ summary: 'إنشاء سنة مالية جديدة' })
  @ApiBody({ type: CreateFiscalYearDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'تم إنشاء السنة المالية بنجاح.',
    type: FiscalYearDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'فشل في إنشاء السنة المالية بسبب بيانات غير صالحة.',
  })
  async create(@Body() createFiscalYearDto: CreateFiscalYearDto): Promise<FiscalYearDto> {
    try {
      // يجب أن يتم تطبيق ValidationPipe تلقائيًا على الـ body
      return await this.fiscalYearsService.create(createFiscalYearDto);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('فشل في إنشاء السنة المالية. يرجى التحقق من البيانات المدخلة.');
    }
  }

  /**
   * تحديث بيانات سنة مالية موجودة
   * @param id - معرف السنة المالية المراد تحديثها
   * @param updateFiscalYearDto - البيانات المراد تحديثها
   * @returns السنة المالية المحدثة
   */
  @Put(':id')
  @ApiOperation({ summary: 'تحديث بيانات سنة مالية موجودة' })
  @ApiParam({ name: 'id', description: 'معرف السنة المالية', type: String })
  @ApiBody({ type: UpdateFiscalYearDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'تم تحديث السنة المالية بنجاح.',
    type: FiscalYearDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'لم يتم العثور على السنة المالية المراد تحديثها.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'فشل في تحديث السنة المالية بسبب بيانات غير صالحة.',
  })
  async update(
    @Param() params: IdParamDto,
    @Body() updateFiscalYearDto: UpdateFiscalYearDto,
  ): Promise<FiscalYearDto> {
    try {
      const updatedYear = await this.fiscalYearsService.update(
        params.id,
        updateFiscalYearDto,
      );
      if (!updatedYear) {
        throw new NotFoundException(`السنة المالية بالمعرف ${params.id} غير موجودة لتحديثها.`);
      }
      return updatedYear;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(error);
      throw new BadRequestException('فشل في تحديث السنة المالية. يرجى التحقق من المعرف والبيانات.');
    }
  }

  /**
   * حذف سنة مالية محددة
   * @param id - معرف السنة المالية المراد حذفها
   */
  @Delete(':id')
  @ApiOperation({ summary: 'حذف سنة مالية محددة' })
  @ApiParam({ name: 'id', description: 'معرف السنة المالية', type: String })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'تم حذف السنة المالية بنجاح.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'لم يتم العثور على السنة المالية المراد حذفها.',
  })
  async remove(@Param() params: IdParamDto): Promise<void> {
    try {
      await this.fiscalYearsService.remove(params.id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(error);
      throw new BadRequestException('فشل في حذف السنة المالية. يرجى التحقق من المعرف.');
    }
  }

  /**
   * إغلاق سنة مالية محددة
   * @param id - معرف السنة المالية المراد إغلاقها
   * @returns السنة المالية بعد الإغلاق
   */
  @Post(':id/close')
  @ApiOperation({ summary: 'إغلاق سنة مالية محددة' })
  @ApiParam({ name: 'id', description: 'معرف السنة المالية', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'تم إغلاق السنة المالية بنجاح.',
    type: FiscalYearDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'لم يتم العثور على السنة المالية المراد إغلاقها.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'فشل في إغلاق السنة المالية (قد تكون مغلقة بالفعل أو هناك قيود).',
  })
  async close(@Param() params: IdParamDto): Promise<FiscalYearDto> {
    try {
      const closedYear = await this.fiscalYearsService.close(params.id);
      return closedYear;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      console.error(error);
      throw new BadRequestException('فشل في إغلاق السنة المالية. يرجى التحقق من المعرف وحالة السنة.');
    }
  }
}
