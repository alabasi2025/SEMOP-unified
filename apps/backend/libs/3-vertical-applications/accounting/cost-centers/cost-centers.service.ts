// PHASE: DTO_QUALITY_FIX
// PHASE-13: إضافة Input Validation وتحسين Business Logic
// PHASE-11: إصلاح انتهاكات DTOs والبنية المعمارية - استخدام @semop/contracts
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class CostCentersService {
  // Dummy data
  private costCenters = [
    {
      id: '1',
      code: 'CC-001',
      nameAr: 'مركز تكلفة المبيعات',
      nameEn: 'Sales Cost Center',
      description: 'مركز تكلفة خاص بقسم المبيعات',
      isActive: true,
      createdAt: '2025-01-01'
    },
    {
      id: '2',
      code: 'CC-002',
      nameAr: 'مركز تكلفة الإنتاج',
      nameEn: 'Production Cost Center',
      description: 'مركز تكلفة خاص بقسم الإنتاج',
      isActive: true,
      createdAt: '2025-01-01'
    },
    {
      id: '3',
      code: 'CC-003',
      nameAr: 'مركز تكلفة الإدارة',
      nameEn: 'Administration Cost Center',
      description: 'مركز تكلفة خاص بالإدارة العامة',
      isActive: true,
      createdAt: '2025-01-01'
    }
  ];
  private nextId = 4;

  findAll() {
    return this.costCenters.filter(cc => !cc['isDeleted']);
  }

  findOne(id: string) {
    const costCenter = this.costCenters.find(cc => cc.id === id && !cc['isDeleted']);
    if (!costCenter) {
      throw new NotFoundException(`Cost Center with ID ${id} not found`);
    }
    return costCenter;
  }

  create(data: { code: string; nameAr: string; nameEn?: string; description?: string; isActive?: boolean }) {
    const newCostCenter = {
      id: String(this.nextId++),
      code: data.code,
      nameAr: data.nameAr,
      nameEn: data.nameEn || '',
      description: data.description || '',
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdAt: new Date().toISOString()
    };
    
    this.costCenters.push(newCostCenter);
    return newCostCenter;
  }

  update(id: string, data: { code?: string; nameAr?: string; nameEn?: string; description?: string; isActive?: boolean }) {
    const index = this.costCenters.findIndex(cc => cc.id === id);
    if (index === -1) {
      throw new NotFoundException(`Cost Center with ID ${id} not found`);
    }
    
    this.costCenters[index] = {
      ...this.costCenters[index],
      ...(data as object)
    };
    
    return this.costCenters[index];
  }

  remove(id: string) {
    const index = this.costCenters.findIndex(cc => cc.id === id);
    if (index === -1) {
      throw new NotFoundException(`Cost Center with ID ${id} not found`);
    }
    
    // Soft delete
    this.costCenters[index]['isDeleted'] = true;
    return this.costCenters[index];
  }
}
