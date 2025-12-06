import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../1-core-services/prisma/prisma.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryInfo, PaginatedResponse } from '../interfaces/inventory.interface';

/**
 * خدمة إدارة فئات الأصناف
 */
@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * جلب جميع الفئات
   */
  async findAll(
    page: number = 1,
    limit: number = 50,
  ): Promise<PaginatedResponse<CategoryInfo>> {
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      this.prisma.itemCategory.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.itemCategory.count(),
    ]);

    return {
      data: categories as CategoryInfo[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * جلب فئة واحدة
   */
  async findOne(id: string): Promise<CategoryInfo> {
    const category = await this.prisma.itemCategory.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('الفئة غير موجودة');
    }

    return category as CategoryInfo;
  }

  /**
   * إنشاء فئة جديدة
   */
  async create(dto: CreateCategoryDto): Promise<CategoryInfo> {
    // التحقق من عدم تكرار الكود
    const existing = await this.prisma.itemCategory.findUnique({
      where: { code: dto.code },
    });

    if (existing) {
      throw new ConflictException('الكود مستخدم بالفعل');
    }

    const category = await this.prisma.itemCategory.create({
      data: {
        ...dto,
        isActive: dto.isActive ?? true,
      },
    });

    return category as CategoryInfo;
  }

  /**
   * تحديث فئة
   */
  async update(id: string, dto: UpdateCategoryDto): Promise<CategoryInfo> {
    await this.findOne(id);

    if (dto.code) {
      const existing = await this.prisma.itemCategory.findUnique({
        where: { code: dto.code },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('الكود مستخدم بالفعل');
      }
    }

    const category = await this.prisma.itemCategory.update({
      where: { id },
      data: dto,
    });

    return category as CategoryInfo;
  }

  /**
   * حذف فئة
   */
  async delete(id: string): Promise<void> {
    await this.findOne(id);

    await this.prisma.itemCategory.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * جلب الهيكل الهرمي للفئات
   */
  async getHierarchy(): Promise<any[]> {
    const categories = await this.prisma.itemCategory.findMany({
      where: { isActive: true },
      orderBy: { nameAr: 'asc' },
    });

    // بناء الهيكل الهرمي
    const buildTree = (parentId: string | null = null): any[] => {
      return categories
        .filter((c) => c.parentId === parentId)
        .map((c) => ({
          ...c,
          children: buildTree(c.id),
        }));
    };

    return buildTree();
  }
}
