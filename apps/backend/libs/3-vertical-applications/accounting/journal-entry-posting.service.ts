import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@semop/prisma'; // افتراض وجود خدمة Prisma في هذا المسار
import { PostJournalEntryDto } from '@semop/contracts'; // افتراض وجود DTO في هذا المسار

// ملاحظة: يتم افتراض أن الأنواع (JournalEntry, JournalEntryLine, Account) يتم استيرادها أو توليدها تلقائيًا
// من Prisma Client و @semop/contracts، وأنها متاحة ضمن سياق المعاملة (tx).
// لغرض هذا الملف، سنستخدم 'any' للأنواع التي لا يمكن استيرادها فعليًا في هذا السياق، مع العلم أنه يجب استخدام الأنواع الدقيقة في التطبيق الفعلي.
type JournalEntryType = any;
type AccountType = any;

@Injectable()
export class JournalEntryPostingService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * ترحيل قيد يومي وتحديث أرصدة الحسابات المتأثرة.
   * @param dto - بيانات ترحيل القيد.
   * @returns القيد اليومي المُرَحَّل.
   */
  async postEntry(dto: PostJournalEntryDto): Promise<JournalEntryType> {
    // **المنطق الأساسي:** يجب أن تتم عملية الترحيل بالكامل ضمن معاملة (Transaction)
    // لضمان إما نجاح جميع العمليات (تحديث القيد وتحديث الأرصدة) أو فشلها جميعًا.
    return this.prisma.$transaction(async (tx) => {
      // 1. جلب القيد اليومي المراد ترحيله
      const entry = await tx.journalEntry.findUnique({
        where: { id: dto.journalEntryId },
        include: { lines: true },
      });

      // **التحقق من وجود القيد**
      if (!entry) {
        throw new NotFoundException(`القيد اليومي بالرقم ${dto.journalEntryId} غير موجود.`);
      }

      // **التحقق من حالة القيد (هل تم ترحيله مسبقًا؟)**
      if (entry.isPosted) {
        throw new BadRequestException(`القيد اليومي بالرقم ${dto.journalEntryId} مُرَحَّل مسبقًا.`);
      }

      // **التحقق من التوازن المحاسبي (المدين = الدائن)**
      // هذا هو أهم جزء في منطق الأعمال المحاسبي.
      if (entry.totalDebit !== entry.totalCredit) {
        throw new BadRequestException(
          `القيد اليومي غير متوازن. المدين (${entry.totalDebit}) لا يساوي الدائن (${entry.totalCredit}). لا يمكن الترحيل.`,
        );
      }

      // 2. تحديث حالة القيد إلى "مُرَحَّل"
      const updatedEntry = await tx.journalEntry.update({
        where: { id: entry.id },
        data: {
          isPosted: true,
          postingDate: dto.postingDate,
          // يمكن إضافة حقل 'postedBy' هنا إذا كان متوفراً
        },
        include: { lines: true },
      });

      // 3. تحديث أرصدة الحسابات المتأثرة
      // يجب تحديث كل حساب متأثر بسطر من سطور القيد.
      for (const line of updatedEntry.lines) {
        // جلب بيانات الحساب لتحديد طبيعته (مدين/دائن) ورصيده الحالي
        const account = await tx.account.findUnique({
          where: { id: line.accountId },
        });

        if (!account) {
          // إذا لم يتم العثور على الحساب، فهذه مشكلة خطيرة يجب التراجع عنها
          throw new InternalServerErrorException(`خطأ في النظام: الحساب بالرقم ${line.accountId} غير موجود.`);
        }

        // **منطق تحديث الرصيد:**
        // - إذا كان الحساب طبيعته مدين (مثل الأصول والمصروفات):
        //   - الزيادة في الرصيد تكون بالمدين (Debit).
        //   - النقصان في الرصيد يكون بالدائن (Credit).
        // - إذا كان الحساب طبيعته دائن (مثل الخصوم والإيرادات):
        //   - الزيادة في الرصيد تكون بالدائن (Credit).
        //   - النقصان في الرصيد يكون بالمدين (Debit).

        let balanceChange = 0;
        if (account.isDebitAccount) {
          // حساب طبيعته مدين
          balanceChange = line.debit - line.credit;
        } else {
          // حساب طبيعته دائن
          balanceChange = line.credit - line.debit;
        }

        // تحديث الرصيد الحالي للحساب
        await tx.account.update({
          where: { id: account.id },
          data: {
            currentBalance: {
              increment: balanceChange,
            },
          },
        });
      }

      // 4. إرجاع القيد المُرَحَّل
      return updatedEntry;
    });
  }
}