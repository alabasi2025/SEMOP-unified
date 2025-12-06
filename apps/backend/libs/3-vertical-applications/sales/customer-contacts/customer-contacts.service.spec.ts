// PHASE-11

import { Test, TestingModule } from '@nestjs/testing';
import { CustomerContactsService } from './customer-contacts.service';
import { PrismaService } from '../../../../../../prisma/prisma.service'; // افتراض مسار لـ PrismaService
import { NotFoundException } from '@nestjs/common';

// تعريف أنواع البيانات الافتراضية
const mockCustomerContact = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockCreateDto = {
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
};

const mockUpdateDto = {
  name: 'Jane Smith',
};

// Mock PrismaService
const mockPrismaService = {
  customerContact: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('CustomerContactsService', () => {
  let service: CustomerContactsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    // إعادة تعيين Mock قبل كل اختبار
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerContactsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CustomerContactsService>(CustomerContactsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('يجب أن يتم تعريف الخدمة (Service) بنجاح', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('يجب أن ينشئ جهة اتصال جديدة بنجاح', async () => {
      mockPrismaService.customerContact.create.mockResolvedValue(mockCustomerContact);
      const result = await service.create(mockCreateDto as any);
      expect(result).toEqual(mockCustomerContact);
      expect(prisma.customerContact.create).toHaveBeenCalledWith({
        data: mockCreateDto,
      });
    });
  });

  describe('findAll', () => {
    it('يجب أن يعيد قائمة بجميع جهات الاتصال', async () => {
      const contactsList = [mockCustomerContact, { ...mockCustomerContact, id: 2, name: 'Test' }];
      mockPrismaService.customerContact.findMany.mockResolvedValue(contactsList);
      const result = await service.findAll();
      expect(result).toEqual(contactsList);
      expect(prisma.customerContact.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('يجب أن يعيد جهة اتصال محددة عند العثور عليها', async () => {
      mockPrismaService.customerContact.findUnique.mockResolvedValue(mockCustomerContact);
      const result = await service.findOne(1);
      expect(result).toEqual(mockCustomerContact);
      expect(prisma.customerContact.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('يجب أن يرمي خطأ NotFoundException إذا لم يتم العثور على جهة الاتصال', async () => {
      mockPrismaService.customerContact.findUnique.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('يجب أن يقوم بتحديث جهة اتصال موجودة بنجاح', async () => {
      // Mock findUnique to simulate finding the record first (for existence check)
      mockPrismaService.customerContact.findUnique.mockResolvedValue(mockCustomerContact);
      // Mock update to return the updated record
      const updatedContact = { ...mockCustomerContact, ...mockUpdateDto };
      mockPrismaService.customerContact.update.mockResolvedValue(updatedContact);

      const result = await service.update(1, mockUpdateDto as any);
      expect(result).toEqual(updatedContact);
      expect(prisma.customerContact.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prisma.customerContact.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: mockUpdateDto,
      });
    });

    it('يجب أن يرمي خطأ NotFoundException عند محاولة تحديث جهة اتصال غير موجودة', async () => {
      mockPrismaService.customerContact.findUnique.mockResolvedValue(null);
      await expect(service.update(999, mockUpdateDto as any)).rejects.toThrow(NotFoundException);
      expect(prisma.customerContact.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('يجب أن يقوم بحذف جهة اتصال موجودة بنجاح', async () => {
      // Mock findUnique to simulate finding the record first (for existence check)
      mockPrismaService.customerContact.findUnique.mockResolvedValue(mockCustomerContact);
      // Mock delete to return the deleted record
      mockPrismaService.customerContact.delete.mockResolvedValue(mockCustomerContact);

      const result = await service.remove(1);
      expect(result).toEqual(mockCustomerContact);
      expect(prisma.customerContact.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prisma.customerContact.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('يجب أن يرمي خطأ NotFoundException عند محاولة حذف جهة اتصال غير موجودة', async () => {
      mockPrismaService.customerContact.findUnique.mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(prisma.customerContact.delete).not.toHaveBeenCalled();
    });
  });
});
