import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient, CostCenter } from '@prisma/client'; // نفترض وجود نموذج CostCenter في Prisma
import { CreateCostCenterDto, UpdateCostCenterDto, FindCostCentersDto } from './cost-centers.dto'; // استخدام DTOs الوهمية التي تم إنشاؤها
// نفترض أن PrismaService هو مزود خدمة (Provider) لإدارة اتصال Prisma
// في بيئة NestJS حقيقية، سيتم حقن PrismaService هنا
// سنستخدم PrismaClient مباشرة لأغراض المحاكاة والتركيز على منطق الخدمة

// **ملاحظة:** في تطبيق حقيقي، يجب استبدال PrismaClient بـ PrismaService محقون
// لضمان إدارة الاتصال بشكل صحيح في NestJS.

@Injectable()
export class CostCentersService {
  // حقن PrismaClient (أو PrismaService) عبر البناء (Constructor Injection)
  constructor(private prisma: PrismaClient) {}

  /**
   * إنشاء مركز تكلفة جديد.
   * @param createCostCenterDto بيانات مركز التكلفة الجديد.
   * @returns مركز التكلفة الذي تم إنشاؤه.
   */
  async create(createCostCenterDto: CreateCostCenterDto): Promise<CostCenter> {
    // التحقق من عدم وجود مركز تكلفة بنفس الاسم أو الرمز مسبقاً
    const existing = await this.prisma.costCenter.findFirst({
      where: {
        OR: [
          { name: createCostCenterDto.name },
          { code: createCostCenterDto.code },
        ],
      },
    });

    if (existing) {
      throw new BadRequestException('مركز التكلفة موجود بالفعل بنفس الاسم أو الرمز.');
    }

    // يتم استخدام المعاملات (Transactions) هنا لضمان أن عملية الإنشاء تتم بنجاح
    // أو يتم التراجع عنها بالكامل، على الرغم من أن العملية بسيطة هنا.
    // في العمليات المحاسبية الأكثر تعقيداً، هذا ضروري.
    return this.prisma.$transaction(async (tx) => {
      const costCenter = await tx.costCenter.create({
        data: createCostCenterDto,
      });
      return costCenter;
    });
  }

  /**
   * البحث عن مراكز التكلفة وتصفيتها وتقسيمها.
   * @param queryDto معايير البحث والفلترة والتقسيم.
   * @returns قائمة بمراكز التكلفة والعدد الإجمالي.
   */
  async findAll(queryDto: FindCostCentersDto): Promise<{ data: CostCenter[]; total: number }> {
    const { search, isActive, page, pageSize } = queryDto;
    const skip = (page - 1) * pageSize;

    // بناء شرط البحث (Where Clause) ديناميكياً
    const where: any = {};

    if (search) {
      // البحث في الاسم أو الرمز
      where.OR = [
        { name: { contains: search, mode: 'insensitive' as const } },
        { code: { contains: search, mode: 'insensitive' as const } },
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    // جلب البيانات والعدد الإجمالي في معاملة واحدة لضمان الاتساق
    const [data, total] = await this.prisma.$transaction([
      this.prisma.costCenter.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { name: 'asc' },
      }),
      this.prisma.costCenter.count({ where }),
    ]);

    return { data, total };
  }

  /**
   * جلب مركز تكلفة واحد بواسطة المعرف (ID).
   * @param id معرف مركز التكلفة.
   * @returns مركز التكلفة المطلوب.
   * @throws NotFoundException إذا لم يتم العثور على مركز التكلفة.
   */
  async findOne(id: number): Promise<CostCenter> {
    const costCenter = await this.prisma.costCenter.findUnique({
      where: { id },
    });

    if (!costCenter) {
      throw new NotFoundException(`لم يتم العثور على مركز التكلفة بالمعرف ${id}.`);
    }

    return costCenter;
  }

  /**
   * تحديث بيانات مركز تكلفة موجود.
   * @param id معرف مركز التكلفة المراد تحديثه.
   * @param updateCostCenterDto البيانات المراد تحديثها.
   * @returns مركز التكلفة المحدث.
   * @throws NotFoundException إذا لم يتم العثور على مركز التكلفة.
   */
  async update(id: number, updateCostCenterDto: UpdateCostCenterDto): Promise<CostCenter> {
    // التحقق أولاً من وجود مركز التكلفة
    await this.findOne(id);

    // إذا كان هناك اسم أو رمز جديد، تحقق من عدم تكراره مع مراكز تكلفة أخرى
    if (updateCostCenterDto.name || updateCostCenterDto.code) {
      const existing = await this.prisma.costCenter.findFirst({
        where: {
          id: { not: id }, // استبعاد مركز التكلفة الحالي
          OR: [
            { name: updateCostCenterDto.name },
            { code: updateCostCenterDto.code },
          ],
        },
      });

      if (existing) {
        throw new BadRequestException('الاسم أو الرمز الجديد مستخدم بالفعل من قبل مركز تكلفة آخر.');
      }
    }

    // تنفيذ عملية التحديث
    return this.prisma.costCenter.update({
      where: { id },
      data: updateCostCenterDto,
    });
  }

  /**
   * حذف مركز تكلفة بواسطة المعرف (ID).
   * @param id معرف مركز التكلفة المراد حذفه.
   * @throws NotFoundException إذا لم يتم العثور على مركز التكلفة.
   *
   * **ملاحظة محاسبية:** في نظام ERP، نادراً ما يتم الحذف الفعلي للكيانات المحاسبية.
   * بدلاً من ذلك، يتم "إلغاء التفعيل" (Soft Delete) أو وضع علامة على أنه غير نشط.
   * هنا، سنقوم بالحذف الفعلي (Hard Delete) لتبسيط مثال CRUD، ولكن يجب مراعاة ذلك.
   */
  async remove(id: number): Promise<CostCenter> {
    // التحقق أولاً من وجود مركز التكلفة
    await this.findOne(id);

    // التحقق من عدم وجود أي تبعيات (مثل قيود يومية مرتبطة) قبل الحذف
    // هذا المنطق معقد ويتطلب معاملات (Transactions) للتحقق والحذف.
    // نفترض هنا أن قاعدة البيانات ستفرض قيود التكامل المرجعي (Foreign Key Constraints).

    return this.prisma.costCenter.delete({
      where: { id },
    });
  }
}

// **ملاحظة إضافية:** يجب أن يتم تعريف نموذج CostCenter في ملف منفصل
// لضمان أن يكون الكود نظيفاً ومنظماً، ولكن تم تضمينه هنا للتبسيط.
// يجب أيضاً إنشاء ملف `cost-centers.module.ts` لتسجيل الخدمة.
