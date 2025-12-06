// PHASE: DTO_QUALITY_FIX
import { Injectable, NotFoundException } from '@nestjs/common';
import { } from '@semop/contracts';


@Injectable()
export class JournalEntriesService {
  // Dummy data
  private entries = [
    {
      id: '1',
      entryNumber: 'JE-2025-001',
      date: '2025-01-15',
      description: 'قيد افتتاحي - رأس المال',
      status: 'POSTED',
      totalDebit: 1000000,
      totalCredit: 1000000,
      lines: [
        { accountId: '3', accountCode: '1101', accountName: 'النقدية', debit: 500000, credit: 0 },
        { accountId: '4', accountCode: '1102', accountName: 'البنك', debit: 500000, credit: 0 },
        { accountId: '5', accountCode: '2', accountName: 'رأس المال', debit: 0, credit: 1000000 }
      ]
    },
    {
      id: '2',
      entryNumber: 'JE-2025-002',
      date: '2025-01-20',
      description: 'شراء أصول ثابتة',
      status: 'POSTED',
      totalDebit: 150000,
      totalCredit: 150000,
      lines: [
        { accountId: '6', accountCode: '1201', accountName: 'أثاث ومعدات', debit: 150000, credit: 0 },
        { accountId: '4', accountCode: '1102', accountName: 'البنك', debit: 0, credit: 150000 }
      ]
    }
  ];
  private nextId = 3;

  findAll(filters?: { status?: string; fromDate?: string; toDate?: string }) {
    let result = [...this.entries];
    
    if (filters?.status) {
      result = result.filter(e => e.status === filters.status);
    }
    
    if (filters?.fromDate) {
      result = result.filter(e => e.date >= filters.fromDate);
    }
    
    if (filters?.toDate) {
      result = result.filter(e => e.date <= filters.toDate);
    }
    
    return result;
  }

  findOne(id: string) {
    const entry = this.entries.find(e => e.id === id);
    if (!entry) {
      throw new NotFoundException(`Journal Entry with ID ${id} not found`);
    }
    return entry;
  }

  create(data: { date: string; description: string; status?: string; lines: Array<{ accountId: string; accountCode: string; accountName: string; debit: number; credit: number }> }) {
    const newEntry = {
      id: String(this.nextId++),
      entryNumber: `JE-2025-${String(this.nextId).padStart(3, '0')}`,
      date: data.date,
      description: data.description,
      status: data.status || 'DRAFT',
      totalDebit: data.lines.reduce((sum: number, line) => sum + (line.debit || 0), 0),
      totalCredit: data.lines.reduce((sum: number, line) => sum + (line.credit || 0), 0),
      lines: data.lines
    };
    
    this.entries.push(newEntry);
    return newEntry;
  }

  update(id: string, data: { date?: string; description?: string; status?: string; lines?: Array<{ accountId: string; accountCode: string; accountName: string; debit: number; credit: number }> }) {
    const index = this.entries.findIndex(e => e.id === id);
    if (index === -1) {
      throw new NotFoundException(`Journal Entry with ID ${id} not found`);
    }
    
    this.entries[index] = {
      ...this.entries[index],
      ...(data as object),
      totalDebit: data.lines ? data.lines.reduce((sum: number, line) => sum + (line.debit || 0), 0) : this.entries[index].totalDebit,
      totalCredit: data.lines ? data.lines.reduce((sum: number, line) => sum + (line.credit || 0), 0) : this.entries[index].totalCredit
    };
    
    return this.entries[index];
  }

  remove(id: string) {
    const index = this.entries.findIndex(e => e.id === id);
    if (index === -1) {
      throw new NotFoundException(`Journal Entry with ID ${id} not found`);
    }
    
    const deleted = this.entries[index];
    this.entries.splice(index, 1);
    return deleted;
  }

  post(id: string) {
    const entry = this.findOne(id);
    entry.status = 'POSTED';
    return entry;
  }
}
