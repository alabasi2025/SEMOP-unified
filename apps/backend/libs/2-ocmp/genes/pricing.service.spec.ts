// PHASE-11

import { Test, TestingModule } from '@nestjs/testing';
import { PricingService } from './pricing.service';
import { PrismaService } from '../../prisma/prisma.service';

// Mock PrismaService
const mockPrismaService = {
  gene: {
    count: jest.fn(),
  },
};

describe('PricingService', () => {
  let service: PricingService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PricingService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PricingService>(PricingService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks(); // مسح الـ mocks قبل كل اختبار
  });

  it('يجب أن يكون الخدمة معرفة', () => {
    expect(service).toBeDefined();
  });

  describe('calculatePrice', () => {
    // السعر الأساسي للجين الواحد هو 100
    const BASE_PRICE = 100;

    it('يجب أن يحسب السعر الأساسي بدون خصم (1-5 جينات)', async () => {
      const count = 3;
      const result = await service.calculatePrice(count);
      const expectedBasePrice = count * BASE_PRICE;

      expect(result.activeGenesCount).toBe(count);
      expect(result.basePrice).toBe(expectedBasePrice);
      expect(result.discountPercentage).toBe(0);
      expect(result.discountAmount).toBe(0);
      expect(result.finalPrice).toBe(expectedBasePrice);
      expect(result.currency).toBe('USD');
    });

    it('يجب أن يطبق خصم 10% (6-10 جينات)', async () => {
      const count = 8;
      const result = await service.calculatePrice(count);
      const expectedBasePrice = count * BASE_PRICE;
      const expectedDiscount = expectedBasePrice * 0.1;
      const expectedFinalPrice = expectedBasePrice - expectedDiscount;

      expect(result.discountPercentage).toBe(10);
      expect(result.discountAmount).toBe(expectedDiscount);
      expect(result.finalPrice).toBe(expectedFinalPrice); // 800 - 80 = 720
    });

    it('يجب أن يطبق خصم 15% (11-15 جينات)', async () => {
      const count = 12;
      const result = await service.calculatePrice(count);
      const expectedBasePrice = count * BASE_PRICE;
      const expectedDiscount = expectedBasePrice * 0.15;
      const expectedFinalPrice = expectedBasePrice - expectedDiscount;

      expect(result.discountPercentage).toBe(15);
      expect(result.discountAmount).toBe(expectedDiscount);
      expect(result.finalPrice).toBe(expectedFinalPrice); // 1200 - 180 = 1020
    });

    it('يجب أن يطبق خصم 20% (16+ جينات)', async () => {
      const count = 20;
      const result = await service.calculatePrice(count);
      const expectedBasePrice = count * BASE_PRICE;
      const expectedDiscount = expectedBasePrice * 0.2;
      const expectedFinalPrice = expectedBasePrice - expectedDiscount;

      expect(result.discountPercentage).toBe(20);
      expect(result.discountAmount).toBe(expectedDiscount);
      expect(result.finalPrice).toBe(expectedFinalPrice); // 2000 - 400 = 1600
    });

    it('يجب أن يستخدم أعلى خصم للعدد الكبير جداً من الجينات', async () => {
      const count = 100;
      const result = await service.calculatePrice(count);
      const expectedBasePrice = count * BASE_PRICE;
      const expectedDiscount = expectedBasePrice * 0.2;
      const expectedFinalPrice = expectedBasePrice - expectedDiscount;

      expect(result.discountPercentage).toBe(20);
      expect(result.finalPrice).toBe(expectedFinalPrice); // 10000 - 2000 = 8000
    });
  });

  describe('calculatePriceForCustomer', () => {
    it('يجب أن يجلب عدد الجينات من Prisma ويحسب السعر', async () => {
      const customerId = 'cust-123';
      const activeGenesCount = 12; // خصم 15%
      
      // Mock the Prisma call
      (mockPrismaService.gene.count as jest.Mock).mockResolvedValue(activeGenesCount);

      // Spy on calculatePrice to ensure it's called correctly
      const calculatePriceSpy = jest.spyOn(service, 'calculatePrice');

      const result = await service.calculatePriceForCustomer(customerId);

      // Verify Prisma was called
      expect(mockPrismaService.gene.count).toHaveBeenCalledWith({
        where: {
          isActive: true,
          // customerId: customerId, // كما هو في الكود الأصلي، لا يتم استخدام customerId حالياً
        },
      });

      // Verify calculatePrice was called with the correct count
      expect(calculatePriceSpy).toHaveBeenCalledWith(activeGenesCount);

      // Verify the result is correct (12 جين = 1020)
      expect(result.finalPrice).toBe(1020);
      
      calculatePriceSpy.mockRestore();
    });
  });

  describe('getPricingTable', () => {
    it('يجب أن يعيد جدول أسعار كامل بـ 22 إدخال', async () => {
      // Mock calculatePrice to avoid actual calculations during iteration, 
      // although the current implementation is fast enough. 
      // We will rely on the previous tests for calculatePrice correctness.
      
      const result = await service.getPricingTable();

      expect(result).toBeDefined();
      expect(result.basePricePerGene).toBe(100);
      expect(result.currency).toBe('USD');
      expect(result.pricingTable).toHaveLength(22);
      expect(result.discountTiers).toHaveLength(4);

      // التحقق من بعض النقاط الرئيسية في الجدول
      // 1. جين واحد (0% خصم)
      const entry1 = result.pricingTable.find(e => e.genesCount === 1);
      expect(entry1.price).toBe(100);
      expect(entry1.discount).toBe(0);

      // 2. 6 جينات (10% خصم)
      const entry6 = result.pricingTable.find(e => e.genesCount === 6);
      expect(entry6.price).toBe(540); // 600 * 0.9
      expect(entry6.discount).toBe(10);

      // 3. 16 جين (20% خصم)
      const entry16 = result.pricingTable.find(e => e.genesCount === 16);
      expect(entry16.price).toBe(1280); // 1600 * 0.8
      expect(entry16.discount).toBe(20);
    });
  });
});
