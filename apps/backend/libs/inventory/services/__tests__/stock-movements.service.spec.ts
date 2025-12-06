import { Test, TestingModule } from '@nestjs/testing';
import { StockMovementsService } from './stock-movements.service';
import { PrismaService } from '../../../1-core-services/prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateStockMovementDto } from './stock-movements.dto';

// تعريف MockPrismaService لمحاكاة PrismaService
const mockPrismaService = {
  warehouse: {
    findUnique: jest.fn(),
  },
  item: {
    findUnique: jest.fn(),
  },
  stockMovement: {
    count: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
  warehouseItem: {
    findUnique: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  },
};

// بيانات وهمية للاختبار
const mockWarehouse = { id: 'wh1', name: 'المستودع الرئيسي' };
const mockItem = { id: 'item1', name: 'منتج اختبار' };
const mockMovementIn: CreateStockMovementDto = {
  warehouseId: 'wh1',
  itemId: 'item1',
  movementType: 'IN',
  quantity: 10,
  sourceDocument: 'PO-001',
};
const mockMovementOut: CreateStockMovementDto = {
  warehouseId: 'wh1',
  itemId: 'item1',
  movementType: 'OUT',
  quantity: 5,
  sourceDocument: 'SO-001',
};
const mockMovementAdjustment: CreateStockMovementDto = {
  warehouseId: 'wh1',
  itemId: 'item1',
  movementType: 'ADJUSTMENT',
  quantity: 2,
  sourceDocument: 'ADJ-001',
};
const mockMovementResult = {
  id: 'mov1',
  movementNumber: 'SM-000001',
  ...mockMovementIn,
  movementDate: new Date(),
};
const mockWarehouseItem = {
  warehouseId: 'wh1',
  itemId: 'item1',
  quantity: 20,
  availableQty: 20,
  reservedQty: 0,
};

describe('StockMovementsService', () => {
  let service: StockMovementsService;
  let prisma: typeof mockPrismaService;

  // إعداد الوحدة الاختبارية قبل كل اختبار
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockMovementsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<StockMovementsService>(StockMovementsService);
    prisma = module.get<typeof mockPrismaService>(PrismaService);

    // مسح سجلات الدوال الوهمية قبل كل اختبار
    jest.clearAllMocks();
  });

  // اختبار وجود الخدمة
  it('يجب أن تكون الخدمة معرفة', () => {
    expect(service).toBeDefined();
  });

  // =========================================================================
  // اختبار دالة create (إنشاء حركة مخزون)
  // =========================================================================
  describe('create', () => {
    // إعداد الدوال الوهمية للحالات الناجحة
    beforeEach(() => {
      prisma.warehouse.findUnique.mockResolvedValue(mockWarehouse);
      prisma.item.findUnique.mockResolvedValue(mockItem);
      prisma.stockMovement.count.mockResolvedValue(0);
      prisma.stockMovement.create.mockResolvedValue(mockMovementResult);
      prisma.warehouseItem.update.mockResolvedValue({});
      prisma.warehouseItem.create.mockResolvedValue({});
    });

    // اختبار حالة نجاح حركة الإدخال (IN)
    it('يجب أن تنشئ حركة إدخال (IN) بنجاح وتحدث رصيد المخزون', async () => {
      // محاكاة وجود رصيد سابق
      prisma.warehouseItem.findUnique.mockResolvedValue(mockWarehouseItem);

      const result = await service.create(mockMovementIn);

      expect(result).toEqual(mockMovementResult);
      expect(prisma.stockMovement.create).toHaveBeenCalled();
      // يجب أن يتم تحديث الرصيد: 20 (سابق) + 10 (جديد) = 30
      expect(prisma.warehouseItem.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            quantity: 30,
            availableQty: 30,
          }),
        }),
      );
    });

    // اختبار حالة نجاح حركة الإخراج (OUT)
    it('يجب أن تنشئ حركة إخراج (OUT) بنجاح وتحدث رصيد المخزون', async () => {
      // محاكاة وجود رصيد كافٍ
      prisma.warehouseItem.findUnique.mockResolvedValue(mockWarehouseItem); // 20

      const result = await service.create(mockMovementOut); // 5

      expect(result).toEqual(mockMovementResult);
      expect(prisma.stockMovement.create).toHaveBeenCalled();
      // يجب أن يتم تحديث الرصيد: 20 (سابق) - 5 (جديد) = 15
      expect(prisma.warehouseItem.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            quantity: 15,
            availableQty: 15,
          }),
        }),
      );
    });

    // اختبار حالة نجاح حركة التسوية (ADJUSTMENT)
    it('يجب أن تنشئ حركة تسوية (ADJUSTMENT) بنجاح وتحدث رصيد المخزون', async () => {
      // محاكاة وجود رصيد سابق
      prisma.warehouseItem.findUnique.mockResolvedValue(mockWarehouseItem); // 20

      const result = await service.create(mockMovementAdjustment); // 2

      expect(result).toEqual(mockMovementResult);
      expect(prisma.stockMovement.create).toHaveBeenCalled();
      // يجب أن يتم تحديث الرصيد: 20 (سابق) + 2 (جديد) = 22
      expect(prisma.warehouseItem.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            quantity: 22,
            availableQty: 22,
          }),
        }),
      );
    });

    // اختبار حالة إنشاء رصيد جديد (IN) عندما لا يكون الصنف موجوداً في المستودع
    it('يجب أن تنشئ رصيد مستودع جديد (warehouseItem) لحركة IN إذا لم يكن موجوداً', async () => {
      // محاكاة عدم وجود رصيد سابق
      prisma.warehouseItem.findUnique.mockResolvedValue(null);

      await service.create(mockMovementIn);

      expect(prisma.warehouseItem.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            quantity: mockMovementIn.quantity,
            availableQty: mockMovementIn.quantity,
          }),
        }),
      );
      expect(prisma.warehouseItem.update).not.toHaveBeenCalled();
    });

    // اختبار حالة فشل: المستودع غير موجود
    it('يجب أن تطلق NotFoundException إذا كان المستودع غير موجود', async () => {
      prisma.warehouse.findUnique.mockResolvedValue(null);

      await expect(service.create(mockMovementIn)).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.item.findUnique).not.toHaveBeenCalled();
    });

    // اختبار حالة فشل: الصنف غير موجود
    it('يجب أن تطلق NotFoundException إذا كان الصنف غير موجود', async () => {
      prisma.item.findUnique.mockResolvedValue(null);

      await expect(service.create(mockMovementIn)).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.stockMovement.create).not.toHaveBeenCalled();
    });

    // اختبار حالة فشل: رصيد غير كافٍ لحركة الإخراج (OUT)
    it('يجب أن تطلق BadRequestException إذا كان الرصيد غير كافٍ لحركة OUT', async () => {
      // محاكاة وجود رصيد قليل (5) ومحاولة إخراج (10)
      prisma.warehouseItem.findUnique.mockResolvedValue({
        ...mockWarehouseItem,
        quantity: 5,
      });
      const largeOutMovement: CreateStockMovementDto = {
        ...mockMovementOut,
        quantity: 10,
      };

      await expect(service.create(largeOutMovement)).rejects.toThrow(
        BadRequestException,
      );
      expect(prisma.warehouseItem.update).not.toHaveBeenCalled();
    });

    // اختبار حالة فشل: محاولة إخراج (OUT) لصنف غير موجود في المستودع
    it('يجب أن تطلق BadRequestException لمحاولة OUT لصنف غير موجود في المستودع', async () => {
      // محاكاة عدم وجود رصيد سابق
      prisma.warehouseItem.findUnique.mockResolvedValue(null);

      await expect(service.create(mockMovementOut)).rejects.toThrow(
        BadRequestException,
      );
      expect(prisma.warehouseItem.create).not.toHaveBeenCalled();
    });
  });

  // =========================================================================
  // اختبار دالة findAll (جلب جميع الحركات)
  // =========================================================================
  describe('findAll', () => {
    it('يجب أن تعيد قائمة بجميع حركات المخزون', async () => {
      const movementsList = [mockMovementResult, { ...mockMovementResult, id: 'mov2' }];
      prisma.stockMovement.findMany.mockResolvedValue(movementsList);

      const result = await service.findAll();

      expect(result).toEqual(movementsList);
      expect(prisma.stockMovement.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { movementDate: 'desc' },
        }),
      );
    });
  });

  // =========================================================================
  // اختبار دالة findOne (جلب حركة واحدة)
  // =========================================================================
  describe('findOne', () => {
    // اختبار حالة نجاح: جلب حركة موجودة
    it('يجب أن تعيد حركة المخزون المطلوبة إذا كانت موجودة', async () => {
      prisma.stockMovement.findUnique.mockResolvedValue(mockMovementResult);

      const result = await service.findOne('mov1');

      expect(result).toEqual(mockMovementResult);
      expect(prisma.stockMovement.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'mov1' },
        }),
      );
    });

    // اختبار حالة فشل: الحركة غير موجودة
    it('يجب أن تطلق NotFoundException إذا كانت الحركة غير موجودة', async () => {
      prisma.stockMovement.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // =========================================================================
  // اختبار دالة findByWarehouse (جلب حركات مستودع)
  // =========================================================================
  describe('findByWarehouse', () => {
    it('يجب أن تعيد قائمة حركات المستودع المحدد', async () => {
      const warehouseMovements = [mockMovementResult];
      prisma.stockMovement.findMany.mockResolvedValue(warehouseMovements);

      const result = await service.findByWarehouse('wh1');

      expect(result).toEqual(warehouseMovements);
      expect(prisma.stockMovement.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { warehouseId: 'wh1' },
        }),
      );
    });
  });

  // =========================================================================
  // اختبار دالة findByItem (جلب حركات صنف)
  // =========================================================================
  describe('findByItem', () => {
    it('يجب أن تعيد قائمة حركات الصنف المحدد', async () => {
      const itemMovements = [mockMovementResult];
      prisma.stockMovement.findMany.mockResolvedValue(itemMovements);

      const result = await service.findByItem('item1');

      expect(result).toEqual(itemMovements);
      expect(prisma.stockMovement.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { itemId: 'item1' },
        }),
      );
    });
  });
});
