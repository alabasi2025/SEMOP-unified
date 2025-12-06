import { Test, TestingModule } from '@nestjs/testing';
import { StockCountService } from './stock-count.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';

// تعريف Mock لخدمة Prisma
// هذا Mock يحاكي سلوك PrismaClient
const mockPrismaService = {
  stockCount: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  stockCountRecord: {
    createMany: jest.fn(),
    findMany: jest.fn(),
  },
  $transaction: jest.fn((callback) => callback(mockPrismaService)), // لمحاكاة المعاملات
};

// بيانات وهمية للاختبار
const mockCount = {
  id: 1,
  warehouseId: 101,
  status: 'PENDING',
  createdAt: new Date(),
  updatedAt: new Date(),
  isCompleted: false,
};

const mockCountRecord = {
  id: 1,
  countId: 1,
  itemId: 500,
  countedQuantity: 10,
  systemQuantity: 12,
  difference: -2,
};

describe('StockCountService', () => {
  let service: StockCountService;
  let prisma: typeof mockPrismaService;

  // إعداد وحدة الاختبار قبل كل اختبار
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockCountService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<StockCountService>(StockCountService);
    // التأكد من أننا نستخدم الـ Mock الذي قمنا بتعريفه
    prisma = module.get<PrismaService>(PrismaService) as unknown as typeof mockPrismaService;
    // إعادة تعيين Mock قبل كل اختبار لضمان استقلالية الاختبارات
    jest.clearAllMocks();
  });

  it('يجب أن يتم تعريف الخدمة بنجاح', () => {
    // التحقق من أن الخدمة موجودة وتم تهيئتها
    expect(service).toBeDefined();
  });

  // اختبار دالة إنشاء جرد جديد
  describe('createCount', () => {
    const createDto = { warehouseId: 101, notes: 'جرد ربع سنوي' };

    it('يجب أن ينشئ جردًا جديدًا بنجاح', async () => {
      // تهيئة الـ Mock لـ create ليعيد كائن الجرد الوهمي
      prisma.stockCount.create.mockResolvedValue(mockCount);

      const result = await service.createCount(createDto as any);

      // التحقق من استدعاء دالة create مرة واحدة بالبيانات الصحيحة
      expect(prisma.stockCount.create).toHaveBeenCalledWith({
        data: {
          warehouseId: createDto.warehouseId,
          notes: createDto.notes,
          status: 'PENDING',
        },
      });
      // التحقق من أن النتيجة هي كائن الجرد الوهمي
      expect(result).toEqual(mockCount);
    });

    it('يجب أن يرمي ConflictException إذا كان هناك جرد معلق لنفس المستودع', async () => {
      // في سيناريو حقيقي، قد نحتاج إلى التحقق من وجود جرد معلق قبل الإنشاء،
      // لكن هنا نحاكي خطأ في قاعدة البيانات (مثل Unique Constraint) أو منطق الخدمة
      prisma.stockCount.create.mockRejectedValue(new Error('Unique constraint failed'));

      // التحقق من أن الدالة ترمي الاستثناء المتوقع
      await expect(service.createCount(createDto as any)).rejects.toThrow(ConflictException);
    });
  });

  // اختبار دالة إضافة سجلات الجرد
  describe('addCountRecords', () => {
    const countId = 1;
    const recordsDto = [{ itemId: 500, countedQuantity: 10 }];

    it('يجب أن يضيف سجلات الجرد بنجاح', async () => {
      // تهيئة الـ Mock لـ findUnique ليعيد كائن الجرد (موجود)
      prisma.stockCount.findUnique.mockResolvedValue(mockCount);
      // تهيئة الـ Mock لـ createMany ليعيد عدد السجلات التي تم إنشاؤها
      prisma.stockCountRecord.createMany.mockResolvedValue({ count: 1 });

      const result = await service.addCountRecords(countId, recordsDto as any);

      // التحقق من استدعاء findUnique للتحقق من وجود الجرد
      expect(prisma.stockCount.findUnique).toHaveBeenCalledWith({ where: { id: countId } });
      // التحقق من استدعاء createMany
      expect(prisma.stockCountRecord.createMany).toHaveBeenCalled();
      // التحقق من أن النتيجة صحيحة
      expect(result).toEqual({ count: 1 });
    });

    it('يجب أن يرمي NotFoundException إذا لم يتم العثور على الجرد', async () => {
      // تهيئة الـ Mock لـ findUnique ليعيد null (غير موجود)
      prisma.stockCount.findUnique.mockResolvedValue(null);

      // التحقق من أن الدالة ترمي NotFoundException
      await expect(service.addCountRecords(countId, recordsDto as any)).rejects.toThrow(NotFoundException);
      await expect(service.addCountRecords(countId, recordsDto as any)).rejects.toThrow('لم يتم العثور على عملية الجرد.');
    });

    it('يجب أن يرمي BadRequestException إذا كانت عملية الجرد مكتملة', async () => {
      // تهيئة الـ Mock لـ findUnique ليعيد كائن جرد مكتمل
      prisma.stockCount.findUnique.mockResolvedValue({ ...mockCount, isCompleted: true });

      // التحقق من أن الدالة ترمي BadRequestException
      await expect(service.addCountRecords(countId, recordsDto as any)).rejects.toThrow(BadRequestException);
      await expect(service.addCountRecords(countId, recordsDto as any)).rejects.toThrow('لا يمكن إضافة سجلات إلى جرد مكتمل.');
    });
  });

  // اختبار دالة حساب الفروقات
  describe('calculateDifferences', () => {
    const countId = 1;

    it('يجب أن يحسب الفروقات ويحدث السجلات بنجاح', async () => {
      // تهيئة الـ Mock لـ findUnique ليعيد كائن الجرد
      prisma.stockCount.findUnique.mockResolvedValue(mockCount);
      // تهيئة الـ Mock لـ findMany ليعيد سجلات الجرد
      prisma.stockCountRecord.findMany.mockResolvedValue([
        { id: 1, itemId: 500, countedQuantity: 10, systemQuantity: 0 },
      ] as any);
      // تهيئة الـ Mock لـ $transaction
      prisma.$transaction.mockImplementation(async (callback) => {
        // محاكاة منطق تحديث السجلات داخل المعاملة
        const updatedRecords = [{ id: 1, itemId: 500, countedQuantity: 10, systemQuantity: 12, difference: -2 }];
        return updatedRecords;
      });

      const result = await service.calculateDifferences(countId);

      // التحقق من استدعاء findUnique
      expect(prisma.stockCount.findUnique).toHaveBeenCalledWith({ where: { id: countId } });
      // التحقق من استدعاء $transaction
      expect(prisma.$transaction).toHaveBeenCalled();
      // التحقق من أن النتيجة هي قائمة السجلات المحدثة (افتراضًا)
      expect(result).toBeDefined();
    });

    it('يجب أن يرمي NotFoundException إذا لم يتم العثور على الجرد', async () => {
      prisma.stockCount.findUnique.mockResolvedValue(null);

      await expect(service.calculateDifferences(countId)).rejects.toThrow(NotFoundException);
    });
  });

  // اختبار دالة إكمال الجرد
  describe('completeCount', () => {
    const countId = 1;

    it('يجب أن يكمل الجرد ويحدث حالته بنجاح', async () => {
      // تهيئة الـ Mock لـ findUnique ليعيد كائن الجرد المعلق
      prisma.stockCount.findUnique.mockResolvedValue(mockCount);
      // تهيئة الـ Mock لـ update ليعيد كائن الجرد المكتمل
      prisma.stockCount.update.mockResolvedValue({ ...mockCount, status: 'COMPLETED', isCompleted: true });

      const result = await service.completeCount(countId);

      // التحقق من استدعاء findUnique
      expect(prisma.stockCount.findUnique).toHaveBeenCalledWith({ where: { id: countId } });
      // التحقق من استدعاء update لتغيير الحالة
      expect(prisma.stockCount.update).toHaveBeenCalledWith({
        where: { id: countId },
        data: { status: 'COMPLETED', isCompleted: true },
      });
      // التحقق من أن النتيجة هي كائن الجرد المكتمل
      expect(result.isCompleted).toBe(true);
    });

    it('يجب أن يرمي NotFoundException إذا لم يتم العثور على الجرد', async () => {
      prisma.stockCount.findUnique.mockResolvedValue(null);

      await expect(service.completeCount(countId)).rejects.toThrow(NotFoundException);
    });

    it('يجب أن يرمي ConflictException إذا كان الجرد مكتملًا بالفعل', async () => {
      // تهيئة الـ Mock لـ findUnique ليعيد كائن جرد مكتمل
      prisma.stockCount.findUnique.mockResolvedValue({ ...mockCount, isCompleted: true, status: 'COMPLETED' });

      await expect(service.completeCount(countId)).rejects.toThrow(ConflictException);
      await expect(service.completeCount(countId)).rejects.toThrow('عملية الجرد مكتملة بالفعل.');
    });
  });

  // اختبار دالة الحصول على تقرير الجرد
  describe('getCountReport', () => {
    const countId = 1;

    it('يجب أن يعيد تقرير الجرد بنجاح', async () => {
      // تهيئة الـ Mock لـ findUnique ليعيد كائن الجرد مع السجلات
      prisma.stockCount.findUnique.mockResolvedValue({
        ...mockCount,
        records: [mockCountRecord],
      } as any);

      const result = await service.getCountReport(countId);

      // التحقق من استدعاء findUnique مع تضمين السجلات
      expect(prisma.stockCount.findUnique).toHaveBeenCalledWith({
        where: { id: countId },
        include: { records: true }, // افتراض أن السجلات يتم تضمينها
      });
      // التحقق من أن النتيجة تحتوي على السجلات
      expect(result.records).toHaveLength(1);
      expect(result.id).toBe(countId);
    });

    it('يجب أن يرمي NotFoundException إذا لم يتم العثور على الجرد', async () => {
      prisma.stockCount.findUnique.mockResolvedValue(null);

      await expect(service.getCountReport(countId)).rejects.toThrow(NotFoundException);
    });
  });
});
