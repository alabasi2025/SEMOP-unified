// PHASE: DTO_QUALITY_FIX
// PHASE-14: تحسين جودة DTOs - إضافة تعليقات PHASE للتوثيق
// PHASE-13: إضافة Input Validation وتحسين Business Logic
// PHASE-11: إصلاح انتهاكات DTOs والبنية المعمارية - استخدام @semop/contracts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../1-core-services/prisma/prisma.service';

/**
 * خدمة حساب التسعير الديناميكي للجينات
 * تحسب السعر بناءً على عدد الجينات النشطة مع خصومات حسب الكمية
 */
@Injectable()
export class PricingService {
  constructor(private prisma: PrismaService) {}

  // أسعار الجينات (يمكن نقلها لقاعدة البيانات لاحقاً)
  private readonly BASE_GENE_PRICE = 100; // السعر الأساسي للجين الواحد
  private readonly DISCOUNT_TIERS = [
    { min: 1, max: 5, discount: 0 },      // 0% خصم للجينات 1-5
    { min: 6, max: 10, discount: 0.1 },   // 10% خصم للجينات 6-10
    { min: 11, max: 15, discount: 0.15 }, // 15% خصم للجينات 11-15
    { min: 16, max: 999, discount: 0.2 }, // 20% خصم للجينات 16+
  ];

  /**
   * حساب السعر بناءً على عدد الجينات النشطة
   * @param activeGenesCount عدد الجينات النشطة
   * @returns كائن يحتوي على تفاصيل التسعير
   */
  async calculatePrice(activeGenesCount: number) {
    // إيجاد مستوى الخصم المناسب
    const tier = this.DISCOUNT_TIERS.find(
      (t) => activeGenesCount >= t.min && activeGenesCount <= t.max,
    ) || this.DISCOUNT_TIERS[this.DISCOUNT_TIERS.length - 1];

    const basePrice = this.BASE_GENE_PRICE * activeGenesCount;
    const discountAmount = basePrice * tier.discount;
    const finalPrice = basePrice - discountAmount;

    return {
      activeGenesCount,
      basePricePerGene: this.BASE_GENE_PRICE,
      basePrice,
      discountPercentage: tier.discount * 100,
      discountAmount,
      finalPrice,
      currency: 'USD',
    };
  }

  /**
   * حساب السعر لعميل معين بناءً على جيناته النشطة
   * @param customerId معرف العميل
   */
  async calculatePriceForCustomer(customerId: string) {
    // جلب عدد الجينات النشطة للعميل (يتطلب تطوير نموذج Customer)
    // هذا مثال افتراضي
    const activeGenes = await this.prisma.gene.count({
      where: {
        isActive: true,
        // customerId: customerId, // سيتم إضافة هذا لاحقاً
      },
    });

    return this.calculatePrice(activeGenes);
  }

  /**
   * الحصول على جدول الأسعار الكامل
   */
  async getPricingTable() {
    const pricingTable = [];

    for (let count = 1; count <= 22; count++) {
      const pricing = await this.calculatePrice(count);
      pricingTable.push({
        genesCount: count,
        price: pricing.finalPrice,
        discount: pricing.discountPercentage,
      });
    }

    return {
      basePricePerGene: this.BASE_GENE_PRICE,
      currency: 'USD',
      pricingTable,
      discountTiers: this.DISCOUNT_TIERS.map((tier) => ({
        range: `${tier.min}-${tier.max === 999 ? '+' : tier.max}`,
        discount: `${tier.discount * 100}%`,
      })),
    };
  }
}
