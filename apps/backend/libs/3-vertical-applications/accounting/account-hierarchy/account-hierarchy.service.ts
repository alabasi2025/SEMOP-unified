// PHASE: DTO_QUALITY_FIX
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../1-core-services/prisma/prisma.service'; // افتراض وجود PrismaService في هذا المسار
import { CreateAccountHierarchyDto, UpdateAccountHierarchyDto } from './account_hierarchy.dto';
import { } from '@semop/contracts';

import { AccountHierarchy } from '@prisma/client'; // افتراض أن Prisma Client تم توليده

@Injectable()
export class AccountHierarchyService {
  constructor(private prisma: PrismaService) {}

  /**
   * إنشاء هيكلية حسابات جديدة
   * @param createAccountHierarchyDto بيانات الهيكلية الجديدة
   * @returns الهيكلية التي تم إنشاؤها
   */
  async create(createAccountHierarchyDto: CreateAccountHierarchyDto): Promise<AccountHierarchy> {
    return this.prisma.accountHierarchy.create({
      data: createAccountHierarchyDto,
    });
  }

  /**
   * الحصول على جميع هيكليات الحسابات
   * @returns قائمة بهيكليات الحسابات
   */
  async findAll(): Promise<AccountHierarchy[]> {
    return this.prisma.accountHierarchy.findMany();
  }

  /**
   * الحصول على هيكلية حسابات محددة بواسطة ID
   * @param id معرف الهيكلية
   * @returns الهيكلية المطلوبة
   * @throws NotFoundException إذا لم يتم العثور على الهيكلية
   */
  async findOne(id: string): Promise<AccountHierarchy> {
    const hierarchy = await this.prisma.accountHierarchy.findUnique({
      where: { id },
    });

    if (!hierarchy) {
      throw new NotFoundException(`AccountHierarchy with ID ${id} not found`);
    }

    return hierarchy;
  }

  /**
   * تحديث هيكلية حسابات محددة
   * @param id معرف الهيكلية
   * @param updateAccountHierarchyDto بيانات التحديث
   * @returns الهيكلية المحدثة
   * @throws NotFoundException إذا لم يتم العثور على الهيكلية
   */
  async update(id: string, updateAccountHierarchyDto: UpdateAccountHierarchyDto): Promise<AccountHierarchy> {
    try {
      return await this.prisma.accountHierarchy.update({
        where: { id },
        data: updateAccountHierarchyDto,
      });
    } catch (error) {
      // التعامل مع حالة عدم العثور على السجل
      if (error.code === 'P2025') {
        throw new NotFoundException(`AccountHierarchy with ID ${id} not found`);
      }
      throw error;
    }
  }

  /**
   * حذف هيكلية حسابات محددة
   * @param id معرف الهيكلية
   * @returns الهيكلية المحذوفة
   * @throws NotFoundException إذا لم يتم العثور على الهيكلية
   */
  async remove(id: string): Promise<AccountHierarchy> {
    try {
      return await this.prisma.accountHierarchy.delete({
        where: { id },
      });
    } catch (error) {
      // التعامل مع حالة عدم العثور على السجل
      if (error.code === 'P2025') {
        throw new NotFoundException(`AccountHierarchy with ID ${id} not found`);
      }
      throw error;
    }
  }
}
