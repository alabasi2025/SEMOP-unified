import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../1-core-services/prisma/prisma.service';
import { CreateUnitDto } from '../dto/create-unit.dto';
import { UpdateUnitDto } from '../dto/update-unit.dto';
import { UnitInfo, PaginatedResponse } from '../interfaces/inventory.interface';

/**
 * خدمة إدارة وحدات القياس
 */
@Injectable()
export class UnitsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * جلب جميع الوحدات
   */
  async findAll(
    page: number = 1,
    limit: number = 50,
  ): Promise<PaginatedResponse<UnitInfo>> {
    const skip = (page - 1) * limit;

    const [units, total] = await Promise.all([
      this.prisma.unit.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.unit.count(),
    ]);

    return {
      data: units as UnitInfo[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * جلب وحدة واحدة
   */
  async findOne(id: string): Promise<UnitInfo> {
    const unit = await this.prisma.unit.findUnique({
      where: { id },
    });

    if (!unit) {
      throw new NotFoundException('الوحدة غير موجودة');
    }

    return unit as UnitInfo;
  }

  /**
   * إنشاء وحدة جديدة
   */
  async create(dto: CreateUnitDto): Promise<UnitInfo> {
    // التحقق من عدم تكرار الكود
    const existing = await this.prisma.unit.findUnique({
      where: { code: dto.code },
    });

    if (existing) {
      throw new ConflictException('الكود مستخدم بالفعل');
    }

    const unit = await this.prisma.unit.create({
      data: {
        ...dto,
        isActive: dto.isActive ?? true,
      },
    });

    return unit as UnitInfo;
  }

  /**
   * تحديث وحدة
   */
  async update(id: string, dto: UpdateUnitDto): Promise<UnitInfo> {
    await this.findOne(id);

    if (dto.code) {
      const existing = await this.prisma.unit.findUnique({
        where: { code: dto.code },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('الكود مستخدم بالفعل');
      }
    }

    const unit = await this.prisma.unit.update({
      where: { id },
      data: dto,
    });

    return unit as UnitInfo;
  }

  /**
   * حذف وحدة
   */
  async delete(id: string): Promise<void> {
    await this.findOne(id);

    await this.prisma.unit.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
