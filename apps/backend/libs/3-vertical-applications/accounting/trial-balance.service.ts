import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@semop/prisma'; // افتراض وجود خدمة Prisma في هذا المسار
import {
  GenerateTrialBalanceDto,
  TrialBalanceResponse,
  TrialBalanceEntry,
} from '@semop/contracts'; // افتراض وجود DTOs في هذا المسار
import { Decimal } from '@prisma/client/runtime/library'; // لاستخدام نوع Decimal من Prisma

/**
 * @brief خدمة ميزان المراجعة (TrialBalanceService)
 *
 * هذه الخدمة مسؤولة عن إنشاء ميزان المراجعة لفترة زمنية محددة
 * والتحقق من توازن الأرصدة (إجمالي المدين = إجمالي الدائن).
 */
@Injectable()
export class TrialBalanceService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * @brief توليد ميزان المراجعة والتحقق من التوازن
   *
   * تقوم هذه الدالة بتجميع حركات دفتر الأستاذ العام (General Ledger)
   * لفترة محددة وحساب الأرصدة النهائية لكل حساب.
   *
   * @param dto بيانات الفترة المطلوبة (تاريخ البداية والنهاية، معرف الشركة)
   * @returns كائن TrialBalanceResponse يحتوي على قائمة الإدخالات وإجمالي المدين والدائن وحالة التوازن.
   */
  async generateTrialBalance(
    dto: GenerateTrialBalanceDto,
  ): Promise<TrialBalanceResponse> {
    // 1. التحقق من صحة المدخلات الأساسية
    if (dto.startDate >= dto.endDate) {
      throw new BadRequestException(
        'تاريخ البداية يجب أن يكون قبل تاريخ النهاية.',
      );
    }

    // 2. استعلام Prisma لتجميع حركات دفتر الأستاذ العام (General Ledger)
    // نفترض أن لدينا نموذج GeneralLedgerEntry في Prisma
    // ونقوم بتجميع الحركات حسب accountId وحساب إجمالي المدين والدائن للفترة.
    const glAggregations = await this.prisma.generalLedgerEntry.groupBy({
      by: ['accountId'],
      where: {
        date: {
          gte: dto.startDate,
          lte: dto.endDate,
        },
        companyId: dto.companyId, // افتراض وجود companyId في النموذج
      },
      _sum: {
        debit: true,
        credit: true,
      },
    });

    if (glAggregations.length === 0) {
      // يمكن اعتبار هذا كحالة طبيعية لعدم وجود حركات في الفترة، أو يمكن رمي خطأ حسب متطلبات العمل
      return {
        entries: [],
        totalDebit: 0,
        totalCredit: 0,
        isBalanced: true,
      };
    }

    // 3. جلب أسماء الحسابات
    const accountIds = glAggregations.map((agg) => agg.accountId);
    const accounts = await this.prisma.account.findMany({
      where: {
        id: { in: accountIds },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const accountMap = new Map(accounts.map((acc) => [acc.id, acc.name]));

    // 4. بناء إدخالات ميزان المراجعة وحساب الأرصدة النهائية
    let totalDebitSum = new Decimal(0);
    let totalCreditSum = new Decimal(0);

    const entries: TrialBalanceEntry[] = glAggregations.map((agg) => {
      const periodDebit = agg._sum.debit || new Decimal(0);
      const periodCredit = agg._sum.credit || new Decimal(0);

      // حساب الرصيد النهائي (المدين - الدائن)
      const balance = periodDebit.minus(periodCredit);

      let endingDebit = new Decimal(0);
      let endingCredit = new Decimal(0);

      if (balance.greaterThan(0)) {
        // الرصيد مدين
        endingDebit = balance;
      } else if (balance.lessThan(0)) {
        // الرصيد دائن (القيمة المطلقة للرصيد السالب)
        endingCredit = balance.abs();
      }

      // تجميع الإجماليات للتحقق من التوازن
      totalDebitSum = totalDebitSum.plus(endingDebit);
      totalCreditSum = totalCreditSum.plus(endingCredit);

      return {
        accountId: agg.accountId,
        accountName: accountMap.get(agg.accountId) || 'حساب غير معروف',
        // نفترض أن الرصيد الافتتاحي (openingBalance) غير مطلوب في هذا التقرير المبسط
        // وإلا لكان يجب إجراء استعلام إضافي لحساب الأرصدة قبل تاريخ البداية.
        periodDebit: periodDebit.toNumber(),
        periodCredit: periodCredit.toNumber(),
        endingDebit: endingDebit.toNumber(),
        endingCredit: endingCredit.toNumber(),
      } as TrialBalanceEntry; // يتم التحويل إلى DTO النهائي
    });

    // 5. التحقق من التوازن (المدين = الدائن)
    // يجب أن يكون إجمالي الأرصدة النهائية المدينة مساوياً لإجمالي الأرصدة النهائية الدائنة.
    const isBalanced = totalDebitSum.equals(totalCreditSum);

    // 6. التحقق من توازن حركات الفترة (للتأكد من سلامة البيانات في GL)
    // هذه خطوة إضافية لضمان أن إجمالي حركات المدين = إجمالي حركات الدائن في GL
    const totalPeriodDebit = glAggregations.reduce(
      (sum, agg) => sum.plus(agg._sum.debit || new Decimal(0)),
      new Decimal(0),
    );
    const totalPeriodCredit = glAggregations.reduce(
      (sum, agg) => sum.plus(agg._sum.credit || new Decimal(0)),
      new Decimal(0),
    );

    if (!totalPeriodDebit.equals(totalPeriodCredit)) {
      // إذا لم تتوازن حركات الفترة، فهناك مشكلة في إدخالات دفتر الأستاذ العام
      console.error(
        `خطأ في توازن حركات دفتر الأستاذ العام: مدين ${totalPeriodDebit.toNumber()}، دائن ${totalPeriodCredit.toNumber()}`,
      );
      // يمكن رمي خطأ أو إرسال تحذير، لكننا سنستمر في إظهار النتيجة غير المتوازنة
    }

    // 7. إرجاع النتيجة
    return {
      entries,
      totalDebit: totalDebitSum.toNumber(),
      totalCredit: totalCreditSum.toNumber(),
      isBalanced,
    };
  }
}

// --------------------------------------------------------------------------------
// افتراضات DTOs (يجب أن تكون في @semop/contracts ولكن تم وضعها هنا للاكتمال)
// --------------------------------------------------------------------------------

/**
 * @brief DTO لطلب توليد ميزان المراجعة
 */
export class GenerateTrialBalanceDto {
  // @IsDate() @IsNotEmpty()
  startDate: Date;

  // @IsDate() @IsNotEmpty()
  endDate: Date;

  // @IsUUID() @IsNotEmpty()
  companyId: string;
}

/**
 * @brief إدخال واحد في ميزان المراجعة
 */
export interface TrialBalanceEntry {
  accountId: string;
  accountName: string;
  periodDebit: number; // إجمالي المدين للفترة
  periodCredit: number; // إجمالي الدائن للفترة
  endingDebit: number; // الرصيد النهائي المدين
  endingCredit: number; // الرصيد النهائي الدائن
}

/**
 * @brief استجابة خدمة ميزان المراجعة
 */
export interface TrialBalanceResponse {
  entries: TrialBalanceEntry[];
  totalDebit: number; // إجمالي الأرصدة النهائية المدينة
  totalCredit: number; // إجمالي الأرصدة النهائية الدائنة
  isBalanced: boolean; // حالة التوازن
}