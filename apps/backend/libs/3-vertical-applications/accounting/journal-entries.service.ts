import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@semop/prisma'; // افتراض مسار خدمة Prisma
import {
  CreateJournalEntryDto,
  UpdateJournalEntryDto,
  JournalEntryLineDto,
} from './dto/journal-entry.dto'; // افتراض مسار DTOs

// تعريف الأنواع لـ Prisma (افتراضًا بناءً على نموذج المحاسبة القياسي)
// يتم استخدام "unknown as JournalEntry" في الدوال لافتراض أن نموذج Prisma يطابق هذا الهيكل
type JournalEntry = {
  id: number;
  date: Date;
  reference: string;
  description: string | null;
  currencyId: number;
  isPosted: boolean;
  lines: JournalEntryLine[];
};

type JournalEntryLine = {
  id: number;
  journalEntryId: number;
  accountId: number;
  debit: number;
  credit: number;
  description: string | null;
};

@Injectable()
export class JournalEntriesService {
  constructor(private prisma: PrismaService) {}

  /**
   * @private
   * دالة مساعدة للتحقق من توازن القيد اليومي (المدين = الدائن).
   * @param lines مصفوفة سطور القيد اليومي.
   * @throws {BadRequestException} إذا كان القيد غير متوازن.
   */
  private validateBalance(lines: JournalEntryLineDto[]): void {
    // حساب إجمالي المدين والدائن
    const totalDebit = lines.reduce((sum, line) => sum + (line.debit || 0), 0);
    const totalCredit = lines.reduce((sum, line) => sum + (line.credit || 0), 0);

    // التحقق من أن كل سطر يحتوي على قيمة واحدة فقط (مدين أو دائن)
    const hasInvalidLines = lines.some(line => (line.debit && line.credit) || (!line.debit && !line.credit));
    if (hasInvalidLines) {
      throw new BadRequestException('يجب أن يحتوي كل سطر قيد على قيمة واحدة فقط إما في حقل المدين أو حقل الدائن.');
    }

    // التحقق من التوازن
    if (totalDebit !== totalCredit) {
      throw new BadRequestException(
        `القيد اليومي غير متوازن. إجمالي المدين: ${totalDebit.toFixed(2)}، إجمالي الدائن: ${totalCredit.toFixed(2)}. يجب أن يتساويا.`
      );
    }

    if (totalDebit === 0) {
      throw new BadRequestException('يجب أن يحتوي القيد اليومي على قيم مالية (المدين والدائن لا يمكن أن يكونا صفرًا).');
    }
  }

  /**
   * إنشاء قيد يومي جديد.
   * يتم التحقق من التوازن قبل الحفظ ويتم استخدام معاملة لضمان سلامة البيانات.
   * @param createJournalEntryDto بيانات القيد اليومي.
   * @returns القيد اليومي الذي تم إنشاؤه.
   */
  async create(createJournalEntryDto: CreateJournalEntryDto): Promise<JournalEntry> {
    // 1. التحقق من توازن القيد اليومي (المدين = الدائن)
    this.validateBalance(createJournalEntryDto.lines);

    // 2. استخدام معاملة (Transaction) لضمان إنشاء القيد وجميع سطوره بنجاح أو فشل العملية بالكامل.
    const newEntry = await this.prisma.$transaction(async (tx) => {
      // إنشاء رأس القيد اليومي
      const entry = await tx.journalEntry.create({
        data: {
          date: createJournalEntryDto.date,
          reference: createJournalEntryDto.reference,
          description: createJournalEntryDto.description,
          currencyId: createJournalEntryDto.currencyId,
          isPosted: false, // افتراض أن القيد غير مرحل عند الإنشاء
        },
      });

      // إعداد بيانات سطور القيد
      const linesData = createJournalEntryDto.lines.map((line) => ({
        journalEntryId: entry.id,
        accountId: line.accountId,
        debit: line.debit || 0,
        credit: line.credit || 0,
        description: line.description,
      }));

      // إنشاء سطور القيد
      await tx.journalEntryLine.createMany({
        data: linesData,
      });

      // استرجاع القيد كاملاً مع السطور
      return tx.journalEntry.findUnique({
        where: { id: entry.id },
        include: { lines: true },
      }) as unknown as JournalEntry; // يتم تحويل النوع ليتناسب مع النوع المحلي
    });

    return newEntry;
  }

  /**
   * استرجاع جميع القيود اليومية.
   * @returns مصفوفة من القيود اليومية.
   */
  async findAll(): Promise<JournalEntry[]> {
    return this.prisma.journalEntry.findMany({
      include: { lines: true },
    }) as unknown as JournalEntry[];
  }

  /**
   * استرجاع قيد يومي واحد حسب المعرف.
   * @param id معرف القيد اليومي.
   * @returns القيد اليومي.
   * @throws {NotFoundException} إذا لم يتم العثور على القيد.
   */
  async findOne(id: number): Promise<JournalEntry> {
    const entry = await this.prisma.journalEntry.findUnique({
      where: { id },
      include: { lines: true },
    });

    if (!entry) {
      throw new NotFoundException(`لم يتم العثور على القيد اليومي بالمعرف ${id}.`);
    }

    return entry as unknown as JournalEntry;
  }

  /**
   * تحديث قيد يومي موجود.
   * يتم التحقق من التوازن ومن حالة الترحيل قبل التحديث.
   * @param id معرف القيد اليومي.
   * @param updateJournalEntryDto بيانات التحديث.
   * @returns القيد اليومي المحدث.
   * @throws {NotFoundException} إذا لم يتم العثور على القيد.
   * @throws {BadRequestException} إذا كان القيد مرحلاً أو غير متوازن.
   */
  async update(id: number, updateJournalEntryDto: UpdateJournalEntryDto): Promise<JournalEntry> {
    const existingEntry = await this.findOne(id);

    // التحقق من حالة الترحيل
    if (existingEntry.isPosted) {
      throw new BadRequestException('لا يمكن تعديل قيد يومي تم ترحيله.');
    }

    // إذا تم تحديث السطور، يجب التحقق من التوازن
    if (updateJournalEntryDto.lines) {
      this.validateBalance(updateJournalEntryDto.lines);
    }

    // استخدام معاملة لحذف السطور القديمة وإنشاء الجديدة وتحديث الرأس
    const updatedEntry = await this.prisma.$transaction(async (tx) => {
      // 1. حذف السطور القديمة
      await tx.journalEntryLine.deleteMany({
        where: { journalEntryId: id },
      });

      // 2. إنشاء السطور الجديدة (إذا كانت موجودة في DTO، وإلا استخدم السطور الموجودة)
      const linesToCreate = updateJournalEntryDto.lines || existingEntry.lines;
      const linesData = linesToCreate.map((line) => ({
        journalEntryId: id,
        accountId: line.accountId,
        debit: line.debit || 0,
        credit: line.credit || 0,
        description: line.description,
      }));

      await tx.journalEntryLine.createMany({
        data: linesData,
      });

      // 3. تحديث رأس القيد
      const entry = await tx.journalEntry.update({
        where: { id },
        data: {
          date: updateJournalEntryDto.date,
          reference: updateJournalEntryDto.reference,
          description: updateJournalEntryDto.description,
          currencyId: updateJournalEntryDto.currencyId,
        },
      });

      // استرجاع القيد كاملاً مع السطور المحدثة
      return tx.journalEntry.findUnique({
        where: { id: entry.id },
        include: { lines: true },
      }) as unknown as JournalEntry;
    });

    return updatedEntry;
  }

  /**
   * حذف قيد يومي.
   * يتم التحقق من حالة الترحيل قبل الحذف.
   * @param id معرف القيد اليومي.
   * @throws {NotFoundException} إذا لم يتم العثور على القيد.
   * @throws {BadRequestException} إذا كان القيد مرحلاً.
   */
  async remove(id: number): Promise<void> {
    const existingEntry = await this.findOne(id);

    // التحقق من حالة الترحيل
    if (existingEntry.isPosted) {
      throw new BadRequestException('لا يمكن حذف قيد يومي تم ترحيله.');
    }

    // استخدام معاملة لحذف السطور ثم رأس القيد
    await this.prisma.$transaction(async (tx) => {
      // 1. حذف سطور القيد
      await tx.journalEntryLine.deleteMany({
        where: { journalEntryId: id },
      });

      // 2. حذف رأس القيد
      await tx.journalEntry.delete({
        where: { id },
      });
    });
  }
}