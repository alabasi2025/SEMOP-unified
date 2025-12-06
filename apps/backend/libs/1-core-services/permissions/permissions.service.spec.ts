/**
 * PHASE-11: Complete Backend Tests
 * COMPONENT: Permissions Service Tests
 * IMPACT: Critical
 * 
 * Date: 2025-12-03
 * Author: Development Team
 */

import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsService } from './permissions.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('PermissionsService', () => {
  let service: PermissionsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    permission: {
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
        PermissionsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of permissions', async () => {
      const mockPermissions = [
        { id: '1', name: 'read', resource: 'users' },
        { id: '2', name: 'write', resource: 'users' },
      ];
      mockPrismaService.permission.findMany.mockResolvedValue(mockPermissions);

      const result = await service.findAll();
      expect(result).toEqual(mockPermissions);
      expect(prisma.permission.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a permission by id', async () => {
      const mockPermission = { id: '1', name: 'read', resource: 'users' };
      mockPrismaService.permission.findUnique.mockResolvedValue(mockPermission);

      const result = await service.findOne('1');
      expect(result).toEqual(mockPermission);
      expect(prisma.permission.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException if permission not found', async () => {
      mockPrismaService.permission.findUnique.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new permission', async () => {
      const createDto = { name: 'delete', resource: 'users', description: 'Delete users' };
      const mockPermission = { id: '3', ...createDto };
      mockPrismaService.permission.create.mockResolvedValue(mockPermission);

      const result = await service.create(createDto as any);
      expect(result).toEqual(mockPermission);
      expect(prisma.permission.create).toHaveBeenCalledWith({ data: createDto });
    });
  });

  describe('update', () => {
    it('should update a permission', async () => {
      const updateDto = { description: 'Updated Description' };
      const mockPermission = { id: '1', name: 'read', resource: 'users', ...updateDto };
      mockPrismaService.permission.update.mockResolvedValue(mockPermission);

      const result = await service.update('1', updateDto as any);
      expect(result).toEqual(mockPermission);
      expect(prisma.permission.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateDto,
      });
    });
  });

  describe('remove', () => {
    it('should delete a permission', async () => {
      const mockPermission = { id: '1', name: 'read', resource: 'users' };
      mockPrismaService.permission.delete.mockResolvedValue(mockPermission);

      const result = await service.remove('1');
      expect(result).toEqual(mockPermission);
      expect(prisma.permission.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });
});
