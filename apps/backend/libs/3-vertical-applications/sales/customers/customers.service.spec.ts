// PHASE-11

import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { PrismaService } from '../../../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

// Mock data
const mockCustomer = { id: 1, name: 'Test Customer', email: 'test@example.com' };
const mockCreateCustomerDto = { name: 'New Customer', email: 'new@example.com' };
const mockUpdateCustomerDto = { name: 'Updated Customer' };
const mockCustomersList = [mockCustomer, { id: 2, name: 'Customer 2', email: 'c2@example.com' }];

// Mock Prisma Service
const mockPrismaService = {
  customer: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('CustomersService', () => {
  let service: CustomersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Test 1: create
  describe('create', () => {
    it('should create a new customer', async () => {
      mockPrismaService.customer.create.mockResolvedValue(mockCustomer);
      const result = await service.create(mockCreateCustomerDto as any);
      expect(prisma.customer.create).toHaveBeenCalledWith({
        data: mockCreateCustomerDto,
      });
      expect(result).toEqual(mockCustomer);
    });
  });

  // Test 2: findAll
  describe('findAll', () => {
    it('should return an array of customers', async () => {
      mockPrismaService.customer.findMany.mockResolvedValue(mockCustomersList);
      const result = await service.findAll();
      expect(prisma.customer.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockCustomersList);
    });
  });

  // Test 3 & 4: findOne
  describe('findOne', () => {
    it('should return a single customer if found', async () => {
      mockPrismaService.customer.findUnique.mockResolvedValue(mockCustomer);
      const result = await service.findOne(1);
      expect(prisma.customer.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockCustomer);
    });

    it('should throw NotFoundException if customer is not found', async () => {
      mockPrismaService.customer.findUnique.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(99)).rejects.toThrow('Customer with ID 99 not found');
    });
  });

  // Test 5 & 6: update
  describe('update', () => {
    it('should update a customer', async () => {
      mockPrismaService.customer.update.mockResolvedValue({ ...mockCustomer, ...mockUpdateCustomerDto });
      const result = await service.update(1, mockUpdateCustomerDto as any);
      expect(prisma.customer.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: mockUpdateCustomerDto,
      });
      expect(result.name).toBe(mockUpdateCustomerDto.name);
    });

    it('should throw NotFoundException if customer to update is not found (P2025 error)', async () => {
      const notFoundError = { code: 'P2025', meta: { cause: 'Record not found' } };
      mockPrismaService.customer.update.mockRejectedValue(notFoundError);

      await expect(service.update(99, mockUpdateCustomerDto as any)).rejects.toThrow(NotFoundException);
      expect(prisma.customer.update).toHaveBeenCalled();
    });

    it('should throw other errors during update', async () => {
      const genericError = new Error('Database connection failed');
      mockPrismaService.customer.update.mockRejectedValue(genericError);

      await expect(service.update(1, mockUpdateCustomerDto as any)).rejects.toThrow('Database connection failed');
    });
  });

  // Test 7 & 8: remove
  describe('remove', () => {
    it('should remove a customer', async () => {
      mockPrismaService.customer.delete.mockResolvedValue(mockCustomer);
      const result = await service.remove(1);
      expect(prisma.customer.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockCustomer);
    });

    it('should throw NotFoundException if customer to remove is not found (P2025 error)', async () => {
      const notFoundError = { code: 'P2025', meta: { cause: 'Record not found' } };
      mockPrismaService.customer.delete.mockRejectedValue(notFoundError);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
      expect(prisma.customer.delete).toHaveBeenCalled();
    });

    it('should throw other errors during remove', async () => {
      const genericError = new Error('Network error');
      mockPrismaService.customer.delete.mockRejectedValue(genericError);

      await expect(service.remove(1)).rejects.toThrow('Network error');
    });
  });
});
