import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { JournalEntriesService } from '../../services/journal-entries.service';
import { AccountsService } from '../../services/accounts.service';

interface JournalEntry {
  id: number;
  entryNumber: string;
  entryDate: Date;
  description: string;
  totalDebit: number;
  totalCredit: number;
  status: string;
  createdBy: string;
  createdAt: Date;
}

interface JournalEntryLine {
  id: number;
  accountCode: string;
  accountName: string;
  description: string;
  debit: number;
  credit: number;
  costCenter?: string;
}

@Component({
  selector: 'app-journal-entries',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    SelectModule,
    DatePickerModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>القيود اليومية</h1>
        <button pButton label="قيد جديد" icon="pi pi-plus" (click)="openNew()"></button>
      </div>

      <div class="card">
        <p-table 
          [value]="entries" 
          [paginator]="true" 
          [rows]="10"
          [globalFilterFields]="['entryNumber','description','status']"
          responsiveLayout="scroll">
          
          <ng-template pTemplate="caption">
            <div class="table-header">
              <span class="p-input-icon-left">
                <i class="pi pi-search"></i>
                <input pInputText type="text" 
                       (input)="onSearch($event)" 
                       placeholder="بحث..." />
              </span>
            </div>
          </ng-template>

          <ng-template pTemplate="header">
            <tr>
              <th>رقم القيد</th>
              <th>التاريخ</th>
              <th>الوصف</th>
              <th>المدين</th>
              <th>الدائن</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-entry>
            <tr>
              <td>{{ entry.entryNumber }}</td>
              <td>{{ entry.entryDate | date:'dd/MM/yyyy' }}</td>
              <td>{{ entry.description }}</td>
              <td>{{ entry.totalDebit | number:'1.2-2' }}</td>
              <td>{{ entry.totalCredit | number:'1.2-2' }}</td>
              <td>
                <span [class]="'status-badge status-' + entry.status">
                  {{ getStatusLabel(entry.status) }}
                </span>
              </td>
              <td>
                <button pButton icon="pi pi-eye" 
                        class="p-button-rounded p-button-text p-button-info"
                        (click)="viewEntry(entry)"
                        pTooltip="عرض"></button>
                <button pButton icon="pi pi-pencil" 
                        class="p-button-rounded p-button-text p-button-warning"
                        (click)="editEntry(entry)"
                        [disabled]="entry.status === 'posted'"
                        pTooltip="تعديل"></button>
                <button pButton icon="pi pi-trash" 
                        class="p-button-rounded p-button-text p-button-danger"
                        (click)="deleteEntry(entry)"
                        [disabled]="entry.status === 'posted'"
                        pTooltip="حذف"></button>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="7" class="text-center">لا توجد قيود</td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <!-- Dialog -->
      <p-dialog 
        [(visible)]="entryDialog" 
        [header]="dialogTitle"
        [modal]="true" 
        [style]="{width: '90vw'}"
        [maximizable]="true">
        
        <div class="entry-form">
          <!-- Header Info -->
          <div class="form-grid">
            <div class="form-group">
              <label>رقم القيد</label>
              <input pInputText [(ngModel)]="entry.entryNumber" [disabled]="true" />
            </div>
            <div class="form-group">
              <label>التاريخ *</label>
              <p-datepicker [(ngModel)]="entry.entryDate" 
                            dateFormat="dd/mm/yy"
                            [showIcon]="true"></p-datepicker>
            </div>
            <div class="form-group full-width">
              <label>الوصف *</label>
              <input pInputText [(ngModel)]="entry.description" />
            </div>
          </div>

          <!-- Entry Lines -->
          <div class="entry-lines">
            <div class="lines-header">
              <h3>تفاصيل القيد</h3>
              <button pButton label="إضافة سطر" 
                      icon="pi pi-plus" 
                      class="p-button-sm"
                      (click)="addLine()"></button>
            </div>

            <p-table [value]="entryLines" responsiveLayout="scroll">
              <ng-template pTemplate="header">
                <tr>
                  <th style="width: 150px">رمز الحساب</th>
                  <th>اسم الحساب</th>
                  <th style="width: 200px">الوصف</th>
                  <th style="width: 120px">مدين</th>
                  <th style="width: 120px">دائن</th>
                  <th style="width: 150px">مركز التكلفة</th>
                  <th style="width: 80px">حذف</th>
                </tr>
              </ng-template>

              <ng-template pTemplate="body" let-line let-i="rowIndex">
                <tr>
                  <td>
                    <input pInputText [(ngModel)]="line.accountCode" 
                           placeholder="رمز الحساب" />
                  </td>
                  <td>
                    <input pInputText [(ngModel)]="line.accountName" 
                           placeholder="اسم الحساب" />
                  </td>
                  <td>
                    <input pInputText [(ngModel)]="line.description" 
                           placeholder="الوصف" />
                  </td>
                  <td>
                    <input pInputText type="number" 
                           [(ngModel)]="line.debit"
                           (ngModelChange)="calculateTotals()"
                           placeholder="0.00" />
                  </td>
                  <td>
                    <input pInputText type="number" 
                           [(ngModel)]="line.credit"
                           (ngModelChange)="calculateTotals()"
                           placeholder="0.00" />
                  </td>
                  <td>
                    <input pInputText [(ngModel)]="line.costCenter" 
                           placeholder="مركز التكلفة" />
                  </td>
                  <td>
                    <button pButton icon="pi pi-trash" 
                            class="p-button-rounded p-button-text p-button-danger p-button-sm"
                            (click)="removeLine(i)"></button>
                  </td>
                </tr>
              </ng-template>

              <ng-template pTemplate="footer">
                <tr>
                  <td colspan="3" class="text-left"><strong>الإجمالي</strong></td>
                  <td><strong>{{ totalDebit | number:'1.2-2' }}</strong></td>
                  <td><strong>{{ totalCredit | number:'1.2-2' }}</strong></td>
                  <td colspan="2">
                    <span *ngIf="!isBalanced()" class="error-text">
                      <i class="pi pi-exclamation-triangle"></i>
                      القيد غير متوازن (الفرق: {{ Math.abs(totalDebit - totalCredit) | number:'1.2-2' }})
                    </span>
                    <span *ngIf="isBalanced()" class="success-text">
                      <i class="pi pi-check-circle"></i>
                      القيد متوازن
                    </span>
                  </td>
                </tr>
              </ng-template>
            </p-table>
          </div>
        </div>

        <ng-template pTemplate="footer">
          <button pButton label="إلغاء" 
                  icon="pi pi-times" 
                  class="p-button-text"
                  (click)="hideDialog()"></button>
          <button pButton label="حفظ كمسودة" 
                  icon="pi pi-save" 
                  class="p-button-secondary"
                  (click)="saveEntry('draft')"
                  [disabled]="!isValid()"></button>
          <button pButton label="ترحيل" 
                  icon="pi pi-check" 
                  (click)="saveEntry('posted')"
                  [disabled]="!isValid() || !isBalanced()"></button>
        </ng-template>
      </p-dialog>

      <p-toast></p-toast>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 1.5rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .page-header h1 {
      margin: 0;
      font-size: 1.75rem;
      color: #333;
    }

    .card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 1.5rem;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .status-draft {
      background: #fff3cd;
      color: #856404;
    }

    .status-posted {
      background: #d4edda;
      color: #155724;
    }

    .status-cancelled {
      background: #f8d7da;
      color: #721c24;
    }

    .entry-form {
      min-height: 400px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .form-group label {
      font-weight: 600;
      color: #333;
    }

    .entry-lines {
      margin-top: 2rem;
    }

    .lines-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .lines-header h3 {
      margin: 0;
      font-size: 1.25rem;
    }

    .text-center {
      text-align: center;
    }

    .text-left {
      text-align: left;
    }

    .error-text {
      color: #dc3545;
      font-weight: 600;
    }

    .success-text {
      color: #28a745;
      font-weight: 600;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
      padding: 0.75rem;
    }

    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
      background: #f8f9fa;
      color: #495057;
      font-weight: 600;
    }

    :host ::ng-deep .p-dialog .p-dialog-content {
      padding: 1.5rem;
    }
  `]
})
export class JournalEntriesComponent implements OnInit {
  entries: JournalEntry[] = [];
  entryLines: JournalEntryLine[] = [];
  entry: any = {};
  entryDialog = false;
  dialogTitle = '';
  totalDebit = 0;
  totalCredit = 0;
  Math = Math;

  constructor(
    private messageService: MessageService,
    private journalEntriesService: JournalEntriesService,
    private accountsService: AccountsService
  ) {}

  ngOnInit() {
    this.loadEntries();
  }

  loadEntries() {
    this.journalEntriesService.getAll().subscribe({
      next: (entries) => {
        this.entries = entries.map(e => ({
          id: parseInt(e.id),
          entryNumber: e.entryNumber,
          entryDate: new Date(e.date),
          description: e.description,
          totalDebit: e.totalDebit,
          totalCredit: e.totalCredit,
          status: e.status.toLowerCase(),
          createdBy: 'admin',
          createdAt: new Date(e.date)
        }));
      },
      error: (error) => {
        console.error('Error loading entries:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل تحميل القيود'
        });
      }
    });
  }

  loadEntriesOld() {
    // Mock data - BACKUP
    this.entries = [
      {
        id: 1,
        entryNumber: 'JE-2025-001',
        entryDate: new Date('2025-01-15'),
        description: 'قيد افتتاحي للسنة المالية 2025',
        totalDebit: 500000,
        totalCredit: 500000,
        status: 'posted',
        createdBy: 'admin',
        createdAt: new Date('2025-01-15')
      },
      {
        id: 2,
        entryNumber: 'JE-2025-002',
        entryDate: new Date('2025-01-20'),
        description: 'قيد شراء أصول ثابتة',
        totalDebit: 150000,
        totalCredit: 150000,
        status: 'posted',
        createdBy: 'admin',
        createdAt: new Date('2025-01-20')
      },
      {
        id: 3,
        entryNumber: 'JE-2025-003',
        entryDate: new Date('2025-02-01'),
        description: 'قيد رواتب شهر يناير',
        totalDebit: 85000,
        totalCredit: 85000,
        status: 'draft',
        createdBy: 'admin',
        createdAt: new Date('2025-02-01')
      }
    ];
  }

  openNew() {
    this.entry = {
      entryNumber: 'JE-' + new Date().getFullYear() + '-' + String(this.entries.length + 1).padStart(3, '0'),
      entryDate: new Date(),
      description: '',
      status: 'draft'
    };
    this.entryLines = [];
    this.addLine();
    this.addLine();
    this.dialogTitle = 'قيد جديد';
    this.entryDialog = true;
  }

  editEntry(entry: JournalEntry) {
    this.entry = { ...entry };
    this.loadEntryLines(entry.id);
    this.dialogTitle = 'تعديل القيد';
    this.entryDialog = true;
  }

  viewEntry(entry: JournalEntry) {
    this.entry = { ...entry };
    this.loadEntryLines(entry.id);
    this.dialogTitle = 'عرض القيد';
    this.entryDialog = true;
  }

  deleteEntry(entry: JournalEntry) {
    if (confirm('هل أنت متأكد من حذف هذا القيد؟')) {
      this.entries = this.entries.filter(e => e.id !== entry.id);
      this.messageService.add({
        severity: 'success',
        summary: 'نجح',
        detail: 'تم حذف القيد بنجاح'
      });
    }
  }

  loadEntryLines(entryId: number) {
    // Mock data
    this.entryLines = [
      {
        id: 1,
        accountCode: '1010',
        accountName: 'النقدية',
        description: 'رصيد افتتاحي',
        debit: 250000,
        credit: 0
      },
      {
        id: 2,
        accountCode: '3010',
        accountName: 'رأس المال',
        description: 'رصيد افتتاحي',
        debit: 0,
        credit: 250000
      }
    ];
    this.calculateTotals();
  }

  addLine() {
    this.entryLines.push({
      id: 0,
      accountCode: '',
      accountName: '',
      description: '',
      debit: 0,
      credit: 0
    });
  }

  removeLine(index: number) {
    this.entryLines.splice(index, 1);
    this.calculateTotals();
  }

  calculateTotals() {
    this.totalDebit = this.entryLines.reduce((sum, line) => sum + (Number(line.debit) || 0), 0);
    this.totalCredit = this.entryLines.reduce((sum, line) => sum + (Number(line.credit) || 0), 0);
  }

  isBalanced(): boolean {
    return Math.abs(this.totalDebit - this.totalCredit) < 0.01 && this.totalDebit > 0;
  }

  isValid(): boolean {
    return this.entry.entryDate && 
           this.entry.description && 
           this.entryLines.length >= 2 &&
           this.entryLines.every(line => line.accountCode && (line.debit > 0 || line.credit > 0));
  }

  saveEntry(status: string) {
    if (!this.isValid()) {
      this.messageService.add({
        severity: 'error',
        summary: 'خطأ',
        detail: 'يرجى ملء جميع الحقول المطلوبة'
      });
      return;
    }

    if (status === 'posted' && !this.isBalanced()) {
      this.messageService.add({
        severity: 'error',
        summary: 'خطأ',
        detail: 'القيد غير متوازن'
      });
      return;
    }

    this.entry.status = status;
    this.entry.totalDebit = this.totalDebit;
    this.entry.totalCredit = this.totalCredit;

    if (this.entry.id) {
      const index = this.entries.findIndex(e => e.id === this.entry.id);
      this.entries[index] = this.entry;
    } else {
      this.entry.id = this.entries.length + 1;
      this.entry.createdBy = 'admin';
      this.entry.createdAt = new Date();
      this.entries.push(this.entry);
    }

    this.messageService.add({
      severity: 'success',
      summary: 'نجح',
      detail: status === 'posted' ? 'تم ترحيل القيد بنجاح' : 'تم حفظ القيد كمسودة'
    });

    this.hideDialog();
  }

  hideDialog() {
    this.entryDialog = false;
    this.entry = {};
    this.entryLines = [];
  }

  onSearch(event: any) {
    // Implement search logic
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      'draft': 'مسودة',
      'posted': 'مرحّل',
      'cancelled': 'ملغي'
    };
    return labels[status] || status;
  }
}
