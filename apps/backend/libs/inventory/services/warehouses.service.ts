import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../1-core-services/prisma/prisma.service';
import { CreateWarehouseDto } from '../dto/create-warehouse.dto';
import { UpdateWarehouseDto } from '../dto/update-warehouse.dto';
import {
  PaginatedResponse,
  WarehouseInfo,
  WarehouseStats,
} from '../interfaces/inventory.interface';
import {
  StockBalance,
  WarehouseStockSummary,
} from '../interfaces/stock-balance.interface';

/**
 * خدمة إدارة المستودعات
 * 
 * توفر جميع العمليات المتعلقة بالمستودعات:
 * - CRUD operations
 * - إدارة الرصيد
 * - الإحصائيات والتقارير
 */
@Injectable()
export class WarehousesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * جلب جميع المستودعات مع pagination
   */
  async findAll(
    page: number = 1,
    limit: number = 50,
    filters?: {
      search?: string;
      isActive?: boolean;
    },
  ): Promise<PaginatedResponse<WarehouseInfo>> {
    const skip = (page - 1) * limit;

    // بناء شروط البحث
    const where: any = {};

    if (filters?.search) {
      where.OR = [
        { code: { contains: filters.search, mode: 'insensitive' } },
        { nameAr: { contains: filters.search, mode: 'insensitive' } },
        { nameEn: { contains: filters.search, mode: 'insensitive' } },
        { location: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    // جلب البيانات
    const [warehouses, total] = await Promise.all([
      this.prisma.warehouse.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.warehouse.count({ where }),
    ]);

    return {
      data: warehouses as WarehouseInfo[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * جلب مستودع واحد حسب المعرف
   */
  async findOne(id: string): Promise<WarehouseInfo> {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id },
    });

    if (!warehouse) {
      throw new NotFoundException(`المستودع بالمعرف ${id} غير موجود`);
    }

    return warehouse as WarehouseInfo;
  }

  /**
   * جلب مستودع حسب الكود
   */
  async findByCode(code: string): Promise<WarehouseInfo | null> {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { code },
    });

    return warehouse as WarehouseInfo | null;
  }

  /**
   * إنشاء مستودع جديد
   */
  async create(createWarehouseDto: CreateWarehouseDto): Promise<WarehouseInfo> {
    // التحقق من عدم تكرار الكود
    const existingCode = await this.findByCode(createWarehouseDto.code);
    if (existingCode) {
      throw new ConflictException(
        `الكود ${createWarehouseDto.code} مستخدم بالفعل`,
      );
    }

    // إنشاء المستودع
    const warehouse = await this.prisma.warehouse.create({
      data: {
        ...createWarehouseDto,
        currentStock: 0,
        isActive: createWarehouseDto.isActive ?? true,
      },
    });

    return warehouse as WarehouseInfo;
  }

  /**
   * تحديث مستودع موجود
   */
  async update(
    id: string,
    updateWarehouseDto: UpdateWarehouseDto,
  ): Promise<WarehouseInfo> {
    // التحقق من وجود المستودع
    await this.findOne(id);

    // التحقق من عدم تكرار الكود
    if (updateWarehouseDto.code) {
      const existingCode = await this.findByCode(updateWarehouseDto.code);
      if (existingCode && existingCode.id !== id) {
        throw new ConflictException(
          `الكود ${updateWarehouseDto.code} مستخدم بالفعل`,
        );
      }
    }

    // تحديث المستودع
    const warehouse = await this.prisma.warehouse.update({
      where: { id },
      data: updateWarehouseDto,
    });

    return warehouse as WarehouseInfo;
  }

  /**
   * حذف مستودع (soft delete)
   */
  async delete(id: string): Promise<void> {
    // التحقق من وجود المستودع
    await this.findOne(id);

    // التحقق من عدم وجود رصيد في المستودع
    const stock = await this.prisma.warehouseItem.findMany({
      where: {
        warehouseId: id,
        quantity: { gt: 0 },
      },
    });

    if (stock.length > 0) {
      throw new BadRequestException(
        'لا يمكن حذف المستودع لأنه يحتوي على رصيد',
      );
    }

    // حذف المستودع (soft delete)
    await this.prisma.warehouse.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * جلب جميع الأصناف في مستودع
   */
  async getWarehouseStock(
    warehouseId: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<WarehouseStockSummary> {
    // التحقق من وجود المستودع
    const warehouse = await this.findOne(warehouseId);

    const skip = (page - 1) * limit;

    // جلب الأصناف
    const [items, totalItems] = await Promise.all([
      this.prisma.warehouseItem.findMany({
        where: { warehouseId },
        skip,
        take: limit,
        include: {
          item: {
            select: {
              id: true,
              code: true,
              nameAr: true,
              costPrice: true,
            },
          },
        },
      }),
      this.prisma.warehouseItem.count({ where: { warehouseId } }),
    ]);

    // حساب الإجماليات
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = items.reduce(
      (sum, item) =>
        sum + item.quantity * (item.item.costPrice ?? 0),
      0,
    );

    // تحويل البيانات
    const stockBalances: StockBalance[] = items.map((item) => ({
      warehouseId: item.warehouseId,
      warehouseName: warehouse.nameAr,
      itemId: item.itemId,
      itemName: item.item.nameAr,
      quantity: item.quantity,
      reservedQty: item.reservedQty,
      availableQty: item.availableQty,
      costPrice: item.item.costPrice ?? undefined,
      totalValue: item.item.costPrice
        ? item.quantity * item.item.costPrice
        : undefined,
      lastUpdated: item.lastUpdated,
    }));

    return {
      warehouseId: warehouse.id,
      warehouseCode: warehouse.code,
      warehouseName: warehouse.nameAr,
      totalItems,
      totalQuantity,
      totalValue,
      items: stockBalances,
    };
  }

  /**
   * حساب قيمة المخزون في مستودع
   */
  async getWarehouseValue(warehouseId: string): Promise<number> {
    // التحقق من وجود المستودع
    await this.findOne(warehouseId);

    // جلب جميع الأصناف مع الأسعار
    const items = await this.prisma.warehouseItem.findMany({
      where: { warehouseId },
      include: {
        item: {
          select: {
            costPrice: true,
          },
        },
      },
    });

    // حساب القيمة الإجمالية
    const totalValue = items.reduce(
      (sum, item) =>
        sum + item.quantity * (item.item.costPrice ?? 0),
      0,
    );

    return totalValue;
  }

  /**
   * حساب نسبة الإشغال
   */
  async getWarehouseCapacity(warehouseId: string): Promise<{
    capacity: number;
    currentStock: number;
    percentage: number;
  }> {
    // التحقق من وجود المستودع
    const warehouse = await this.findOne(warehouseId);

    if (!warehouse.capacity || warehouse.capacity === 0) {
      return {
        capacity: 0,
        currentStock: warehouse.currentStock ?? 0,
        percentage: 0,
      };
    }

    // حساب الرصيد الحالي
    const currentStock = await this.prisma.warehouseItem.aggregate({
      where: { warehouseId },
      _sum: { quantity: true },
    });

    const totalStock = currentStock._sum.quantity ?? 0;

    // تحديث الرصيد في المستودع
    await this.prisma.warehouse.update({
      where: { id: warehouseId },
      data: { currentStock: totalStock },
    });

    return {
      capacity: warehouse.capacity,
      currentStock: totalStock,
      percentage: (totalStock / warehouse.capacity) * 100,
    };
  }

  /**
   * جلب حركات مستودع
   */
  async getWarehouseMovements(
    warehouseId: string,
    startDate?: Date,
    endDate?: Date,
    page: number = 1,
    limit: number = 50,
  ): Promise<any> {
    // التحقق من وجود المستودع
    await this.findOne(warehouseId);

    const skip = (page - 1) * limit;

    // بناء شروط البحث
    const where: any = { warehouseId };

    if (startDate || endDate) {
      where.movementDate = {};
      if (startDate) where.movementDate.gte = startDate;
      if (endDate) where.movementDate.lte = endDate;
    }

    // جلب الحركات
    const [movements, total] = await Promise.all([
      this.prisma.stockMovement.findMany({
        where,
        skip,
        take: limit,
        include: {
          item: {
            select: {
              code: true,
              nameAr: true,
            },
          },
        },
        orderBy: { movementDate: 'desc' },
      }),
      this.prisma.stockMovement.count({ where }),
    ]);

    return {
      data: movements,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * جلب إحصائيات المستودع
   */
  async getWarehouseStats(warehouseId: string): Promise<WarehouseStats> {
    // التحقق من وجود المستودع
    const warehouse = await this.findOne(warehouseId);

    // جلب عدد الأصناف
    const totalItems = await this.prisma.warehouseItem.count({
      where: { warehouseId },
    });

    // جلب الكمية الإجمالية
    const totalQuantity = await this.prisma.warehouseItem.aggregate({
      where: { warehouseId },
      _sum: { quantity: true },
    });

    // حساب القيمة الإجمالية
    const totalValue = await this.getWarehouseValue(warehouseId);

    // حساب نسبة الإشغال
    const capacity = await this.getWarehouseCapacity(warehouseId);

    return {
      warehouseId: warehouse.id,
      warehouseName: warehouse.nameAr,
      totalItems,
      totalQuantity: totalQuantity._sum.quantity ?? 0,
      totalValue,
      capacityUsed: capacity.currentStock,
      capacityPercentage: capacity.percentage,
    };
  }
}
