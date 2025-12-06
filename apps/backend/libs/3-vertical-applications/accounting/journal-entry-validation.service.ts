import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { IsNumber, Min, IsArray, ValidateNested, ArrayMinSize, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

// افتراض أن هذه الـ DTOs مستوردة من @semop/contracts
// لأغراض هذا المثال، يتم تعريفها هنا لضمان اكتمال الكود.

/**
 * @class JournalEntryLineItemDto
 * @description يمثل بندًا واحدًا في القيد المحاسبي.
 */
class JournalEntryLineItemDto {
  // معرف الحساب (يفترض أنه رقم موجب)
  @IsNumber()
  @IsPositive()
  accountId: number;

  // المبلغ المدين (يجب أن يكون رقمًا، وأكبر من أو يساوي صفر)
  @IsNumber()
  @Min(0)
  debit: number;

  // المبلغ الدائن (يجب أن يكون رقمًا، وأكبر من أو يساوي صفر)
  @IsNumber()
  @Min(0)
  credit: number;
}

/**
 * @class ValidateJournalEntryDto
 * @description يمثل هيكل البيانات المطلوب للتحقق من القيد المحاسبي.
 */
export class ValidateJournalEntryDto {
  // قائمة ببنود القيد (يجب أن تكون مصفوفة، وتحتوي على عنصرين على الأقل)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JournalEntryLineItemDto)
  @ArrayMinSize(2)
  lineItems: JournalEntryLineItemDto[];
}

/**
 * @class JournalEntryValidationService
 * @description خدمة مسؤولة عن التحقق من صحة القيود المحاسبية، وخاصة التحقق من التوازن (المدين = الدائن).
 */
@Injectable()
export class JournalEntryValidationService {
  // حقن PrismaClient عبر Dependency Injection
  // يفترض وجود خدمة PrismaService مغلفة لـ PrismaClient
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * @method validateBalance
   * @description يتحقق من توازن القيد المحاسبي: إجمالي المدين يجب أن يساوي إجمالي الدائن.
   * @param {ValidateJournalEntryDto} journalEntryData - بيانات القيد المراد التحقق منه.
   * @throws {BadRequestException} إذا كان القيد غير متوازن.
   * @returns {boolean} true إذا كان القيد متوازنًا.
   */
  public validateBalance(journalEntryData: ValidateJournalEntryDto): boolean {
    // المنطق المعقد: حساب إجمالي المدين وإجمالي الدائن والتحقق من التوازن.

    // 1. حساب إجمالي المدين (Total Debit)
    const totalDebit = journalEntryData.lineItems.reduce(
      (sum, item) => sum + item.debit,
      0,
    );

    // 2. حساب إجمالي الدائن (Total Credit)
    const totalCredit = journalEntryData.lineItems.reduce(
      (sum, item) => sum + item.credit,
      0,
    );

    // 3. التحقق من التوازن
    // نستخدم مقارنة الأرقام العشرية مع هامش خطأ صغير (Epsilon) لتجنب مشاكل دقة الفاصلة العائمة
    // في JavaScript، لكن لتبسيط المنطق المحاسبي الذي يفترض التعامل مع أرقام دقيقة، سنستخدم مقارنة مباشرة.
    // في بيئة إنتاجية، يفضل استخدام مكتبة للتعامل مع العملات (مثل 'decimal.js' أو 'big.js').
    const isBalanced = totalDebit === totalCredit;

    if (!isBalanced) {
      // معالجة الخطأ: رمي استثناء في حال عدم التوازن
      throw new BadRequestException(
        `القيد المحاسبي غير متوازن. إجمالي المدين (${totalDebit}) لا يساوي إجمالي الدائن (${totalCredit}).`,
      );
    }

    // 4. إذا كان متوازنًا، يتم إرجاع true
    return true;
  }

  /**
   * @method validateAccountsExistence
   * @description مثال على استخدام Prisma Client للتحقق من وجود الحسابات في قاعدة البيانات.
   * @param {ValidateJournalEntryDto} journalEntryData - بيانات القيد.
   * @returns {Promise<void>}
   */
  public async validateAccountsExistence(journalEntryData: ValidateJournalEntryDto): Promise<void> {
    const accountIds = journalEntryData.lineItems.map(item => item.accountId);
    const uniqueAccountIds = [...new Set(accountIds)];

    // مثال على استعلام Prisma: التحقق من وجود جميع الحسابات
    // يفترض وجود نموذج 'Account' في Prisma
    /*
    const existingAccountsCount = await this.prisma.account.count({
      where: {
        id: {
          in: uniqueAccountIds,
        },
      },
    });

    if (existingAccountsCount !== uniqueAccountIds.length) {
      throw new NotFoundException('أحد الحسابات المذكورة في القيد غير موجود.');
    }
    */
    // يتم ترك هذا الجزء كتعليق لأنه يتطلب نموذج Prisma فعلي غير متوفر.
  }
}