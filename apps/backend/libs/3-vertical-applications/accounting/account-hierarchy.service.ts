import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../../../../prisma/prisma.service'; // مسار افتراضي لخدمة Prisma
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types'; // افتراض أن هذه الحزمة متاحة

// =================================================================================================
// DTOs and Interfaces (Mocked from @semop/contracts and Prisma types)
// يتم تضمينها هنا لغرض الاكتفاء الذاتي للمهمة، ولكن يجب أن تكون في حزمة العقود (@semop/contracts)
// =================================================================================================

/**
 * @interface AccountHierarchy
 * يمثل نموذج التسلسل الهرمي للحسابات في قاعدة البيانات (افتراضي).
 */
interface AccountHierarchy {
  id: number;
  name: string;
  code: string;
  parentId: number | null;
  level: number;
  isGroup: boolean; // يشير إلى ما إذا كان حساب مجموعة (رئيسي) أو حساب نهائي (فرعي)
}

/**
 * @class CreateAccountHierarchyDto
 * نموذج نقل البيانات لإنشاء حساب جديد في التسلسل الهرمي.
 */
class CreateAccountHierarchyDto {
  @IsNotEmpty({ message: 'اسم الحساب مطلوب.' })
  @IsString({ message: 'يجب أن يكون اسم الحساب نصًا.' })
  name: string;

  @IsNotEmpty({ message: 'كود الحساب مطلوب.' })
  @IsString({ message: 'يجب أن يكون كود الحساب نصًا.' })
  code: string;

  @IsOptional()
  @IsInt({ message: 'يجب أن يكون معرف الأب رقمًا صحيحًا.' })
  @Min(1, { message: 'يجب أن يكون معرف الأب أكبر من 0.' })
  parentId?: number;

  @IsBoolean({ message: 'يجب أن تكون قيمة isGroup منطقية.' })
  isGroup: boolean;
}

/**
 * @class UpdateAccountHierarchyDto
 * نموذج نقل البيانات لتحديث حساب موجود.
 */
class UpdateAccountHierarchyDto extends PartialType(CreateAccountHierarchyDto) {
  // لا توجد حقول إضافية مطلوبة في هذا المثال
}

/**
 * @interface AccountHierarchyNode
 * واجهة لتمثيل عقدة في هيكل الشجرة الهرمي.
 */
interface AccountHierarchyNode extends AccountHierarchy {
  children: AccountHierarchyNode[];
}

// =================================================================================================
// AccountHierarchyService
// =================================================================================================

@Injectable()
export class AccountHierarchyService {
  // حقن خدمة PrismaClient باستخدام Dependency Injection
  constructor(private prisma: PrismaService) {}

  /**
   * @method create
   * إنشاء حساب جديد في التسلسل الهرمي.
   * يتم التحقق من وجود الحساب الأب وتحديد مستوى الحساب الجديد.
   * @param data - بيانات إنشاء الحساب.
   * @returns الحساب الذي تم إنشاؤه.
   */
  async create(data: CreateAccountHierarchyDto): Promise<AccountHierarchy> {
    // التحقق من وجود الحساب الأب إذا تم تحديده
    if (data.parentId) {
      const parent = await this.prisma.accountHierarchy.findUnique({
        where: { id: data.parentId },
      });

      if (!parent) {
        throw new NotFoundException(`الحساب الأب بالمعرف ${data.parentId} غير موجود.`);
      }

      // التحقق من أن الحساب الأب هو حساب مجموعة (Group)
      if (!parent.isGroup) {
        throw new BadRequestException('لا يمكن إضافة حساب فرعي إلا تحت حساب مجموعة (Group).');
      }

      // تحديد مستوى الحساب الجديد (مستوى الأب + 1)
      const newLevel = parent.level + 1;

      // استخدام Transaction لضمان سلامة العملية
      return this.prisma.$transaction(async (tx) => {
        // إنشاء الحساب الجديد
        const newAccount = await tx.accountHierarchy.create({
          data: {
            ...data,
            level: newLevel,
          },
        });
        return newAccount as AccountHierarchy;
      });
    }

    // إذا لم يكن هناك أب، فإنه حساب رئيسي (Root) ويكون مستواه 1
    return this.prisma.accountHierarchy.create({
      data: {
        ...data,
        level: 1,
      },
    }) as Promise<AccountHierarchy>;
  }

  /**
   * @method findAll
   * استرداد جميع الحسابات في التسلسل الهرمي.
   * @returns قائمة بجميع الحسابات.
   */
  async findAll(): Promise<AccountHierarchy[]> {
    return this.prisma.accountHierarchy.findMany({
      orderBy: { code: 'asc' }, // ترتيب حسب الكود لسهولة القراءة
    }) as Promise<AccountHierarchy[]>;
  }

  /**
   * @method findOne
   * استرداد حساب واحد بناءً على المعرف.
   * @param id - معرف الحساب.
   * @returns الحساب المطلوب.
   */
  async findOne(id: number): Promise<AccountHierarchy> {
    const account = await this.prisma.accountHierarchy.findUnique({
      where: { id },
    });

    if (!account) {
      throw new NotFoundException(`الحساب بالمعرف ${id} غير موجود.`);
    }

    return account as AccountHierarchy;
  }

  /**
   * @method update
   * تحديث بيانات حساب موجود.
   * @param id - معرف الحساب.
   * @param data - بيانات التحديث.
   * @returns الحساب المحدث.
   */
  async update(id: number, data: UpdateAccountHierarchyDto): Promise<AccountHierarchy> {
    await this.findOne(id); // التحقق من وجود الحساب أولاً

    // منطق إضافي: إذا تم تغيير parentId، يجب إعادة حساب المستوى (Level)
    if (data.parentId !== undefined) {
      // إذا كان parentId هو null، يصبح الحساب رئيسيًا (مستوى 1)
      if (data.parentId === null) {
        data['level'] = 1;
      } else {
        // إذا تم تحديد أب جديد، يجب التحقق منه وحساب المستوى الجديد
        const parent = await this.prisma.accountHierarchy.findUnique({
          where: { id: data.parentId },
        });

        if (!parent) {
          throw new NotFoundException(`الحساب الأب بالمعرف ${data.parentId} غير موجود.`);
        }

        if (!parent.isGroup) {
          throw new BadRequestException('لا يمكن نقل الحساب إلا تحت حساب مجموعة (Group).');
        }

        data['level'] = parent.level + 1;
      }
    }

    return this.prisma.accountHierarchy.update({
      where: { id },
      data,
    }) as Promise<AccountHierarchy>;
  }

  /**
   * @method remove
   * حذف حساب من التسلسل الهرمي.
   * يتم التحقق من عدم وجود حسابات فرعية مرتبطة به قبل الحذف.
   * @param id - معرف الحساب.
   */
  async remove(id: number): Promise<void> {
    await this.findOne(id); // التحقق من وجود الحساب أولاً

    // التحقق من عدم وجود حسابات فرعية مرتبطة بهذا الحساب
    const childrenCount = await this.prisma.accountHierarchy.count({
      where: { parentId: id },
    });

    if (childrenCount > 0) {
      throw new BadRequestException('لا يمكن حذف هذا الحساب لأنه يحتوي على حسابات فرعية مرتبطة به.');
    }

    await this.prisma.accountHierarchy.delete({
      where: { id },
    });
  }

  /**
   * @method getHierarchyTree
   * استرداد التسلسل الهرمي للحسابات في هيكل شجري.
   * @returns هيكل شجري يمثل التسلسل الهرمي.
   */
  async getHierarchyTree(): Promise<AccountHierarchyNode[]> {
    const accounts = await this.findAll();

    // دالة مساعدة لبناء الشجرة الهرمية
    const buildTree = (parentId: number | null = null): AccountHierarchyNode[] => {
      // تصفية الحسابات التي تنتمي إلى الأب الحالي
      const children = accounts
        .filter(account => account.parentId === parentId)
        .map(account => ({
          ...account,
          children: buildTree(account.id), // استدعاء ذاتي لبناء الفروع
        }));

      return children;
    };

    // بدء بناء الشجرة من العقد الجذرية (parentId = null)
    return buildTree(null);
  }
}