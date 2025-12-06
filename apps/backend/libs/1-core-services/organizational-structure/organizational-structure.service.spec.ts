// PHASE-11
import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationalStructureService } from './organizational-structure.service';
import { PrismaService } from '../../../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateOrganizationalStructureDto } from './dto/create-organizational-structure.dto';
import { UpdateOrganizationalStructureDto } from './dto/update-organizational-structure.dto';

// Mock data
const mockOrganizationalStructure = {
  id: 1,
  name: 'Test Structure',
  description: 'A test description',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Mock Prisma Error for P2025 (Record not found)
const mockPrismaErrorP2025 = { code: 'P2025', meta: { cause: 'Record not found' } };

// Mock PrismaService structure with Jest functions
const mockPrismaService = {
  organizationalStructure: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('OrganizationalStructureService', () => {
  let service: OrganizationalStructureService;
  let prisma: PrismaService;

  beforeEach(async () => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationalStructureService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<OrganizationalStructureService>(OrganizationalStructureService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('يجب أن يتم تعريف الخدمة بنجاح', () => {
    expect(service).toBeDefined();
  });

  // -------------------------------------------------------------------
  // 1. اختبار وظيفة create
  // -------------------------------------------------------------------
  describe('create', () => {
    it('يجب أن تنشئ هيكلاً تنظيمياً جديداً وتعيده', async () => {
      const createDto: CreateOrganizationalStructureDto = { name: 'New Structure', description: 'New Desc' };
      (prisma.organizationalStructure.create as jest.Mock).mockResolvedValue(mockOrganizationalStructure);

      const result = await service.create(createDto);

      expect(prisma.organizationalStructure.create).toHaveBeenCalledWith({ data: createDto });
      expect(result).toEqual(mockOrganizationalStructure);
    });
  });

  // -------------------------------------------------------------------
  // 2. اختبار وظيفة findAll
  // -------------------------------------------------------------------
  describe('findAll', () => {
    it('يجب أن تعيد قائمة بجميع الهياكل التنظيمية', async () => {
      const mockList = [mockOrganizationalStructure, { ...mockOrganizationalStructure, id: 2, name: 'Second' }];
      (prisma.organizationalStructure.findMany as jest.Mock).mockResolvedValue(mockList);

      const result = await service.findAll();

      expect(prisma.organizationalStructure.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockList);
      expect(result.length).toBe(2);
    });
  });

  // -------------------------------------------------------------------
  // 3. اختبار وظيفة findOne
  // -------------------------------------------------------------------
  describe('findOne', () => {
    it('يجب أن تعيد الهيكل التنظيمي المحدد إذا تم العثور عليه', async () => {
      (prisma.organizationalStructure.findUnique as jest.Mock).mockResolvedValue(mockOrganizationalStructure);

      const result = await service.findOne(1);

      expect(prisma.organizationalStructure.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockOrganizationalStructure);
    });

    it('يجب أن ترمي NotFoundException إذا لم يتم العثور على الهيكل التنظيمي', async () => {
      (prisma.organizationalStructure.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('Organizational Structure with ID 999 not found');
    });
  });

  // -------------------------------------------------------------------
  // 4. اختبار وظيفة update
  // -------------------------------------------------------------------
  describe('update', () => {
    const updateDto: UpdateOrganizationalStructureDto = { name: 'Updated Name' };

    it('يجب أن تحدث الهيكل التنظيمي وتعيده', async () => {
      const updatedStructure = { ...mockOrganizationalStructure, name: 'Updated Name' };
      (prisma.organizationalStructure.update as jest.Mock).mockResolvedValue(updatedStructure);

      const result = await service.update(1, updateDto);

      expect(prisma.organizationalStructure.update).toHaveBeenCalledWith({ where: { id: 1 }, data: updateDto });
      expect(result).toEqual(updatedStructure);
    });

    it('يجب أن ترمي NotFoundException إذا لم يتم العثور على الهيكل التنظيمي (خطأ P2025)', async () => {
      (prisma.organizationalStructure.update as jest.Mock).mockRejectedValue(mockPrismaErrorP2025);

      await expect(service.update(999, updateDto)).rejects.toThrow(NotFoundException);
      await expect(service.update(999, updateDto)).rejects.toThrow('Organizational Structure with ID 999 not found for update');
    });

    it('يجب أن ترمي أي خطأ آخر غير P2025', async () => {
      const genericError = new Error('Database connection failed');
      (prisma.organizationalStructure.update as jest.Mock).mockRejectedValue(genericError);

      await expect(service.update(1, updateDto)).rejects.toThrow(genericError);
    });
  });

  // -------------------------------------------------------------------
  // 5. اختبار وظيفة remove
  // -------------------------------------------------------------------
  describe('remove', () => {
    it('يجب أن تحذف الهيكل التنظيمي وتعيده', async () => {
      (prisma.organizationalStructure.delete as jest.Mock).mockResolvedValue(mockOrganizationalStructure);

      const result = await service.remove(1);

      expect(prisma.organizationalStructure.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockOrganizationalStructure);
    });

    it('يجب أن ترمي NotFoundException إذا لم يتم العثور على الهيكل التنظيمي (خطأ P2025)', async () => {
      (prisma.organizationalStructure.delete as jest.Mock).mockRejectedValue(mockPrismaErrorP2025);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      await expect(service.remove(999)).rejects.toThrow('Organizational Structure with ID 999 not found for deletion');
    });

    it('يجب أن ترمي أي خطأ آخر غير P2025', async () => {
      const genericError = new Error('Constraint violation');
      (prisma.organizationalStructure.delete as jest.Mock).mockRejectedValue(genericError);

      await expect(service.remove(1)).rejects.toThrow(genericError);
    });
  });
});
