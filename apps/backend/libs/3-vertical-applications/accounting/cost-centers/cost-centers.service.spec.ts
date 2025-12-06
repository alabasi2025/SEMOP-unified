// PHASE-11

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CostCentersService } from './cost-centers.service';

// ملاحظة: الخدمة تستخدم بيانات داخل الذاكرة (In-Memory Data) ولا تعتمد على PrismaService.
// لذلك، تم تجاهل متطلب Mocking PrismaService لأنه غير قابل للتطبيق على الكود الفعلي.

describe('CostCentersService', () => {
  let service: CostCentersService;

  // بيانات أولية لضمان استقلالية الاختبارات
  const initialCostCenters = [
    {
      id: '1',
      code: 'CC-001',
      nameAr: 'مركز تكلفة المبيعات',
      nameEn: 'Sales Cost Center',
      description: 'مركز تكلفة خاص بقسم المبيعات',
      isActive: true,
      createdAt: '2025-01-01',
    },
    {
      id: '2',
      code: 'CC-002',
      nameAr: 'مركز تكلفة الإنتاج',
      nameEn: 'Production Cost Center',
      description: 'مركز تكلفة خاص بقسم الإنتاج',
      isActive: true,
      createdAt: '2025-01-01',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CostCentersService],
    }).compile();

    service = module.get<CostCentersService>(CostCentersService);
    
    // إعادة تعيين الحالة الداخلية للخدمة قبل كل اختبار لضمان العزل
    (service as any).costCenters = JSON.parse(JSON.stringify(initialCostCenters));
    (service as any).nextId = 3; // يجب أن يبدأ الـ ID التالي من 3
  });

  it('يجب أن يتم تعريف الخدمة', () => {
    expect(service).toBeDefined();
  });

  // -------------------------------------------------------------------
  // اختبارات create
  // -------------------------------------------------------------------
  describe('create', () => {
    it('يجب أن ينشئ مركز تكلفة جديد ويعيده', () => {
      const newCenterData = {
        code: 'CC-003',
        nameAr: 'مركز تكلفة جديد',
        nameEn: 'New Cost Center',
        isActive: false,
      };
      const result = service.create(newCenterData);
      
      expect(result).toBeDefined();
      expect(result.id).toBe('3');
      expect(result.code).toBe('CC-003');
      expect(result.isActive).toBe(false);
      expect((service as any).costCenters.length).toBe(3);
    });

    it('يجب أن يعين قيم افتراضية للحقول الاختيارية', () => {
      const newCenterData = {
        code: 'CC-004',
        nameAr: 'مركز تكلفة آخر',
      };
      const result = service.create(newCenterData);
      
      expect(result.id).toBe('3');
      expect(result.nameEn).toBe('');
      expect(result.description).toBe('');
      expect(result.isActive).toBe(true); // القيمة الافتراضية هي true
    });
  });

  // -------------------------------------------------------------------
  // اختبارات findAll
  // -------------------------------------------------------------------
  describe('findAll', () => {
    it('يجب أن يعيد جميع مراكز التكلفة غير المحذوفة', () => {
      const result = service.findAll();
      expect(result.length).toBe(2);
      expect(result).toEqual(initialCostCenters);
    });

    it('يجب أن يستثني مراكز التكلفة المحذوفة (Soft Deleted)', () => {
      // حذف مركز تكلفة
      service.remove('1');
      const result = service.findAll();
      
      expect(result.length).toBe(1);
      expect(result.some(cc => cc.id === '1')).toBe(false);
      expect(result.some(cc => cc.id === '2')).toBe(true);
    });
  });

  // -------------------------------------------------------------------
  // اختبارات findOne
  // -------------------------------------------------------------------
  describe('findOne', () => {
    it('يجب أن يعيد مركز تكلفة موجود', () => {
      const result = service.findOne('1');
      expect(result.id).toBe('1');
      expect(result.code).toBe('CC-001');
    });

    it('يجب أن يرمي NotFoundException إذا كان ID غير موجود', () => {
      expect(() => service.findOne('999')).toThrow(NotFoundException);
      expect(() => service.findOne('999')).toThrow('Cost Center with ID 999 not found');
    });

    it('يجب أن يرمي NotFoundException إذا كان مركز التكلفة محذوفًا (Soft Deleted)', () => {
      service.remove('2');
      expect(() => service.findOne('2')).toThrow(NotFoundException);
    });
  });

  // -------------------------------------------------------------------
  // اختبارات update
  // -------------------------------------------------------------------
  describe('update', () => {
    const updateData = { nameAr: 'اسم محدث', isActive: false };

    it('يجب أن يحدث مركز تكلفة موجود ويعيده', () => {
      const result = service.update('1', updateData);
      
      expect(result.id).toBe('1');
      expect(result.nameAr).toBe('اسم محدث');
      expect(result.isActive).toBe(false);
      expect(result.code).toBe('CC-001'); // يجب أن يبقى الكود كما هو
    });

    it('يجب أن يرمي NotFoundException إذا كان ID غير موجود', () => {
      expect(() => service.update('999', updateData)).toThrow(NotFoundException);
    });
  });

  // -------------------------------------------------------------------
  // اختبارات remove
  // -------------------------------------------------------------------
  describe('remove', () => {
    it('يجب أن يقوم بالحذف الناعم (Soft Delete) لمركز تكلفة موجود', () => {
      const result = service.remove('1');
      
      expect(result.id).toBe('1');
      expect(result['isDeleted']).toBe(true);
      
      // التحقق من أن findOne لا يجده
      expect(() => service.findOne('1')).toThrow(NotFoundException);
    });

    it('يجب أن يرمي NotFoundException إذا كان ID غير موجود', () => {
      expect(() => service.remove('999')).toThrow(NotFoundException);
    });
  });
});
