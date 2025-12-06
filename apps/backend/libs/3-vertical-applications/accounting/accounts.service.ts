import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../../../../prisma/prisma.service'; // افتراض مسار خدمة Prisma
import {
  CreateAccountDto,
  UpdateAccountDto,
  FindAccountsDto,
} from '@semop/contracts';
import { Prisma } from '@prisma/client';

// افتراض أن نموذج Prisma للحساب هو 'Account'
// يجب تعديل مسار PrismaService ليتناسب مع بنية المشروع الفعلية

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  /**
   * إنشاء حساب جديد.
   * يتم التحقق من عدم وجود حساب بنفس الكود، ويتم ربطه بالحساب الأب إذا تم تحديده.
   * @param createAccountDto بيانات إنشاء الحساب
   * @returns الحساب الذي تم إنشاؤه
   */
  async create(createAccountDto: CreateAccountDto) {
    const { parentId, ...data } = createAccountDto;

    // 1. التحقق من وجود حساب بنفس الكود
    const existingAccount = await this.prisma.account.findUnique({
      where: { code: data.code },
    });

    if (existingAccount) {
      throw new BadRequestException(`الحساب بالكود ${data.code} موجود بالفعل.`);
    }

    // 2. التحقق من وجود الحساب الأب إذا تم تحديده
    if (parentId) {
      const parentAccount = await this.prisma.account.findUnique({
        where: { id: parentId },
      });

      if (!parentAccount) {
        throw new NotFoundException(`الحساب الأب بالمعرف ${parentId} غير موجود.`);
      }
    }

    try {
      return await this.prisma.account.create({
        data: {
          ...data,
          parent: parentId ? { connect: { id: parentId } } : undefined,
        },
      });
    } catch (error) {
      // معالجة أخطاء قاعدة البيانات الأخرى
      throw new BadRequestException('فشل في إنشاء الحساب بسبب خطأ في البيانات المدخلة.');
    }
  }

  /**
   * استرداد جميع الحسابات مع دعم الفلترة والبحث والتسلسل الهرمي.
   * @param findAccountsDto معايير البحث والفلترة
   * @returns قائمة بالحسابات
   */
  async findAll(findAccountsDto: FindAccountsDto) {
    const { search, type, status, parentId, skip, take } = findAccountsDto;

    const where: Prisma.AccountWhereInput = {};

    // 1. فلترة حسب النوع والحالة
    if (type) {
      where.type = type;
    }
    if (status) {
      where.status = status;
    }

    // 2. دعم التسلسل الهرمي (الحسابات التابعة لحساب أب محدد)
    if (parentId !== undefined) {
      where.parentId = parentId;
    }

    // 3. البحث النصي (على الاسم أو الكود)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' as const } },
        { code: { contains: search, mode: 'insensitive' as const } },
      ];
    }

    const accounts = await this.prisma.account.findMany({
      where,
      skip: skip || 0,
      take: take || 100,
      // تضمين الحسابات الأبناء (للتسلسل الهرمي)
      include: {
        children: true,
        parent: true,
      },
      orderBy: {
        code: 'asc',
      },
    });

    // ملاحظة: يمكن إضافة منطق إضافي هنا لضمان توازن الحسابات (المدين/الدائن) إذا كان هذا الاستعلام يتضمن أرصدة.
    // بما أن هذا CRUD على الحسابات نفسها، فإن منطق التوازن يتم تطبيقه عادةً في خدمة القيود المحاسبية (Journal Entries).

    return accounts;
  }

  /**
   * استرداد حساب واحد بناءً على المعرف.
   * @param id معرف الحساب
   * @returns الحساب المطلوب
   */
  async findOne(id: string) {
    const account = await this.prisma.account.findUnique({
      where: { id },
      include: {
        children: true,
        parent: true,
      },
    });

    if (!account) {
      throw new NotFoundException(`الحساب بالمعرف ${id} غير موجود.`);
    }

    return account;
  }

  /**
   * تحديث بيانات حساب موجود.
   * يتم التحقق من وجود الحساب قبل التحديث.
   * @param id معرف الحساب
   * @param updateAccountDto بيانات التحديث
   * @returns الحساب المحدث
   */
  async update(id: string, updateAccountDto: UpdateAccountDto) {
    // 1. التحقق من وجود الحساب
    await this.findOne(id);

    const { parentId, ...data } = updateAccountDto;

    // 2. التحقق من وجود الحساب الأب إذا تم تحديده
    if (parentId) {
      const parentAccount = await this.prisma.account.findUnique({
        where: { id: parentId },
      });

      if (!parentAccount) {
        throw new NotFoundException(`الحساب الأب بالمعرف ${parentId} غير موجود.`);
      }
      // 3. منع ربط الحساب بنفسه كأب (منع الحلقات)
      if (parentId === id) {
        throw new BadRequestException('لا يمكن ربط الحساب بنفسه كحساب أب.');
      }
    }

    try {
      return await this.prisma.account.update({
        where: { id },
        data: {
          ...data,
          parent: parentId !== undefined ? { connect: { id: parentId } } : undefined,
        },
      });
    } catch (error) {
      // معالجة أخطاء قاعدة البيانات الأخرى
      throw new BadRequestException('فشل في تحديث الحساب بسبب خطأ في البيانات المدخلة.');
    }
  }

  /**
   * حذف حساب موجود.
   * يتم التحقق من عدم وجود حسابات تابعة له قبل الحذف.
   * @param id معرف الحساب
   */
  async remove(id: string) {
    // 1. التحقق من وجود الحساب
    const account = await this.findOne(id);

    // 2. التحقق من عدم وجود حسابات تابعة (أبناء)
    const childrenCount = await this.prisma.account.count({
      where: { parentId: id },
    });

    if (childrenCount > 0) {
      throw new BadRequestException('لا يمكن حذف الحساب لوجود حسابات تابعة له.');
    }

    // 3. يمكن إضافة تحقق هنا من عدم وجود قيود محاسبية مرتبطة بهذا الحساب.

    // 4. تنفيذ عملية الحذف داخل معامل (Transaction) لضمان السلامة
    // بما أن العملية بسيطة (حذف واحد)، يمكن الاستغناء عن المعامل، لكن نستخدمه كمثال على أفضل الممارسات.
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.account.delete({
          where: { id },
        });
      });
    } catch (error) {
      // معالجة أخطاء قاعدة البيانات
      throw new BadRequestException('فشل في حذف الحساب.');
    }
  }
}
