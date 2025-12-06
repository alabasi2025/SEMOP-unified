import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient, JournalEntryLine, JournalEntry } from '@prisma/client';
import { IsUUID, IsDateString, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// افتراض: هذه الـ DTOs يتم استيرادها من مكتبة @semop/contracts
// لغرض التطوير، سيتم تعريفها محلياً.

/**
 * @class GetGeneralLedgerDto
 * @description DTO لمدخلات طلب دفتر الأستاذ العام
 */
export class GetGeneralLedgerDto {
  @IsUUID('4', { message: 'يجب أن يكون AccountId معرفاً فريداً (UUID)' })
  @IsNotEmpty({ message: 'يجب تحديد رقم الحساب' })
  accountId: string;

  @IsDateString({}, { message: 'يجب أن يكون تاريخ البدء بتنسيق تاريخ صحيح' })
  @IsNotEmpty({ message: 'يجب تحديد تاريخ البدء' })
  startDate: string;

  @IsDateString({}, { message: 'يجب أن يكون تاريخ الانتهاء بتنسيق تاريخ صحيح' })
  @IsNotEmpty({ message: 'يجب تحديد تاريخ الانتهاء' })
  endDate: string;
}

/**
 * @interface GeneralLedgerEntry
 * @description هيكل بيانات سطر دفتر الأستاذ العام الناتج
 */
export interface GeneralLedgerEntry {
  id: string;
  entryDate: Date;
  entryNumber: string;
  description: string;
  debit: number;
  credit: number;
  runningBalance: number; // الرصيد الجاري
}

/**
 * @class GeneralLedgerService
 * @description خدمة دفتر الأستاذ العام (General Ledger)
 * توفر وظيفة استعراض حركات حساب معين في فترة محددة مع حساب الرصيد الجاري.
 */
@Injectable()
export class GeneralLedgerService {
  constructor(private prisma: PrismaClient) {}

  /**
   * @method getGeneralLedger
   * @description استعراض حركات حساب معين في فترة محددة مع حساب الرصيد الجاري.
   * @param dto - بيانات طلب دفتر الأستاذ (AccountId, StartDate, EndDate)
   * @returns قائمة بسطور دفتر الأستاذ مع الرصيد الجاري
   */
  async getGeneralLedger(dto: GetGeneralLedgerDto): Promise<GeneralLedgerEntry[]> {
    const { accountId, startDate, endDate } = dto;

    // 1. التحقق من وجود الحساب
    // نفترض وجود نموذج Account أو AccountHierarchy يمكن استخدامه للتحقق
    // ملاحظة: تم استخدام AccountHierarchy بناءً على تحليل schema.prisma
    const account = await this.prisma.accountHierarchy.findUnique({
      where: { accountId: accountId },
    });

    if (!account) {
      throw new NotFoundException(`الحساب بالمعرف ${accountId} غير موجود.`);
    }

    // 2. التحقق من صحة نطاق التاريخ
    const start = new Date(startDate);
    const end = new Date(endDate);
    // لضمان شمولية اليوم الأخير، نضيف يوماً كاملاً إلى تاريخ الانتهاء
    end.setDate(end.getDate() + 1);

    if (start >= end) {
      throw new BadRequestException('يجب أن يكون تاريخ البدء قبل تاريخ الانتهاء.');
    }

    // 3. حساب الرصيد الافتتاحي (Opening Balance)
    // يجب حساب مجموع الحركات (المدين - الدائن) قبل تاريخ البدء
    // يتم استخدام $queryRawUnsafe لتجنب مشاكل التحويل التلقائي للتواريخ في بعض إصدارات Prisma
    const openingBalanceResult = await this.prisma.$queryRaw<{ balance: number }[]>`
      SELECT
        COALESCE(SUM("line"."debit" - "line"."credit"), 0)::float AS balance
      FROM "JournalEntryLine" AS line
      JOIN "JournalEntry" AS entry ON "line"."journalEntryId" = "entry"."id"
      WHERE
        "line"."accountId" = ${accountId} AND
        "entry"."entryDate" < ${start}
    `;

    const openingBalance = openingBalanceResult[0]?.balance || 0;

    // 4. جلب الحركات وحساب الرصيد الجاري (Running Balance) باستخدام Raw SQL
    // استخدام Raw SQL مع Window Function (SUM() OVER) هو الأداء الأمثل
    // يتم تصفية الحركات بين تاريخ البدء وتاريخ الانتهاء (شامل)
    const ledgerEntries = await this.prisma.$queryRaw<GeneralLedgerEntry[]>`
      WITH FilteredLines AS (
        SELECT
          line.id,
          entry."entryDate",
          entry."entryNumber",
          line.description,
          line.debit,
          line.credit,
          entry."createdAt", -- لإضافة ترتيب ثانوي في حال تساوت التواريخ
          -- حساب الرصيد الجاري التراكمي
          SUM(line.debit - line.credit) OVER (ORDER BY entry."entryDate" ASC, entry."createdAt" ASC, line."createdAt" ASC) AS cumulative_change
        FROM "JournalEntryLine" AS line
        JOIN "JournalEntry" AS entry ON line."journalEntryId" = entry.id
        WHERE
          line."accountId" = ${accountId} AND
          "entry"."entryDate" >= ${start} AND
          "entry"."entryDate" < ${end} -- استخدام < end بعد إضافة يوم لضمان شمولية اليوم الأخير
        ORDER BY entry."entryDate" ASC, entry."createdAt" ASC, line."createdAt" ASC
      )
      SELECT
        id,
        "entryDate",
        "entryNumber",
        description,
        debit,
        credit,
        -- إضافة الرصيد الافتتاحي إلى التغيير التراكمي للحصول على الرصيد الجاري
        (${openingBalance} + cumulative_change)::float AS "runningBalance"
      FROM FilteredLines;
    `;

    // 5. إرجاع النتيجة
    return ledgerEntries;
  }
}