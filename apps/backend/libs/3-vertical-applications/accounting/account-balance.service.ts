import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@semop/prisma'; // افتراض مسار خدمة Prisma
import {
  CalculateAccountBalanceDto,
  AccountBalanceResponseDto,
  UpdateAccountBalanceDto,
} from '@semop/contracts/accounting'; // افتراض مسار DTOs

/**
 * @description خدمة AccountBalanceService
 * مسؤولة عن إدارة وحساب أرصدة الحسابات (الافتتاحية، الختامية، المدين، الدائن).
 * تعتمد على جدول JournalEntryLine لحساب الحركات وجدول AccountBalance لتخزين الأرصدة.
 */
@Injectable()
export class AccountBalanceService {
  constructor(private prisma: PrismaService) {}

  /**
   * @description حساب الرصيد الختامي لحساب معين حتى تاريخ محدد.
   * يتم جلب الرصيد الافتتاحي من آخر رصيد مخزن، ثم تجميع حركات المدين والدائن من تاريخ الرصيد الافتتاحي حتى تاريخ النهاية.
   * @param dto - يحتوي على accountId وتاريخ النهاية (endDate).
   * @returns AccountBalanceResponseDto - كائن يحتوي على تفاصيل الرصيد.
   */
  async calculateBalance(
    dto: CalculateAccountBalanceDto,
  ): Promise<AccountBalanceResponseDto> {
    const { accountId, endDate } = dto;
    const targetDate = endDate ? new Date(endDate) : new Date();

    // 1. التحقق من وجود الحساب
    const account = await this.prisma.accountHierarchy.findUnique({
      where: { accountId },
    });

    if (!account) {
      throw new NotFoundException(`Account with ID ${accountId} not found.`);
    }

    // 2. جلب آخر رصيد مخزن (الرصيد الافتتاحي للفترة الحالية)
    const lastBalance = await this.prisma.accountBalance.findFirst({
      where: { accountId },
      orderBy: { balanceDate: 'desc' },
    });

    // تحديد تاريخ بداية الفترة الحالية
    const startDate = lastBalance
      ? new Date(lastBalance.balanceDate.getTime() + 24 * 60 * 60 * 1000) // اليوم التالي لآخر رصيد
      : new Date('1900-01-01'); // إذا لم يكن هناك رصيد سابق، ابدأ من البداية

    // 3. تجميع حركات المدين والدائن للفترة
    const movements = await this.prisma.journalEntryLine.aggregate({
      _sum: {
        debit: true,
        credit: true,
      },
      where: {
        accountId,
        createdAt: {
          gte: startDate,
          lte: targetDate,
        },
      },
    });

    const totalDebit = movements._sum.debit || 0;
    const totalCredit = movements._sum.credit || 0;

    // 4. تحديد الرصيد الافتتاحي
    const openingBalanceDebit = lastBalance
      ? lastBalance.closingBalanceDebit
      : 0;
    const openingBalanceCredit = lastBalance
      ? lastBalance.closingBalanceCredit
      : 0;

    // 5. حساب الرصيد الختامي
    // المنطق المحاسبي:
    // الرصيد الختامي المدين = الرصيد الافتتاحي المدين + إجمالي المدين - الرصيد الافتتاحي الدائن - إجمالي الدائن
    // الرصيد الختامي الدائن = الرصيد الافتتاحي الدائن + إجمالي الدائن - الرصيد الافتتاحي المدين - إجمالي المدين
    // بما أن الحساب يجب أن يكون له طبيعة واحدة (مدين أو دائن)، سنحسب صافي الرصيد.

    const netDebit = openingBalanceDebit + totalDebit;
    const netCredit = openingBalanceCredit + totalCredit;

    let closingBalanceDebit = 0;
    let closingBalanceCredit = 0;

    if (netDebit > netCredit) {
      // الرصيد مدين
      closingBalanceDebit = netDebit - netCredit;
    } else if (netCredit > netDebit) {
      // الرصيد دائن
      closingBalanceCredit = netCredit - netDebit;
    }
    // إذا كان netDebit == netCredit، الرصيد صفر (كلاهما 0)

    // 6. إرجاع النتيجة
    return {
      accountId,
      accountName: account.name, // اسم الحساب من AccountHierarchy
      openingBalanceDebit,
      openingBalanceCredit,
      totalDebit,
      totalCredit,
      closingBalanceDebit,
      closingBalanceCredit,
      balanceDate: targetDate,
    };
  }

  /**
   * @description تحديث وتخزين رصيد حساب معين في جدول AccountBalance.
   * هذه الدالة تستخدم في عمليات إغلاق الفترات المحاسبية لـ "تجميد" الأرصدة.
   * يتم استخدام Transaction لضمان سلامة عملية التخزين.
   * @param dto - يحتوي على تفاصيل الرصيد المراد تخزينه.
   * @returns AccountBalanceModel - كائن الرصيد المخزن.
   */
  async updateBalance(dto: UpdateAccountBalanceDto) {
    const {
      accountId,
      openingBalanceDebit,
      openingBalanceCredit,
      totalDebit,
      totalCredit,
      closingBalanceDebit,
      closingBalanceCredit,
      balanceDate,
    } = dto;

    // يجب أن يكون هناك فترة مالية (Fiscal Period) مرتبطة بهذا الرصيد.
    // سنفترض وجود دالة تجلب الفترة المالية النشطة أو بناءً على التاريخ.
    // لغرض هذا المثال، سنفترض أننا نستخدم فترة مالية وهمية.
    const fiscalPeriodId = 'placeholder-fiscal-period-id';

    // التحقق من توازن الرصيد الختامي (للتأكد من صحة البيانات قبل التخزين)
    // في الواقع، هذا التحقق يتم في دالة calculateBalance، ولكن يتم تكراره هنا كإجراء احترازي.
    if (
      Math.abs(closingBalanceDebit - closingBalanceCredit) !==
      Math.abs(
        openingBalanceDebit + totalDebit - (openingBalanceCredit + totalCredit),
      )
    ) {
      throw new BadRequestException(
        'Closing balance calculation is inconsistent with opening balance and movements.',
      );
    }

    // استخدام Transaction لضمان أن عملية التحديث تتم بالكامل أو لا تتم على الإطلاق
    return this.prisma.$transaction(async (tx) => {
      // 1. التحقق من عدم وجود رصيد لنفس الحساب ونفس الفترة المالية
      const existingBalance = await tx.accountBalance.findUnique({
        where: {
          accountId_fiscalPeriodId: {
            accountId,
            fiscalPeriodId,
          },
        },
      });

      if (existingBalance) {
        // يمكن أن تكون عملية تحديث أو منع التخزين المكرر
        throw new BadRequestException(
          `Account balance already exists for account ${accountId} in fiscal period ${fiscalPeriodId}.`,
        );
      }

      // 2. تخزين الرصيد الجديد
      const newBalance = await tx.accountBalance.create({
        data: {
          accountId,
          fiscalPeriodId,
          openingBalanceDebit,
          openingBalanceCredit,
          totalDebit,
          totalCredit,
          closingBalanceDebit,
          closingBalanceCredit,
          balanceDate: balanceDate ? new Date(balanceDate) : new Date(),
        },
      });

      return newBalance;
    });
  }
}