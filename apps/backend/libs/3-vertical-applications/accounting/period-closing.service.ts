import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaClient, AccountingPeriod, JournalEntry, JournalItem } from '@prisma/client';
import { PrismaService } from '../../../../../../prisma/prisma.service'; // افتراض مسار خدمة Prisma
import { ClosePeriodDto, PeriodStatus, CheckPeriodStatusDto } from '@semop/contracts'; // افتراض وجود DTOs والحالة في العقود

/**
 * خدمة إقفال الفترات المحاسبية.
 * تتولى مسؤولية التحقق من توازن القيود وإقفال الفترات لمنع التعديل عليها.
 */
@Injectable()
export class PeriodClosingService {
  constructor(private prisma: PrismaService) {}

  /**
   * دالة مساعدة للتحقق من توازن جميع القيود في فترة معينة.
   * @param periodId معرف الفترة المحاسبية.
   * @returns وعد بقيمة منطقية (صحيح إذا كانت جميع القيود متوازنة).
   */
  private async checkPeriodBalance(periodId: number): Promise<boolean> {
    // منطق التحقق من التوازن: يجب أن يكون مجموع المدين يساوي مجموع الدائن لجميع القيود في الفترة.
    // نفترض أن لدينا جدول JournalItem يحتوي على حقول debit و credit و entryId.
    // ونفترض أن JournalEntry مرتبط بـ AccountingPeriod عبر حقل periodId.

    // خطوة 1: جلب جميع بنود القيود للفترة المحددة.
    const journalItems = await this.prisma.journalItem.findMany({
      where: {
        journalEntry: {
          periodId: periodId,
        },
      },
      select: {
        debit: true,
        credit: true,
      },
    });

    // خطوة 2: حساب إجمالي المدين وإجمالي الدائن.
    const totalDebit = journalItems.reduce((sum, item) => sum + item.debit, 0);
    const totalCredit = journalItems.reduce((sum, item) => sum + item.credit, 0);

    // خطوة 3: التحقق من التوازن.
    // التعليق العربي: يجب أن يكون إجمالي المدين مساوياً لإجمالي الدائن لضمان سلامة البيانات المحاسبية قبل الإقفال.
    return totalDebit === totalCredit;
  }

  /**
   * إقفال فترة محاسبية محددة.
   * يتم التحقق من توازن القيود قبل الإقفال.
   * @param dto بيانات إقفال الفترة.
   * @returns وعد بالفترة المحاسبية المحدثة.
   */
  async closePeriod(dto: ClosePeriodDto): Promise<AccountingPeriod> {
    const { periodId } = dto;

    // 1. التحقق من وجود الفترة
    const period = await this.prisma.accountingPeriod.findUnique({
      where: { id: periodId },
    });

    if (!period) {
      throw new NotFoundException(`الفترة المحاسبية بالمعرف ${periodId} غير موجودة.`);
    }

    // 2. التحقق من حالة الفترة
    if (period.status === PeriodStatus.CLOSED) {
      throw new BadRequestException(`الفترة المحاسبية ${periodId} مغلقة بالفعل.`);
    }

    // 3. تطبيق منطق العمل: التحقق من التوازن (المدين = الدائن)
    const isBalanced = await this.checkPeriodBalance(periodId);

    if (!isBalanced) {
      // التعليق العربي: لا يمكن إقفال الفترة لوجود قيود غير متوازنة. يجب تصحيح القيود أولاً.
      throw new BadRequestException(`لا يمكن إقفال الفترة المحاسبية ${periodId}. يوجد عدم توازن في القيود (المدين لا يساوي الدائن).`);
    }

    // 4. إقفال الفترة باستخدام Transaction لضمان سلامة العملية
    // نستخدم $transaction لضمان أن عملية التحديث تتم بنجاح أو يتم التراجع عنها بالكامل.
    return this.prisma.$transaction(async (tx) => {
      const closedPeriod = await tx.accountingPeriod.update({
        where: { id: periodId },
        data: {
          status: PeriodStatus.CLOSED,
          closingDate: new Date(), // تسجيل تاريخ الإقفال
        },
      });

      // يمكن إضافة منطق إضافي هنا مثل إنشاء قيد إقفال الأرباح والخسائر (اختياري)

      return closedPeriod;
    });
  }

  /**
   * التحقق مما إذا كانت فترة معينة مغلقة.
   * تستخدم هذه الدالة من قبل خدمات أخرى (مثل خدمة القيود) لمنع التعديل.
   * @param dto بيانات التحقق من حالة الفترة (تحتوي على تاريخ القيد المراد إدخاله/تعديله).
   * @throws ForbiddenException إذا كانت الفترة مغلقة.
   */
  async checkIfPeriodIsClosed(dto: CheckPeriodStatusDto): Promise<void> {
    const { date } = dto;

    // 1. البحث عن الفترة التي يقع ضمنها التاريخ
    const period = await this.prisma.accountingPeriod.findFirst({
      where: {
        startDate: { lte: date }, // التاريخ أكبر من أو يساوي تاريخ البداية
        endDate: { gte: date },   // التاريخ أصغر من أو يساوي تاريخ النهاية
      },
    });

    if (!period) {
      // التعليق العربي: إذا لم يتم العثور على فترة، فهذا يعني أن التاريخ خارج نطاق الفترات المحددة.
      throw new NotFoundException(`لم يتم العثور على فترة محاسبية تغطي التاريخ المحدد: ${date.toISOString().split('T')[0]}.`);
    }

    // 2. التحقق من حالة الفترة
    if (period.status === PeriodStatus.CLOSED) {
      // التعليق العربي: منع التعديل أو الإضافة لأن الفترة مغلقة.
      throw new ForbiddenException(`لا يمكن إجراء العملية. الفترة المحاسبية (${period.startDate.toISOString().split('T')[0]} - ${period.endDate.toISOString().split('T')[0]}) مغلقة.`);
    }
  }
}

// ملاحظة: تم افتراض وجود PrismaService في المسار النسبي المحدد.
// تم افتراض وجود DTOs و PeriodStatus في حزمة @semop/contracts.
// تم افتراض وجود نماذج Prisma التالية: AccountingPeriod, JournalEntry, JournalItem.