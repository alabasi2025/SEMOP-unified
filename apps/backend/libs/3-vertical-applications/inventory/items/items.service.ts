import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../1-core-services/prisma/prisma.service';
import { CreateItemDto, UpdateItemDto, ItemResponseDto } from './items.dto';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateItemDto): Promise<ItemResponseDto> {
    // Check if code already exists
    const existing = await this.prisma.item.findUnique({
      where: { code: createDto.code }
    });

    if (existing) {
      throw new ConflictException(`Item with code ${createDto.code} already exists`);
    }

    // Check barcode uniqueness
    if (createDto.barcode) {
      const barcodeExists = await this.prisma.item.findUnique({
        where: { barcode: createDto.barcode }
      });

      if (barcodeExists) {
        throw new ConflictException(`Item with barcode ${createDto.barcode} already exists`);
      }
    }

    // Check SKU uniqueness
    if (createDto.sku) {
      const skuExists = await this.prisma.item.findUnique({
        where: { sku: createDto.sku }
      });

      if (skuExists) {
        throw new ConflictException(`Item with SKU ${createDto.sku} already exists`);
      }
    }

    const item = await this.prisma.item.create({
      data: createDto
    });

    return item as ItemResponseDto;
  }

  async findAll(): Promise<ItemResponseDto[]> {
    const items = await this.prisma.item.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return items as ItemResponseDto[];
  }

  async findOne(id: string): Promise<ItemResponseDto> {
    const item = await this.prisma.item.findUnique({
      where: { id }
    });

    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    return item as ItemResponseDto;
  }

  async update(id: string, updateDto: UpdateItemDto): Promise<ItemResponseDto> {
    // Check if item exists
    await this.findOne(id);

    // Check code uniqueness if updating
    if (updateDto.code) {
      const existing = await this.prisma.item.findUnique({
        where: { code: updateDto.code }
      });

      if (existing && existing.id !== id) {
        throw new ConflictException(`Item with code ${updateDto.code} already exists`);
      }
    }

    // Check barcode uniqueness if updating
    if (updateDto.barcode) {
      const barcodeExists = await this.prisma.item.findUnique({
        where: { barcode: updateDto.barcode }
      });

      if (barcodeExists && barcodeExists.id !== id) {
        throw new ConflictException(`Item with barcode ${updateDto.barcode} already exists`);
      }
    }

    // Check SKU uniqueness if updating
    if (updateDto.sku) {
      const skuExists = await this.prisma.item.findUnique({
        where: { sku: updateDto.sku }
      });

      if (skuExists && skuExists.id !== id) {
        throw new ConflictException(`Item with SKU ${updateDto.sku} already exists`);
      }
    }

    const item = await this.prisma.item.update({
      where: { id },
      data: updateDto
    });

    return item as ItemResponseDto;
  }

  async remove(id: string): Promise<ItemResponseDto> {
    // Check if item exists
    await this.findOne(id);

    // Check if item has stock
    const stockCount = await this.prisma.warehouseItem.count({
      where: { itemId: id }
    });

    if (stockCount > 0) {
      throw new ConflictException(`Cannot delete item with existing stock`);
    }

    const item = await this.prisma.item.delete({
      where: { id }
    });

    return item as ItemResponseDto;
  }

  async getItemStock(id: string) {
    await this.findOne(id);

    const stock = await this.prisma.warehouseItem.findMany({
      where: { itemId: id },
      include: {
        warehouse: true
      }
    });

    return stock;
  }

  async getLowStockItems() {
    const items = await this.prisma.item.findMany({
      where: {
        isActive: true
      },
      include: {
        warehouseItems: true
      }
    });

    const lowStockItems = items.filter(item => {
      const totalStock = item.warehouseItems.reduce((sum, wi) => sum + wi.quantity, 0);
      return item.minStock && totalStock <= item.minStock;
    });

    return lowStockItems;
  }
}
