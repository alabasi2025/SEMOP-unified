// PHASE-11

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AccountHierarchyService } from './account-hierarchy.service';
import { PrismaService } from '../../../../prisma/prisma.service';

// تعريف Mock لـ PrismaService
const mockAccountHierarchy = {
  id: 1,
  name: 'الأصول',
  code: '1000',
  parentId: null,
};

const mockPrismaService = {
  accountHierarchy: {
    create: jest.fn().mockResolvedValue(mockAccountHierarchy),
    findMany: jest.fn().mockResolvedValue([mockAccountHierarchy]),
    findUnique: jest.fn().mockResolvedValue(mockAccountHierarchy),
    update: jest.fn().mockResolvedValue(mockAccountHierarchy),
    delete: jest.fn().mockResolvedValue(mockAccountHierarchy),
  },
};

describe('AccountHierarchyService', () => {
  let service: AccountHierarchyService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountHierarchyService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AccountHierarchyService>(AccountHierarchyService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('يجب أن يتم تعريف الخدمة', () => {
    expect(service).toBeDefined();
  });

  // --------------------------------------------------
  // اختبارات create
  // --------------------------------------------------
  describe('create', () => {
    it('يجب أن ينشئ سجل تسلسل حسابي جديد بنجاح', async () => {
      const createData = { name: 'الخصوم', code: '2000' };
      const result = await service.create(createData);
      expect(prisma.accountHierarchy.create).toHaveBeenCalledWith({ data: createData });
      expect(result).toEqual(mockAccountHierarchy);
    });
  });

  // --------------------------------------------------
  // اختبارات findAll
  // --------------------------------------------------
  describe('findAll', () => {
    it('يجب أن يعيد قائمة بجميع سجلات التسلسل الحسابي', async () => {
      const result = await service.findAll();
      expect(prisma.accountHierarchy.findMany).toHaveBeenCalled();
      expect(result).toEqual([mockAccountHierarchy]);
    });

    it('يجب أن يعيد مصفوفة فارغة إذا لم يتم العثور على سجلات', async () => {
      (prisma.accountHierarchy.findMany as jest.Mock).mockResolvedValueOnce([]);
      const result = await service.findAll();
      expect(result).toEqual([]);
    });
  });

  // --------------------------------------------------
  // اختبارات findOne
  // --------------------------------------------------
  describe('findOne', () => {
    it('يجب أن يعيد سجل التسلسل الحسابي المحدد', async () => {
      const result = await service.findOne(1);
      expect(prisma.accountHierarchy.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockAccountHierarchy);
    });

    it('يجب أن يرمي NotFoundException إذا لم يتم العثور على السجل', async () => {
      (prisma.accountHierarchy.findUnique as jest.Mock).mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('AccountHierarchy with ID 999 not found');
    });
  });

  // --------------------------------------------------
  // اختبارات update
  // --------------------------------------------------
  describe('update', () => {
    const updateData = { name: 'الأصول المتداولة' };

    it('يجب أن يحدث سجل التسلسل الحسابي بنجاح', async () => {
      const result = await service.update(1, updateData);
      expect(prisma.accountHierarchy.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
      });
      expect(result).toEqual(mockAccountHierarchy);
    });

    it('يجب أن يرمي NotFoundException إذا لم يتم العثور على السجل (خطأ P2025)', async () => {
      const notFoundError = { code: 'P2025' };
      (prisma.accountHierarchy.update as jest.Mock).mockRejectedValueOnce(notFoundError);
      await expect(service.update(999, updateData)).rejects.toThrow(NotFoundException);
    });

    it('يجب أن يرمي خطأ آخر إذا لم يكن خطأ P2025', async () => {
      const genericError = new Error('Database connection failed');
      (prisma.accountHierarchy.update as jest.Mock).mockRejectedValueOnce(genericError);
      await expect(service.update(1, updateData)).rejects.toThrow(genericError);
    });
  });

  // --------------------------------------------------
  // اختبارات remove
  // --------------------------------------------------
  describe('remove', () => {
    it('يجب أن يحذف سجل التسلسل الحسابي بنجاح', async () => {
      const result = await service.remove(1);
      expect(prisma.accountHierarchy.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockAccountHierarchy);
    });

    it('يجب أن يرمي NotFoundException إذا لم يتم العثور على السجل (خطأ P2025)', async () => {
      const notFoundError = { code: 'P2025' };
      (prisma.accountHierarchy.delete as jest.Mock).mockRejectedValueOnce(notFoundError);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });

    it('يجب أن يرمي خطأ آخر إذا لم يكن خطأ P2025', async () => {
      const genericError = new Error('Database connection failed');
      (prisma.accountHierarchy.delete as jest.Mock).mockRejectedValueOnce(genericError);
      await expect(service.remove(1)).rejects.toThrow(genericError);
    });
  });
});
