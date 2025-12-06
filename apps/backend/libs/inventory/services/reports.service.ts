import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../1-core-services/prisma/prisma.service';
import {
  ItemMovementReport,
  WarehouseMovementReport,
  LowStockReport,
  InactiveItemsReport,
  StockValueReport,
  StockBalanceReport,
} from '../interfaces/report.interface';

/**
 * خدمة التقارير
 */
@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * تقرير حركة صنف
   */
  async getItemMovementReport(
    itemId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<ItemMovementReport> {
    const item = await this.prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new Error('الصنف غير موجود');
    }

    const movements = await this.prisma.stockMovement.findMany({
      where: {
        itemId,
        movementDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        warehouse: {
          select: { nameAr: true },
        },
      },
      orderBy: { movementDate: 'asc' },
    });

    // حساب الأرصدة
    const totalIn = movements
      .filter((m) => m.movementType === 'IN')
      .reduce((sum, m) => sum + m.quantity, 0);

    const totalOut = movements
      .filter((m) => m.movementType === 'OUT')
      .reduce((sum, m) => sum + m.quantity, 0);

    return {
      itemId: item.id,
      itemCode: item.code,
      itemName: item.nameAr,
      startDate,
      endDate,
      openingBalance: 0, // يمكن حسابه من الحركات السابقة
      totalIn,
      totalOut,
      totalTransferIn: 0,
      totalTransferOut: 0,
      totalAdjustment: 0,
      closingBalance: totalIn - totalOut,
      movements: movements.map((m) => ({
        date: m.movementDate,
        movementNumber: m.movementNumber,
        movementType: m.movementType,
        warehouseName: m.warehouse.nameAr,
        quantity: m.quantity,
        balance: 0, // يتم حسابه تراكمياً
        referenceType: m.referenceType ?? undefined,
        referenceNumber: m.referenceNumber ?? undefined,
        notes: m.notes ?? undefined,
      })),
    };
  }

  /**
   * تقرير حركة مستودع
   */
  async getWarehouseMovementReport(
    warehouseId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<WarehouseMovementReport> {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouseId },
    });

    if (!warehouse) {
      throw new Error('المستودع غير موجود');
    }

    const movements = await this.prisma.stockMovement.findMany({
      where: {
        warehouseId,
        movementDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { movementDate: 'asc' },
    });

    const totalIn = movements
      .filter((m) => m.movementType === 'IN')
      .reduce((sum, m) => sum + m.quantity, 0);

    const totalOut = movements
      .filter((m) => m.movementType === 'OUT')
      .reduce((sum, m) => sum + m.quantity, 0);

    return {
      warehouseId: warehouse.id,
      warehouseCode: warehouse.code,
      warehouseName: warehouse.nameAr,
      startDate,
      endDate,
      totalMovements: movements.length,
      totalIn,
      totalOut,
      totalTransferIn: 0,
      totalTransferOut: 0,
      totalAdjustment: 0,
      movements: movements.map((m) => ({
        date: m.movementDate,
        movementNumber: m.movementNumber,
        movementType: m.movementType,
        warehouseName: warehouse.nameAr,
        quantity: m.quantity,
        balance: 0,
        referenceType: m.referenceType ?? undefined,
        referenceNumber: m.referenceNumber ?? undefined,
        notes: m.notes ?? undefined,
      })),
    };
  }

  /**
   * تقرير الأصناف الناقصة
   */
  async getLowStockReport(
    warehouseId?: string,
    categoryId?: string,
  ): Promise<LowStockReport> {
    const where: any = {
      isActive: true,
      minStock: { gt: 0 },
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const items = await this.prisma.item.findMany({
      where,
      include: {
        warehouseItems: {
          where: warehouseId ? { warehouseId } : undefined,
          include: {
            warehouse: {
              select: { nameAr: true },
            },
          },
        },
      },
    });

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
            minStock: item.minStock ?? 0,
            reorderPoint: item.reorderPoint ?? undefined,
            shortage: (item.minStock ?? 0) - wi.quantity,
            status: (wi.quantity === 0
              ? 'CRITICAL'
              : wi.quantity <= (item.reorderPoint ?? 0)
              ? 'AT_REORDER'
              : 'BELOW_MIN') as any,
          })),
      );

    return {
      generatedAt: new Date(),
      warehouseId,
      categoryId,
      totalItems: lowStockItems.length,
      items: lowStockItems,
    };
  }

  /**
   * تقرير الأصناف الراكدة
   */
  async getInactiveItemsReport(
    warehouseId?: string,
    daysWithoutMovement: number = 90,
  ): Promise<InactiveItemsReport> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysWithoutMovement);

    // جلب الأصناف التي لم تتحرك منذ فترة
    const items = await this.prisma.item.findMany({
      where: {
        isActive: true,
      },
      include: {
        warehouseItems: {
          where: warehouseId ? { warehouseId } : undefined,
          include: {
            warehouse: {
              select: { nameAr: true },
            },
          },
        },
        movements: {
          where: {
            movementDate: { gte: cutoffDate },
          },
          take: 1,
        },
      },
    });

    const inactiveItems = items
      .filter((item) => item.movements.length === 0)
      .flatMap((item) =>
        item.warehouseItems.map((wi) => ({
          itemId: item.id,
          itemCode: item.code,
          itemName: item.nameAr,
          warehouseId: wi.warehouseId,
          warehouseName: wi.warehouse.nameAr,
          currentQuantity: wi.quantity,
          costPrice: item.costPrice ?? 0,
          totalValue: wi.quantity * (item.costPrice ?? 0),
          lastMovementDate: undefined,
          daysInactive: daysWithoutMovement,
        })),
      );

    const totalValue = inactiveItems.reduce((sum, item) => sum + item.totalValue, 0);

    return {
      generatedAt: new Date(),
      warehouseId,
      daysWithoutMovement,
      totalItems: inactiveItems.length,
      totalValue,
      items: inactiveItems,
    };
  }

  /**
   * تقرير قيمة المخزون
   */
  async getStockValueReport(
    warehouseId?: string,
    categoryId?: string,
    asOfDate?: Date,
  ): Promise<StockValueReport> {
    const where: any = {};

    if (warehouseId) {
      where.warehouseId = warehouseId;
    }

    const warehouseItems = await this.prisma.warehouseItem.findMany({
      where,
      include: {
        warehouse: {
          select: { nameAr: true },
        },
        item: {
          select: {
            code: true,
            nameAr: true,
            categoryName: true,
            costPrice: true,
          },
          where: categoryId ? { categoryId } : undefined,
        },
      },
    });

    const items = warehouseItems.map((wi) => ({
      itemId: wi.itemId,
      itemCode: wi.item.code,
      itemName: wi.item.nameAr,
      categoryName: wi.item.categoryName ?? undefined,
      warehouseId: wi.warehouseId,
      warehouseName: wi.warehouse.nameAr,
      quantity: wi.quantity,
      costPrice: wi.item.costPrice ?? 0,
      totalValue: wi.quantity * (wi.item.costPrice ?? 0),
    }));

    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = items.reduce((sum, item) => sum + item.totalValue, 0);

    return {
      generatedAt: new Date(),
      asOfDate: asOfDate ?? new Date(),
      warehouseId,
      categoryId,
      totalItems: items.length,
      totalQuantity,
      totalValue,
      items,
    };
  }

  /**
   * تقرير الرصيد الحالي
   */
  async getStockBalanceReport(
    warehouseId?: string,
    categoryId?: string,
  ): Promise<StockBalanceReport> {
    const where: any = {};

    if (warehouseId) {
      where.warehouseId = warehouseId;
    }

    const warehouseItems = await this.prisma.warehouseItem.findMany({
      where,
      include: {
        warehouse: {
          select: { nameAr: true },
        },
        item: {
          select: {
            code: true,
            nameAr: true,
            categoryName: true,
            minStock: true,
            maxStock: true,
          },
          where: categoryId ? { categoryId } : undefined,
        },
      },
    });

    const items = warehouseItems.map((wi) => {
      let status: 'NORMAL' | 'LOW' | 'CRITICAL' | 'OVERSTOCK' = 'NORMAL';
      
      if (wi.quantity === 0) {
        status = 'CRITICAL';
      } else if (wi.item.minStock && wi.quantity < wi.item.minStock) {
        status = 'LOW';
      } else if (wi.item.maxStock && wi.quantity > wi.item.maxStock) {
        status = 'OVERSTOCK';
      }

      return {
        itemId: wi.itemId,
        itemCode: wi.item.code,
        itemName: wi.item.nameAr,
        categoryName: wi.item.categoryName ?? undefined,
        warehouseId: wi.warehouseId,
        warehouseName: wi.warehouse.nameAr,
        quantity: wi.quantity,
        reservedQty: wi.reservedQty,
        availableQty: wi.availableQty,
        minStock: wi.item.minStock ?? undefined,
        maxStock: wi.item.maxStock ?? undefined,
        status,
      };
    });

    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      generatedAt: new Date(),
      warehouseId,
      categoryId,
      totalItems: items.length,
      totalQuantity,
      items,
    };
  }
}
