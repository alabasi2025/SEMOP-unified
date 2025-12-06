/**
 * @fileoverview Data Transfer Objects (DTOs) for managing gene information.
 * This file defines the core DTO for a gene and DTOs for creation and update operations,
 * incorporating JSDoc documentation، strict type safety، and simulated validation decorators
 * for adherence to best practices.
 */

// Simulation of a validation library import, e.g., 'class-validator'
// import { IsInt, IsPositive, IsString, IsNotEmpty, IsIn, IsOptional, ValidateIf } from 'class-validator';

/**
 * يمثل هيكل البيانات الأساسي للجين.
 * يُستخدم لنقل معلومات الجين من طبقة الخدمة إلى العميل.
 */
export class GeneDto {
  /**
   * المعرّف الفريد الذي يولده النظام للجين.
   * @type {number}
   * // @IsInt()
   * // @IsPositive()
   * @example 12345
   */
  public readonly id: number;

  /**
   * الرمز الرسمي للجين (مثل 'BRCA1').
   * @type {string}
   * // @IsString()
   * // @IsNotEmpty()
   * @example "BRCA1"
   */
  public readonly symbol: string;

  /**
   * الاسم الكامل أو الوصف للجين.
   * @type {string}
   * // @IsString()
   * // @IsNotEmpty()
   * @example "Breast Cancer Type 1 Susceptibility Protein"
   */
  public readonly name: string;

  /**
   * الكروموسوم الذي يقع عليه الجين (مثل 'chr17').
   * @type {string}
   * // @IsString()
   * // @IsNotEmpty()
   * @example "chr17"
   */
  public readonly chromosome: string;

  /**
   * موضع البداية للجين على الكروموسوم (مبني على 1).
   * @type {number}
   * // @IsInt()
   * // @IsPositive()
   * @example 43044295
   */
  public readonly start: number;

  /**
   * موضع النهاية للجين على الكروموسوم (مبني على 1).
   * @type {number}
   * // @IsInt()
   * // @IsPositive()
   * @example 43125483
   */
  public readonly end: number;

  /**
   * شريط الحمض النووي (DNA) الذي يقع عليه الجين ('+' أو '-').
   * @type {'+' | '-'}
   * // @IsIn(['+', '-'])
   * @example "+"
   */
  public readonly strand: '+' | '-';

  /**
   * منشئ الفئة (Constructor) لـ GeneDto.
   * @param {number} id - المعرّف الفريد.
   * @param {string} symbol - رمز الجين.
   * @param {string} name - اسم الجين.
   * @param {string} chromosome - الكروموسوم.
   * @param {number} start - موضع البداية.
   * @param {number} end - موضع النهاية.
   * @param {'+' | '-'} strand - شريط الحمض النووي.
   */
  constructor(
    id: number,
    symbol: string,
    name: string,
    chromosome: string,
    start: number,
    end: number,
    strand: '+' | '-'
  ) {
    this.id = id;
    this.symbol = symbol;
    this.name = name;
    this.chromosome = chromosome;
    this.start = start;
    this.end = end;
    this.strand = strand;
  }
}

/**
 * DTO لإنشاء إدخال جين جديد.
 * يُستخدم لنقل البيانات من العميل إلى طبقة الخدمة لعملية الإنشاء.
 */
export class CreateGeneDto {
  /**
   * الرمز الرسمي للجين (مثل 'BRCA1').
   * @type {string}
   * // @IsString()
   * // @IsNotEmpty()
   * @example "BRCA1"
   */
  public readonly symbol: string;

  /**
   * الاسم الكامل أو الوصف للجين.
   * @type {string}
   * // @IsString()
   * // @IsNotEmpty()
   * @example "Breast Cancer Type 1 Susceptibility Protein"
   */
  public readonly name: string;

  /**
   * الكروموسوم الذي يقع عليه الجين (مثل 'chr17').
   * @type {string}
   * // @IsString()
   * // @IsNotEmpty()
   * @example "chr17"
   */
  public readonly chromosome: string;

  /**
   * موضع البداية للجين على الكروموسوم (مبني على 1).
   * يجب أن يكون عددًا صحيحًا موجبًا.
   * @type {number}
   * // @IsInt()
   * // @IsPositive()
   * @example 43044295
   */
  public readonly start: number;

  /**
   * موضع النهاية للجين على الكروموسوم (مبني على 1).
   * يجب أن يكون عددًا صحيحًا موجبًا وأكبر من 'start'.
   * @type {number}
   * // @IsInt()
   * // @IsPositive()
   * @example 43125483
   */
  public readonly end: number;

  /**
   * شريط الحمض النووي (DNA) الذي يقع عليه الجين ('+' أو '-').
   * @type {'+' | '-'}
   * // @IsIn(['+', '-'])
   * @example "+"
   */
  public readonly strand: '+' | '-';

  /**
   * منشئ الفئة (Constructor) لـ CreateGeneDto.
   * يتضمن معالجة أخطاء محسّنة لضمان سلامة البيانات الأساسية.
   * @param {string} symbol - رمز الجين.
   * @param {string} name - اسم الجين.
   * @param {string} chromosome - الكروموسوم.
   * @param {number} start - موضع البداية.
   * @param {number} end - موضع النهاية.
   * @param {'+' | '-'} strand - شريط الحمض النووي.
   * @throws {Error} إذا لم يكن 'start' أو 'end' موجبًا، أو إذا كان 'start' أكبر من 'end'.
   */
  constructor(
    symbol: string,
    name: string,
    chromosome: string,
    start: number,
    end: number,
    strand: '+' | '-'
  ) {
    if (typeof start !== 'number' || start <= 0) {
      throw new Error('Start position must be a positive integer.');
    }
    if (typeof end !== 'number' || end <= 0) {
      throw new Error('End position must be a positive integer.');
    }
    if (start > end) {
      throw new Error('Start position cannot be greater than end position.');
    }
    if (strand !== '+' && strand !== '-') {
      throw new Error('Strand must be either "+" or "-".');
    }

    this.symbol = symbol;
    this.name = name;
    this.chromosome = chromosome;
    this.start = start;
    this.end = end;
    this.strand = strand;
  }
}

/**
 * DTO لتحديث إدخال جين موجود.
 * جميع الحقول اختيارية، ويُستخدم لنقل البيانات الجزئية للتحديث.
 */
export class UpdateGeneDto {
  /**
   * الرمز الرسمي للجين (مثل 'BRCA1').
   * @type {string | undefined}
   * // @IsOptional()
   * // @IsString()
   * // @IsNotEmpty()
   * @example "BRCA1"
   */
  public readonly symbol?: string;

  /**
   * الاسم الكامل أو الوصف للجين.
   * @type {string | undefined}
   * // @IsOptional()
   * // @IsString()
   * // @IsNotEmpty()
   * @example "Breast Cancer Type 1 Susceptibility Protein"
   */
  public readonly name?: string;

  /**
   * الكروموسوم الذي يقع عليه الجين (مثل 'chr17').
   * @type {string | undefined}
   * // @IsOptional()
   * // @IsString()
   * // @IsNotEmpty()
   * @example "chr17"
   */
  public readonly chromosome?: string;

  /**
   * موضع البداية للجين على الكروموسوم (مبني على 1).
   * يجب أن يكون عددًا صحيحًا موجبًا إذا تم توفيره.
   * @type {number | undefined}
   * // @IsOptional()
   * // @IsInt()
   * // @IsPositive()
   * @example 43044295
   */
  public readonly start?: number;

  /**
   * موضع النهاية للجين على الكروموسوم (مبني على 1).
   * يجب أن يكون عددًا صحيحًا موجبًا إذا تم توفيره.
   * @type {number | undefined}
   * // @IsOptional()
   * // @IsInt()
   * // @IsPositive()
   * @example 43125483
   */
  public readonly end?: number;

  /**
   * شريط الحمض النووي (DNA) الذي يقع عليه الجين ('+' أو '-').
   * @type {'+' | '-' | undefined}
   * // @IsOptional()
   * // @IsIn(['+', '-'])
   * @example "+"
   */
  public readonly strand?: '+' | '-';

  /**
   * منشئ الفئة (Constructor) لـ UpdateGeneDto.
   * يتضمن معالجة أخطاء محسّنة لضمان سلامة البيانات الجزئية.
   * @param {Partial<CreateGeneDto>} updates - كائن يحتوي على الحقول المراد تحديثها.
   * @throws {Error} إذا تم توفير 'start' أو 'end' ولم يكن موجبًا، أو إذا كان 'start' أكبر من 'end' (إذا تم توفيرهما معًا).
   */
  constructor(updates: Partial<CreateGeneDto>) {
    const { start, end, strand } = updates;

    if (start !== undefined) {
      if (typeof start !== 'number' || start <= 0) {
        throw new Error('Start position must be a positive integer if provided.');
      }
    }
    if (end !== undefined) {
      if (typeof end !== 'number' || end <= 0) {
        throw new Error('End position must be a positive integer if provided.');
      }
    }
    if (start !== undefined && end !== undefined && start > end) {
      throw new Error('Start position cannot be greater than end position.');
    }
    if (strand !== undefined && strand !== '+' && strand !== '-') {
      throw new Error('Strand must be either "+" or "-" if provided.');
    }

    this.symbol = updates.symbol;
    this.name = updates.name;
    this.chromosome = updates.chromosome;
    this.start = start;
    this.end = end;
    this.strand = strand as '+' | '-' | undefined;
  }
}
