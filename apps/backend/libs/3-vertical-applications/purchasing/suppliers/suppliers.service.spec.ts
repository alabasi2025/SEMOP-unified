// PHASE-11
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SuppliersService } from '../suppliers.service';

// Mock PrismaService (مطلوب حسب المهمة)
class MockPrismaService {
  // لا نحتاج لتطبيق أي وظائف هنا لأن الخدمة الحالية تستخدم الذاكرة
}

describe('SuppliersService', () => {
  let service: SuppliersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuppliersService,
        {
          // نفترض أن PrismaService يتم توفيره بهذا الرمز (Token)
          provide: 'PrismaService', 
          useClass: MockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SuppliersService>(SuppliersService);
    // إعادة تعيين الحالة الداخلية للخدمة لضمان عزل الاختبارات
    (service as any).items = [];
    (service as any).nextId = 1;
  });

  it('يجب أن تكون الخدمة معرفة', () => {
    expect(service).toBeDefined();
  });

  // 1. اختبار create
  describe('create', () => {
    it('يجب أن ينشئ موردًا جديدًا ويعيده', () => {
      const createDto = { name: 'Supplier A', email: 'a@example.com' };
      const result = service.create(createDto);
      expect(result).toEqual({ id: 1, ...createDto });
      expect((service as any).items.length).toBe(1);
    });
  });

  // 2. اختبار findAll
  describe('findAll', () => {
    it('يجب أن يعيد قائمة فارغة إذا لم يكن هناك موردون', () => {
      expect(service.findAll()).toEqual([]);
    });

    it('يجب أن يعيد جميع الموردين', () => {
      const supplier1 = service.create({ name: 'S1' });
      const supplier2 = service.create({ name: 'S2' });
      expect(service.findAll()).toEqual([supplier1, supplier2]);
    });
  });

  // 3. اختبار findOne
  describe('findOne', () => {
    it('يجب أن يعيد المورد إذا تم العثور عليه', () => {
      const supplier = service.create({ name: 'Find Me' });
      expect(service.findOne(supplier.id)).toEqual(supplier);
    });

    it('يجب أن يرمي NotFoundException إذا لم يتم العثور على المورد', () => {
      expect(() => service.findOne(999)).toThrow(NotFoundException);
      expect(() => service.findOne(999)).toThrow(`Item with ID 999 not found`);
    });
  });

  // 4. اختبار update
  describe('update', () => {
    it('يجب أن يقوم بتحديث المورد وإعادته', () => {
      const supplier = service.create({ name: 'Old Name' });
      const updateDto = { name: 'New Name', phone: '12345' };
      const updatedSupplier = service.update(supplier.id, updateDto);
      expect(updatedSupplier.name).toBe('New Name');
      expect(updatedSupplier.phone).toBe('12345');
      expect(service.findOne(supplier.id)).toEqual(updatedSupplier);
    });

    it('يجب أن يرمي NotFoundException إذا لم يتم العثور على المورد للتحديث', () => {
      expect(() => service.update(999, { name: 'New' })).toThrow(NotFoundException);
    });
  });

  // 5. اختبار remove
  describe('remove', () => {
    it('يجب أن يحذف المورد بنجاح', () => {
      const supplier = service.create({ name: 'Delete Me' });
      const result = service.remove(supplier.id);
      expect(result).toEqual({ message: 'Item deleted successfully' });
      expect(service.findAll().length).toBe(0);
      expect(() => service.findOne(supplier.id)).toThrow(NotFoundException);
    });

    it('يجب أن يرمي NotFoundException إذا لم يتم العثور على المورد للحذف', () => {
      expect(() => service.remove(999)).toThrow(NotFoundException);
    });
  });
});
