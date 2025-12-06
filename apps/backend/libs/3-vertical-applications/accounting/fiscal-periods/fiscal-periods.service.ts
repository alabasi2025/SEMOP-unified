// PHASE: DTO_QUALITY_FIX
// PHASE-11: إصلاح انتهاكات DTOs والبنية المعمارية - استخدام @semop/contracts
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class FiscalPeriodsService {
  // Dummy data
  private fiscalPeriods = [
    {
      id: '1',
      fiscalYearId: '2',
      code: 'P01-2025',
      nameAr: 'يناير 2025',
      nameEn: 'January 2025',
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      isClosed: true,
      closedBy: 'أحمد محمد',
      closedAt: '2025-02-01',
      createdAt: '2025-01-01'
    },
    {
      id: '2',
      fiscalYearId: '2',
      code: 'P02-2025',
      nameAr: 'فبراير 2025',
      nameEn: 'February 2025',
      startDate: '2025-02-01',
      endDate: '2025-02-28',
      isClosed: true,
      closedBy: 'أحمد محمد',
      closedAt: '2025-03-01',
      createdAt: '2025-02-01'
    },
    {
      id: '3',
      fiscalYearId: '2',
      code: 'P03-2025',
      nameAr: 'مارس 2025',
      nameEn: 'March 2025',
      startDate: '2025-03-01',
      endDate: '2025-03-31',
      isClosed: false,
      closedBy: null,
      closedAt: null,
      createdAt: '2025-03-01'
    },
    {
      id: '4',
      fiscalYearId: '2',
      code: 'P04-2025',
      nameAr: 'أبريل 2025',
      nameEn: 'April 2025',
      startDate: '2025-04-01',
      endDate: '2025-04-30',
      isClosed: false,
      closedBy: null,
      closedAt: null,
      createdAt: '2025-04-01'
    }
  ];
  private nextId = 5;

  findAll() {
    return this.fiscalPeriods.filter(fp => !fp['isDeleted']);
  }

  findOne(id: string) {
    const fiscalPeriod = this.fiscalPeriods.find(fp => fp.id === id && !fp['isDeleted']);
    if (!fiscalPeriod) {
      throw new NotFoundException(`Fiscal Period with ID ${id} not found`);
    }
    return fiscalPeriod;
  }

  create(data: { fiscalYearId: string; code: string; nameAr: string; nameEn?: string; startDate: string; endDate: string }) {
    const newFiscalPeriod = {
      id: String(this.nextId++),
      fiscalYearId: data.fiscalYearId,
      code: data.code,
      nameAr: data.nameAr,
      nameEn: data.nameEn || '',
      startDate: data.startDate,
      endDate: data.endDate,
      isClosed: false,
      closedBy: null,
      closedAt: null,
      createdAt: new Date().toISOString()
    };
    
    this.fiscalPeriods.push(newFiscalPeriod);
    return newFiscalPeriod;
  }

  update(id: string, data: { fiscalYearId?: string; code?: string; nameAr?: string; nameEn?: string; startDate?: string; endDate?: string; isClosed?: boolean }) {
    const index = this.fiscalPeriods.findIndex(fp => fp.id === id);
    if (index === -1) {
      throw new NotFoundException(`Fiscal Period with ID ${id} not found`);
    }
    
    this.fiscalPeriods[index] = {
      ...this.fiscalPeriods[index],
      ...(data as object)
    };
    
    return this.fiscalPeriods[index];
  }

  remove(id: string) {
    const index = this.fiscalPeriods.findIndex(fp => fp.id === id);
    if (index === -1) {
      throw new NotFoundException(`Fiscal Period with ID ${id} not found`);
    }
    
    // Soft delete
    this.fiscalPeriods[index]['isDeleted'] = true;
    return this.fiscalPeriods[index];
  }

  close(id: string, closedBy: string) {
    const index = this.fiscalPeriods.findIndex(fp => fp.id === id);
    if (index === -1) {
      throw new NotFoundException(`Fiscal Period with ID ${id} not found`);
    }
    
    this.fiscalPeriods[index].isClosed = true;
    this.fiscalPeriods[index].closedBy = closedBy;
    this.fiscalPeriods[index].closedAt = new Date().toISOString();
    return this.fiscalPeriods[index];
  }
}
