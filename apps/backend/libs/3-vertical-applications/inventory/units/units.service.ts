import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../1-core-services/prisma/prisma.service';

@Injectable()
export class UnitsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.unit.create({
      data: {
        code: data.code || `UNIT-${Date.now()}`,
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        symbol: data.symbol,
        isActive: data.isActive ?? true,
      },
    });
  }

  async findAll() {
    return this.prisma.unit.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.unit.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.unit.update({
      where: { id },
      data: {
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        symbol: data.symbol,
        isActive: data.isActive,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.unit.delete({
      where: { id },
    });
  }
}
