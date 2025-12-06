/**
 * PHASE-11: Complete Backend Tests
 * COMPONENT: Latitude Points Service Tests
 * IMPACT: Critical
 * 
 * Date: 2025-12-03
 * Author: Development Team
 */

import { Test, TestingModule } from '@nestjs/testing';
import { LatitudePointsService } from './latitude-points.service';
import { PrismaService } from '../../1-core-services/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('LatitudePointsService', () => {
  let service: LatitudePointsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    latitudePoint: {
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
        LatitudePointsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<LatitudePointsService>(LatitudePointsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of latitude points', async () => {
      const mockPoints = [{ id: 1, name: 'Point 1' }, { id: 2, name: 'Point 2' }];
      mockPrismaService.latitudePoint.findMany.mockResolvedValue(mockPoints);

      const result = await service.findAll();
      expect(result).toEqual(mockPoints);
      expect(prisma.latitudePoint.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a latitude point by id', async () => {
      const mockPoint = { id: 1, name: 'Point 1' };
      mockPrismaService.latitudePoint.findUnique.mockResolvedValue(mockPoint);

      const result = await service.findOne(1);
      expect(result).toEqual(mockPoint);
      expect(prisma.latitudePoint.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if point not found', async () => {
      mockPrismaService.latitudePoint.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new latitude point', async () => {
      const createDto = { name: 'New Point', latitude: 25.0, longitude: 45.0 };
      const mockPoint = { id: 1, ...createDto };
      mockPrismaService.latitudePoint.create.mockResolvedValue(mockPoint);

      const result = await service.create(createDto as any);
      expect(result).toEqual(mockPoint);
      expect(prisma.latitudePoint.create).toHaveBeenCalledWith({ data: createDto });
    });
  });

  describe('update', () => {
    it('should update a latitude point', async () => {
      const updateDto = { name: 'Updated Point' };
      const mockPoint = { id: 1, ...updateDto };
      mockPrismaService.latitudePoint.update.mockResolvedValue(mockPoint);

      const result = await service.update(1, updateDto as any);
      expect(result).toEqual(mockPoint);
      expect(prisma.latitudePoint.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateDto,
      });
    });
  });

  describe('remove', () => {
    it('should delete a latitude point', async () => {
      const mockPoint = { id: 1, name: 'Point 1' };
      mockPrismaService.latitudePoint.delete.mockResolvedValue(mockPoint);

      const result = await service.remove(1);
      expect(result).toEqual(mockPoint);
      expect(prisma.latitudePoint.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});
