// PHASE: DTO_QUALITY_FIX
// PHASE-11: إصلاح انتهاكات DTOs والبنية المعمارية - استخدام @semop/contracts
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class FiscalYearsService {
  // Dummy data
  private fiscalYears = [
    {
      id: '1',
      code: 'FY-2024',
      nameAr: 'السنة المالية 2024',
      nameEn: 'Fiscal Year 2024',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      isClosed: true,
      isActive: false,
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      code: 'FY-2025',
      nameAr: 'السنة المالية 2025',
      nameEn: 'Fiscal Year 2025',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      isClosed: false,
      isActive: true,
      createdAt: '2025-01-01'
    },
    {
      id: '3',
      code: 'FY-2026',
      nameAr: 'السنة المالية 2026',
      nameEn: 'Fiscal Year 2026',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      isClosed: false,
      isActive: false,
      createdAt: '2025-01-01'
    }
  ];
  private nextId = 4;

  findAll() {
    return this.fiscalYears.filter(fy => !fy['isDeleted']);
  }

  findOne(id: string) {
    const fiscalYear = this.fiscalYears.find(fy => fy.id === id && !fy['isDeleted']);
    if (!fiscalYear) {
      throw new NotFoundException(`Fiscal Year with ID ${id} not found`);
    }
    return fiscalYear;
  }

  create(data: { code: string; nameAr: string; nameEn?: string; startDate: string; endDate: string; isActive?: boolean }) {
    const newFiscalYear = {
      id: String(this.nextId++),
      code: data.code,
      nameAr: data.nameAr,
      nameEn: data.nameEn || '',
      startDate: data.startDate,
      endDate: data.endDate,
      isClosed: false,
      isActive: data.isActive !== undefined ? data.isActive : false,
      createdAt: new Date().toISOString()
    };
    
    this.fiscalYears.push(newFiscalYear);
    return newFiscalYear;
  }

  update(id: string, data: { code?: string; nameAr?: string; nameEn?: string; startDate?: string; endDate?: string; isActive?: boolean; isClosed?: boolean }) {
    const index = this.fiscalYears.findIndex(fy => fy.id === id);
    if (index === -1) {
      throw new NotFoundException(`Fiscal Year with ID ${id} not found`);
    }
    
    this.fiscalYears[index] = {
      ...this.fiscalYears[index],
      ...(data as object)
    };
    
    return this.fiscalYears[index];
  }

  remove(id: string) {
    const index = this.fiscalYears.findIndex(fy => fy.id === id);
    if (index === -1) {
      throw new NotFoundException(`Fiscal Year with ID ${id} not found`);
    }
    
    // Soft delete
    this.fiscalYears[index]['isDeleted'] = true;
    return this.fiscalYears[index];
  }

  close(id: string) {
    const index = this.fiscalYears.findIndex(fy => fy.id === id);
    if (index === -1) {
      throw new NotFoundException(`Fiscal Year with ID ${id} not found`);
    }
    
    this.fiscalYears[index].isClosed = true;
    this.fiscalYears[index].isActive = false;
    return this.fiscalYears[index];
  }
}
