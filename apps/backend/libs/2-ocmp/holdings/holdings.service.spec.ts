// PHASE-11

import { Test, TestingModule } from '@nestjs/testing';
import { HoldingsService } from './holdings.service';
import { PrismaService } from '../../../../prisma/prisma.service'; // يجب أن يتطابق مع المسار المستخدم في الخدمة

// بيانات وهمية للاختبار
const mockHolding = { id: 1, name: 'Test Holding', createdAt: new Date(), updatedAt: new Date() };
const mockHoldings = [mockHolding, { ...mockHolding, id: 2, name: 'Another Holding' }];

// Mocking لـ PrismaService
const mockPrismaService = {
  holding: {
    create: jest.fn().mockResolvedValue(mockHolding),
    findMany: jest.fn().mockResolvedValue(mockHoldings),
    findUnique: jest.fn().mockResolvedValue(mockHolding),
    update: jest.fn().mockResolvedValue(mockHolding),
    delete: jest.fn().mockResolvedValue(mockHolding),
  },
};

describe('HoldingsService', () => {
  let service: HoldingsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HoldingsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<HoldingsService>(HoldingsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('يجب أن يتم تعريف الخدمة (Service should be defined)', () => {
    expect(service).toBeDefined();
  });

  // 1. اختبار دالة create
  it('يجب أن ينشئ حيازة جديدة (should create a new holding)', async () => {
    const createDto = { name: 'New Holding' };
    const result = await service.create(createDto);
    
    expect(prisma.holding.create).toHaveBeenCalledWith({ data: createDto });
    expect(result).toEqual(mockHolding);
  });

  // 2. اختبار دالة findAll
  it('يجب أن يعيد جميع الحيازات (should return all holdings)', async () => {
    const result = await service.findAll();
    
    expect(prisma.holding.findMany).toHaveBeenCalled();
    expect(result).toEqual(mockHoldings);
    expect(result.length).toBe(2);
  });

  // 3. اختبار دالة findOne
  it('يجب أن يعيد حيازة واحدة بالـ ID (should return a single holding by ID)', async () => {
    const id = 1;
    const result = await service.findOne(id);
    
    expect(prisma.holding.findUnique).toHaveBeenCalledWith({ where: { id } });
    expect(result).toEqual(mockHolding);
  });

  // 4. اختبار دالة update
  it('يجب أن يحدث حيازة موجودة (should update an existing holding)', async () => {
    const id = 1;
    const updateDto = { name: 'Updated Holding' };
    const updatedHolding = { ...mockHolding, ...updateDto };
    
    // إعادة تعيين Mock لـ update ليعيد الكائن المحدث
    (prisma.holding.update as jest.Mock).mockResolvedValue(updatedHolding);

    const result = await service.update(id, updateDto);
    
    expect(prisma.holding.update).toHaveBeenCalledWith({
      where: { id },
      data: updateDto,
    });
    expect(result).toEqual(updatedHolding);
  });

  // 5. اختبار دالة remove
  it('يجب أن يحذف حيازة بالـ ID (should delete a holding by ID)', async () => {
    const id = 1;
    
    // إعادة تعيين Mock لـ delete ليعيد الكائن المحذوف
    (prisma.holding.delete as jest.Mock).mockResolvedValue(mockHolding);

    const result = await service.remove(id);
    
    expect(prisma.holding.delete).toHaveBeenCalledWith({ where: { id } });
    expect(result).toEqual(mockHolding);
  });
});

// ملاحظة: تم إنشاء 5 اختبارات وظيفية (Functional Tests) تغطي جميع دوال CRUD.
// يفترض هذا أن التغطية ستكون 100% للخدمة البسيطة التي تم إنشاؤها في holdings.service.ts.
// عدد الاختبارات: 5 + 1 (تعريف الخدمة) = 6 اختبارات.
