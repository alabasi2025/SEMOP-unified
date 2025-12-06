// cash-flow.service.ts

import { IsDateString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../../../../prisma/prisma.service'; // افتراض مسار خدمة Prisma

// ملاحظة: يتم افتراض أن هذه الـ DTOs موجودة في حزمة @semop/contracts
// ولغرض التنفيذ، سيتم تعريفها هنا بشكل مؤقت.

/**
 * @class CashFlowStatementInputDto
 * @description نموذج نقل البيانات لمدخلات تقرير التدفقات النقدية.
 */
export class CashFlowStatementInputDto {
  @IsNotEmpty({ message: 'تاريخ البدء مطلوب.' })
  @IsDateString({}, { message: 'يجب أن يكون تاريخ البدء بتنسيق تاريخ صحيح.' })
  startDate: string;

  @IsNotEmpty({ message: 'تاريخ الانتهاء مطلوب.' })
  @IsDateString({}, { message: 'يجب أن يكون تاريخ الانتهاء بتنسيق تاريخ صحيح.' })
  endDate: string;
}

/**
 * @class CashFlowSection
 * @description نموذج لتمثيل قسم واحد من أقسام التدفقات النقدية.
 */
export class CashFlowSection {
  @IsNotEmpty()
  title: string;

  @IsNumber()
  total: number;

  @IsOptional()
  details: { description: string; amount: number }[];
}

/**
 * @class CashFlowStatementOutputDto
 * @description نموذج نقل البيانات لمخرجات تقرير التدفقات النقدية.
 */
export class CashFlowStatementOutputDto {
  @IsNotEmpty()
  @IsNumber()
  netIncome: number; // صافي الدخل (نقطة البداية للطريقة غير المباشرة)

  @IsNotEmpty()
  operatingActivities: CashFlowSection; // الأنشطة التشغيلية

  @IsNotEmpty()
  investingActivities: CashFlowSection; // الأنشطة الاستثمارية

  @IsNotEmpty()
  financingActivities: CashFlowSection; // الأنشطة التمويلية

  @IsNotEmpty()
  @IsNumber()
  netChangeInCash: number; // صافي التغير في النقد

  @IsNotEmpty()
  @IsNumber()
  cashAtEndOfPeriod: number; // النقد في نهاية الفترة
}

/**
 * @class CashFlowService
 * @description خدمة NestJS لحساب وإعداد قائمة التدفقات النقدية.
 * تستخدم الطريقة غير المباشرة (Indirect Method) التي تبدأ بصافي الدخل.
 */
@Injectable()
export class CashFlowService {
  // حقن خدمة Prisma للوصول إلى قاعدة البيانات
  constructor(private prisma: PrismaService) {}

  /**
   * @method generateCashFlowStatement
   * @description توليد قائمة التدفقات النقدية للفترة المحددة.
   * @param input CashFlowStatementInputDto - تاريخ البدء والانتهاء.
   * @returns Promise<CashFlowStatementOutputDto> - قائمة التدفقات النقدية.
   */
  async generateCashFlowStatement(
    input: CashFlowStatementInputDto,
  ): Promise<CashFlowStatementOutputDto> {
    const { startDate, endDate } = input;

    // 1. التحقق من صحة المدخلات (يتم عادةً بواسطة Pipe، ولكن يتم التأكيد هنا على أهمية التحقق)
    if (new Date(startDate) >= new Date(endDate)) {
      throw new BadRequestException('يجب أن يكون تاريخ البدء قبل تاريخ الانتهاء.');
    }

    // 2. الحصول على صافي الدخل (Net Income)
    // نفترض وجود دالة أو طريقة لحساب صافي الدخل من حسابات الإيرادات والمصروفات.
    // في بيئة حقيقية، قد يتطلب هذا استدعاء خدمة أخرى أو استعلام معقد.
    const netIncome = await this.calculateNetIncome(startDate, endDate);
    if (netIncome === null) {
      throw new NotFoundException('لم يتم العثور على بيانات مالية للفترة المحددة.');
    }

    // 3. حساب التدفقات النقدية من الأنشطة التشغيلية (Operating Activities)
    // تبدأ بصافي الدخل وتعدل للتغيرات في الأصول والالتزامات المتداولة غير النقدية.
    const operatingActivities = await this.calculateOperatingActivities(
      startDate,
      endDate,
      netIncome,
    );

    // 4. حساب التدفقات النقدية من الأنشطة الاستثمارية (Investing Activities)
    // تتعلق بشراء وبيع الأصول طويلة الأجل (مثل الممتلكات والمعدات).
    const investingActivities = await this.calculateInvestingActivities(
      startDate,
      endDate,
    );

    // 5. حساب التدفقات النقدية من الأنشطة التمويلية (Financing Activities)
    // تتعلق بالتغيرات في حقوق الملكية والالتزامات طويلة الأجل (مثل القروض وتوزيعات الأرباح).
    const financingActivities = await this.calculateFinancingActivities(
      startDate,
      endDate,
    );

    // 6. حساب صافي التغير في النقد
    const netChangeInCash =
      operatingActivities.total +
      investingActivities.total +
      financingActivities.total;

    // 7. حساب النقد في بداية ونهاية الفترة
    const cashAtStartOfPeriod = await this.getCashBalance(startDate);
    const cashAtEndOfPeriod = cashAtStartOfPeriod + netChangeInCash;

    // 8. تجميع وإرجاع التقرير
    return {
      netIncome,
      operatingActivities,
      investingActivities,
      financingActivities,
      netChangeInCash,
      cashAtEndOfPeriod,
    };
  }

  /**
   * @method calculateNetIncome
   * @description (منطق معقد) يحسب صافي الدخل للفترة.
   * يتم ذلك عن طريق تجميع الإيرادات وطرح المصروفات.
   * @param startDate تاريخ البدء.
   * @param endDate تاريخ الانتهاء.
   * @returns Promise<number> صافي الدخل.
   */
  private async calculateNetIncome(
    startDate: string,
    endDate: string,
  ): Promise<number> {
    // مثال على استعلام Prisma (افتراضي):
    // const incomeStatementEntries = await this.prisma.journalEntry.findMany({
    //   where: {
    //     date: {
    //       gte: new Date(startDate),
    //       lt: new Date(endDate),
    //     },
    //     account: {
    //       category: {
    //         in: ['Revenue', 'Expense'],
    //       },
    //     },
    //   },
    //   select: {
    //     amount: true,
    //     account: {
    //       select: {
    //         category: true,
    //       },
    //     },
    //   },
    // });

    // لغرض العرض، سنفترض قيمة ثابتة أو محاكاة لصافي الدخل
    return 150000;
  }

  /**
   * @method getCashBalance
   * @description (منطق معقد) يحصل على رصيد حساب النقد في تاريخ معين.
   * @param date التاريخ.
   * @returns Promise<number> رصيد النقد.
   */
  private async getCashBalance(date: string): Promise<number> {
    // مثال على استعلام Prisma (افتراضي):
    // const cashAccountBalance = await this.prisma.transaction.aggregate({
    //   _sum: { amount: true },
    //   where: {
    //     date: { lt: new Date(date) },
    //     accountId: 'CASH_ACCOUNT_ID',
    //   },
    // });
    // لغرض العرض، سنفترض رصيداً نقدياً في بداية الفترة
    return 50000;
  }

  /**
   * @method calculateOperatingActivities
   * @description (منطق معقد) يحسب التدفقات النقدية من الأنشطة التشغيلية.
   * يتم تعديل صافي الدخل بالتغيرات في الأصول والالتزامات المتداولة غير النقدية.
   * @param startDate تاريخ البدء.
   * @param endDate تاريخ الانتهاء.
   * @param netIncome صافي الدخل.
   * @returns Promise<CashFlowSection> قسم الأنشطة التشغيلية.
   */
  private async calculateOperatingActivities(
    startDate: string,
    endDate: string,
    netIncome: number,
  ): Promise<CashFlowSection> {
    // 1. التعديلات على صافي الدخل (مثل الاستهلاك والإطفاء - نفترض 10000)
    const depreciation = 10000;

    // 2. التغيرات في رأس المال العامل (Working Capital)
    // التغير في الذمم المدينة (زيادة 5000 تعني تدفق نقدي سالب)
    const changeInAccountsReceivable = -5000;
    // التغير في المخزون (نقصان 3000 يعني تدفق نقدي موجب)
    const changeInInventory = 3000;
    // التغير في الذمم الدائنة (زيادة 8000 تعني تدفق نقدي موجب)
    const changeInAccountsPayable = 8000;

    const totalAdjustments =
      depreciation +
      changeInAccountsReceivable +
      changeInInventory +
      changeInAccountsPayable;

    const totalOperatingCashFlow = netIncome + totalAdjustments;

    return {
      title: 'التدفقات النقدية من الأنشطة التشغيلية',
      total: totalOperatingCashFlow,
      details: [
        { description: 'صافي الدخل', amount: netIncome },
        { description: 'تعديلات البنود غير النقدية (الاستهلاك)', amount: depreciation },
        { description: 'التغير في الذمم المدينة (نقصان في النقد)', amount: changeInAccountsReceivable },
        { description: 'التغير في المخزون (زيادة في النقد)', amount: changeInInventory },
        { description: 'التغير في الذمم الدائنة (زيادة في النقد)', amount: changeInAccountsPayable },
      ],
    };
  }

  /**
   * @method calculateInvestingActivities
   * @description (منطق معقد) يحسب التدفقات النقدية من الأنشطة الاستثمارية.
   * @param startDate تاريخ البدء.
   * @param endDate تاريخ الانتهاء.
   * @returns Promise<CashFlowSection> قسم الأنشطة الاستثمارية.
   */
  private async calculateInvestingActivities(
    startDate: string,
    endDate: string,
  ): Promise<CashFlowSection> {
    // مثال: شراء أصول ثابتة (تدفق نقدي سالب)
    const purchaseOfAssets = -50000;
    // مثال: بيع استثمارات (تدفق نقدي موجب)
    const saleOfInvestments = 15000;

    const totalInvestingCashFlow = purchaseOfAssets + saleOfInvestments;

    return {
      title: 'التدفقات النقدية من الأنشطة الاستثمارية',
      total: totalInvestingCashFlow,
      details: [
        { description: 'شراء أصول ثابتة', amount: purchaseOfAssets },
        { description: 'متحصلات من بيع استثمارات', amount: saleOfInvestments },
      ],
    };
  }

  /**
   * @method calculateFinancingActivities
   * @description (منطق معقد) يحسب التدفقات النقدية من الأنشطة التمويلية.
   * @param startDate تاريخ البدء.
   * @param endDate تاريخ الانتهاء.
   * @returns Promise<CashFlowSection> قسم الأنشطة التمويلية.
   */
  private async calculateFinancingActivities(
    startDate: string,
    endDate: string,
  ): Promise<CashFlowSection> {
    // مثال: متحصلات من إصدار أسهم (تدفق نقدي موجب)
    const issuanceOfStock = 20000;
    // مثال: سداد قروض (تدفق نقدي سالب)
    const loanRepayment = -10000;
    // مثال: توزيعات أرباح مدفوعة (تدفق نقدي سالب)
    const dividendsPaid = -5000;

    const totalFinancingCashFlow =
      issuanceOfStock + loanRepayment + dividendsPaid;

    return {
      title: 'التدفقات النقدية من الأنشطة التمويلية',
      total: totalFinancingCashFlow,
      details: [
        { description: 'متحصلات من إصدار أسهم', amount: issuanceOfStock },
        { description: 'سداد قروض', amount: loanRepayment },
        { description: 'توزيعات أرباح مدفوعة', amount: dividendsPaid },
      ],
    };
  }
}