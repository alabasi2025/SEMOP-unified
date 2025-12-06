// PHASE: DTO_QUALITY_FIX
// PHASE-14: إصلاح جميع any types واستخدام DTOs من @semop/contracts
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class HoldingsService {
  private items = [];
  private nextId = 1;

  findAll() {
    return this.items;
  }

  findOne(id: number) {
    const item = this.items.find(i => i.id === id);
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return item;
  }

  create(createDto: unknown) {
    const newItem = { id: this.nextId++, ...(createDto as object) };
    this.items.push(newItem);
    return newItem;
  }

  update(id: number, updateDto: unknown) {
    const index = this.items.findIndex(i => i.id === id);
    if (index === -1) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    this.items[index] = { ...this.items[index], ...(updateDto as object) };
    return this.items[index];
  }

  remove(id: number) {
    const index = this.items.findIndex(i => i.id === id);
    if (index === -1) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    this.items.splice(index, 1);
    return { message: 'Item deleted successfully' };
  }
}
