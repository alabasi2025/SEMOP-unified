/**
 * PHASE-11: Complete Backend Tests
 * COMPONENT: Roles Service Tests
 * IMPACT: Critical
 * 
 * Date: 2025-12-03
 * Author: Development Team
 */

import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('RolesService', () => {
  let service: RolesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    role: {
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
        RolesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of roles', async () => {
      const mockRoles = [
        { id: '1', name: 'Admin', description: 'Administrator' },
        { id: '2', name: 'User', description: 'Regular User' },
      ];
      mockPrismaService.role.findMany.mockResolvedValue(mockRoles);

      const result = await service.findAll();
      expect(result).toEqual(mockRoles);
      expect(prisma.role.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a role by id', async () => {
      const mockRole = { id: '1', name: 'Admin', description: 'Administrator' };
      mockPrismaService.role.findUnique.mockResolvedValue(mockRole);

      const result = await service.findOne('1');
      expect(result).toEqual(mockRole);
      expect(prisma.role.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException if role not found', async () => {
      mockPrismaService.role.findUnique.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new role', async () => {
      const createDto = { name: 'Manager', description: 'Manager Role' };
      const mockRole = { id: '3', ...createDto };
      mockPrismaService.role.create.mockResolvedValue(mockRole);

      const result = await service.create(createDto as any);
      expect(result).toEqual(mockRole);
      expect(prisma.role.create).toHaveBeenCalledWith({ data: createDto });
    });
  });

  describe('update', () => {
    it('should update a role', async () => {
      const updateDto = { description: 'Updated Description' };
      const mockRole = { id: '1', name: 'Admin', ...updateDto };
      mockPrismaService.role.update.mockResolvedValue(mockRole);

      const result = await service.update('1', updateDto as any);
      expect(result).toEqual(mockRole);
      expect(prisma.role.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateDto,
      });
    });
  });

  describe('remove', () => {
    it('should delete a role', async () => {
      const mockRole = { id: '1', name: 'Admin', description: 'Administrator' };
      mockPrismaService.role.delete.mockResolvedValue(mockRole);

      const result = await service.remove('1');
      expect(result).toEqual(mockRole);
      expect(prisma.role.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });
});
