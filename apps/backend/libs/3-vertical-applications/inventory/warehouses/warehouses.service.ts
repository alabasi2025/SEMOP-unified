import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../1-core-services/prisma/prisma.service';
import { CreateWarehouseDto, UpdateWarehouseDto, WarehouseResponseDto } from './warehouses.dto';

@Injectable()
export class WarehousesService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateWarehouseDto): Promise<WarehouseResponseDto> {
    // Check if code already exists
    const existing = await this.prisma.warehouse.findUnique({
      where: { code: createDto.code }
    });

    if (existing) {
      throw new ConflictException(`Warehouse with code ${createDto.code} already exists`);
    }

    const warehouse = await this.prisma.warehouse.create({
      data: {
        ...createDto,
        currentStock: 0
      }
    });

    return warehouse as WarehouseResponseDto;
  }

  async findAll(): Promise<WarehouseResponseDto[]> {
    const warehouses = await this.prisma.warehouse.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return warehouses as WarehouseResponseDto[];
  }

  async findOne(id: string): Promise<WarehouseResponseDto> {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id }
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }

    return warehouse as WarehouseResponseDto;
  }

  async update(id: string, updateDto: UpdateWarehouseDto): Promise<WarehouseResponseDto> {
    // Check if warehouse exists
    await this.findOne(id);

    // If updating code, check for conflicts
    if (updateDto.code) {
      const existing = await this.prisma.warehouse.findUnique({
        where: { code: updateDto.code }
      });

      if (existing && existing.id !== id) {
        throw new ConflictException(`Warehouse with code ${updateDto.code} already exists`);
      }
    }

    const warehouse = await this.prisma.warehouse.update({
      where: { id },
      data: updateDto
    });

    return warehouse as WarehouseResponseDto;
  }

  async remove(id: string): Promise<WarehouseResponseDto> {
    // Check if warehouse exists
    await this.findOne(id);

    // Check if warehouse has items
    const itemsCount = await this.prisma.warehouseItem.count({
      where: { warehouseId: id }
    });

    if (itemsCount > 0) {
      throw new ConflictException(`Cannot delete warehouse with existing items`);
    }

    const warehouse = await this.prisma.warehouse.delete({
      where: { id }
    });

    return warehouse as WarehouseResponseDto;
  }

  async getWarehouseStock(id: string) {
    await this.findOne(id);

    const items = await this.prisma.warehouseItem.findMany({
      where: { warehouseId: id },
      include: {
        item: true
      }
    });

    return items;
  }
}
