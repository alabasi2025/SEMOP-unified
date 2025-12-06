import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@semop/prisma';
import { Prisma } from '@prisma/client';

/**
 * خدمة عكس القيود اليومية
 * تقوم بعكس القيود المحاسبية المرحلة
 */
@Injectable()
export class JournalEntryReversalService {
  constructor(private prisma: PrismaService) {}

  /**
   * عكس قيد يومي
   */
  async reverseJournalEntry(
    journalEntryId: string,
    reversalDate: Date,
    reversalReason?: string,
  ) {
    try {
      // جلب القيد الأصلي
      const originalEntry = await this.prisma.journalEntry.findUnique({
        where: { id: journalEntryId },
        include: {
          lines: {
            include: {
              account: true,
              costCenter: true,
            },
          },
          fiscalYear: true,
        },
      });

      if (!originalEntry) {
        throw new NotFoundException(`القيد ${journalEntryId} غير موجود`);
      }

      // التحقق من أن القيد مرحل
      if (originalEntry.status !== 'POSTED') {
        throw new BadRequestException('لا يمكن عكس قيد غير مرحل');
      }

      // التحقق من عدم عكس القيد مسبقاً
      if (originalEntry.isReversed) {
        throw new ConflictException('هذا القيد تم عكسه مسبقاً');
      }

      // التحقق من أن تاريخ العكس بعد تاريخ القيد الأصلي
      if (reversalDate < originalEntry.entryDate) {
        throw new BadRequestException(
          'تاريخ العكس يجب أن يكون بعد تاريخ القيد الأصلي',
        );
      }

      // إنشاء القيد العكسي
      const reversalEntry = await this.prisma.journalEntry.create({
        data: {
          entryNumber: await this.generateReversalEntryNumber(
            originalEntry.entryNumber,
          ),
          entryDate: reversalDate,
          description: `عكس قيد: ${originalEntry.description}${reversalReason ? ` - ${reversalReason}` : ''}`,
          fiscalYearId: originalEntry.fiscalYearId,
          accountingPeriodId: originalEntry.accountingPeriodId,
          status: 'DRAFT',
          isReversalEntry: true,
          originalEntryId: originalEntry.id,
          lines: {
            create: originalEntry.lines.map((line) => ({
              accountId: line.accountId,
              description: `عكس: ${line.description}`,
              // عكس المدين والدائن
              debitAmount: line.creditAmount,
              creditAmount: line.debitAmount,
              ...(line.costCenterId && { costCenterId: line.costCenterId }),
            })),
          },
        },
        include: {
          lines: {
            include: {
              account: true,
              costCenter: true,
            },
          },
        },
      });

      // ترحيل القيد العكسي تلقائياً
      const postedReversalEntry = await this.prisma.journalEntry.update({
        where: { id: reversalEntry.id },
        data: {
          status: 'POSTED',
          postedAt: new Date(),
        },
        include: {
          lines: {
            include: {
              account: true,
              costCenter: true,
            },
          },
        },
      });

      // تحديث القيد الأصلي
      await this.prisma.journalEntry.update({
        where: { id: originalEntry.id },
        data: {
          isReversed: true,
          reversalEntryId: reversalEntry.id,
        },
      });

      return {
        message: 'تم عكس القيد بنجاح',
        originalEntry: {
          id: originalEntry.id,
          entryNumber: originalEntry.entryNumber,
          entryDate: originalEntry.entryDate,
          description: originalEntry.description,
        },
        reversalEntry: postedReversalEntry,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException(`خطأ في عكس القيد: ${error.message}`);
    }
  }

  /**
   * عكس مجموعة من القيود
   */
  async reverseBatchJournalEntries(
    journalEntryIds: string[],
    reversalDate: Date,
    reversalReason?: string,
  ) {
    try {
      const results = [];

      for (const journalEntryId of journalEntryIds) {
        try {
          const result = await this.reverseJournalEntry(
            journalEntryId,
            reversalDate,
            reversalReason,
          );
          results.push({
            success: true,
            journalEntryId,
            result,
          });
        } catch (error) {
          results.push({
            success: false,
            journalEntryId,
            error: error.message,
          });
        }
      }

      const successCount = results.filter((r) => r.success).length;
      const failureCount = results.filter((r) => !r.success).length;

      return {
        message: `تم عكس ${successCount} قيد بنجاح، فشل ${failureCount} قيد`,
        totalCount: journalEntryIds.length,
        successCount,
        failureCount,
        results,
      };
    } catch (error) {
      throw new BadRequestException(
        `خطأ في عكس القيود الدفعية: ${error.message}`,
      );
    }
  }

  /**
   * إلغاء عكس قيد (إذا لم يتم ترحيله بعد)
   */
  async cancelReversal(reversalEntryId: string) {
    try {
      // جلب القيد العكسي
      const reversalEntry = await this.prisma.journalEntry.findUnique({
        where: { id: reversalEntryId },
      });

      if (!reversalEntry) {
        throw new NotFoundException(`القيد ${reversalEntryId} غير موجود`);
      }

      // التحقق من أنه قيد عكسي
      if (!reversalEntry.isReversalEntry) {
        throw new BadRequestException('هذا ليس قيد عكسي');
      }

      // التحقق من أن القيد العكسي غير مرحل
      if (reversalEntry.status === 'POSTED') {
        throw new BadRequestException('لا يمكن إلغاء قيد عكسي مرحل');
      }

      // حذف القيد العكسي
      await this.prisma.journalEntry.delete({
        where: { id: reversalEntryId },
      });

      // تحديث القيد الأصلي
      if (reversalEntry.originalEntryId) {
        await this.prisma.journalEntry.update({
          where: { id: reversalEntry.originalEntryId },
          data: {
            isReversed: false,
            reversalEntryId: null,
          },
        });
      }

      return {
        message: 'تم إلغاء عكس القيد بنجاح',
        reversalEntryId,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `خطأ في إلغاء عكس القيد: ${error.message}`,
      );
    }
  }

  /**
   * جلب القيود المعكوسة
   */
  async getReversedEntries(filters?: {
    fiscalYearId?: string;
    fromDate?: Date;
    toDate?: Date;
  }) {
    try {
      return await this.prisma.journalEntry.findMany({
        where: {
          isReversed: true,
          ...(filters?.fiscalYearId && {
            fiscalYearId: filters.fiscalYearId,
          }),
          ...(filters?.fromDate && {
            entryDate: {
              gte: filters.fromDate,
            },
          }),
          ...(filters?.toDate && {
            entryDate: {
              lte: filters.toDate,
            },
          }),
        },
        include: {
          reversalEntry: {
            include: {
              lines: {
                include: {
                  account: true,
                },
              },
            },
          },
          lines: {
            include: {
              account: true,
            },
          },
        },
        orderBy: {
          entryDate: 'desc',
        },
      });
    } catch (error) {
      throw new BadRequestException(
        `خطأ في جلب القيود المعكوسة: ${error.message}`,
      );
    }
  }

  /**
   * جلب القيود العكسية
   */
  async getReversalEntries(filters?: {
    fiscalYearId?: string;
    fromDate?: Date;
    toDate?: Date;
  }) {
    try {
      return await this.prisma.journalEntry.findMany({
        where: {
          isReversalEntry: true,
          ...(filters?.fiscalYearId && {
            fiscalYearId: filters.fiscalYearId,
          }),
          ...(filters?.fromDate && {
            entryDate: {
              gte: filters.fromDate,
            },
          }),
          ...(filters?.toDate && {
            entryDate: {
              lte: filters.toDate,
            },
          }),
        },
        include: {
          originalEntry: {
            include: {
              lines: {
                include: {
                  account: true,
                },
              },
            },
          },
          lines: {
            include: {
              account: true,
            },
          },
        },
        orderBy: {
          entryDate: 'desc',
        },
      });
    } catch (error) {
      throw new BadRequestException(
        `خطأ في جلب القيود العكسية: ${error.message}`,
      );
    }
  }

  /**
   * توليد رقم قيد عكسي
   */
  private async generateReversalEntryNumber(
    originalEntryNumber: string,
  ): Promise<string> {
    const timestamp = Date.now();
    return `REV-${originalEntryNumber}-${timestamp}`;
  }
}
