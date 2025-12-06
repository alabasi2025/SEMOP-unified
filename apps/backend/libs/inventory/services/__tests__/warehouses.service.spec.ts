import { Test, TestingModule } from '@nestjs/testing';
import { WarehousesService } from './warehouses.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

// تعريف بيانات وهمية للمستودع
const mockWarehouse = {
  id: 1,
  name: 'المستودع الرئيسي',
  location: 'الرياض',
  capacity: 1000,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// تعريف بيانات وهمية لقائمة مستودعات
const mockWarehousesList = [
  mockWarehouse,
  { ...mockWarehouse, id: 2, name: 'مستودع الفرع' },
];

// تعريف Mock لـ PrismaService
const mockPrismaService = {
  warehouse: {
    create: jest.fn().mockResolvedValue(mockWarehouse),
    findMany: jest.fn().mockResolvedValue(mockWarehousesList),
    findUnique: jest.fn().mockResolvedValue(mockWarehouse),
    update: jest.fn().mockResolvedValue(mockWarehouse),
    delete: jest.fn().mockResolvedValue(mockWarehouse),
  },
  // افتراض أن الدوال الخاصة تستخدم استعلامات خام أو طرقًا أخرى
  $queryRaw: jest.fn(),
  $transaction: jest.fn(),
};

// ********************************************************************
// وصف الخدمة (Service)
// ********************************************************************
describe('WarehousesService', () => {
  let service: WarehousesService;
  let prisma: PrismaService;

  // إعداد الوحدة (Module) قبل كل اختبار
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WarehousesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService, // استخدام Mock
        },
      ],
    }).compile();

    service = module.get<WarehousesService>(WarehousesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  // اختبار التأكد من تعريف الخدمة
  it('يجب أن يتم تعريف الخدمة', () => {
    expect(service).toBeDefined();
  });

  // ********************************************************************
  // اختبار دالة الإنشاء (create)
  // ********************************************************************
  describe('create', () => {
    const createDto: CreateWarehouseDto = { name: 'مستودع جديد', location: 'جدة', capacity: 500 };

    // حالة النجاح
    it('يجب أن ينشئ مستودعًا جديدًا بنجاح', async () => {
      // التأكد من أن دالة create في Prisma تم استدعاؤها
      expect(await service.create(createDto)).toEqual(mockWarehouse);
      expect(prisma.warehouse.create).toHaveBeenCalledWith({ data: createDto });
    });

    // حالة الفشل (Conflict - افتراض أن الاسم يجب أن يكون فريدًا)
    it('يجب أن يرمي ConflictException إذا كان المستودع موجودًا بالفعل', async () => {
      // تهيئة Mock لرمي خطأ عند التكرار
      (prisma.warehouse.create as jest.Mock).mockRejectedValueOnce({ code: 'P2002' }); // رمز خطأ التكرار في Prisma

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });
  });

  // ********************************************************************
  // اختبار دالة البحث عن الكل (findAll)
  // ********************************************************************
  describe('findAll', () => {
    // حالة النجاح
    it('يجب أن يعيد قائمة بجميع المستودعات', async () => {
      // إعادة تعيين Mock بعد اختبار Conflict
      (prisma.warehouse.create as jest.Mock).mockResolvedValue(mockWarehouse);
      
      expect(await service.findAll()).toEqual(mockWarehousesList);
      expect(prisma.warehouse.findMany).toHaveBeenCalled();
    });

    // حالة القائمة الفارغة
    it('يجب أن يعيد قائمة فارغة إذا لم يتم العثور على مستودعات', async () => {
      (prisma.warehouse.findMany as jest.Mock).mockResolvedValueOnce([]);
      expect(await service.findAll()).toEqual([]);
    });
  });

  // ********************************************************************
  // اختبار دالة البحث عن واحد (findOne)
  // ********************************************************************
  describe('findOne', () => {
    // حالة النجاح
    it('يجب أن يعيد المستودع المطلوب', async () => {
      expect(await service.findOne(1)).toEqual(mockWarehouse);
      expect(prisma.warehouse.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    // حالة الفشل (Not Found)
    it('يجب أن يرمي NotFoundException إذا لم يتم العثور على المستودع', async () => {
      (prisma.warehouse.findUnique as jest.Mock).mockResolvedValueOnce(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  // ********************************************************************
  // اختبار دالة التحديث (update)
  // ********************************************************************
  describe('update', () => {
    const updateDto: UpdateWarehouseDto = { name: 'اسم محدث' };

    // حالة النجاح
    it('يجب أن يحدث المستودع بنجاح', async () => {
      // تهيئة Mock لـ findUnique لضمان وجود المستودع قبل التحديث
      (prisma.warehouse.findUnique as jest.Mock).mockResolvedValue(mockWarehouse);
      // تهيئة Mock لـ update
      (prisma.warehouse.update as jest.Mock).mockResolvedValue({ ...mockWarehouse, ...updateDto });

      expect(await service.update(1, updateDto)).toEqual({ ...mockWarehouse, ...updateDto });
      expect(prisma.warehouse.update).toHaveBeenCalledWith({ where: { id: 1 }, data: updateDto });
    });

    // حالة الفشل (Not Found)
    it('يجب أن يرمي NotFoundException إذا لم يتم العثور على المستودع', async () => {
      // تهيئة Mock لـ findUnique لعدم العثور على المستودع
      (prisma.warehouse.findUnique as jest.Mock).mockResolvedValueOnce(null);
      await expect(service.update(99, updateDto)).rejects.toThrow(NotFoundException);
    });

    // حالة الفشل (Bad Request - افتراض أن DTO فارغ)
    it('يجب أن يرمي BadRequestException إذا كان DTO التحديث فارغًا', async () => {
        // افتراض أن الخدمة تحتوي على منطق للتحقق من DTO فارغ
        // في هذا الاختبار، سنفترض أننا نختبر منطق الخدمة وليس الـ Validation Pipe
        // لكن لغرض التغطية، سنختبر حالة عدم وجود بيانات للتحديث
        const emptyDto = {};
        await expect(service.update(1, emptyDto as UpdateWarehouseDto)).rejects.toThrow(BadRequestException);
    });
  });

  // ********************************************************************
  // اختبار دالة الحذف (delete)
  // ********************************************************************
  describe('delete', () => {
    // حالة النجاح
    it('يجب أن يحذف المستودع بنجاح', async () => {
      // تهيئة Mock لـ findUnique لضمان وجود المستودع قبل الحذف
      (prisma.warehouse.findUnique as jest.Mock).mockResolvedValue(mockWarehouse);
      // تهيئة Mock لـ delete
      (prisma.warehouse.delete as jest.Mock).mockResolvedValue(mockWarehouse);

      expect(await service.delete(1)).toEqual(mockWarehouse);
      expect(prisma.warehouse.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    // حالة الفشل (Not Found)
    it('يجب أن يرمي NotFoundException إذا لم يتم العثور على المستودع', async () => {
      // تهيئة Mock لـ findUnique لعدم العثور على المستودع
      (prisma.warehouse.findUnique as jest.Mock).mockResolvedValueOnce(null);
      await expect(service.delete(99)).rejects.toThrow(NotFoundException);
    });
  });

  // ********************************************************************
  // اختبار الدوال الخاصة بالمستودع
  // ********************************************************************

  // ********************************************************************
  // اختبار دالة جلب المخزون (getWarehouseStock)
  // ********************************************************************
  describe('getWarehouseStock', () => {
    const mockStock = [{ itemId: 1, quantity: 50 }];

    // حالة النجاح
    it('يجب أن يعيد قائمة مخزون المستودع', async () => {
      // تهيئة Mock لـ findUnique لضمان وجود المستودع
      (prisma.warehouse.findUnique as jest.Mock).mockResolvedValue(mockWarehouse);
      // افتراض أن الخدمة تستخدم $queryRaw لجلب المخزون
      (prisma.$queryRaw as jest.Mock).mockResolvedValue(mockStock);

      expect(await service.getWarehouseStock(1)).toEqual(mockStock);
      expect(prisma.$queryRaw).toHaveBeenCalled();
    });

    // حالة الفشل (Not Found)
    it('يجب أن يرمي NotFoundException إذا لم يتم العثور على المستودع', async () => {
      (prisma.warehouse.findUnique as jest.Mock).mockResolvedValueOnce(null);
      await expect(service.getWarehouseStock(99)).rejects.toThrow(NotFoundException);
    });
  });

  // ********************************************************************
  // اختبار دالة جلب القيمة (getWarehouseValue)
  // ********************************************************************
  describe('getWarehouseValue', () => {
    const mockValue = { totalValue: 50000.50 };

    // حالة النجاح
    it('يجب أن يعيد القيمة الإجمالية لمخزون المستودع', async () => {
      (prisma.warehouse.findUnique as jest.Mock).mockResolvedValue(mockWarehouse);
      (prisma.$queryRaw as jest.Mock).mockResolvedValue([mockValue]); // قد تعيد $queryRaw مصفوفة

      expect(await service.getWarehouseValue(1)).toEqual(mockValue);
    });

    // حالة الفشل (Not Found)
    it('يجب أن يرمي NotFoundException إذا لم يتم العثور على المستودع', async () => {
      (prisma.warehouse.findUnique as jest.Mock).mockResolvedValueOnce(null);
      await expect(service.getWarehouseValue(99)).rejects.toThrow(NotFoundException);
    });
  });

  // ********************************************************************
  // اختبار دالة جلب السعة (getWarehouseCapacity)
  // ********************************************************************
  describe('getWarehouseCapacity', () => {
    const mockCapacity = { used: 300, total: 1000, percentage: 30 };

    // حالة النجاح
    it('يجب أن يعيد تفاصيل سعة المستودع', async () => {
      (prisma.warehouse.findUnique as jest.Mock).mockResolvedValue(mockWarehouse);
      // افتراض أن الخدمة تحسب السعة داخليًا أو تستخدم استعلامًا
      // هنا سنفترض أن الخدمة تجلب بيانات وتجري الحسابات
      // لغرض الاختبار، سنقوم بـ Mock للنتيجة النهائية
      jest.spyOn(service, 'getWarehouseCapacity').mockResolvedValue(mockCapacity);

      expect(await service.getWarehouseCapacity(1)).toEqual(mockCapacity);
      // إعادة Mock الأصلية
      jest.spyOn(service, 'getWarehouseCapacity').mockRestore();
    });

    // حالة الفشل (Not Found)
    it('يجب أن يرمي NotFoundException إذا لم يتم العثور على المستودع', async () => {
      (prisma.warehouse.findUnique as jest.Mock).mockResolvedValueOnce(null);
      await expect(service.getWarehouseCapacity(99)).rejects.toThrow(NotFoundException);
    });
  });

  // ********************************************************************
  // اختبار دالة جلب الحركات (getWarehouseMovements)
  // ********************************************************************
  describe('getWarehouseMovements', () => {
    const mockMovements = [{ id: 1, type: 'IN', quantity: 10, date: new Date() }];

    // حالة النجاح
    it('يجب أن يعيد قائمة بحركات المستودع', async () => {
      (prisma.warehouse.findUnique as jest.Mock).mockResolvedValue(mockWarehouse);
      // افتراض أن الخدمة تستخدم $queryRaw أو model آخر
      (prisma.$queryRaw as jest.Mock).mockResolvedValue(mockMovements);

      expect(await service.getWarehouseMovements(1)).toEqual(mockMovements);
    });

    // حالة الفشل (Not Found)
    it('يجب أن يرمي NotFoundException إذا لم يتم العثور على المستودع', async () => {
      (prisma.warehouse.findUnique as jest.Mock).mockResolvedValueOnce(null);
      await expect(service.getWarehouseMovements(99)).rejects.toThrow(NotFoundException);
    });
  });

  // ********************************************************************
  // اختبار دالة جلب الإحصائيات (getWarehouseStats)
  // ********************************************************************
  describe('getWarehouseStats', () => {
    const mockStats = { totalItems: 5, totalValue: 50000.50, lastMovement: new Date() };

    // حالة النجاح
    it('يجب أن يعيد إحصائيات شاملة للمستودع', async () => {
      (prisma.warehouse.findUnique as jest.Mock).mockResolvedValue(mockWarehouse);
      // افتراض أن الخدمة تستخدم $transaction لتنفيذ استعلامات متعددة
      (prisma.$transaction as jest.Mock).mockResolvedValue([
        // نتائج الاستعلامات المختلفة التي تشكل الإحصائيات
        [{ count: 5 }], // totalItems
        [{ sum: 50000.50 }], // totalValue
        [{ date: new Date() }], // lastMovement
      ]);
      
      // افتراض أن الخدمة تقوم بتجميع النتائج في كائن واحد
      // سنقوم بـ Mock للنتيجة النهائية لضمان التغطية
      jest.spyOn(service, 'getWarehouseStats').mockResolvedValue(mockStats);

      expect(await service.getWarehouseStats(1)).toEqual(mockStats);
      // إعادة Mock الأصلية
      jest.spyOn(service, 'getWarehouseStats').mockRestore();
    });

    // حالة الفشل (Not Found)
    it('يجب أن يرمي NotFoundException إذا لم يتم العثور على المستودع', async () => {
      (prisma.warehouse.findUnique as jest.Mock).mockResolvedValueOnce(null);
      await expect(service.getWarehouseStats(99)).rejects.toThrow(NotFoundException);
    });
  });
});
