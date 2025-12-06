import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@semop/prisma';
import { Prisma } from '@prisma/client';

/**
 * خدمة إدارة العملات
 * تقوم بإدارة العملات وأسعار الصرف
 */
@Injectable()
export class CurrenciesService {
  constructor(private prisma: PrismaService) {}

  /**
   * إنشاء عملة جديدة
   */
  async create(data: {
    code: string;
    name: string;
    symbol: string;
    isBaseCurrency?: boolean;
    exchangeRate?: number;
    decimalPlaces?: number;
  }) {
    try {
      // التحقق من عدم وجود عملة بنفس الكود
      const existing = await this.prisma.currency.findUnique({
        where: { code: data.code },
      });

      if (existing) {
        throw new ConflictException(`العملة ${data.code} موجودة بالفعل`);
      }

      // إذا كانت عملة أساسية، تحديث العملات الأخرى
      if (data.isBaseCurrency) {
        await this.prisma.currency.updateMany({
          where: { isBaseCurrency: true },
          data: { isBaseCurrency: false },
        });
      }

      return await this.prisma.currency.create({
        data: {
          code: data.code,
          name: data.name,
          symbol: data.symbol,
          isBaseCurrency: data.isBaseCurrency || false,
          exchangeRate: data.exchangeRate
            ? new Prisma.Decimal(data.exchangeRate)
            : new Prisma.Decimal(1),
          decimalPlaces: data.decimalPlaces || 2,
          isActive: true,
        },
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException(`خطأ في إنشاء العملة: ${error.message}`);
    }
  }

  /**
   * جلب جميع العملات
   */
  async findAll(filters?: { isActive?: boolean }) {
    try {
      return await this.prisma.currency.findMany({
        where: {
          ...(filters?.isActive !== undefined && {
            isActive: filters.isActive,
          }),
        },
        orderBy: {
          code: 'asc',
        },
      });
    } catch (error) {
      throw new BadRequestException(`خطأ في جلب العملات: ${error.message}`);
    }
  }

  /**
   * جلب عملة بواسطة المعرف
   */
  async findOne(id: string) {
    try {
      const currency = await this.prisma.currency.findUnique({
        where: { id },
      });

      if (!currency) {
        throw new NotFoundException(`العملة ${id} غير موجودة`);
      }

      return currency;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`خطأ في جلب العملة: ${error.message}`);
    }
  }

  /**
   * جلب عملة بواسطة الكود
   */
  async findByCode(code: string) {
    try {
      const currency = await this.prisma.currency.findUnique({
        where: { code },
      });

      if (!currency) {
        throw new NotFoundException(`العملة ${code} غير موجودة`);
      }

      return currency;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`خطأ في جلب العملة: ${error.message}`);
    }
  }

  /**
   * جلب العملة الأساسية
   */
  async getBaseCurrency() {
    try {
      const currency = await this.prisma.currency.findFirst({
        where: { isBaseCurrency: true },
      });

      if (!currency) {
        throw new NotFoundException('لا توجد عملة أساسية محددة');
      }

      return currency;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `خطأ في جلب العملة الأساسية: ${error.message}`,
      );
    }
  }

  /**
   * تحديث عملة
   */
  async update(
    id: string,
    data: {
      name?: string;
      symbol?: string;
      isBaseCurrency?: boolean;
      exchangeRate?: number;
      decimalPlaces?: number;
      isActive?: boolean;
    },
  ) {
    try {
      // التحقق من وجود العملة
      await this.findOne(id);

      // إذا كانت عملة أساسية، تحديث العملات الأخرى
      if (data.isBaseCurrency) {
        await this.prisma.currency.updateMany({
          where: {
            id: { not: id },
            isBaseCurrency: true,
          },
          data: { isBaseCurrency: false },
        });
      }

      return await this.prisma.currency.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.symbol && { symbol: data.symbol }),
          ...(data.isBaseCurrency !== undefined && {
            isBaseCurrency: data.isBaseCurrency,
          }),
          ...(data.exchangeRate && {
            exchangeRate: new Prisma.Decimal(data.exchangeRate),
          }),
          ...(data.decimalPlaces !== undefined && {
            decimalPlaces: data.decimalPlaces,
          }),
          ...(data.isActive !== undefined && { isActive: data.isActive }),
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`خطأ في تحديث العملة: ${error.message}`);
    }
  }

  /**
   * تحديث سعر الصرف
   */
  async updateExchangeRate(id: string, exchangeRate: number) {
    try {
      await this.findOne(id);

      return await this.prisma.currency.update({
        where: { id },
        data: {
          exchangeRate: new Prisma.Decimal(exchangeRate),
          lastExchangeRateUpdate: new Date(),
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `خطأ في تحديث سعر الصرف: ${error.message}`,
      );
    }
  }

  /**
   * حذف عملة (حذف منطقي)
   */
  async remove(id: string) {
    try {
      const currency = await this.findOne(id);

      // منع حذف العملة الأساسية
      if (currency.isBaseCurrency) {
        throw new BadRequestException('لا يمكن حذف العملة الأساسية');
      }

      return await this.prisma.currency.update({
        where: { id },
        data: { isActive: false },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(`خطأ في حذف العملة: ${error.message}`);
    }
  }

  /**
   * تحويل مبلغ من عملة إلى أخرى
   */
  async convert(
    amount: number,
    fromCurrencyId: string,
    toCurrencyId: string,
  ) {
    try {
      const fromCurrency = await this.findOne(fromCurrencyId);
      const toCurrency = await this.findOne(toCurrencyId);

      // التحويل عبر العملة الأساسية
      const amountInBaseCurrency =
        amount / Number(fromCurrency.exchangeRate);
      const convertedAmount =
        amountInBaseCurrency * Number(toCurrency.exchangeRate);

      return {
        amount,
        fromCurrency: {
          id: fromCurrency.id,
          code: fromCurrency.code,
          name: fromCurrency.name,
          exchangeRate: Number(fromCurrency.exchangeRate),
        },
        toCurrency: {
          id: toCurrency.id,
          code: toCurrency.code,
          name: toCurrency.name,
          exchangeRate: Number(toCurrency.exchangeRate),
        },
        convertedAmount: Number(convertedAmount.toFixed(toCurrency.decimalPlaces)),
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`خطأ في تحويل العملة: ${error.message}`);
    }
  }

  /**
   * جلب أسعار الصرف الحالية
   */
  async getExchangeRates() {
    try {
      const baseCurrency = await this.getBaseCurrency();
      const currencies = await this.findAll({ isActive: true });

      return {
        baseCurrency: {
          id: baseCurrency.id,
          code: baseCurrency.code,
          name: baseCurrency.name,
        },
        rates: currencies.map((currency) => ({
          id: currency.id,
          code: currency.code,
          name: currency.name,
          symbol: currency.symbol,
          exchangeRate: Number(currency.exchangeRate),
          lastUpdate: currency.lastExchangeRateUpdate,
        })),
      };
    } catch (error) {
      throw new BadRequestException(
        `خطأ في جلب أسعار الصرف: ${error.message}`,
      );
    }
  }
}
