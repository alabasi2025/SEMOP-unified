import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../1-core-services/prisma/prisma.service';
import { CreateStockMovementDto, StockMovementResponseDto } from './stock-movements.dto';

@Injectable()
export class StockMovementsService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateStockMovementDto): Promise<StockMovementResponseDto> {
    // Validate warehouse exists
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: createDto.warehouseId }
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${createDto.warehouseId} not found`);
    }

    // Validate item exists
    const item = await this.prisma.item.findUnique({
      where: { id: createDto.itemId }
    });

    if (!item) {
      throw new NotFoundException(`Item with ID ${createDto.itemId} not found`);
    }

    // Generate movement number
    const count = await this.prisma.stockMovement.count();
    const movementNumber = `SM-${String(count + 1).padStart(6, '0')}`;

    // Create movement
    const movement = await this.prisma.stockMovement.create({
      data: {
        ...createDto,
        movementNumber,
        movementDate: createDto.movementDate ? new Date(createDto.movementDate) : new Date()
      }
    });

    // Update warehouse item stock
    await this.updateWarehouseItemStock(
      createDto.warehouseId,
      createDto.itemId,
      createDto.movementType,
      createDto.quantity
    );

    return movement as StockMovementResponseDto;
  }

  private async updateWarehouseItemStock(
    warehouseId: string,
    itemId: string,
    movementType: string,
    quantity: number
  ) {
    const warehouseItem = await this.prisma.warehouseItem.findUnique({
      where: {
        warehouseId_itemId: {
          warehouseId,
          itemId
        }
      }
    });

    let newQuantity = 0;

    if (warehouseItem) {
      if (movementType === 'IN' || movementType === 'ADJUSTMENT') {
        newQuantity = warehouseItem.quantity + quantity;
      } else if (movementType === 'OUT') {
        newQuantity = warehouseItem.quantity - quantity;
        if (newQuantity < 0) {
          throw new BadRequestException('Insufficient stock');
        }
      }

      await this.prisma.warehouseItem.update({
        where: {
          warehouseId_itemId: {
            warehouseId,
            itemId
          }
        },
        data: {
          quantity: newQuantity,
          availableQty: newQuantity,
          lastUpdated: new Date()
        }
      });
    } else {
      // Create new warehouse item
      if (movementType === 'IN' || movementType === 'ADJUSTMENT') {
        await this.prisma.warehouseItem.create({
          data: {
            warehouseId,
            itemId,
            quantity,
            availableQty: quantity,
            reservedQty: 0
          }
        });
      } else {
        throw new BadRequestException('Item not found in warehouse');
      }
    }
  }

  async findAll(): Promise<StockMovementResponseDto[]> {
    const movements = await this.prisma.stockMovement.findMany({
      orderBy: { movementDate: 'desc' },
      include: {
        warehouse: true,
        item: true
      }
    });

    return movements as any;
  }

  async findOne(id: string): Promise<StockMovementResponseDto> {
    const movement = await this.prisma.stockMovement.findUnique({
      where: { id },
      include: {
        warehouse: true,
        item: true
      }
    });

    if (!movement) {
      throw new NotFoundException(`Stock movement with ID ${id} not found`);
    }

    return movement as any;
  }

  async findByWarehouse(warehouseId: string) {
    const movements = await this.prisma.stockMovement.findMany({
      where: { warehouseId },
      orderBy: { movementDate: 'desc' },
      include: {
        item: true
      }
    });

    return movements;
  }

  async findByItem(itemId: string) {
    const movements = await this.prisma.stockMovement.findMany({
      where: { itemId },
      orderBy: { movementDate: 'desc' },
      include: {
        warehouse: true
      }
    });

    return movements;
  }
}
