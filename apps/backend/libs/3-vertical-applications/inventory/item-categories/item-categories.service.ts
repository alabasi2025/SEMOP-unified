import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../1-core-services/prisma/prisma.service';

@Injectable()
export class ItemCategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.itemCategory.create({
      data: {
        code: data.code || `CAT-${Date.now()}`,
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        description: data.description,
        parentId: data.parentId,
        isActive: data.isActive ?? true,
      },
    });
  }

  async findAll() {
    return this.prisma.itemCategory.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.itemCategory.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.itemCategory.update({
      where: { id },
      data: {
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        description: data.description,
        parentId: data.parentId,
        isActive: data.isActive,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.itemCategory.delete({
      where: { id },
    });
  }
}
