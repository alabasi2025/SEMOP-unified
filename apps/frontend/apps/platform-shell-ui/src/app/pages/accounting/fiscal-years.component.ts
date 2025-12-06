import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FiscalYearsService, FiscalYear } from '../../services/fiscal-years.service';

@Component({
  selector: 'app-fiscal-years',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    DatePickerModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>السنوات المالية</h1>
        <button pButton label="إضافة سنة مالية" icon="pi pi-plus" (click)="openNew()"></button>
      </div>

      <div class="card">
        <p-table [value]="fiscalYears" [paginator]="true" [rows]="10">
          <ng-template pTemplate="header">
            <tr>
              <th>الكود</th>
              <th>الاسم</th>
              <th>تاريخ البداية</th>
              <th>تاريخ النهاية</th>
              <th>الحالة</th>
              <th>نشط</th>
              <th style="width: 200px">الإجراءات</th>
            </tr>
          </ng-template>
          
          <ng-template pTemplate="body" let-fiscalYear>
            <tr>
              <td>{{ fiscalYear.code }}</td>
              <td>{{ fiscalYear.nameAr }}</td>
              <td>{{ fiscalYear.startDate | date:'yyyy-MM-dd' }}</td>
              <td>{{ fiscalYear.endDate | date:'yyyy-MM-dd' }}</td>
              <td>
                <span [class]="'status-badge ' + (fiscalYear.isClosed ? 'status-closed' : 'status-open')">
                  {{ fiscalYear.isClosed ? 'مغلقة' : 'مفتوحة' }}
                </span>
              </td>
              <td>
                <span [class]="'status-badge ' + (fiscalYear.isActive ? 'status-active' : 'status-inactive')">
                  {{ fiscalYear.isActive ? 'نشط' : 'غير نشط' }}
                </span>
              </td>
              <td>
                <button pButton icon="pi pi-pencil" class="p-button-rounded p-button-text" 
                        (click)="edit(fiscalYear)" [disabled]="fiscalYear.isClosed"></button>
                <button pButton icon="pi pi-lock" class="p-button-rounded p-button-text p-button-warning" 
                        (click)="closeFiscalYear(fiscalYear)" [disabled]="fiscalYear.isClosed"
                        pTooltip="إغلاق السنة"></button>
                <button pButton icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger" 
                        (click)="delete(fiscalYear)" [disabled]="fiscalYear.isClosed"></button>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <p-dialog [(visible)]="dialog" [header]="dialogTitle" [modal]="true" [style]="{width: '600px'}">
        <div class="form-grid">
          <div class="form-group">
            <label>الكود *</label>
            <input pInputText [(ngModel)]="fiscalYear.code" required />
          </div>
          
          <div class="form-group">
            <label>الاسم بالعربي *</label>
            <input pInputText [(ngModel)]="fiscalYear.nameAr" required />
          </div>
          
          <div class="form-group">
            <label>الاسم بالإنجليزي</label>
            <input pInputText [(ngModel)]="fiscalYear.nameEn" />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>تاريخ البداية *</label>
              <p-datepicker [(ngModel)]="fiscalYear.startDate" dateFormat="yy-mm-dd" [showIcon]="true"></p-datepicker>
            </div>
            
            <div class="form-group">
              <label>تاريخ النهاية *</label>
              <p-datepicker [(ngModel)]="fiscalYear.endDate" dateFormat="yy-mm-dd" [showIcon]="true"></p-datepicker>
            </div>
          </div>
        </div>
        
        <ng-template pTemplate="footer">
          <button pButton label="إلغاء" icon="pi pi-times" class="p-button-text" (click)="hideDialog()"></button>
          <button pButton label="حفظ" icon="pi pi-check" (click)="save()"></button>
        </ng-template>
      </p-dialog>

      <p-toast></p-toast>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 2rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .page-header h1 {
      margin: 0;
      font-size: 2rem;
      color: #333;
    }

    .card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 1.5rem;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .status-active {
      background: #e8f5e9;
      color: #388e3c;
    }

    .status-inactive {
      background: #ffebee;
      color: #c62828;
    }

    .status-open {
      background: #e3f2fd;
      color: #1976d2;
    }

    .status-closed {
      background: #f5f5f5;
      color: #757575;
    }

    .form-grid {
      display: grid;
      gap: 1rem;
      padding: 1rem 0;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-weight: 600;
      color: #333;
    }

    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
      background: #f8f9fa;
      color: #495057;
      font-weight: 600;
    }
  `]
})
export class FiscalYearsComponent implements OnInit {
  fiscalYears: FiscalYear[] = [];
  fiscalYear: any = {};
  dialog = false;
  dialogTitle = '';
  isEditMode = false;

  constructor(
    private fiscalYearsService: FiscalYearsService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadFiscalYears();
  }

  loadFiscalYears() {
    this.fiscalYearsService.getAll().subscribe({
      next: (data) => {
        this.fiscalYears = data;
      },
      error: (error) => {
        console.error('Error loading fiscal years:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل تحميل السنوات المالية'
        });
      }
    });
  }

  openNew() {
    this.fiscalYear = {
      code: '',
      nameAr: '',
      nameEn: '',
      startDate: null,
      endDate: null,
      isActive: false
    };
    this.isEditMode = false;
    this.dialogTitle = 'سنة مالية جديدة';
    this.dialog = true;
  }

  edit(fiscalYear: FiscalYear) {
    this.fiscalYear = { ...fiscalYear };
    this.isEditMode = true;
    this.dialogTitle = 'تعديل السنة المالية';
    this.dialog = true;
  }

  delete(fiscalYear: FiscalYear) {
    if (confirm('هل أنت متأكد من حذف هذه السنة المالية؟')) {
      this.fiscalYearsService.delete(fiscalYear.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'نجح',
            detail: 'تم حذف السنة المالية بنجاح'
          });
          this.loadFiscalYears();
        },
        error: (error) => {
          console.error('Error deleting fiscal year:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'فشل حذف السنة المالية'
          });
        }
      });
    }
  }

  closeFiscalYear(fiscalYear: FiscalYear) {
    if (confirm('هل أنت متأكد من إغلاق هذه السنة المالية؟ لن تتمكن من التعديل عليها بعد الإغلاق.')) {
      this.fiscalYearsService.close(fiscalYear.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'نجح',
            detail: 'تم إغلاق السنة المالية بنجاح'
          });
          this.loadFiscalYears();
        },
        error: (error) => {
          console.error('Error closing fiscal year:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'فشل إغلاق السنة المالية'
          });
        }
      });
    }
  }

  save() {
    if (!this.fiscalYear.code || !this.fiscalYear.nameAr || !this.fiscalYear.startDate || !this.fiscalYear.endDate) {
      this.messageService.add({
        severity: 'error',
        summary: 'خطأ',
        detail: 'يرجى ملء جميع الحقول المطلوبة'
      });
      return;
    }

    // Convert dates to ISO string format
    const data = {
      ...this.fiscalYear,
      startDate: this.fiscalYear.startDate instanceof Date ? 
        this.fiscalYear.startDate.toISOString().split('T')[0] : this.fiscalYear.startDate,
      endDate: this.fiscalYear.endDate instanceof Date ? 
        this.fiscalYear.endDate.toISOString().split('T')[0] : this.fiscalYear.endDate
    };

    if (this.isEditMode) {
      this.fiscalYearsService.update(this.fiscalYear.id, data).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'نجح',
            detail: 'تم تحديث السنة المالية بنجاح'
          });
          this.hideDialog();
          this.loadFiscalYears();
        },
        error: (error) => {
          console.error('Error updating fiscal year:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'فشل تحديث السنة المالية'
          });
        }
      });
    } else {
      this.fiscalYearsService.create(data).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'نجح',
            detail: 'تم إضافة السنة المالية بنجاح'
          });
          this.hideDialog();
          this.loadFiscalYears();
        },
        error: (error) => {
          console.error('Error creating fiscal year:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'فشل إضافة السنة المالية'
          });
        }
      });
    }
  }

  hideDialog() {
    this.dialog = false;
    this.fiscalYear = {};
  }
}
