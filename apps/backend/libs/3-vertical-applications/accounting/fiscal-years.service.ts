import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client'; // محاكاة لاستيراد Prisma
import { plainToInstance } from 'class-transformer'; // محاكاة لاستخدام class-transformer
import { validateOrReject } from 'class-validator'; // محاكاة لاستخدام class-validator

// =================================================================
// محاكاة DTOs من @semop/contracts
// في بيئة العمل الحقيقية، سيتم استيراد هذه الفئات من الحزمة المشتركة
// =================================================================

// محاكاة لنموذج السنة المالية من Prisma
interface FiscalYear {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isClosed: boolean;
  status: 'OPEN' | 'CLOSED';
}

// محاكاة لنموذج أرصدة الحسابات (يستخدم لترحيل الأرصدة)
interface AccountBalance {
  id: string;
  accountId: string;
  fiscalYearId: string;
  closingDebit: number;
  closingCredit: number;
  openingDebit: number;
  openingCredit: number;
}

// DTO لإنشاء سنة مالية جديدة
class CreateFiscalYearDto {
  name: string;
  startDate: Date;
  endDate: Date;
}

// DTO لتحديث سنة مالية
class UpdateFiscalYearDto {
  name?: string;
  startDate?: Date;
  endDate?: Date;
}

// DTO لإقفال سنة مالية
class CloseFiscalYearDto {
  fiscalYearId: string;
  nextFiscalYearId: string;
}

// DTO للاستجابة (يمكن أن يكون هو نفسه نموذج Prisma)
type FiscalYearResponseDto = FiscalYear;

// =================================================================
// محاكاة PrismaService
// =================================================================
// في بيئة NestJS، يتم توفير PrismaClient كـ PrismaService عبر DI
// هنا نستخدم PrismaClient مباشرة للمحاكاة
class MockPrismaClient {
  fiscalYear = {
    findUnique: async (args: { where: { id?: string, name?: string } }): Promise<FiscalYear | null> => {
      // محاكاة عملية البحث
      return null;
    },
    findMany: async (): Promise<FiscalYear[]> => {
      // محاكاة عملية جلب الكل
      return [];
    },
    create: async (args: { data: CreateFiscalYearDto }): Promise<FiscalYear> => {
      // محاكاة عملية الإنشاء
      return { id: 'mock-id', isClosed: false, status: 'OPEN', ...args.data } as FiscalYear;
    },
    update: async (args: { where: { id: string }, data: UpdateFiscalYearDto }): Promise<FiscalYear> => {
      // محاكاة عملية التحديث
      return { id: args.where.id, isClosed: false, status: 'OPEN', name: 'Updated Year', startDate: new Date(), endDate: new Date() } as FiscalYear;
    },
    delete: async (args: { where: { id: string } }): Promise<FiscalYear> => {
      // محاكاة عملية الحذف
      return { id: args.where.id, isClosed: false, status: 'OPEN', name: 'Deleted Year', startDate: new Date(), endDate: new Date() } as FiscalYear;
    },
  };

  accountBalance = {
    findMany: async (args: { where: { fiscalYearId: string } }): Promise<AccountBalance[]> => {
      // محاكاة جلب أرصدة الإقفال
      return [];
    },
    createMany: async (args: { data: any[] }): Promise<{ count: number }> => {
      // محاكاة ترحيل أرصدة الافتتاح
      return { count: args.data.length };
    },
  };

  $transaction = async <T>(callback: (prisma: any) => Promise<T>): Promise<T> => {
    // محاكاة لـ Prisma Transaction
    // في بيئة حقيقية، يتم تمرير الـ (prisma) الذي يدعم المعاملات
    return callback(this);
  };
}

// =================================================================
// الخدمة المطلوبة: FiscalYearsService
// =================================================================

@Injectable()
export class FiscalYearsService {
  // استخدام Dependency Injection لـ PrismaClient
  // في بيئة NestJS حقيقية، سيتم حقن PrismaService
  constructor(private readonly prisma: MockPrismaClient) {}

  /**
   * @description إنشاء سنة مالية جديدة.
   * @param createDto بيانات السنة المالية الجديدة.
   * @returns السنة المالية التي تم إنشاؤها.
   */
  async create(createDto: CreateFiscalYearDto): Promise<FiscalYearResponseDto> {
    // محاكاة التحقق من البيانات باستخدام class-validator
    try {
      await validateOrReject(plainToInstance(CreateFiscalYearDto, createDto));
    } catch (errors) {
      throw new BadRequestException('بيانات إنشاء السنة المالية غير صالحة.');
    }

    // التحقق من عدم وجود سنة مالية بنفس الاسم أو تداخل في التواريخ
    const existingYear = await this.prisma.fiscalYear.findUnique({ where: { name: createDto.name } });
    if (existingYear) {
      throw new BadRequestException(`السنة المالية بالاسم ${createDto.name} موجودة بالفعل.`);
    }

    // يمكن إضافة منطق للتحقق من عدم تداخل التواريخ مع السنوات المفتوحة الأخرى

    try {
      const newYear = await this.prisma.fiscalYear.create({ data: createDto });
      return newYear as FiscalYearResponseDto;
    } catch (error) {
      throw new InternalServerErrorException('فشل في إنشاء السنة المالية.');
    }
  }

  /**
   * @description جلب جميع السنوات المالية.
   * @returns قائمة بالسنوات المالية.
   */
  async findAll(): Promise<FiscalYearResponseDto[]> {
    return this.prisma.fiscalYear.findMany() as Promise<FiscalYearResponseDto[]>;
  }

  /**
   * @description جلب سنة مالية محددة بواسطة المعرف.
   * @param id معرف السنة المالية.
   * @returns السنة المالية المطلوبة.
   */
  async findOne(id: string): Promise<FiscalYearResponseDto> {
    const year = await this.prisma.fiscalYear.findUnique({ where: { id } });
    if (!year) {
      throw new NotFoundException(`لم يتم العثور على سنة مالية بالمعرف ${id}.`);
    }
    return year as FiscalYearResponseDto;
  }

  /**
   * @description تحديث بيانات سنة مالية.
   * @param id معرف السنة المالية.
   * @param updateDto البيانات المراد تحديثها.
   * @returns السنة المالية المحدثة.
   */
  async update(id: string, updateDto: UpdateFiscalYearDto): Promise<FiscalYearResponseDto> {
    // محاكاة التحقق من البيانات
    try {
      await validateOrReject(plainToInstance(UpdateFiscalYearDto, updateDto));
    } catch (errors) {
      throw new BadRequestException('بيانات تحديث السنة المالية غير صالحة.');
    }

    // التحقق من وجود السنة المالية
    await this.findOne(id);

    // التحقق من أن السنة المالية ليست مغلقة
    // في بيئة حقيقية: يجب جلب السنة المالية والتحقق من حالتها
    // const year = await this.prisma.fiscalYear.findUnique({ where: { id } });
    // if (year.isClosed) { throw new BadRequestException('لا يمكن تعديل سنة مالية مغلقة.'); }

    try {
      const updatedYear = await this.prisma.fiscalYear.update({
        where: { id },
        data: updateDto,
      });
      return updatedYear as FiscalYearResponseDto;
    } catch (error) {
      throw new InternalServerErrorException('فشل في تحديث السنة المالية.');
    }
  }

  /**
   * @description حذف سنة مالية.
   * @param id معرف السنة المالية.
   * @returns السنة المالية المحذوفة.
   */
  async remove(id: string): Promise<FiscalYearResponseDto> {
    // التحقق من وجود السنة المالية
    await this.findOne(id);

    // التحقق من أن السنة المالية ليست مغلقة ولا تحتوي على حركات
    // في بيئة حقيقية: يجب التحقق من عدم وجود حركات محاسبية مرتبطة بهذه السنة

    try {
      const deletedYear = await this.prisma.fiscalYear.delete({ where: { id } });
      return deletedYear as FiscalYearResponseDto;
    } catch (error) {
      throw new InternalServerErrorException('فشل في حذف السنة المالية. قد تكون مرتبطة بحركات محاسبية.');
    }
  }

  // =================================================================
  // منطق العمل (Business Logic) الخاص بإقفال السنة المالية وترحيل الأرصدة
  // =================================================================

  /**
   * @description إقفال سنة مالية محددة وترحيل أرصدة الحسابات إلى السنة التالية.
   * @param closeDto بيانات الإقفال التي تتضمن معرف السنة الحالية ومعرف السنة التالية.
   * @returns السنة المالية التي تم إقفالها.
   */
  async closeFiscalYear(closeDto: CloseFiscalYearDto): Promise<FiscalYearResponseDto> {
    const { fiscalYearId, nextFiscalYearId } = closeDto;

    // 1. التحقق من وجود السنتين الماليتين
    const currentYear = await this.findOne(fiscalYearId);
    const nextYear = await this.findOne(nextFiscalYearId);

    // 2. التحقق من شروط الإقفال
    if (currentYear.isClosed) {
      throw new BadRequestException(`السنة المالية ${currentYear.name} مغلقة بالفعل.`);
    }
    if (nextYear.isClosed) {
      throw new BadRequestException(`السنة المالية التالية ${nextYear.name} مغلقة. لا يمكن الترحيل إليها.`);
    }
    if (nextYear.startDate <= currentYear.endDate) {
      throw new BadRequestException('تاريخ بداية السنة التالية يجب أن يكون بعد تاريخ نهاية السنة الحالية.');
    }

    // 3. التحقق من إتمام جميع القيود والتسويات (منطق محاسبي معقد)
    // يجب التأكد من إقفال حسابات الإيرادات والمصروفات في قيود التسوية النهائية
    // (هذا الجزء يتم محاكاته هنا، لكن في الواقع يتطلب استعلامات معقدة على دفتر الأستاذ)

    // 4. تنفيذ عملية الإقفال والترحيل كمعاملة واحدة (Transaction)
    return this.prisma.$transaction(async (tx) => {
      // أ. جلب أرصدة الإقفال (Closing Balances) للحسابات التي يجب ترحيلها (الأصول والالتزامات وحقوق الملكية)
      // نفترض أن هذه الدالة تجلب الأرصدة النهائية للحسابات التي يجب ترحيلها (عادةً حسابات الميزانية)
      const closingBalances: AccountBalance[] = await tx.accountBalance.findMany({
        where: { fiscalYearId: currentYear.id },
        // يجب إضافة منطق لتصفية الحسابات (فقط حسابات الميزانية)
      });

      if (closingBalances.length === 0) {
        // يمكن أن يكون تحذيرًا بدلاً من خطأ، لكن يجب التأكد من عدم وجود أرصدة مرحلة
        console.warn(`لا توجد أرصدة لترحيلها من السنة ${currentYear.name}.`);
      }

      // ب. إعداد أرصدة الافتتاح (Opening Balances) للسنة التالية
      const openingBalancesData = closingBalances.map(balance => {
        // الأرصدة الختامية للسنة الحالية تصبح أرصدة افتتاحية للسنة التالية
        return {
          accountId: balance.accountId,
          fiscalYearId: nextYear.id,
          // يتم عكس المدين والدائن إذا كان الحساب من نوع معين (مثل الأرباح والخسائر)
          // لكن للحسابات الميزانية (الأصول والالتزامات)، يتم ترحيلها كما هي.
          openingDebit: balance.closingDebit,
          openingCredit: balance.closingCredit,
          // يجب أن تكون أرصدة الإقفال للسنة الجديدة صفرًا في البداية
          closingDebit: 0,
          closingCredit: 0,
        };
      });

      // ج. ترحيل أرصدة الافتتاح إلى السنة التالية
      await tx.accountBalance.createMany({ data: openingBalancesData });

      // د. تحديث حالة السنة المالية الحالية إلى مغلقة
      const closedYear = await tx.fiscalYear.update({
        where: { id: fiscalYearId },
        data: { isClosed: true, status: 'CLOSED' },
      });

      // هـ. (اختياري) إنشاء قيد افتتاحي في السنة الجديدة يعكس الأرصدة المرحّلة
      // هذا يتطلب تفاعلاً مع خدمة القيود (Journal Entries Service)

      return closedYear as FiscalYearResponseDto;
    }).catch(error => {
      // معالجة الأخطاء التي قد تحدث داخل المعاملة
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error; // إعادة رمي الأخطاء المنطقية
      }
      // خطأ في قاعدة البيانات أو خطأ داخلي آخر
      throw new InternalServerErrorException(`فشل في عملية إقفال السنة المالية: ${error.message}`);
    });
  }
}