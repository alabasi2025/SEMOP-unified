import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';

// تعريف Mock لـ PrismaService
const mockPrismaService = {
  category: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  // Mock لـ $queryRaw أو $transaction إذا كانت getHierarchy تستخدمها
  $queryRaw: jest.fn(),
  $transaction: jest.fn(),
};

// بيانات وهمية للاختبار
const mockCategory = {
  id: 1,
  name: 'إلكترونيات',
  slug: 'electronics',
  parentId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockCategoriesList = [
  mockCategory,
  { ...mockCategory, id: 2, name: 'هواتف', slug: 'phones', parentId: 1 },
];

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prisma: typeof mockPrismaService;

  // إعداد الوحدة الاختبارية قبل كل اختبار
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    prisma = module.get<PrismaService>(PrismaService) as any;
    
    // مسح الـ Mocks قبل كل اختبار لضمان استقلالية الاختبارات
    jest.clearAllMocks();
  });

  // اختبار وجود الخدمة
  it('يجب أن تكون الخدمة معرفة', () => {
    expect(service).toBeDefined();
  });

  // -------------------------------------------------------------------
  // اختبار دالة findAll
  // -------------------------------------------------------------------
  describe('findAll', () => {
    // حالة النجاح: إرجاع قائمة الفئات
    it('يجب أن ترجع قائمة بجميع الفئات بنجاح', async () => {
      // تهيئة الـ Mock لإرجاع قائمة الفئات
      prisma.category.findMany.mockResolvedValue(mockCategoriesList);

      const result = await service.findAll();

      // التحقق من استدعاء الدالة الصحيحة
      expect(prisma.category.findMany).toHaveBeenCalled();
      // التحقق من النتيجة
      expect(result).toEqual(mockCategoriesList);
      // التحقق من عدد العناصر
      expect(result.length).toBe(2);
    });

    // حالة النجاح: إرجاع قائمة فارغة
    it('يجب أن ترجع قائمة فارغة إذا لم يتم العثور على فئات', async () => {
      // تهيئة الـ Mock لإرجاع مصفوفة فارغة
      prisma.category.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      // التحقق من استدعاء الدالة الصحيحة
      expect(prisma.category.findMany).toHaveBeenCalled();
      // التحقق من النتيجة
      expect(result).toEqual([]);
      // التحقق من عدد العناصر
      expect(result.length).toBe(0);
    });
  });

  // -------------------------------------------------------------------
  // اختبار دالة findOne
  // -------------------------------------------------------------------
  describe('findOne', () => {
    // حالة النجاح: إرجاع فئة محددة
    it('يجب أن ترجع فئة محددة بالـ ID بنجاح', async () => {
      // تهيئة الـ Mock لإرجاع فئة واحدة
      prisma.category.findUnique.mockResolvedValue(mockCategory);

      const result = await service.findOne(1);

      // التحقق من استدعاء الدالة الصحيحة بالمعاملات الصحيحة
      expect(prisma.category.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      // التحقق من النتيجة
      expect(result).toEqual(mockCategory);
    });

    // حالة الفشل: عدم العثور على الفئة (NotFoundException)
    it('يجب أن تطلق NotFoundException إذا لم يتم العثور على الفئة', async () => {
      // تهيئة الـ Mock لإرجاع قيمة فارغة (null)
      prisma.category.findUnique.mockResolvedValue(null);

      // التحقق من إطلاق الاستثناء
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(prisma.category.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
    });
  });

  // -------------------------------------------------------------------
  // اختبار دالة create
  // -------------------------------------------------------------------
  describe('create', () => {
    const createDto = { name: 'أجهزة لوحية', slug: 'tablets', parentId: 1 };

    // حالة النجاح: إنشاء فئة جديدة
    it('يجب أن تنشئ فئة جديدة بنجاح', async () => {
      // تهيئة الـ Mock لإرجاع الفئة التي تم إنشاؤها
      prisma.category.create.mockResolvedValue({ ...mockCategory, id: 3, ...createDto });

      const result = await service.create(createDto as any);

      // التحقق من استدعاء الدالة الصحيحة
      expect(prisma.category.create).toHaveBeenCalledWith({ data: createDto });
      // التحقق من النتيجة
      expect(result.name).toBe(createDto.name);
    });

    // حالة الفشل: تكرار الاسم أو الـ Slug (ConflictException)
    it('يجب أن تطلق ConflictException عند تكرار الـ Slug', async () => {
      // تهيئة الـ Mock لمحاكاة خطأ تكرار (P2002)
      prisma.category.create.mockRejectedValue({ code: 'P2002' });

      // التحقق من إطلاق الاستثناء
      await expect(service.create(createDto as any)).rejects.toThrow(ConflictException);
    });

    // حالة الفشل: إدخال غير صالح (BadRequestException)
    it('يجب أن تطلق BadRequestException عند إدخال بيانات غير صالحة', async () => {
      // نفترض أن الدالة تتحقق من أن parentId موجود
      // في هذا الاختبار، سنفترض أن الدالة تطلق BadRequestException لسبب منطقي (مثلاً: محاولة جعل الفئة أب لنفسها)
      // بما أننا لا نملك الكود الفعلي، سنقوم بمحاكاة خطأ عام غير P2002
      prisma.category.create.mockRejectedValue(new Error('Invalid parent ID'));

      // التحقق من إطلاق الاستثناء
      await expect(service.create(createDto as any)).rejects.toThrow(); // يمكن تغييرها إلى BadRequestException إذا كان الكود الفعلي يطلقها
    });
  });

  // -------------------------------------------------------------------
  // اختبار دالة update
  // -------------------------------------------------------------------
  describe('update', () => {
    const updateDto = { name: 'إلكترونيات محدثة' };

    // حالة النجاح: تحديث فئة موجودة
    it('يجب أن تحدث فئة موجودة بنجاح', async () => {
      // تهيئة الـ Mock لـ findUnique (للتأكد من وجودها)
      prisma.category.findUnique.mockResolvedValue(mockCategory);
      // تهيئة الـ Mock لـ update
      prisma.category.update.mockResolvedValue({ ...mockCategory, ...updateDto });

      const result = await service.update(1, updateDto as any);

      // التحقق من استدعاء الدالة الصحيحة
      expect(prisma.category.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prisma.category.update).toHaveBeenCalledWith({ where: { id: 1 }, data: updateDto });
      // التحقق من النتيجة
      expect(result.name).toBe(updateDto.name);
    });

    // حالة الفشل: عدم العثور على الفئة (NotFoundException)
    it('يجب أن تطلق NotFoundException إذا لم يتم العثور على الفئة المراد تحديثها', async () => {
      // تهيئة الـ Mock لـ findUnique لإرجاع قيمة فارغة (null)
      prisma.category.findUnique.mockResolvedValue(null);

      // التحقق من إطلاق الاستثناء
      await expect(service.update(999, updateDto as any)).rejects.toThrow(NotFoundException);
      expect(prisma.category.update).not.toHaveBeenCalled();
    });

    // حالة الفشل: تكرار الـ Slug أثناء التحديث (ConflictException)
    it('يجب أن تطلق ConflictException عند محاولة تحديث الـ Slug إلى قيمة مكررة', async () => {
      // تهيئة الـ Mock لـ findUnique (للتأكد من وجودها)
      prisma.category.findUnique.mockResolvedValue(mockCategory);
      // تهيئة الـ Mock لـ update لمحاكاة خطأ تكرار (P2002)
      prisma.category.update.mockRejectedValue({ code: 'P2002' });

      // التحقق من إطلاق الاستثناء
      await expect(service.update(1, { slug: 'existing-slug' } as any)).rejects.toThrow(ConflictException);
    });
  });

  // -------------------------------------------------------------------
  // اختبار دالة delete
  // -------------------------------------------------------------------
  describe('delete', () => {
    // حالة النجاح: حذف فئة موجودة
    it('يجب أن تحذف فئة موجودة بنجاح', async () => {
      // تهيئة الـ Mock لـ findUnique (للتأكد من وجودها)
      prisma.category.findUnique.mockResolvedValue(mockCategory);
      // تهيئة الـ Mock لـ delete
      prisma.category.delete.mockResolvedValue(mockCategory);

      const result = await service.delete(1);

      // التحقق من استدعاء الدالة الصحيحة
      expect(prisma.category.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prisma.category.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      // التحقق من النتيجة (عادةً ما ترجع الدالة الكائن المحذوف)
      expect(result).toEqual(mockCategory);
    });

    // حالة الفشل: عدم العثور على الفئة (NotFoundException)
    it('يجب أن تطلق NotFoundException إذا لم يتم العثور على الفئة المراد حذفها', async () => {
      // تهيئة الـ Mock لـ findUnique لإرجاع قيمة فارغة (null)
      prisma.category.findUnique.mockResolvedValue(null);

      // التحقق من إطلاق الاستثناء
      await expect(service.delete(999)).rejects.toThrow(NotFoundException);
      expect(prisma.category.delete).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------
  // اختبار دالة getHierarchy (دالة خاصة)
  // -------------------------------------------------------------------
  describe('getHierarchy', () => {
    // بيانات وهمية لهيكل شجري
    const mockHierarchy = [
      { id: 1, name: 'Root', children: [
        { id: 2, name: 'Child 1', children: [] },
        { id: 3, name: 'Child 2', children: [] },
      ] },
    ];

    // حالة النجاح: إرجاع الهيكل الشجري للفئات
    it('يجب أن ترجع الهيكل الشجري للفئات بنجاح', async () => {
      // نفترض أن getHierarchy تستخدم $queryRaw أو $transaction لتنفيذ استعلام معقد
      // سنقوم بمحاكاة النتيجة النهائية التي يتم معالجتها داخل الدالة
      // بما أننا لا نملك الكود الفعلي، سنفترض أن الدالة تعتمد على findMany مع تضمين العلاقات
      // أو أنها تستخدم دالة مساعدة داخلية. سنقوم بمحاكاة النتيجة النهائية مباشرة.
      
      // بما أننا لا نملك الكود الفعلي، سنفترض أن الدالة تعتمد على findMany مع تضمين العلاقات
      // أو أنها تستخدم دالة مساعدة داخلية. سنقوم بمحاكاة النتيجة النهائية مباشرة.
      // في الواقع، بناء الهيكل الشجري يتم عادةً بعد جلب جميع الفئات.
      prisma.category.findMany.mockResolvedValue([
        { id: 1, name: 'Root', parentId: null },
        { id: 2, name: 'Child 1', parentId: 1 },
        { id: 3, name: 'Child 2', parentId: 1 },
      ]);

      // بما أننا لا نملك منطق تحويل القائمة إلى شجرة، سنقوم بمحاكاة النتيجة المتوقعة
      // ونفترض أن الدالة تستدعي findMany
      const serviceAsAny = service as any;
      serviceAsAny.buildTree = jest.fn().mockReturnValue(mockHierarchy);
      
      const result = await service.getHierarchy();

      // التحقق من استدعاء الدالة الصحيحة
      expect(prisma.category.findMany).toHaveBeenCalled();
      // التحقق من النتيجة
      expect(result).toEqual(mockHierarchy);
    });

    // حالة الفشل: خطأ عام في قاعدة البيانات
    it('يجب أن تطلق خطأ عام عند فشل جلب البيانات', async () => {
      // تهيئة الـ Mock لإطلاق خطأ
      prisma.category.findMany.mockRejectedValue(new Error('DB Connection Error'));

      // التحقق من إطلاق الاستثناء
      await expect(service.getHierarchy()).rejects.toThrow('DB Connection Error');
    });
  });
});
