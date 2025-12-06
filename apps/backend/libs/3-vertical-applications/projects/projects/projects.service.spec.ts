// PHASE-11

import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { NotFoundException } from '@nestjs/common';

// Mock data
const mockItem = { id: 1, name: 'Test Project' };
const mockItems = [mockItem, { id: 2, name: 'Another Project' }];

// Mock PrismaService
// بما أن الخدمة الحالية تستخدم ذاكرة داخلية (in-memory array) بدلاً من Prisma،
// سنقوم بمحاكاة PrismaService للامتثال لمتطلبات الاختبار، مع العلم أن
// الخدمة الفعلية لا تستخدمها حاليًا. سنركز على اختبار منطق الخدمة الحالي.
const mockPrismaService = {
  project: {
    findMany: jest.fn().mockResolvedValue(mockItems),
    findUnique: jest.fn().mockImplementation(({ where: { id } }) => {
      return Promise.resolve(mockItems.find(i => i.id === id));
    }),
    create: jest.fn().mockImplementation((data) => {
      return Promise.resolve({ id: 3, ...data.data });
    }),
    update: jest.fn().mockImplementation(({ where: { id }, data }) => {
      const index = mockItems.findIndex(i => i.id === id);
      if (index === -1) return null;
      return Promise.resolve({ ...mockItems[index], ...data });
    }),
    delete: jest.fn().mockImplementation(({ where: { id } }) => {
      const index = mockItems.findIndex(i => i.id === id);
      if (index === -1) return null;
      return Promise.resolve(mockItems[index]);
    }),
  },
};

// سنقوم بتعريف رمز وهمي لـ PrismaService
class PrismaService {}

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        // توفير PrismaService كـ Mock
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    // إعادة تعيين حالة الخدمة الداخلية قبل كل اختبار لضمان الاستقلالية
    (service as any).items = [...mockItems];
    (service as any).nextId = 3;
  });

  it('يجب أن يتم تعريف الخدمة', () => {
    expect(service).toBeDefined();
  });

  // 1. اختبار create
  describe('create', () => {
    it('يجب أن ينشئ عنصرًا جديدًا ويعيده', async () => {
      const createDto = { name: 'New Project' };
      const result = service.create(createDto);
      expect(result).toEqual({ id: 3, name: 'New Project' });
      expect((service as any).items.length).toBe(3);
    });
  });

  // 2. اختبار findAll
  describe('findAll', () => {
    it('يجب أن يعيد جميع العناصر', () => {
      const result = service.findAll();
      expect(result).toEqual(mockItems);
      expect(result.length).toBe(2);
    });
  });

  // 3. اختبار findOne
  describe('findOne', () => {
    it('يجب أن يعيد العنصر المطلوب عند العثور عليه', () => {
      const result = service.findOne(1);
      expect(result).toEqual(mockItem);
    });

    it('يجب أن يرمي NotFoundException إذا لم يتم العثور على العنصر', () => {
      expect(() => service.findOne(999)).toThrow(NotFoundException);
      expect(() => service.findOne(999)).toThrow('Item with ID 999 not found');
    });
  });

  // 4. اختبار update
  describe('update', () => {
    const updateDto = { name: 'Updated Project' };

    it('يجب أن يقوم بتحديث العنصر المطلوب وإعادته', () => {
      const result = service.update(1, updateDto);
      expect(result).toEqual({ id: 1, name: 'Updated Project' });
      expect((service as any).items[0].name).toBe('Updated Project');
    });

    it('يجب أن يرمي NotFoundException إذا لم يتم العثور على العنصر', () => {
      expect(() => service.update(999, updateDto)).toThrow(NotFoundException);
      expect(() => service.update(999, updateDto)).toThrow('Item with ID 999 not found');
    });
  });

  // 5. اختبار remove
  describe('remove', () => {
    it('يجب أن يقوم بإزالة العنصر المطلوب وإرجاع رسالة نجاح', () => {
      const initialLength = (service as any).items.length;
      const result = service.remove(1);
      expect(result).toEqual({ message: 'Item deleted successfully' });
      expect((service as any).items.length).toBe(initialLength - 1);
      expect((service as any).items.find(i => i.id === 1)).toBeUndefined();
    });

    it('يجب أن يرمي NotFoundException إذا لم يتم العثور على العنصر', () => {
      expect(() => service.remove(999)).toThrow(NotFoundException);
      expect(() => service.remove(999)).toThrow('Item with ID 999 not found');
    });
  });
});
