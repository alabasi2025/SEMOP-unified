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
  InternalServerErrorException,
  UsePipes,
  ValidationPipe,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// افتراضات (Mocks) للـ DTOs والـ Service لضمان اكتمال البنية
// في التطبيق الفعلي، يجب استيراد الـ DTOs من '@semop/contracts' والـ Service من مسارها المحلي
// -----------------------------------------------------------------------------

// DTOs Mock - يجب استبدالها بالاستيرادات الفعلية
class CostCenterDto {
  id: number;
  name: string;
  code: string;
  description?: string;
}

class CreateCostCenterDto {
  name: string;
  code: string;
  description?: string;
}

class UpdateCostCenterDto {
  name?: string;
  code?: string;
  description?: string;
}

class FindCostCentersQueryDto {
  limit?: number;
  offset?: number;
  search?: string;
}

// Service Mock - يجب استبدالها بالاستيراد الفعلي
class CostCentersService {
  async findAll(query: FindCostCentersQueryDto): Promise<CostCenterDto[]> {
    // منطق البحث الفعلي
    return [];
  }
  async findOne(id: number): Promise<CostCenterDto | null> {
    // منطق البحث الفعلي
    if (id === 999) return null; // مثال لعدم العثور
    return { id, name: 'مركز تكلفة افتراضي', code: 'CC001' };
  }
  async create(data: CreateCostCenterDto): Promise<CostCenterDto> {
    // منطق الإنشاء الفعلي
    return { id: 1, ...data };
  }
  async update(id: number, data: UpdateCostCenterDto): Promise<CostCenterDto> {
    // منطق التحديث الفعلي
    return { id, name: data.name || 'محدث', code: data.code || 'CC001' };
  }
  async remove(id: number): Promise<void> {
    // منطق الحذف الفعلي
    return;
  }
}

// -----------------------------------------------------------------------------
// Controller الفعلي
// -----------------------------------------------------------------------------

/**
 * @Controller('accounting/cost-centers')
 * يتحكم في جميع العمليات المتعلقة بمراكز التكلفة ضمن نظام المحاسبة.
 * يطبق معايير RESTful API ويوفر توثيق Swagger كامل.
 */
@Controller('accounting/cost-centers')
@ApiTags('Accounting')
// تطبيق ValidationPipe على مستوى Controller لضمان التحقق من صحة جميع المدخلات
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class CostCentersController {
  /**
   * حقن خدمة مراكز التكلفة (CostCentersService) في الـ constructor.
   * @param costCentersService الخدمة المسؤولة عن منطق الأعمال لمراكز التكلفة.
   */
  constructor(private readonly costCentersService: CostCentersService) {}

  /**
   * استرجاع قائمة بجميع مراكز التكلفة.
   * يدعم الاستعلامات لتصفية النتائج والتقسيم (Pagination).
   */
  @Get()
  @ApiOperation({ summary: 'استرجاع قائمة بجميع مراكز التكلفة', description: 'يسمح بتصفية النتائج والتقسيم عبر معاملات الاستعلام.' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'الحد الأقصى لعدد النتائج.' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'عدد النتائج التي يجب تخطيها.' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'نص للبحث في أسماء أو أكواد مراكز التكلفة.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'نجاح العملية. إرجاع قائمة بمراكز التكلفة.', type: [CostCenterDto] })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'خطأ داخلي في الخادم.' })
  async findAll(@Query() query: FindCostCentersQueryDto): Promise<CostCenterDto[]> {
    try {
      // منطق استدعاء الخدمة
      return await this.costCentersService.findAll(query);
    } catch (error) {
      console.error('Error in findAll CostCenters:', error);
      throw new InternalServerErrorException('حدث خطأ غير متوقع أثناء استرجاع مراكز التكلفة.');
    }
  }

  /**
   * استرجاع مركز تكلفة محدد بواسطة المعرف (ID).
   */
  @Get(':id')
  @ApiOperation({ summary: 'استرجاع مركز تكلفة بواسطة المعرف', description: 'يسترجع تفاصيل مركز تكلفة محدد باستخدام ID.' })
  @ApiParam({ name: 'id', required: true, type: Number, description: 'معرف مركز التكلفة.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'نجاح العملية. إرجاع مركز التكلفة.', type: CostCenterDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'لم يتم العثور على مركز التكلفة بالمعرف المحدد.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'المعرف (ID) غير صالح.' })
  async findOne(@Param('id') id: number): Promise<CostCenterDto> {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException('معرف مركز التكلفة غير صالح. يجب أن يكون رقماً صحيحاً وموجباً.');
    }
    try {
      const costCenter = await this.costCentersService.findOne(id);
      if (!costCenter) {
        throw new NotFoundException(`لم يتم العثور على مركز تكلفة بالمعرف: ${id}.`);
      }
      return costCenter;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error in findOne CostCenter:', error);
      throw new InternalServerErrorException('حدث خطأ غير متوقع أثناء استرجاع مركز التكلفة.');
    }
  }

  /**
   * إنشاء مركز تكلفة جديد.
   */
  @Post()
  @ApiOperation({ summary: 'إنشاء مركز تكلفة جديد', description: 'إنشاء سجل جديد لمركز تكلفة.' })
  @ApiBody({ type: CreateCostCenterDto, description: 'بيانات مركز التكلفة المراد إنشاؤه.' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'تم إنشاء مركز التكلفة بنجاح.', type: CostCenterDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'بيانات الإدخال غير صالحة (مثل نقص حقل إلزامي أو تكرار الكود).' })
  async create(@Body() createCostCenterDto: CreateCostCenterDto): Promise<CostCenterDto> {
    try {
      // يمكن إضافة منطق للتحقق من تكرار الكود هنا قبل استدعاء الخدمة
      // مثال: if (await this.costCentersService.isCodeExists(createCostCenterDto.code)) { throw new BadRequestException('كود مركز التكلفة مستخدم بالفعل.'); }
      return await this.costCentersService.create(createCostCenterDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error in create CostCenter:', error);
      throw new InternalServerErrorException('حدث خطأ غير متوقع أثناء إنشاء مركز التكلفة.');
    }
  }

  /**
   * تحديث بيانات مركز تكلفة موجود.
   */
  @Put(':id')
  @ApiOperation({ summary: 'تحديث مركز تكلفة موجود', description: 'تحديث بيانات مركز تكلفة محدد بواسطة ID.' })
  @ApiParam({ name: 'id', required: true, type: Number, description: 'معرف مركز التكلفة.' })
  @ApiBody({ type: UpdateCostCenterDto, description: 'البيانات الجديدة لمركز التكلفة.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'تم تحديث مركز التكلفة بنجاح.', type: CostCenterDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'لم يتم العثور على مركز التكلفة بالمعرف المحدد.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'المعرف (ID) غير صالح أو بيانات التحديث غير صالحة.' })
  async update(@Param('id') id: number, @Body() updateCostCenterDto: UpdateCostCenterDto): Promise<CostCenterDto> {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException('معرف مركز التكلفة غير صالح. يجب أن يكون رقماً صحيحاً وموجباً.');
    }
    try {
      // التحقق من وجود مركز التكلفة قبل التحديث
      const existingCostCenter = await this.costCentersService.findOne(id);
      if (!existingCostCenter) {
        throw new NotFoundException(`لم يتم العثور على مركز تكلفة بالمعرف: ${id} لتحديثه.`);
      }

      return await this.costCentersService.update(id, updateCostCenterDto);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error in update CostCenter:', error);
      throw new InternalServerErrorException('حدث خطأ غير متوقع أثناء تحديث مركز التكلفة.');
    }
  }

  /**
   * حذف مركز تكلفة محدد.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'حذف مركز تكلفة', description: 'حذف مركز تكلفة محدد بواسطة ID.' })
  @ApiParam({ name: 'id', required: true, type: Number, description: 'معرف مركز التكلفة.' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'تم حذف مركز التكلفة بنجاح.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'لم يتم العثور على مركز التكلفة بالمعرف المحدد.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'المعرف (ID) غير صالح.' })
  async remove(@Param('id') id: number): Promise<void> {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException('معرف مركز التكلفة غير صالح. يجب أن يكون رقماً صحيحاً وموجباً.');
    }
    try {
      // التحقق من وجود مركز التكلفة قبل الحذف
      const existingCostCenter = await this.costCentersService.findOne(id);
      if (!existingCostCenter) {
        throw new NotFoundException(`لم يتم العثور على مركز تكلفة بالمعرف: ${id} لحذفه.`);
      }

      await this.costCentersService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error in remove CostCenter:', error);
      throw new InternalServerErrorException('حدث خطأ غير متوقع أثناء حذف مركز التكلفة.');
    }
  }
}
