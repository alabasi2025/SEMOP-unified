import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../1-core-services/prisma/prisma.service';
import { CreateItemDto } from '../dto/create-item.dto';
import { UpdateItemDto } from '../dto/update-item.dto';
import { PaginatedResponse, ItemInfo } from '../interfaces/inventory.interface';
import { StockBalance } from '../interfaces/stock-balance.interface';

/**
 * خدمة إدارة الأصناف
 * 
 * توفر جميع العمليات المتعلقة بالأصناف:
 * - CRUD operations
 * - البحث والفلترة
 * - إدارة الرصيد
 * - التقارير
 */
@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * جلب جميع الأصناف مع pagination
   */
  async findAll(
    page: number = 1,
    limit: number = 50,
    filters?: {
      search?: string;
      categoryId?: string;
      isActive?: boolean;
    },
  ): Promise<PaginatedResponse<ItemInfo>> {
    const skip = (page - 1) * limit;

    // بناء شروط البحث
    const where: any = {};

    if (filters?.search) {
      where.OR = [
        { code: { contains: filters.search, mode: 'insensitive' } },
        { nameAr: { contains: filters.search, mode: 'insensitive' } },
        { nameEn: { contains: filters.search, mode: 'insensitive' } },
        { barcode: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    // جلب البيانات
    const [items, total] = await Promise.all([
      this.prisma.item.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.item.count({ where }),
    ]);

    return {
      data: items as ItemInfo[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * جلب صنف واحد حسب المعرف
   */
  async findOne(id: string): Promise<ItemInfo> {
    const item = await this.prisma.item.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException(`الصنف بالمعرف ${id} غير موجود`);
    }

    return item as ItemInfo;
  }

  /**
   * جلب صنف حسب الكود
   */
  async findByCode(code: string): Promise<ItemInfo | null> {
    const item = await this.prisma.item.findUnique({
      where: { code },
    });

    return item as ItemInfo | null;
  }

  /**
   * جلب صنف حسب الباركود
   */
  async findByBarcode(barcode: string): Promise<ItemInfo | null> {
    const item = await this.prisma.item.findUnique({
      where: { barcode },
    });

    return item as ItemInfo | null;
  }

  /**
   * إنشاء صنف جديد
   */
  async create(createItemDto: CreateItemDto): Promise<ItemInfo> {
    // التحقق من عدم تكرار الكود
    const existingCode = await this.findByCode(createItemDto.code);
    if (existingCode) {
      throw new ConflictException(`الكود ${createItemDto.code} مستخدم بالفعل`);
    }

    // التحقق من عدم تكرار الباركود
    if (createItemDto.barcode) {
      const existingBarcode = await this.findByBarcode(createItemDto.barcode);
      if (existingBarcode) {
        throw new ConflictException(
          `الباركود ${createItemDto.barcode} مستخدم بالفعل`,
        );
      }
    }

    // التحقق من عدم تكرار SKU
    if (createItemDto.sku) {
      const existingSku = await this.prisma.item.findUnique({
        where: { sku: createItemDto.sku },
      });
      if (existingSku) {
        throw new ConflictException(
          `SKU ${createItemDto.sku} مستخدم بالفعل`,
        );
      }
    }

    // إنشاء الصنف
    const item = await this.prisma.item.create({
      data: {
        ...createItemDto,
        isActive: createItemDto.isActive ?? true,
      },
    });

    return item as ItemInfo;
  }

  /**
   * تحديث صنف موجود
   */
  async update(id: string, updateItemDto: UpdateItemDto): Promise<ItemInfo> {
    // التحقق من وجود الصنف
    await this.findOne(id);

    // التحقق من عدم تكرار الكود
    if (updateItemDto.code) {
      const existingCode = await this.findByCode(updateItemDto.code);
      if (existingCode && existingCode.id !== id) {
        throw new ConflictException(`الكود ${updateItemDto.code} مستخدم بالفعل`);
      }
    }

    // التحقق من عدم تكرار الباركود
    if (updateItemDto.barcode) {
      const existingBarcode = await this.findByBarcode(updateItemDto.barcode);
      if (existingBarcode && existingBarcode.id !== id) {
        throw new ConflictException(
          `الباركود ${updateItemDto.barcode} مستخدم بالفعل`,
        );
      }
    }

    // التحقق من عدم تكرار SKU
    if (updateItemDto.sku) {
      const existingSku = await this.prisma.item.findUnique({
        where: { sku: updateItemDto.sku },
      });
      if (existingSku && existingSku.id !== id) {
        throw new ConflictException(
          `SKU ${updateItemDto.sku} مستخدم بالفعل`,
        );
      }
    }

    // تحديث الصنف
    const item = await this.prisma.item.update({
      where: { id },
      data: updateItemDto,
    });

    return item as ItemInfo;
  }

  /**
   * حذف صنف (soft delete)
   */
  async delete(id: string): Promise<void> {
    // التحقق من وجود الصنف
    await this.findOne(id);

    // التحقق من عدم وجود رصيد للصنف
    const stock = await this.prisma.warehouseItem.findMany({
      where: {
        itemId: id,
        quantity: { gt: 0 },
      },
    });

    if (stock.length > 0) {
      throw new BadRequestException(
        'لا يمكن حذف الصنف لأنه يحتوي على رصيد في المستودعات',
      );
    }

    // حذف الصنف (soft delete)
    await this.prisma.item.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * البحث في الأصناف
   */
  async search(
    query: string,
    limit: number = 20,
  ): Promise<ItemInfo[]> {
    const items = await this.prisma.item.findMany({
      where: {
        OR: [
          { code: { contains: query, mode: 'insensitive' } },
          { nameAr: { contains: query, mode: 'insensitive' } },
          { nameEn: { contains: query, mode: 'insensitive' } },
          { barcode: { contains: query, mode: 'insensitive' } },
          { sku: { contains: query, mode: 'insensitive' } },
        ],
        isActive: true,
      },
      take: limit,
      orderBy: { nameAr: 'asc' },
    });

    return items as ItemInfo[];
  }

  /**
   * جلب أصناف حسب الفئة
   */
  async findByCategory(
    categoryId: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<PaginatedResponse<ItemInfo>> {
    return this.findAll(page, limit, { categoryId, isActive: true });
  }

  /**
   * جلب رصيد صنف في جميع المستودعات
   */
  async getItemStock(itemId: string): Promise<StockBalance[]> {
    // التحقق من وجود الصنف
    await this.findOne(itemId);

    // جلب الرصيد من جميع المستودعات
    const stock = await this.prisma.warehouseItem.findMany({
      where: { itemId },
      include: {
        warehouse: {
          select: {
            id: true,
            code: true,
            nameAr: true,
          },
        },
        item: {
          select: {
            id: true,
            code: true,
            nameAr: true,
            costPrice: true,
          },
        },
      },
    });

    return stock.map((s) => ({
      warehouseId: s.warehouseId,
      warehouseName: s.warehouse.nameAr,
      itemId: s.itemId,
      itemName: s.item.nameAr,
      quantity: s.quantity,
      reservedQty: s.reservedQty,
      availableQty: s.availableQty,
      costPrice: s.item.costPrice ?? undefined,
      totalValue: s.item.costPrice ? s.quantity * s.item.costPrice : undefined,
      lastUpdated: s.lastUpdated,
    }));
  }

  /**
   * جلب الأصناف التي وصلت للحد الأدنى
   */
  async getLowStockItems(warehouseId?: string): Promise<any[]> {
    const where: any = {
      isActive: true,
      minStock: { gt: 0 },
    };

    const items = await this.prisma.item.findMany({
      where,
      include: {
        warehouseItems: {
          where: warehouseId ? { warehouseId } : undefined,
          include: {
            warehouse: {
              select: {
                id: true,
                nameAr: true,
              },
            },
          },
        },
      },
    });

    // فلترة الأصناف التي الرصيد أقل من الحد الأدنى
    const lowStockItems = items
      .flatMap((item) =>
        item.warehouseItems
          .filter((wi) => wi.quantity < (item.minStock ?? 0))
          .map((wi) => ({
            itemId: item.id,
            itemCode: item.code,
            itemName: item.nameAr,
            warehouseId: wi.warehouseId,
            warehouseName: wi.warehouse.nameAr,
            currentQuantity: wi.quantity,
            minStock: item.minStock,
            reorderPoint: item.reorderPoint,
            shortage: (item.minStock ?? 0) - wi.quantity,
            status:
              wi.quantity === 0
                ? 'CRITICAL'
                : wi.quantity <= (item.reorderPoint ?? 0)
                ? 'AT_REORDER'
                : 'BELOW_MIN',
          })),
      );

    return lowStockItems;
  }
}
