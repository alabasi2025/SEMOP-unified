import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@semop/prisma'; // افتراض وجود خدمة Prisma في هذا المسار
import {
  GetBalanceSheetDto,
  BalanceSheetReport,
  BalanceSheetSection,
  AccountType, // افتراض وجود هذا enum في العقود
} from '@semop/contracts'; // افتراض وجود DTOs في هذا المسار
import { Decimal } from '@prisma/client/runtime/library'; // لاستخدام النوع Decimal من Prisma

/**
 * واجهة تمثل الرصيد المحسوب لحساب معين.
 * نفترض أن الحسابات لها نوع (أصل، خصم، ملكية، إيراد، مصروف)
 */
interface AccountBalance {
  id: number;
  name: string;
  type: AccountType;
  balance: Decimal;
}

@Injectable()
export class BalanceSheetService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * دالة مساعدة (Placeholder) لجلب وحساب أرصدة جميع الحسابات حتى تاريخ معين.
   * في التطبيق الحقيقي، ستتضمن هذه الدالة استعلامات معقدة على جدول القيود اليومية (Journal Entries)
   * لحساب صافي المدين والدائن لكل حساب حتى تاريخ الإغلاق.
   * @param endDate تاريخ إغلاق التقرير
   * @returns قائمة بأرصدة الحسابات
   */
  private async getAccountBalances(endDate: Date): Promise<AccountBalance[]> {
    // #region المنطق المحاسبي المعقد (تعليق عربي)
    /**
     * المنطق المحاسبي:
     * 1. يتم جلب جميع القيود اليومية (Journal Entries) التي تمت حتى تاريخ (endDate).
     * 2. يتم تجميع (Aggregate) صافي الحركة (المدين - الدائن) لكل حساب.
     * 3. يتم إضافة أرصدة البداية (Opening Balances) لكل حساب إلى صافي الحركة.
     * 4. يتم تطبيق قاعدة الرصيد الطبيعي (Normal Balance Rule):
     *    - الأصول والمصروفات: رصيد مدين (Debit) طبيعي.
     *    - الخصوم وحقوق الملكية والإيرادات: رصيد دائن (Credit) طبيعي.
     *    - يتم عكس إشارة الأرصدة ذات الرصيد الطبيعي الدائن عند التجميع لتوحيد العملية الحسابية،
     *      أو يتم التعامل معها بشكل منفصل لضمان أن (الأصول = الخصوم + حقوق الملكية).
     *
     * ملاحظة: لغرض هذا المثال، سنفترض أننا نجلب بيانات مُجمعة مسبقًا أو نستخدم بيانات وهمية
     * لتمثيل النتيجة النهائية للاستعلام المعقد.
     */
    // #endregion

    // بيانات وهمية لتمثيل نتيجة الاستعلام المحسوبة
    const mockBalances: AccountBalance[] = [
      // الأصول (Assets) - رصيد مدين طبيعي
      { id: 101, name: 'النقدية', type: AccountType.ASSET, balance: new Decimal(50000) },
      { id: 102, name: 'العملاء', type: AccountType.ASSET, balance: new Decimal(25000) },
      { id: 103, name: 'المخزون', type: AccountType.ASSET, balance: new Decimal(40000) },
      // الخصوم (Liabilities) - رصيد دائن طبيعي
      { id: 201, name: 'الموردون', type: AccountType.LIABILITY, balance: new Decimal(30000).neg() }, // يتم تخزينها كقيمة سالبة لتمثيل الرصيد الدائن
      { id: 202, name: 'قروض قصيرة الأجل', type: AccountType.LIABILITY, balance: new Decimal(15000).neg() },
      // حقوق الملكية (Equity) - رصيد دائن طبيعي
      { id: 301, name: 'رأس المال', type: AccountType.EQUITY, balance: new Decimal(60000).neg() },
      { id: 302, name: 'الأرباح المحتجزة', type: AccountType.EQUITY, balance: new Decimal(10000).neg() },
      // الإيرادات والمصروفات (يجب تصفيتها أو تحويلها إلى الأرباح المحتجزة)
      // لغرض الميزانية العمومية، يجب أن تكون الإيرادات والمصروفات قد تم إغلاقها في حساب الأرباح المحتجزة.
    ];

    // في الواقع، يجب استخدام Prisma هنا:
    // const balances = await this.prisma.$queryRaw<AccountBalance[]>`... SQL Query ...`;
    // if (!balances || balances.length === 0) {
    //   throw new NotFoundException('لم يتم العثور على أي أرصدة حسابات حتى التاريخ المحدد.');
    // }

    return mockBalances;
  }

  /**
   * توليد تقرير الميزانية العمومية (Balance Sheet).
   * @param dto بيانات طلب التقرير، تتضمن تاريخ الإغلاق.
   * @returns تقرير الميزانية العمومية المفصل.
   */
  async generateReport(dto: GetBalanceSheetDto): Promise<BalanceSheetReport> {
    const { endDate } = dto;

    if (endDate > new Date()) {
      throw new BadRequestException('تاريخ التقرير لا يمكن أن يكون في المستقبل.');
    }

    try {
      const allBalances = await this.getAccountBalances(endDate);

      // #region تجميع الأرصدة وتطبيق المعادلة المحاسبية (تعليق عربي)
      /**
       * تجميع الأرصدة:
       * يتم تجميع الحسابات إلى الأقسام الرئيسية الثلاثة للميزانية العمومية: الأصول، الخصوم، حقوق الملكية.
       * يتم استخدام القيمة المطلقة (abs) عند التجميع لضمان أن جميع المجاميع موجبة في التقرير،
       * ولكن يجب الانتباه إلى أن الخصوم وحقوق الملكية يتم التعامل معها كأرصدة دائنة (سالبة في تمثيلنا)
       * لغرض التحقق من المعادلة: الأصول = الخصوم + حقوق الملكية.
       */
      // #endregion

      const assets: AccountBalance[] = [];
      const liabilities: AccountBalance[] = [];
      const equity: AccountBalance[] = [];

      let assetsTotal = new Decimal(0);
      let liabilitiesTotal = new Decimal(0);
      let equityTotal = new Decimal(0);

      for (const balance of allBalances) {
        // نستخدم القيمة المطلقة في التقرير، ولكن نستخدم القيمة الأصلية في التحقق من المعادلة
        const reportBalance = balance.balance.abs();

        switch (balance.type) {
          case AccountType.ASSET:
            assets.push({ ...balance, balance: reportBalance });
            assetsTotal = assetsTotal.add(balance.balance);
            break;
          case AccountType.LIABILITY:
            liabilities.push({ ...balance, balance: reportBalance });
            // يجب أن تكون الخصوم سالبة في تمثيلنا، لذا نجمعها مباشرة
            liabilitiesTotal = liabilitiesTotal.add(balance.balance);
            break;
          case AccountType.EQUITY:
            equity.push({ ...balance, balance: reportBalance });
            // يجب أن تكون حقوق الملكية سالبة في تمثيلنا، لذا نجمعها مباشرة
            equityTotal = equityTotal.add(balance.balance);
            break;
          default:
            // تجاهل حسابات الإيرادات والمصروفات لأنها يجب أن تكون مغلقة في الأرباح المحتجزة
            break;
        }
      }

      // #region التحقق من التوازن (تعليق عربي)
      /**
       * التحقق من التوازن:
       * المعادلة المحاسبية الأساسية: الأصول = الخصوم + حقوق الملكية.
       * في تمثيلنا، حيث الأصول موجبة والخصوم وحقوق الملكية سالبة، يجب أن يكون المجموع الكلي صفرًا.
       * Assets + Liabilities + Equity = 0
       * أو: Assets = -(Liabilities + Equity)
       *
       * سنستخدم المعادلة التقليدية: Assets = Liabilities (abs) + Equity (abs)
       * ونقارن بين مجموع الأصول ومجموع الخصوم وحقوق الملكية (بالقيمة المطلقة).
       */
      // #endregion

      const totalLiabilitiesAndEquity = liabilitiesTotal.abs().add(equityTotal.abs());
      const isBalanced = assetsTotal.equals(totalLiabilitiesAndEquity);

      if (!isBalanced) {
        // في بيئة الإنتاج، قد يكون هذا خطأ داخلي أو تحذير، وليس بالضرورة استثناء
        console.warn(`Balance Sheet is not balanced: Assets (${assetsTotal}) != Liabilities + Equity (${totalLiabilitiesAndEquity})`);
        // يمكن إلقاء استثناء في حالة وجود خلل كبير في البيانات
        // throw new InternalServerErrorException('فشل في تحقيق التوازن المحاسبي للميزانية العمومية.');
      }

      // تحويل الأرصدة من Decimal إلى number لسهولة الاستخدام في الواجهة الأمامية (مع الحفاظ على الدقة)
      const toReportSection = (name: string, balances: AccountBalance[]): BalanceSheetSection => ({
        name,
        total: balances.reduce((sum, b) => sum + b.balance.toNumber(), 0),
        accounts: balances.map(b => ({ name: b.name, balance: b.balance.toNumber() })),
      });

      return {
        reportDate: endDate,
        assetsTotal: assetsTotal.toNumber(),
        liabilitiesTotal: liabilitiesTotal.abs().toNumber(),
        equityTotal: equityTotal.abs().toNumber(),
        isBalanced,
        sections: {
          assets: toReportSection('الأصول', assets),
          liabilities: toReportSection('الخصوم', liabilities),
          equity: toReportSection('حقوق الملكية', equity),
        },
      };
    } catch (error) {
      // معالجة الأخطاء العامة
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error generating balance sheet report:', error);
      throw new InternalServerErrorException('حدث خطأ أثناء توليد تقرير الميزانية العمومية.');
    }
  }
}