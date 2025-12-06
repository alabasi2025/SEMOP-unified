import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@semop/prisma';
import { Prisma } from '@prisma/client';

/**
 * خدمة حساب أرصدة الحسابات
 * تقوم بحساب الأرصدة المدينة والدائنة لكل حساب
 */
@Injectable()
export class AccountBalanceCalculatorService {
  constructor(private prisma: PrismaService) {}

  /**
   * حساب رصيد حساب معين في تاريخ محدد
   */
  async calculateAccountBalance(
    accountId: string,
    asOfDate: Date,
    fiscalYearId?: string,
  ) {
    try {
      // التحقق من وجود الحساب
      const account = await this.prisma.account.findUnique({
        where: { id: accountId },
      });

      if (!account) {
        throw new NotFoundException(`الحساب ${accountId} غير موجود`);
      }

      // جلب جميع القيود حتى التاريخ المحدد
      const journalEntryLines = await this.prisma.journalEntryLine.findMany({
        where: {
          accountId,
          journalEntry: {
            entryDate: {
              lte: asOfDate,
            },
            status: 'POSTED', // فقط القيود المرحلة
            ...(fiscalYearId && { fiscalYearId }),
          },
        },
        include: {
          journalEntry: true,
        },
      });

      // حساب المجاميع
      let debitTotal = 0;
      let creditTotal = 0;

      for (const line of journalEntryLines) {
        debitTotal += Number(line.debitAmount || 0);
        creditTotal += Number(line.creditAmount || 0);
      }

      // حساب الرصيد حسب نوع الحساب
      let balance = 0;
      let balanceType: 'DEBIT' | 'CREDIT' = 'DEBIT';

      if (account.normalBalance === 'DEBIT') {
        balance = debitTotal - creditTotal;
        balanceType = balance >= 0 ? 'DEBIT' : 'CREDIT';
      } else {
        balance = creditTotal - debitTotal;
        balanceType = balance >= 0 ? 'CREDIT' : 'DEBIT';
      }

      return {
        accountId,
        accountCode: account.code,
        accountName: account.name,
        accountType: account.type,
        normalBalance: account.normalBalance,
        asOfDate,
        debitTotal,
        creditTotal,
        balance: Math.abs(balance),
        balanceType,
        fiscalYearId,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`خطأ في حساب الرصيد: ${error.message}`);
    }
  }

  /**
   * حساب أرصدة جميع الحسابات في تاريخ محدد
   */
  async calculateAllAccountBalances(asOfDate: Date, fiscalYearId?: string) {
    try {
      // جلب جميع الحسابات
      const accounts = await this.prisma.account.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          code: 'asc',
        },
      });

      const balances = [];

      for (const account of accounts) {
        const balance = await this.calculateAccountBalance(
          account.id,
          asOfDate,
          fiscalYearId,
        );
        balances.push(balance);
      }

      return balances;
    } catch (error) {
      throw new BadRequestException(
        `خطأ في حساب أرصدة الحسابات: ${error.message}`,
      );
    }
  }

  /**
   * حساب رصيد افتتاحي لحساب معين
   */
  async calculateOpeningBalance(accountId: string, fiscalYearId: string) {
    try {
      // جلب السنة المالية
      const fiscalYear = await this.prisma.fiscalYear.findUnique({
        where: { id: fiscalYearId },
      });

      if (!fiscalYear) {
        throw new NotFoundException(`السنة المالية ${fiscalYearId} غير موجودة`);
      }

      // حساب الرصيد قبل بداية السنة المالية
      const openingDate = new Date(fiscalYear.startDate);
      openingDate.setDate(openingDate.getDate() - 1);

      return await this.calculateAccountBalance(accountId, openingDate);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `خطأ في حساب الرصيد الافتتاحي: ${error.message}`,
      );
    }
  }

  /**
   * حساب رصيد ختامي لحساب معين
   */
  async calculateClosingBalance(accountId: string, fiscalYearId: string) {
    try {
      // جلب السنة المالية
      const fiscalYear = await this.prisma.fiscalYear.findUnique({
        where: { id: fiscalYearId },
      });

      if (!fiscalYear) {
        throw new NotFoundException(`السنة المالية ${fiscalYearId} غير موجودة`);
      }

      // حساب الرصيد في نهاية السنة المالية
      return await this.calculateAccountBalance(
        accountId,
        fiscalYear.endDate,
        fiscalYearId,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `خطأ في حساب الرصيد الختامي: ${error.message}`,
      );
    }
  }

  /**
   * حفظ أرصدة الحسابات في قاعدة البيانات
   */
  async saveAccountBalances(asOfDate: Date, fiscalYearId: string) {
    try {
      const balances = await this.calculateAllAccountBalances(
        asOfDate,
        fiscalYearId,
      );

      const savedBalances = [];

      for (const balance of balances) {
        const saved = await this.prisma.accountBalance.upsert({
          where: {
            accountId_fiscalYearId_asOfDate: {
              accountId: balance.accountId,
              fiscalYearId: fiscalYearId,
              asOfDate: asOfDate,
            },
          },
          create: {
            accountId: balance.accountId,
            fiscalYearId: fiscalYearId,
            asOfDate: asOfDate,
            debitAmount: new Prisma.Decimal(balance.debitTotal),
            creditAmount: new Prisma.Decimal(balance.creditTotal),
            balance: new Prisma.Decimal(balance.balance),
            balanceType: balance.balanceType,
          },
          update: {
            debitAmount: new Prisma.Decimal(balance.debitTotal),
            creditAmount: new Prisma.Decimal(balance.creditTotal),
            balance: new Prisma.Decimal(balance.balance),
            balanceType: balance.balanceType,
          },
        });

        savedBalances.push(saved);
      }

      return {
        message: 'تم حفظ أرصدة الحسابات بنجاح',
        count: savedBalances.length,
        balances: savedBalances,
      };
    } catch (error) {
      throw new BadRequestException(
        `خطأ في حفظ أرصدة الحسابات: ${error.message}`,
      );
    }
  }

  /**
   * حساب رصيد حساب في فترة محاسبية معينة
   */
  async calculateAccountBalanceForPeriod(
    accountId: string,
    periodId: string,
  ) {
    try {
      // جلب الفترة المحاسبية
      const period = await this.prisma.accountingPeriod.findUnique({
        where: { id: periodId },
        include: {
          fiscalYear: true,
        },
      });

      if (!period) {
        throw new NotFoundException(`الفترة المحاسبية ${periodId} غير موجودة`);
      }

      // حساب الرصيد في نهاية الفترة
      return await this.calculateAccountBalance(
        accountId,
        period.endDate,
        period.fiscalYearId,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `خطأ في حساب رصيد الفترة: ${error.message}`,
      );
    }
  }
}
