/**
 * PHASE-11: Complete Backend Tests
 * COMPONENT: Purchase Orders Service Tests
 * IMPACT: Critical
 * 
 * Date: 2025-12-03
 * Author: Development Team
 */

import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseOrdersService } from './purchase-orders.service';
import { PrismaService } from '../../../../1-core-services/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('PurchaseOrdersService', () => {
  let service: PurchaseOrdersService;
  let prisma: PrismaService;

  const mockPrismaService = {
    purchaseOrder: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseOrdersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PurchaseOrdersService>(PurchaseOrdersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of purchase orders', async () => {
      const mockOrders = [
        { id: '1', orderNumber: 'PO-001', supplierId: 'S1' },
        { id: '2', orderNumber: 'PO-002', supplierId: 'S2' },
      ];
      mockPrismaService.purchaseOrder.findMany.mockResolvedValue(mockOrders);

      const result = await service.findAll();
      expect(result).toEqual(mockOrders);
      expect(prisma.purchaseOrder.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a purchase order by id', async () => {
      const mockOrder = { id: '1', orderNumber: 'PO-001', supplierId: 'S1' };
      mockPrismaService.purchaseOrder.findUnique.mockResolvedValue(mockOrder);

      const result = await service.findOne('1');
      expect(result).toEqual(mockOrder);
      expect(prisma.purchaseOrder.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException if order not found', async () => {
      mockPrismaService.purchaseOrder.findUnique.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new purchase order', async () => {
      const createDto = {
        supplierId: 'S1',
        orderDate: new Date(),
        lines: [],
      };
      const mockOrder = { id: '1', orderNumber: 'PO-001', ...createDto };
      mockPrismaService.purchaseOrder.create.mockResolvedValue(mockOrder);

      const result = await service.create(createDto as any);
      expect(result).toBeDefined();
      expect(prisma.purchaseOrder.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a purchase order', async () => {
      const updateDto = { notes: 'Updated notes' };
      const mockOrder = { id: '1', orderNumber: 'PO-001', ...updateDto };
      mockPrismaService.purchaseOrder.update.mockResolvedValue(mockOrder);

      const result = await service.update('1', updateDto as any);
      expect(result).toEqual(mockOrder);
      expect(prisma.purchaseOrder.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateDto,
      });
    });
  });

  describe('remove', () => {
    it('should delete a purchase order', async () => {
      const mockOrder = { id: '1', orderNumber: 'PO-001', supplierId: 'S1' };
      mockPrismaService.purchaseOrder.delete.mockResolvedValue(mockOrder);

      const result = await service.remove('1');
      expect(result).toEqual(mockOrder);
      expect(prisma.purchaseOrder.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });
});
