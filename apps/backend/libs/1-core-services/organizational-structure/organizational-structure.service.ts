// PHASE: DTO_QUALITY_FIX
// PHASE-14: إصلاح جميع any types واستخدام DTOs من @semop/contracts
// PHASE-13: إضافة Input Validation وتحسين Business Logic
// PHASE-11: إصلاح انتهاكات DTOs والبنية المعمارية - استخدام @semop/contracts
/**
 * PHASE 10: Organizational Structure Development
 * Service for managing organizational structure with Prisma
 * Maps between DTOs (@semop/contracts) and Prisma models
 */

import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  CreateDepartmentDto,
  UpdateDepartmentDto,
  CreatePositionDto,
  UpdatePositionDto,
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from '@semop/contracts';

@Injectable()
export class OrganizationalStructureService {
  private prisma = new PrismaClient();

  // ============================================
  // Department Methods
  // ============================================

  async createDepartment(dto: CreateDepartmentDto) {
    return this.prisma.department.create({
      data: {
        code: dto.code,
        nameAr: dto.name, // Map name -> nameAr
        nameEn: dto.name, // Use same for both (can be enhanced later)
        description: dto.description,
        parentDepartmentId: dto.parentId,
        managerId: dto.managerId,
        isActive: true,
        level: 1, // Will be calculated based on parent
      },
    });
  }

  async getAllDepartments() {
    return this.prisma.department.findMany({
      where: { isActive: true },
      include: {
        parentDepartment: {
          select: {
            id: true,
            nameAr: true,
            nameEn: true,
          },
        },
        subDepartments: {
          select: {
            id: true,
            code: true,
            nameAr: true,
            nameEn: true,
          },
        },
        employees: {
          select: {
            id: true,
            code: true,
            firstNameAr: true,
            lastNameAr: true,
            email: true,
          },
        },
      },
      orderBy: { level: 'asc' },
    });
  }

  async getDepartmentById(id: string) {
    return this.prisma.department.findUnique({
      where: { id },
      include: {
        parentDepartment: true,
        subDepartments: true,
        employees: true,
      },
    });
  }

  async updateDepartment(id: string, dto: UpdateDepartmentDto) {
    const data: {
      nameAr?: string;
      nameEn?: string;
      description?: string | null;
      parentDepartmentId?: string | null;
      managerId?: string | null;
      isActive?: boolean;
    } = {};
    if (dto.name) {
      data.nameAr = dto.name;
      data.nameEn = dto.name;
    }
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.parentId !== undefined) data.parentDepartmentId = dto.parentId;
    if (dto.managerId !== undefined) data.managerId = dto.managerId;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;

    return this.prisma.department.update({
      where: { id },
      data,
    });
  }

  async deleteDepartment(id: string) {
    return this.prisma.department.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getDepartmentHierarchy() {
    const departments = await this.prisma.department.findMany({
      where: { isActive: true },
      include: {
        subDepartments: true,
        employees: {
          select: {
            id: true,
            firstNameAr: true,
            lastNameAr: true,
          },
        },
      },
      orderBy: { level: 'asc' },
    });

    // Build tree structure
    const buildTree = (parentId: string | null): unknown[] => {
      return departments
        .filter((d) => d.parentDepartmentId === parentId)
        .map((d) => ({
          ...d,
          children: buildTree(d.id),
        }));
    };

    return buildTree(null);
  }

  // ============================================
  // Position Methods
  // ============================================

  async createPosition(dto: CreatePositionDto) {
    return this.prisma.position.create({
      data: {
        code: dto.code,
        titleAr: dto.title, // Map title -> titleAr
        titleEn: dto.title, // Use same for both
        description: dto.description,
        level: dto.level || 1,
        isActive: true,
      },
    });
  }

  async getAllPositions() {
    return this.prisma.position.findMany({
      where: { isActive: true },
      include: {
        employees: {
          select: {
            id: true,
            firstNameAr: true,
            lastNameAr: true,
          },
        },
      },
      orderBy: { level: 'asc' },
    });
  }

  async getPositionById(id: string) {
    return this.prisma.position.findUnique({
      where: { id },
      include: {
        employees: true,
      },
    });
  }

  async updatePosition(id: string, dto: UpdatePositionDto) {
    const data: {
      titleAr?: string;
      titleEn?: string;
      description?: string | null;
      level?: number;
      isActive?: boolean;
    } = {};
    if (dto.title) {
      data.titleAr = dto.title;
      data.titleEn = dto.title;
    }
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.level !== undefined) data.level = dto.level;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;

    return this.prisma.position.update({
      where: { id },
      data,
    });
  }

  async deletePosition(id: string) {
    return this.prisma.position.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // ============================================
  // Employee Methods
  // ============================================

  async createEmployee(dto: CreateEmployeeDto) {
    return this.prisma.employee.create({
      data: {
        code: dto.code,
        firstNameAr: dto.firstName, // Map firstName -> firstNameAr
        lastNameAr: dto.lastName, // Map lastName -> lastNameAr
        firstNameEn: dto.firstName, // Use same for both
        lastNameEn: dto.lastName,
        email: dto.email,
        phone: dto.phone || dto.mobile || '',
        departmentId: (dto as any).departmentId, // From extended DTO
        positionId: (dto as any).positionId, // From extended DTO
        managerId: (dto as any).managerId,
        hireDate: new Date(dto.hireDate),
        salary: (dto as any).salary,
        isActive: true,
        userId: (dto as any).userId,
      },
    });
  }

  async getAllEmployees() {
    return this.prisma.employee.findMany({
      where: { isActive: true },
      include: {
        department: {
          select: {
            id: true,
            nameAr: true,
            nameEn: true,
          },
        },
        position: {
          select: {
            id: true,
            titleAr: true,
            titleEn: true,
          },
        },
        manager: {
          select: {
            id: true,
            firstNameAr: true,
            lastNameAr: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getEmployeeById(id: string) {
    return this.prisma.employee.findUnique({
      where: { id },
      include: {
        department: true,
        position: true,
        manager: true,
        subordinates: true,
      },
    });
  }

  async updateEmployee(id: string, dto: UpdateEmployeeDto) {
    const data: {
      firstNameAr?: string;
      firstNameEn?: string;
      lastNameAr?: string;
      lastNameEn?: string;
      email?: string;
      phone?: string;
      departmentId?: string;
      positionId?: string;
      managerId?: string | null;
      salary?: number;
      isActive?: boolean;
    } = {};
    if ((dto as any).firstName) {
      data.firstNameAr = (dto as any).firstName;
      data.firstNameEn = (dto as any).firstName;
    }
    if ((dto as any).lastName) {
      data.lastNameAr = (dto as any).lastName;
      data.lastNameEn = (dto as any).lastName;
    }
    if ((dto as any).email) data.email = (dto as any).email;
    if ((dto as any).phone) data.phone = (dto as any).phone;
    if ((dto as any).departmentId) data.departmentId = (dto as any).departmentId;
    if ((dto as any).positionId) data.positionId = (dto as any).positionId;
    if ((dto as any).managerId !== undefined) data.managerId = (dto as any).managerId;
    if ((dto as any).salary !== undefined) data.salary = (dto as any).salary;
    if ((dto as any).isActive !== undefined) data.isActive = (dto as any).isActive;

    return this.prisma.employee.update({
      where: { id },
      data,
    });
  }

  async deleteEmployee(id: string) {
    return this.prisma.employee.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getEmployeesByDepartment(departmentId: string) {
    return this.prisma.employee.findMany({
      where: {
        departmentId,
        isActive: true,
      },
      include: {
        position: true,
        manager: {
          select: {
            id: true,
            firstNameAr: true,
            lastNameAr: true,
          },
        },
      },
    });
  }

  // ============================================
  // Statistics
  // ============================================

  async getStatistics() {
    const [
      totalDepartments,
      totalPositions,
      totalEmployees,
      activeEmployees,
    ] = await Promise.all([
      this.prisma.department.count({ where: { isActive: true } }),
      this.prisma.position.count({ where: { isActive: true } }),
      this.prisma.employee.count(),
      this.prisma.employee.count({ where: { isActive: true } }),
    ]);

    return {
      totalDepartments,
      totalPositions,
      totalEmployees,
      activeEmployees,
      inactiveEmployees: totalEmployees - activeEmployees,
    };
  }
}
