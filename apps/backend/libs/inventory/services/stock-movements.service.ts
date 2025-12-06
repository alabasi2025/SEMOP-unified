import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../1-core-services/prisma/prisma.service';
import { CreateMovementDto } from '../dto/create-movement.dto';
import { MovementType } from '../types/movement-type.enum';
import {
  PaginatedResponse,
} from '../interfaces/inventory.interface';
import {
  StockMovementDetail,
  MovementSummary,
} from '../interfaces/stock-balance.interface';

/**
 * خدمة إدارة حركات المخزون
 * 
 * توفر جميع العمليات المتعلقة بحركات المخزون:
 * - إدخال وإخراج
 * - تسويات
 * - تحويلات
 * - التقارير
 */
@Injectable()
export class StockMovementsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * توليد رقم حركة فريد
   */
  private async generateMovementNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // جلب آخر رقم في الشهر الحالي
    const lastMovement = await this.prisma.stockMovement.findFirst({
      where: {
        movementNumber: {
          startsWith: `MOV-${year}${month}`,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    let sequence = 1;
    if (lastMovement) {
      const lastSequence = parseInt(
        lastMovement.movementNumber.split('-')[2],
      );
      sequence = lastSequence + 1;
    }

    return `MOV-${year}${month}-${String(sequence).padStart(6, '0')}`;
  }

  /**
   * إنشاء حركة إدخال
   */
  async createInMovement(dto: CreateMovementDto): Promise<StockMovementDetail> {
    // التحقق من وجود المستودع والصنف
    const [warehouse, item] = await Promise.all([
      this.prisma.warehouse.findUnique({ where: { id: dto.warehouseId } }),
      this.prisma.item.findUnique({ where: { id: dto.itemId } }),
    ]);

    if (!warehouse) {
      throw new NotFoundException('المستودع غير موجود');
    }
    if (!item) {
      throw new NotFoundException('الصنف غير موجود');
    }

    // توليد رقم الحركة
    const movementNumber = await this.generateMovementNumber();

    // إنشاء الحركة
    const movement = await this.prisma.stockMovement.create({
      data: {
        movementNumber,
        movementType: MovementType.IN,
        warehouseId: dto.warehouseId,
        itemId: dto.itemId,
        quantity: dto.quantity,
        referenceType: dto.referenceType,
        referenceId: dto.referenceId,
        referenceNumber: dto.referenceNumber,
        notes: dto.notes,
        createdBy: dto.createdBy,
        movementDate: dto.movementDate ? new Date(dto.movementDate) : new Date(),
      },
    });

    // تحديث الرصيد
    await this.updateStockBalance(
      dto.warehouseId,
      dto.itemId,
      dto.quantity,
      'add',
    );

    return this.formatMovementDetail(movement, warehouse, item);
  }

  /**
   * إنشاء حركة إخراج
   */
  async createOutMovement(dto: CreateMovementDto): Promise<StockMovementDetail> {
    // التحقق من وجود المستودع والصنف
    const [warehouse, item] = await Promise.all([
      this.prisma.warehouse.findUnique({ where: { id: dto.warehouseId } }),
      this.prisma.item.findUnique({ where: { id: dto.itemId } }),
    ]);

    if (!warehouse) {
      throw new NotFoundException('المستودع غير موجود');
    }
    if (!item) {
      throw new NotFoundException('الصنف غير موجود');
    }

    // التحقق من توفر الكمية
    const stock = await this.prisma.warehouseItem.findUnique({
      where: {
        warehouseId_itemId: {
          warehouseId: dto.warehouseId,
          itemId: dto.itemId,
        },
      },
    });

    if (!stock || stock.availableQty < dto.quantity) {
      throw new BadRequestException(
        `الكمية المتاحة غير كافية. المتاح: ${stock?.availableQty ?? 0}`,
      );
    }

    // توليد رقم الحركة
    const movementNumber = await this.generateMovementNumber();

    // إنشاء الحركة
    const movement = await this.prisma.stockMovement.create({
      data: {
        movementNumber,
        movementType: MovementType.OUT,
        warehouseId: dto.warehouseId,
        itemId: dto.itemId,
        quantity: dto.quantity,
        referenceType: dto.referenceType,
        referenceId: dto.referenceId,
        referenceNumber: dto.referenceNumber,
        notes: dto.notes,
        createdBy: dto.createdBy,
        movementDate: dto.movementDate ? new Date(dto.movementDate) : new Date(),
      },
    });

    // تحديث الرصيد
    await this.updateStockBalance(
      dto.warehouseId,
      dto.itemId,
      dto.quantity,
      'subtract',
    );

    return this.formatMovementDetail(movement, warehouse, item);
  }

  /**
   * إنشاء تسوية
   */
  async createAdjustment(dto: CreateMovementDto): Promise<StockMovementDetail> {
    // التحقق من وجود المستودع والصنف
    const [warehouse, item] = await Promise.all([
      this.prisma.warehouse.findUnique({ where: { id: dto.warehouseId } }),
      this.prisma.item.findUnique({ where: { id: dto.itemId } }),
    ]);

    if (!warehouse) {
      throw new NotFoundException('المستودع غير موجود');
    }
    if (!item) {
      throw new NotFoundException('الصنف غير موجود');
    }

    // توليد رقم الحركة
    const movementNumber = await this.generateMovementNumber();

    // إنشاء الحركة
    const movement = await this.prisma.stockMovement.create({
      data: {
        movementNumber,
        movementType: MovementType.ADJUSTMENT,
        warehouseId: dto.warehouseId,
        itemId: dto.itemId,
        quantity: Math.abs(dto.quantity),
        referenceType: dto.referenceType,
        referenceId: dto.referenceId,
        referenceNumber: dto.referenceNumber,
        notes: dto.notes,
        createdBy: dto.createdBy,
        movementDate: dto.movementDate ? new Date(dto.movementDate) : new Date(),
      },
    });

    // تحديث الرصيد (زيادة أو نقصان حسب الإشارة)
    await this.updateStockBalance(
      dto.warehouseId,
      dto.itemId,
      Math.abs(dto.quantity),
      dto.quantity > 0 ? 'add' : 'subtract',
    );

    return this.formatMovementDetail(movement, warehouse, item);
  }

  /**
   * جلب جميع الحركات مع فلترة
   */
  async findAll(
    page: number = 1,
    limit: number = 50,
    filters?: {
      warehouseId?: string;
      itemId?: string;
      movementType?: MovementType;
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<PaginatedResponse<StockMovementDetail>> {
    const skip = (page - 1) * limit;

    // بناء شروط البحث
    const where: any = {};

    if (filters?.warehouseId) {
      where.warehouseId = filters.warehouseId;
    }
    if (filters?.itemId) {
      where.itemId = filters.itemId;
    }
    if (filters?.movementType) {
      where.movementType = filters.movementType;
    }
    if (filters?.startDate || filters?.endDate) {
      where.movementDate = {};
      if (filters.startDate) where.movementDate.gte = filters.startDate;
      if (filters.endDate) where.movementDate.lte = filters.endDate;
    }

    // جلب البيانات
    const [movements, total] = await Promise.all([
      this.prisma.stockMovement.findMany({
        where,
        skip,
        take: limit,
        include: {
          warehouse: {
            select: { nameAr: true },
          },
          item: {
            select: { code: true, nameAr: true },
          },
        },
        orderBy: { movementDate: 'desc' },
      }),
      this.prisma.stockMovement.count({ where }),
    ]);

    const data = movements.map((m) =>
      this.formatMovementDetail(m, m.warehouse, m.item),
    );

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * جلب تفاصيل حركة واحدة
   */
  async findOne(id: string): Promise<StockMovementDetail> {
    const movement = await this.prisma.stockMovement.findUnique({
      where: { id },
      include: {
        warehouse: {
          select: { nameAr: true },
        },
        item: {
          select: { code: true, nameAr: true },
        },
      },
    });

    if (!movement) {
      throw new NotFoundException('الحركة غير موجودة');
    }

    return this.formatMovementDetail(movement, movement.warehouse, movement.item);
  }

  /**
   * إلغاء حركة (عكس الحركة)
   */
  async cancelMovement(id: string, cancelledBy?: string): Promise<void> {
    const movement = await this.findOne(id);

    // عكس الحركة
    const reverseOperation =
      movement.movementType === 'IN' ? 'subtract' : 'add';

    await this.updateStockBalance(
      movement.warehouseId,
      movement.itemId,
      movement.quantity,
      reverseOperation,
    );

    // حذف الحركة
    await this.prisma.stockMovement.delete({
      where: { id },
    });
  }

  /**
   * جلب حركات صنف معين
   */
  async getItemMovements(
    itemId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<MovementSummary> {
    const where: any = { itemId };

    if (startDate || endDate) {
      where.movementDate = {};
      if (startDate) where.movementDate.gte = startDate;
      if (endDate) where.movementDate.lte = endDate;
    }

    const movements = await this.prisma.stockMovement.findMany({
      where,
      include: {
        warehouse: { select: { nameAr: true } },
        item: { select: { code: true, nameAr: true } },
      },
      orderBy: { movementDate: 'desc' },
    });

    return this.calculateMovementSummary(movements);
  }

  /**
   * جلب حركات مستودع معين
   */
  async getWarehouseMovements(
    warehouseId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<MovementSummary> {
    const where: any = { warehouseId };

    if (startDate || endDate) {
      where.movementDate = {};
      if (startDate) where.movementDate.gte = startDate;
      if (endDate) where.movementDate.lte = endDate;
    }

    const movements = await this.prisma.stockMovement.findMany({
      where,
      include: {
        warehouse: { select: { nameAr: true } },
        item: { select: { code: true, nameAr: true } },
      },
      orderBy: { movementDate: 'desc' },
    });

    return this.calculateMovementSummary(movements);
  }

  /**
   * تحديث رصيد المخزون
   */
  async updateStockBalance(
    warehouseId: string,
    itemId: string,
    quantity: number,
    operation: 'add' | 'subtract',
  ): Promise<void> {
    // البحث عن الرصيد الحالي
    const existingStock = await this.prisma.warehouseItem.findUnique({
      where: {
        warehouseId_itemId: {
          warehouseId,
          itemId,
        },
      },
    });

    const newQuantity =
      operation === 'add'
        ? (existingStock?.quantity ?? 0) + quantity
        : (existingStock?.quantity ?? 0) - quantity;

    if (newQuantity < 0) {
      throw new BadRequestException('لا يمكن أن يكون الرصيد سالباً');
    }

    const availableQty = newQuantity - (existingStock?.reservedQty ?? 0);

    if (existingStock) {
      // تحديث الرصيد الموجود
      await this.prisma.warehouseItem.update({
        where: {
          warehouseId_itemId: {
            warehouseId,
            itemId,
          },
        },
        data: {
          quantity: newQuantity,
          availableQty,
          lastUpdated: new Date(),
        },
      });
    } else {
      // إنشاء رصيد جديد
      await this.prisma.warehouseItem.create({
        data: {
          warehouseId,
          itemId,
          quantity: newQuantity,
          reservedQty: 0,
          availableQty: newQuantity,
          lastUpdated: new Date(),
        },
      });
    }
  }

  /**
   * تنسيق تفاصيل الحركة
   */
  private formatMovementDetail(
    movement: any,
    warehouse: any,
    item: any,
  ): StockMovementDetail {
    return {
      id: movement.id,
      movementNumber: movement.movementNumber,
      movementType: movement.movementType,
      warehouseId: movement.warehouseId,
      warehouseName: warehouse.nameAr,
      itemId: movement.itemId,
      itemCode: item.code,
      itemName: item.nameAr,
      quantity: movement.quantity,
      fromWarehouseId: movement.fromWarehouseId,
      toWarehouseId: movement.toWarehouseId,
      referenceType: movement.referenceType,
      referenceId: movement.referenceId,
      referenceNumber: movement.referenceNumber,
      notes: movement.notes,
      createdBy: movement.createdBy,
      movementDate: movement.movementDate,
      createdAt: movement.createdAt,
    };
  }

  /**
   * حساب ملخص الحركات
   */
  private calculateMovementSummary(movements: any[]): MovementSummary {
    const totalIn = movements
      .filter((m) => m.movementType === MovementType.IN)
      .reduce((sum, m) => sum + m.quantity, 0);

    const totalOut = movements
      .filter((m) => m.movementType === MovementType.OUT)
      .reduce((sum, m) => sum + m.quantity, 0);

    const totalTransfers = movements
      .filter((m) => m.movementType === MovementType.TRANSFER)
      .reduce((sum, m) => sum + m.quantity, 0);

    const totalAdjustments = movements
      .filter((m) => m.movementType === MovementType.ADJUSTMENT)
      .reduce((sum, m) => sum + m.quantity, 0);

    const formattedMovements = movements.map((m) =>
      this.formatMovementDetail(m, m.warehouse, m.item),
    );

    return {
      totalMovements: movements.length,
      totalIn,
      totalOut,
      totalTransfers,
      totalAdjustments,
      movements: formattedMovements,
    };
  }
}
