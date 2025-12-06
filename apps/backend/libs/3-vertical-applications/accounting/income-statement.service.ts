// /home/ubuntu/SEMOP-unified/apps/backend/libs/3-vertical-applications/accounting/income-statement.service.ts

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@semop/prisma'; // افتراض وجود خدمة Prisma في هذا المسار
import { IncomeStatementDto, GetIncomeStatementDto } from '@semop/contracts'; // افتراض وجود DTOs في هذا المسار

// ملاحظة: يتم افتراض وجود نماذج (Models) في Prisma Schema مثل Account و LedgerEntry
// وأنها تحتوي على الحقول اللازمة (مثل type للحساب، و debit/credit للقيد).

// تعريف هيكل البيانات المتوقع لـ DTOs (لأغراض التوضيح، يفترض أنها مستوردة من @semop/contracts)
// يجب استبدال هذه التعريفات بالاستيراد الفعلي في بيئة العمل الحقيقية.
interface GetIncomeStatementDto {
  startDate: Date;
  endDate: Date;
}

interface IncomeStatementDto {
  totalRevenues: number;
  totalExpenses: number;
  netProfitOrLoss: number;
}

@Injectable()
export class IncomeStatementService {
  constructor(private prisma: PrismaService) {}

  /**
   * @brief حساب قائمة الدخل لفترة زمنية محددة.
   * @param dto - يحتوي على تاريخ البداية وتاريخ النهاية للفترة.
   * @returns IncomeStatementDto - ملخص قائمة الدخل (الإيرادات، المصروفات، صافي الربح/الخسارة).
   */
  async getIncomeStatement(dto: GetIncomeStatementDto): Promise<IncomeStatementDto> {
    const { startDate, endDate } = dto;

    // 1. التحقق من صحة التواريخ
    if (startDate >= endDate) {
      throw new BadRequestException('تاريخ البداية يجب أن يكون قبل تاريخ النهاية.');
    }

    // 2. تجميع الإيرادات والمصروفات من دفتر الأستاذ (Ledger)
    // يتم افتراض أن الحسابات المصنفة كـ 'Revenue' و 'Expense' هي المعنية بقائمة الدخل.
    // يتم افتراض أن نموذج LedgerEntry يحتوي على حقل accountId وحقلي debit و credit.
    // يتم افتراض أن نموذج Account يحتوي على حقل type لتصنيف الحساب.

    // المنطق المحاسبي:
    // - الإيرادات (Revenues): طبيعتها دائنة (Credit). الزيادة تكون في الدائن.
    // - المصروفات (Expenses): طبيعتها مدينة (Debit). الزيادة تكون في المدين.
    // يتم حساب صافي الحركة (Credit - Debit) للإيرادات، و (Debit - Credit) للمصروفات.

    try {
      // استخراج جميع قيود دفتر الأستاذ المتعلقة بحسابات الإيرادات والمصروفات خلال الفترة
      const ledgerEntries = await this.prisma.ledgerEntry.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
          account: {
            type: {
              in: ['Revenue', 'Expense'],
            },
          },
        },
        select: {
          debit: true,
          credit: true,
          account: {
            select: {
              type: true,
            },
          },
        },
      });

      if (ledgerEntries.length === 0) {
        // لا تعتبر حالة خطأ بالضرورة، قد تكون الفترة خالية من الحركات
        return {
          totalRevenues: 0,
          totalExpenses: 0,
          netProfitOrLoss: 0,
        };
      }

      let totalRevenues = 0;
      let totalExpenses = 0;

      // 3. تجميع الإيرادات والمصروفات
      ledgerEntries.forEach(entry => {
        const accountType = entry.account.type;
        const netMovement = entry.credit - entry.debit; // الحركة الصافية (دائن - مدين)

        if (accountType === 'Revenue') {
          // الإيرادات: يتم تجميع صافي الحركة (Credit - Debit).
          // بما أن طبيعة الإيرادات دائنة، فإن الرصيد الدائن (Credit) يمثل الإيراد.
          totalRevenues += netMovement;
        } else if (accountType === 'Expense') {
          // المصروفات: يتم تجميع صافي الحركة المعكوسة (Debit - Credit).
          // بما أن طبيعة المصروفات مدينة، فإن الرصيد المدين (Debit) يمثل المصروف.
          // يمكن حسابها كـ (Debit - Credit) أو ببساطة جمع (entry.debit - entry.credit)
          // ولكن لتوحيد المنطق، سنستخدم القيمة المطلقة للحركة الصافية إذا كانت سالبة (لأنها مصروف)
          // أو ببساطة:
          totalExpenses += (entry.debit - entry.credit);
        }
      });

      // يجب التأكد من أن الإيرادات والمصروفات لا تكون سالبة في التقرير (يجب أن تكون قيمة مطلقة)
      // في المحاسبة، يتم عرض الإيرادات والمصروفات كأرقام موجبة، ويتم حساب صافي الربح/الخسارة.
      // إذا كانت totalRevenues سالبة، فهذا يعني أن هناك قيود مدينة على حسابات الإيرادات (وهو أمر غير شائع لكن ممكن).
      // سنفترض أننا نجمع الأرصدة النهائية للحسابات، وليس فقط الحركات.
      // لتجنب التعقيد، سنستخدم طريقة التجميع المباشر:

      const aggregatedData = await this.prisma.ledgerEntry.groupBy({
        by: ['accountId'],
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
          account: {
            type: {
              in: ['Revenue', 'Expense'],
            },
          },
        },
        _sum: {
          debit: true,
          credit: true,
        },
      });

      let finalRevenues = 0;
      let finalExpenses = 0;

      // نحتاج إلى جلب نوع الحساب لكل accountId
      const accountIds = aggregatedData.map(item => item.accountId);
      const accounts = await this.prisma.account.findMany({
        where: { id: { in: accountIds } },
        select: { id: true, type: true },
      });
      const accountMap = new Map(accounts.map(acc => [acc.id, acc.type]));

      // 4. حساب الإيرادات والمصروفات بناءً على طبيعة الحساب
      aggregatedData.forEach(item => {
        const accountType = accountMap.get(item.accountId);
        const sumDebit = item._sum.debit || 0;
        const sumCredit = item._sum.credit || 0;

        if (accountType === 'Revenue') {
          // الإيرادات: يتم حساب الرصيد الدائن (Credit) للحسابات ذات الطبيعة الدائنة.
          // الرصيد = مجموع الدائن - مجموع المدين.
          const balance = sumCredit - sumDebit;
          finalRevenues += balance;
        } else if (accountType === 'Expense') {
          // المصروفات: يتم حساب الرصيد المدين (Debit) للحسابات ذات الطبيعة المدينة.
          // الرصيد = مجموع المدين - مجموع الدائن.
          const balance = sumDebit - sumCredit;
          finalExpenses += balance;
        }
      });

      // 5. حساب صافي الربح أو الخسارة
      // صافي الربح/الخسارة = إجمالي الإيرادات - إجمالي المصروفات
      const netProfitOrLoss = finalRevenues - finalExpenses;

      // 6. إرجاع النتيجة
      return {
        totalRevenues: finalRevenues,
        totalExpenses: finalExpenses,
        netProfitOrLoss: netProfitOrLoss,
      };

    } catch (error) {
      // معالجة الأخطاء العامة المتعلقة بقاعدة البيانات أو Prisma
      console.error('خطأ في حساب قائمة الدخل:', error);
      throw new BadRequestException('حدث خطأ أثناء معالجة البيانات المحاسبية.');
    }
  }
}