import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@semop/prisma'; // افتراض أن PrismaService موجودة في هذا المسار
import { GenerateAccountCodeDto } from '@semop/contracts'; // افتراض وجود DTO في هذا المسار
import { Prisma } from '@prisma/client';

/**
 * AccountCodeGeneratorService
 * خدمة مسؤولة عن توليد أرقام الحسابات تلقائيًا بناءً على المستوى والحساب الأب.
 * تتبع هذه الخدمة هيكلية شجرة دليل الحسابات (Chart of Accounts - COA).
 * يتم فصل أجزاء رقم الحساب بنقطة (.).
 */
@Injectable()
export class AccountCodeGeneratorService {
  // طول الجزء الجديد من الكود (مثلاً 2 للمستوى الثاني، 3 للمستويات الفرعية)
  private readonly CODE_SEGMENT_LENGTH = 3;
  // طول الجزء الأول (المستوى الأول) قد يكون مختلفًا
  private readonly ROOT_SEGMENT_LENGTH = 1;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * @description توليد رقم حساب جديد بناءً على الحساب الأب.
   * @param dto - يحتوي على معرف الحساب الأب (parentId)
   * @returns رقم الحساب الجديد (code)
   */
  async generateCode(dto: GenerateAccountCodeDto): Promise<{ code: string }> {
    const { parentId } = dto;

    // 1. تحديد كود الحساب الأب والمستوى التالي
    let parentCode: string = '';
    let nextLevel: number = 1;
    let segmentLength: number = this.ROOT_SEGMENT_LENGTH;

    if (parentId) {
      // البحث عن الحساب الأب
      const parentAccount = await this.prisma.account.findUnique({
        where: { id: parentId },
        select: { code: true, level: true },
      });

      if (!parentAccount) {
        throw new NotFoundException(`الحساب الأب بالمعرف ${parentId} غير موجود.`);
      }

      parentCode = parentAccount.code;
      nextLevel = parentAccount.level + 1;
      // بعد المستوى الأول، نستخدم طول الجزء القياسي
      segmentLength = this.CODE_SEGMENT_LENGTH;
    }

    // 2. البحث عن آخر كود مستخدم تحت الحساب الأب
    // يتم البحث عن الحسابات التي لها نفس parentId
    const lastSibling = await this.prisma.account.findMany({
      where: {
        parentId: parentId || null, // إذا لم يكن هناك parentId، ابحث عن الحسابات الجذرية (null)
      },
      orderBy: {
        code: 'desc', // ترتيب تنازلي للحصول على أكبر كود
      },
      take: 1,
      select: { code: true },
    });

    // 3. استخراج الجزء الأخير من الكود وتوليد الجزء الجديد
    let nextSegmentNumber: number = 1;

    if (lastSibling.length > 0) {
      const lastCode = lastSibling[0].code;
      let lastSegment: string;

      // منطق استخراج الجزء الأخير من الكود
      if (parentCode) {
        // إذا كان هناك حساب أب، فإن الجزء الجديد هو الجزء الذي يلي كود الأب
        // مثال: كود الأب "1101"، آخر كود شقيق "1101.005" -> الجزء الأخير هو "005"
        if (!lastCode.startsWith(parentCode + '.')) {
            // هذا خطأ في البيانات، يجب أن يبدأ كود الشقيق بكود الأب
            throw new BadRequestException('هيكل كود الحساب غير متطابق مع الحساب الأب.');
        }
        lastSegment = lastCode.substring(parentCode.length + 1);
      } else {
        // إذا لم يكن هناك حساب أب، فإن الجزء الجديد هو الكود بأكمله
        // مثال: آخر كود شقيق "5" -> الجزء الأخير هو "5"
        lastSegment = lastCode;
      }

      // التأكد من أن الجزء المستخرج هو رقم صحيح
      const parsedSegment = parseInt(lastSegment, 10);
      if (isNaN(parsedSegment)) {
        throw new BadRequestException(`الجزء الأخير من كود الحساب (${lastSegment}) ليس رقمًا صالحًا.`);
      }

      nextSegmentNumber = parsedSegment + 1;
    }

    // 4. تنسيق الجزء الجديد من الكود
    // يتم استخدام التصفير الأولي (padding) لضمان الطول المحدد
    const newSegment = String(nextSegmentNumber).padStart(segmentLength, '0');

    // 5. تجميع الكود النهائي
    const newCode = parentCode ? `${parentCode}.${newSegment}` : newSegment;

    // 6. التحقق من أن الكود الجديد لا يتجاوز الطول الأقصى (اختياري، ولكن يفضل)
    // يمكن إضافة منطق للتحقق من الطول الأقصى للكود إذا كان محددًا في النظام

    return { code: newCode };
  }

  /**
   * @description دالة مساعدة لتحديد طول الجزء الجديد من الكود بناءً على المستوى.
   * يمكن تعديل هذه الدالة لتطبيق قواعد أكثر تعقيدًا لتوليد الأكواد.
   * @param level - مستوى الحساب الجديد
   * @returns طول الجزء المطلوب
   */
  private getSegmentLength(level: number): number {
    // مثال: المستوى الأول (الجذر) طوله 1، والمستويات الأخرى طولها 3
    return level === 1 ? this.ROOT_SEGMENT_LENGTH : this.CODE_SEGMENT_LENGTH;
  }
}

// ملاحظة: هذا الكود يفترض وجود نموذج Prisma باسم `Account`
// ويجب أن يكون حقل `code` في النموذج فريدًا (unique)
// ويجب أن يكون حقل `level` موجودًا لتحديد مستوى الحساب
// ويفترض وجود `PrismaService` في `@semop/prisma`
// ويفترض وجود `GenerateAccountCodeDto` في `@semop/contracts`
//
// مثال على DTO (افتراضي):
// export class GenerateAccountCodeDto {
//   @IsOptional()
//   @IsUUID()
//   parentId?: string;
// }
//
// مثال على استخدام class-validator (يتم تطبيقه في Controller أو Pipe):
// بما أن الدالة تستقبل DTO، فإن التحقق يتم عادةً قبل وصوله إلى الخدمة.
// لكن لضمان الالتزام بالمتطلبات، تم افتراض أن DTO يتم التحقق منه مسبقًا.
//
// تم استخدام `findMany` مع `orderBy: { code: 'desc' }` و `take: 1`
// للحصول على آخر كود مستخدم، وهذا يعتمد على أن الكود يتم تخزينه كنص
// وأن الترتيب النصي (Lexicographical order) سيعطي أكبر رقم بشكل صحيح
// في حالة التصفير الأولي (padding) مثل "009" قبل "010".
// إذا لم يكن هناك تصفير، يجب استخدام منطق أكثر تعقيدًا للفرز.
// في هذا التصميم، تم استخدام التصفير لضمان الترتيب الصحيح.