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
  Injectable,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Response } from 'express';

// *****************************************************************
// DTOs و Service وهمية (في بيئة العمل الحقيقية يتم استيرادها)
// *****************************************************************

// DTO للاستعلام عن التقارير (Query Parameters)
// يجب أن تكون مستوردة من '@semop/contracts'
class FindCostCenterReportsQueryDto {
  /**
   * معرف مركز التكلفة المراد البحث عنه.
   * @example "CC-001"
   */
  @ApiQuery({
    name: 'costCenterId',
    required: false,
    description: 'معرف مركز التكلفة',
  })
  costCenterId?: string;

  /**
   * تاريخ البدء لتصفية التقارير.
   * @example "2024-01-01"
   */
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'تاريخ البدء (YYYY-MM-DD)',
  })
  startDate?: string;

  /**
   * تاريخ الانتهاء لتصفية التقارير.
   * @example "2024-12-31"
   */
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'تاريخ الانتهاء (YYYY-MM-DD)',
  })
  endDate?: string;
}

// DTO لهيكلية تقرير مركز التكلفة (Response Body)
// يجب أن تكون مستوردة من '@semop/contracts'
class CostCenterReportDto {
  /**
   * المعرف الفريد للتقرير.
   * @example "rpt-cc-123"
   */
  id: string;

  /**
   * اسم مركز التكلفة.
   * @example "قسم التسويق"
   */
  name: string;

  /**
   * إجمالي الإيرادات لمركز التكلفة.
   * @example 150000.50
   */
  totalRevenue: number;

  /**
   * إجمالي المصروفات لمركز التكلفة.
   * @example 80000.25
   */
  totalExpense: number;

  /**
   * صافي النتيجة (الربح/الخسارة).
   * @example 69999.25
   */
  netResult: number;
}

// Service وهمية لحقن التبعية
@Injectable()
class CostCenterReportService {
  async findAll(query: FindCostCenterReportsQueryDto): Promise<CostCenterReportDto[]> {
    // منطق استرجاع جميع التقارير بناءً على معايير البحث
    console.log('Searching for reports with query:', query);
    return [
      { id: 'rpt-cc-1', name: 'تقرير الربع الأول', totalRevenue: 100000, totalExpense: 50000, netResult: 50000 },
      { id: 'rpt-cc-2', name: 'تقرير الربع الثاني', totalRevenue: 120000, totalExpense: 60000, netResult: 60000 },
    ];
  }

  async findOne(id: string): Promise<CostCenterReportDto | null> {
    // منطق استرجاع تقرير محدد
    if (id === 'rpt-cc-1') {
      return { id, name: 'تقرير الربع الأول', totalRevenue: 100000, totalExpense: 50000, netResult: 50000 };
    }
    return null; // في حال عدم العثور
  }

  async export(id: string): Promise<Buffer | null> {
    // منطق توليد ملف التقرير (مثلاً PDF أو Excel)
    if (id === 'rpt-cc-1') {
      // بيانات وهمية لملف Excel
      const excelData = 'ID,Name,Revenue,Expense,Net\nrpt-cc-1,Q1 Report,100000,50000,50000';
      return Buffer.from(excelData, 'utf-8');
    }
    return null;
  }
}

// *****************************************************************
// Controller
// *****************************************************************

// الانتقال إلى المرحلة الثانية: كتابة الكود الأساسي للـ Controller

@Controller('accounting/reports/cost-centers')
@ApiTags('Accounting')
@UsePipes(new ValidationPipe({ transform: true })) // تطبيق ValidationPipe على مستوى Controller
export class CostCenterReportController {
  constructor(
    private readonly costCenterReportService: CostCenterReportService,
  ) {}

  /**
   * @description استرجاع قائمة بتقارير مراكز التكلفة بناءً على معايير البحث.
   * @route GET /accounting/reports/cost-centers
   */
  @Get()
  @ApiOperation({ summary: 'استرجاع قائمة بتقارير مراكز التكلفة', description: 'يسمح باسترجاع جميع تقارير مراكز التكلفة مع إمكانية التصفية حسب المعرف أو الفترة الزمنية.' })
  @ApiQuery({ type: FindCostCenterReportsQueryDto, description: 'معايير البحث والتصفية' })
  @ApiResponse({ status: 200, description: 'نجاح العملية، وإرجاع قائمة بالتقارير.', type: [CostCenterReportDto] })
  @ApiResponse({ status: 500, description: 'خطأ داخلي في الخادم.' })
  async findAll(
    @Query() query: FindCostCenterReportsQueryDto,
  ): Promise<CostCenterReportDto[]> {
    try {
      // منطق العمل: استدعاء الخدمة لاسترجاع التقارير
      const reports = await this.costCenterReportService.findAll(query);
      return reports;
    } catch (error) {
      // معالجة الأخطاء
      console.error('Error in findAll:', error);
      throw new InternalServerErrorException(
        'حدث خطأ داخلي أثناء استرجاع تقارير مراكز التكلفة.',
      );
    }
  }

  /**
   * @description استرجاع تقرير مركز تكلفة محدد بواسطة المعرف.
   * @route GET /accounting/reports/cost-centers/:id
   */
  @Get(':id')
  @ApiOperation({ summary: 'استرجاع تقرير مركز تكلفة محدد', description: 'استرجاع تفاصيل تقرير مركز تكلفة باستخدام المعرف الفريد.' })
  @ApiParam({ name: 'id', description: 'المعرف الفريد لتقرير مركز التكلفة', example: 'rpt-cc-1' })
  @ApiResponse({ status: 200, description: 'نجاح العملية، وإرجاع تفاصيل التقرير.', type: CostCenterReportDto })
  @ApiResponse({ status: 404, description: 'لم يتم العثور على التقرير.' })
  @ApiResponse({ status: 500, description: 'خطأ داخلي في الخادم.' })
  async findOne(
    @Param('id') id: string,
  ): Promise<CostCenterReportDto> {
    try {
      // منطق العمل: استدعاء الخدمة لاسترجاع تقرير محدد
      const report = await this.costCenterReportService.findOne(id);

      if (!report) {
        throw new NotFoundException(
          `لم يتم العثور على تقرير مركز التكلفة بالمعرف: ${id}`,
        );
      }

      return report;
    } catch (error) {
      // إعادة رمي الاستثناءات المعروفة
      if (error instanceof NotFoundException) {
        throw error;
      }
      // معالجة الأخطاء الأخرى
      console.error('Error in findOne:', error);
      throw new InternalServerErrorException(
        `حدث خطأ داخلي أثناء استرجاع تقرير مركز التكلفة بالمعرف: ${id}`,
      );
    }
  }

  /**
   * @description تصدير تقرير مركز تكلفة محدد إلى ملف (مثل Excel أو PDF).
   * @route GET /accounting/reports/cost-centers/:id/export
   */
  @Get(':id/export')
  @ApiOperation({ summary: 'تصدير تقرير مركز تكلفة', description: 'تصدير تقرير مركز تكلفة محدد إلى ملف (مثل Excel).' })
  @ApiParam({ name: 'id', description: 'المعرف الفريد لتقرير مركز التكلفة المراد تصديره', example: 'rpt-cc-1' })
  @ApiResponse({ status: 200, description: 'نجاح التصدير، وإرجاع الملف (Excel/PDF).' })
  @ApiResponse({ status: 404, description: 'لم يتم العثور على بيانات التقرير للتصدير.' })
  @ApiResponse({ status: 500, description: 'خطأ داخلي أثناء عملية التصدير.' })
  async exportReport(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      // منطق العمل: استدعاء الخدمة لتوليد ملف التقرير
      const fileBuffer = await this.costCenterReportService.export(id);

      if (!fileBuffer) {
        throw new NotFoundException(
          `لم يتم العثور على بيانات لتصدير تقرير مركز التكلفة بالمعرف: ${id}`,
        );
      }

      // إعداد رؤوس الاستجابة لتنزيل الملف
      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // مثال لملف Excel
        'Content-Disposition': `attachment; filename="cost_center_report_${id}.xlsx"`,
        'Content-Length': fileBuffer.length,
      });

      res.send(fileBuffer);
    } catch (error) {
      // إعادة رمي الاستثناءات المعروفة
      if (error instanceof NotFoundException) {
        throw error;
      }
      // معالجة الأخطاء الأخرى
      console.error('Error in exportReport:', error);
      throw new InternalServerErrorException(
        `حدث خطأ داخلي أثناء تصدير تقرير مركز التكلفة بالمعرف: ${id}`,
      );
    }
  }
}
