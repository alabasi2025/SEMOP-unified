// PHASE: DTO_QUALITY_FIX
// role_permissions.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../1-core-services/prisma/prisma.service'; // افتراض وجود PrismaService في هذا المسار
import { CreateRolePermissionDto, UpdateRolePermissionDto } from './role_permissions.dto';
import { } from '@semop/contracts';

import { RolePermissions as RolePermissionModel } from '@prisma/client'; // افتراض أن اسم الموديل في العميل هو RolePermissions

@Injectable()
export class RolePermissionsService {
  constructor(private prisma: PrismaService) {}

  // إنشاء علاقة دور وصلاحية جديدة
  async create(data: CreateRolePermissionDto): Promise<RolePermissionModel> {
    return this.prisma.rolePermissions.create({
      data: {
        roleId: data.roleId,
        permissionId: data.permissionId,
        assignedBy: data.assignedBy,
      },
    });
  }

  // جلب جميع علاقات الدور والصلاحية
  async findAll(): Promise<RolePermissionModel[]> {
    return this.prisma.rolePermissions.findMany();
  }

  // جلب علاقة دور وصلاحية محددة باستخدام المفتاح المركب
  async findOne(roleId: number, permissionId: number): Promise<RolePermissionModel | null> {
    const rolePermission = await this.prisma.rolePermissions.findUnique({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId,
        },
      },
    });

    if (!rolePermission) {
      throw new NotFoundException(`RolePermission with roleId ${roleId} and permissionId ${permissionId} not found`);
    }

    return rolePermission;
  }

  // تحديث علاقة دور وصلاحية محددة
  async update(
    roleId: number,
    permissionId: number,
    data: UpdateRolePermissionDto,
  ): Promise<RolePermissionModel> {
    try {
      return await this.prisma.rolePermissions.update({
        where: {
          roleId_permissionId: {
            roleId,
            permissionId,
          },
        },
        data: {
          assignedBy: data.assignedBy,
        },
      });
    } catch (error) {
      // التعامل مع حالة عدم العثور على السجل
      if (error.code === 'P2025') {
        throw new NotFoundException(`RolePermission with roleId ${roleId} and permissionId ${permissionId} not found`);
      }
      throw error;
    }
  }

  // حذف علاقة دور وصلاحية محددة
  async remove(roleId: number, permissionId: number): Promise<RolePermissionModel> {
    try {
      return await this.prisma.rolePermissions.delete({
        where: {
          roleId_permissionId: {
            roleId,
            permissionId,
          },
        },
      });
    } catch (error) {
      // التعامل مع حالة عدم العثور على السجل
      if (error.code === 'P2025') {
        throw new NotFoundException(`RolePermission with roleId ${roleId} and permissionId ${permissionId} not found`);
      }
      throw error;
    }
  }
}
