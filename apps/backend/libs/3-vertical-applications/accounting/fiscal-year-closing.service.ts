import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@semop/prisma'; // افتراض وجود خدمة Prisma
import { CloseFiscalYearDto } from '@semop/contracts'; // افتراض وجود DTO
import { IsUUID, IsString, validateOrReject } from 'class-validator'; // افتراض وجود class-validator

// =================================================================================================
// Mocked Types (يجب استبدالها بالأنواع الحقيقية من Prisma و @semop/contracts)
// =================================================================================================

// افتراض لهيكل السنة المالية
interface FiscalYear {
  id: string;
  startDate: Date;
  endDate: Date;
  isClosed: boolean;
}

// افتراض لهيكل الحساب
interface Account {
  id: string;
  name: string;
  type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  // في نظام حقيقي، يتم حساب الرصيد من قيود اليومية، ولكن هنا نفترض وجود دالة لحسابه
  calculateBalance: (fiscalYearId: string) => Promise<number>;
}

// افتراض لهيكل قيد اليومية
interface JournalEntry {
  id: string;
  date: Date;
  description: string;
  fiscalYearId: string;
}

// افتراض لهيكل سطر قيد اليومية
interface JournalEntryLine {
  id: string;
  journalEntryId: string;
  accountId: string;
  debit: number;
  credit: number;
}

// افتراض لهيكل المعاملة (Transaction)
interface Transaction {
  create: (data: any) => any;
}

// =================================================================================================
// DTO (يجب أن يكون مستورداً من @semop/contracts)
// =================================================================================================

// Mock DTO for input validation
class MockCloseFiscalYearDto {
  @IsUUID()
  fiscalYearId: string;

  @IsString()
  closingEntryDescription: string;
}

// =================================================================================================
// الخدمة الرئيسية
// =================================================================================================

@Injectable()
export class FiscalYearClosingService {
  // معرفات الحسابات الافتراضية (يجب جلبها من قاعدة البيانات أو الإعدادات)
  private readonly incomeSummaryAccountName = 'ملخص الدخل';
  private readonly retainedEarningsAccountName = 'الأرباح المحتجزة';

  constructor(private readonly prisma: PrismaService) {}

  /**
   * @brief إقفال السنة المالية وإنشاء قيود الإقفال وترحيل الأرباح/الخسائر.
   * @param dto بيانات إقفال السنة المالية (معرف السنة والوصف).
   * @returns السنة المالية المحدثة.
   */
  async closeFiscalYear(dto: MockCloseFiscalYearDto): Promise<FiscalYear> {
    // 1. التحقق من صحة الإدخال
    await validateOrReject(dto).catch(errors => {
      throw new BadRequestException('بيانات الإدخال غير صالحة: ' + errors.toString());
    });

    // 2. التحقق من وجود السنة المالية وحالتها
    const fiscalYear = await this.prisma.fiscalYear.findUnique({
      where: { id: dto.fiscalYearId },
    });

    if (!fiscalYear) {
      throw new NotFoundException(`السنة المالية بالمعرف ${dto.fiscalYearId} غير موجودة.`);
    }

    if (fiscalYear.isClosed) {
      throw new BadRequestException(`السنة المالية ${fiscalYear.id} مغلقة بالفعل.`);
    }

    // 3. جلب الحسابات الضرورية (ملخص الدخل والأرباح المحتجزة)
    const incomeSummaryAccount = await this.prisma.account.findUnique({
      where: { name: this.incomeSummaryAccountName },
    });
    const retainedEarningsAccount = await this.prisma.account.findUnique({
      where: { name: this.retainedEarningsAccountName },
    });

    if (!incomeSummaryAccount || !retainedEarningsAccount) {
      throw new NotFoundException('حسابات الإقفال الأساسية (ملخص الدخل أو الأرباح المحتجزة) غير موجودة.');
    }

    // 4. تنفيذ جميع عمليات الإقفال ضمن معاملة واحدة لضمان سلامة البيانات
    return this.prisma.$transaction(async (tx) => {
      // 4.1. إقفال حسابات الإيرادات والمصروفات إلى حساب ملخص الدخل
      const { netProfit, closingEntry1 } = await this.closeRevenueAndExpenseAccounts(
        tx,
        dto.fiscalYearId,
        incomeSummaryAccount,
        dto.closingEntryDescription
      );

      // 4.2. إقفال حساب ملخص الدخل إلى حساب الأرباح المحتجزة
      const closingEntry2 = await this.closeIncomeSummaryToRetainedEarnings(
        tx,
        dto.fiscalYearId,
        netProfit,
        incomeSummaryAccount,
        retainedEarningsAccount,
        dto.closingEntryDescription
      );

      // 4.3. تحديث حالة السنة المالية إلى مغلقة
      const updatedFiscalYear = await tx.fiscalYear.update({
        where: { id: dto.fiscalYearId },
        data: { isClosed: true },
      });

      // 5. التحقق من التوازن (للتأكد من أن جميع القيود متوازنة)
      // هذا التحقق يتم ضمنياً في منطق إنشاء القيود، ولكن يمكن إضافة تحقق إجمالي هنا
      // مثال: التحقق من أن مجموع المدين = مجموع الدائن لجميع القيود التي تم إنشاؤها في هذه المعاملة

      return updatedFiscalYear;
    });
  }

  /**
   * @brief إقفال حسابات الإيرادات والمصروفات إلى حساب ملخص الدخل.
   * @param tx معاملة Prisma.
   * @param fiscalYearId معرف السنة المالية.
   * @param incomeSummaryAccount حساب ملخص الدخل.
   * @param description وصف قيد الإقفال.
   * @returns صافي الربح/الخسارة وقيد الإقفال الأول.
   */
  private async closeRevenueAndExpenseAccounts(
    tx: any, // يجب أن يكون نوع المعاملة الصحيح
    fiscalYearId: string,
    incomeSummaryAccount: Account,
    description: string,
  ): Promise<{ netProfit: number, closingEntry1: JournalEntry }> {
    // جلب جميع حسابات الإيرادات والمصروفات
    const operatingAccounts: Account[] = await tx.account.findMany({
      where: { type: { in: ['REVENUE', 'EXPENSE'] } },
    });

    if (operatingAccounts.length === 0) {
        // لا توجد حسابات إيرادات أو مصروفات للإقفال
        return { netProfit: 0, closingEntry1: null };
    }

    // إنشاء قيد اليومية الأول (إقفال الإيرادات والمصروفات)
    const closingEntry1: JournalEntry = await tx.journalEntry.create({
      data: {
        date: new Date(),
        description: `قيد إقفال الإيرادات والمصروفات للسنة المالية: ${description}`,
        fiscalYearId: fiscalYearId,
      },
    });

    let totalRevenue = 0;
    let totalExpense = 0;
    const entryLines: any[] = [];

    // 1. إقفال حسابات الإيرادات (جعلها مدينة)
    for (const account of operatingAccounts.filter(a => a.type === 'REVENUE')) {
      // افتراض أن هذه الدالة تحسب الرصيد الفعلي للسنة
      const balance = await account.calculateBalance(fiscalYearId);
      if (balance > 0) {
        totalRevenue += balance;
        // الإيرادات طبيعتها دائنة، لإقفالها نجعلها مدينة
        entryLines.push({
          journalEntryId: closingEntry1.id,
          accountId: account.id,
          debit: balance,
          credit: 0,
        });
      }
    }

    // 2. إقفال حسابات المصروفات (جعلها دائنة)
    for (const account of operatingAccounts.filter(a => a.type === 'EXPENSE')) {
      // افتراض أن هذه الدالة تحسب الرصيد الفعلي للسنة
      const balance = await account.calculateBalance(fiscalYearId);
      if (balance > 0) {
        totalExpense += balance;
        // المصروفات طبيعتها مدينة، لإقفالها نجعلها دائنة
        entryLines.push({
          journalEntryId: closingEntry1.id,
          accountId: account.id,
          debit: 0,
          credit: balance,
        });
      }
    }

    const netProfit = totalRevenue - totalExpense;

    // 3. ترحيل صافي الربح/الخسارة إلى حساب ملخص الدخل
    if (netProfit !== 0) {
      // إذا كان ربحاً (الإيرادات > المصروفات)، يكون ملخص الدخل دائناً
      if (netProfit > 0) {
        entryLines.push({
          journalEntryId: closingEntry1.id,
          accountId: incomeSummaryAccount.id,
          debit: 0,
          credit: netProfit,
        });
      }
      // إذا كانت خسارة (المصروفات > الإيرادات)، يكون ملخص الدخل مديناً
      else {
        entryLines.push({
          journalEntryId: closingEntry1.id,
          accountId: incomeSummaryAccount.id,
          debit: Math.abs(netProfit),
          credit: 0,
        });
      }
    }

    // التحقق من التوازن: مجموع المدين يجب أن يساوي مجموع الدائن
    const totalDebit = entryLines.reduce((sum, line) => sum + line.debit, 0);
    const totalCredit = entryLines.reduce((sum, line) => sum + line.credit, 0);

    if (totalDebit !== totalCredit) {
      // **تعليق توضيحي:** هذا تحقق حاسم لضمان سلامة البيانات المحاسبية.
      // يجب أن يكون مجموع الأرصدة المدينة (الإيرادات المغلقة + ملخص الدخل في حالة الخسارة)
      // مساوياً لمجموع الأرصدة الدائنة (المصروفات المغلقة + ملخص الدخل في حالة الربح).
      throw new Error(`فشل التحقق من التوازن في قيد الإقفال الأول. المدين: ${totalDebit}, الدائن: ${totalCredit}`);
    }

    // إنشاء سطور قيد اليومية
    await tx.journalEntryLine.createMany({ data: entryLines });

    return { netProfit, closingEntry1 };
  }

  /**
   * @brief إقفال حساب ملخص الدخل إلى حساب الأرباح المحتجزة.
   * @param tx معاملة Prisma.
   * @param fiscalYearId معرف السنة المالية.
   * @param netProfit صافي الربح/الخسارة من الخطوة السابقة.
   * @param incomeSummaryAccount حساب ملخص الدخل.
   * @param retainedEarningsAccount حساب الأرباح المحتجزة.
   * @param description وصف قيد الإقفال.
   * @returns قيد الإقفال الثاني.
   */
  private async closeIncomeSummaryToRetainedEarnings(
    tx: any, // يجب أن يكون نوع المعاملة الصحيح
    fiscalYearId: string,
    netProfit: number,
    incomeSummaryAccount: Account,
    retainedEarningsAccount: Account,
    description: string,
  ): Promise<JournalEntry | null> {
    if (netProfit === 0) {
      return null; // لا يوجد ربح أو خسارة للترحيل
    }

    // إنشاء قيد اليومية الثاني (إقفال ملخص الدخل)
    const closingEntry2: JournalEntry = await tx.journalEntry.create({
      data: {
        date: new Date(),
        description: `قيد إقفال ملخص الدخل وترحيل صافي الربح/الخسارة للسنة المالية: ${description}`,
        fiscalYearId: fiscalYearId,
      },
    });

    const entryLines: any[] = [];

    // **تعليق توضيحي:** يتم عكس رصيد حساب ملخص الدخل لجعله صفراً، وترحيل المبلغ إلى الأرباح المحتجزة.
    // 1. إذا كان ربحاً (netProfit > 0):
    //    - ملخص الدخل كان دائناً في القيد الأول، لإقفاله نجعله مديناً.
    //    - الأرباح المحتجزة طبيعتها دائنة، لزيادتها نزيدها دائنة.
    if (netProfit > 0) {
      entryLines.push(
        {
          journalEntryId: closingEntry2.id,
          accountId: incomeSummaryAccount.id,
          debit: netProfit,
          credit: 0,
        },
        {
          journalEntryId: closingEntry2.id,
          accountId: retainedEarningsAccount.id,
          debit: 0,
          credit: netProfit,
        },
      );
    }
    // 2. إذا كانت خسارة (netProfit < 0):
    //    - ملخص الدخل كان مديناً في القيد الأول، لإقفاله نجعله دائناً.
    //    - الأرباح المحتجزة طبيعتها دائنة، لنقصانها نزيدها مدينة.
    else {
      const lossAmount = Math.abs(netProfit);
      entryLines.push(
        {
          journalEntryId: closingEntry2.id,
          accountId: incomeSummaryAccount.id,
          debit: 0,
          credit: lossAmount,
        },
        {
          journalEntryId: closingEntry2.id,
          accountId: retainedEarningsAccount.id,
          debit: lossAmount,
          credit: 0,
        },
      );
    }

    // التحقق من التوازن
    const totalDebit = entryLines.reduce((sum, line) => sum + line.debit, 0);
    const totalCredit = entryLines.reduce((sum, line) => sum + line.credit, 0);

    if (totalDebit !== totalCredit) {
      throw new Error(`فشل التحقق من التوازن في قيد الإقفال الثاني. المدين: ${totalDebit}, الدائن: ${totalCredit}`);
    }

    // إنشاء سطور قيد اليومية
    await tx.journalEntryLine.createMany({ data: entryLines });

    return closingEntry2;
  }
}