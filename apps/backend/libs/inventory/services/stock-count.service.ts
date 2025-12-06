import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../1-core-services/prisma/prisma.service';
import { CreateCountDto } from '../dto/create-count.dto';
import { AddCountRecordsDto, CompleteCountDto } from '../dto/count-record.dto';
import { CountStatus } from '../types/count-status.enum';
import { StockMovementsService } from './stock-movements.service';
import { MovementType, ReferenceType } from '../types/movement-type.enum';

/**
 * خدمة إدارة الجرد
 */
@Injectable()
export class StockCountService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stockMovementsService: StockMovementsService,
  ) {}

  /**
   * توليد رقم جرد فريد
   */
  private async generateCountNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    const lastCount = await this.prisma.inventoryCount.findFirst({
      where: {
        countNumber: {
          startsWith: `CNT-${year}${month}`,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    let sequence = 1;
    if (lastCount) {
      const lastSequence = parseInt(lastCount.countNumber.split('-')[2]);
      sequence = lastSequence + 1;
    }

    return `CNT-${year}${month}-${String(sequence).padStart(6, '0')}`;
  }

  /**
   * إنشاء عملية جرد جديدة
   */
  async createCount(dto: CreateCountDto): Promise<any> {
    // التحقق من وجود المستودع
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: dto.warehouseId },
    });

    if (!warehouse) {
      throw new NotFoundException('المستودع غير موجود');
    }

    // توليد رقم الجرد
    const countNumber = await this.generateCountNumber();

    // جلب الأصناف المراد جردها
    const where: any = { warehouseId: dto.warehouseId };
    if (dto.itemIds && dto.itemIds.length > 0) {
      where.itemId = { in: dto.itemIds };
    }

    const warehouseItems = await this.prisma.warehouseItem.findMany({
      where,
      include: {
        item: {
          select: {
            id: true,
            code: true,
            nameAr: true,
          },
        },
      },
    });

    // إنشاء عملية الجرد
    const count = await this.prisma.inventoryCount.create({
      data: {
        countNumber,
        warehouseId: dto.warehouseId,
        countDate: dto.countDate ? new Date(dto.countDate) : new Date(),
        status: CountStatus.DRAFT,
        countedBy: dto.countedBy,
        notes: dto.notes,
      },
    });

    // إنشاء سجلات الجرد
    const records = warehouseItems.map((wi) => ({
      countId: count.id,
      itemId: wi.itemId,
      systemQuantity: wi.quantity,
      countedQuantity: null,
      difference: null,
    }));

    await this.prisma.inventoryRecord.createMany({
      data: records,
    });

    return {
      ...count,
      itemsCount: records.length,
    };
  }

  /**
   * إضافة سجلات الجرد (الكميات المعدودة)
   */
  async addCountRecords(
    countId: string,
    dto: AddCountRecordsDto,
  ): Promise<any> {
    // التحقق من وجود عملية الجرد
    const count = await this.prisma.inventoryCount.findUnique({
      where: { id: countId },
    });

    if (!count) {
      throw new NotFoundException('عملية الجرد غير موجودة');
    }

    if (count.status === CountStatus.COMPLETED) {
      throw new BadRequestException('عملية الجرد مكتملة بالفعل');
    }

    // تحديث السجلات
    for (const record of dto.records) {
      const existingRecord = await this.prisma.inventoryRecord.findFirst({
        where: {
          countId,
          itemId: record.itemId,
        },
      });

      if (!existingRecord) {
        throw new NotFoundException(
          `السجل للصنف ${record.itemId} غير موجود`,
        );
      }

      const difference = record.countedQuantity - existingRecord.systemQuantity;

      await this.prisma.inventoryRecord.update({
        where: { id: existingRecord.id },
        data: {
          countedQuantity: record.countedQuantity,
          difference,
          notes: record.notes,
        },
      });
    }

    // تحديث حالة الجرد
    await this.prisma.inventoryCount.update({
      where: { id: countId },
      data: { status: CountStatus.IN_PROGRESS },
    });

    return { success: true, message: 'تم تحديث سجلات الجرد بنجاح' };
  }

  /**
   * حساب الفروقات
   */
  async calculateDifferences(countId: string): Promise<any> {
    const records = await this.prisma.inventoryRecord.findMany({
      where: { countId },
      include: {
        item: {
          select: {
            code: true,
            nameAr: true,
          },
        },
      },
    });

    const summary = {
      totalItems: records.length,
      countedItems: records.filter((r) => r.countedQuantity !== null).length,
      matched: records.filter((r) => r.difference === 0).length,
      surplus: records.filter((r) => (r.difference ?? 0) > 0).length,
      shortage: records.filter((r) => (r.difference ?? 0) < 0).length,
      totalSurplus: records
        .filter((r) => (r.difference ?? 0) > 0)
        .reduce((sum, r) => sum + (r.difference ?? 0), 0),
      totalShortage: Math.abs(
        records
          .filter((r) => (r.difference ?? 0) < 0)
          .reduce((sum, r) => sum + (r.difference ?? 0), 0),
      ),
      records: records.map((r) => ({
        itemId: r.itemId,
        itemCode: r.item.code,
        itemName: r.item.nameAr,
        systemQuantity: r.systemQuantity,
        countedQuantity: r.countedQuantity,
        difference: r.difference,
        notes: r.notes,
      })),
    };

    return summary;
  }

  /**
   * إتمام الجرد وإنشاء تسويات
   */
  async completeCount(
    countId: string,
    dto: CompleteCountDto,
  ): Promise<any> {
    // التحقق من وجود عملية الجرد
    const count = await this.prisma.inventoryCount.findUnique({
      where: { id: countId },
    });

    if (!count) {
      throw new NotFoundException('عملية الجرد غير موجودة');
    }

    if (count.status === CountStatus.COMPLETED) {
      throw new BadRequestException('عملية الجرد مكتملة بالفعل');
    }

    // جلب السجلات
    const records = await this.prisma.inventoryRecord.findMany({
      where: { countId },
    });

    // التحقق من أن جميع الأصناف تم عدها
    const notCounted = records.filter((r) => r.countedQuantity === null);
    if (notCounted.length > 0) {
      throw new BadRequestException(
        `يوجد ${notCounted.length} صنف لم يتم عده بعد`,
      );
    }

    // إنشاء تسويات للفروقات
    if (dto.createAdjustments !== false) {
      const differences = records.filter((r) => r.difference !== 0);

      for (const record of differences) {
        await this.stockMovementsService.createAdjustment({
          movementType: MovementType.ADJUSTMENT,
          warehouseId: count.warehouseId,
          itemId: record.itemId,
          quantity: record.difference ?? 0,
          referenceType: ReferenceType.FOUND,
          referenceId: countId,
          referenceNumber: count.countNumber,
          notes: `تسوية جرد: ${record.notes ?? ''}`,
          createdBy: dto.approvedBy,
        });
      }
    }

    // تحديث حالة الجرد
    await this.prisma.inventoryCount.update({
      where: { id: countId },
      data: {
        status: CountStatus.COMPLETED,
        approvedBy: dto.approvedBy,
        notes: dto.notes,
      },
    });

    return { success: true, message: 'تم إتمام الجرد بنجاح' };
  }

  /**
   * جلب تقرير الجرد
   */
  async getCountReport(countId: string): Promise<any> {
    const count = await this.prisma.inventoryCount.findUnique({
      where: { id: countId },
      include: {
        records: {
          include: {
            item: {
              select: {
                code: true,
                nameAr: true,
                costPrice: true,
              },
            },
          },
        },
      },
    });

    if (!count) {
      throw new NotFoundException('عملية الجرد غير موجودة');
    }

    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: count.warehouseId },
    });

    return {
      countNumber: count.countNumber,
      warehouseName: warehouse?.nameAr,
      countDate: count.countDate,
      status: count.status,
      countedBy: count.countedBy,
      approvedBy: count.approvedBy,
      notes: count.notes,
      summary: await this.calculateDifferences(countId),
    };
  }
}
