import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CostCentersService, CostCenter } from '../../services/cost-centers.service';

@Component({
  selector: 'app-cost-centers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>مراكز التكلفة</h1>
        <button pButton label="إضافة مركز تكلفة" icon="pi pi-plus" (click)="openNew()"></button>
      </div>

      <div class="card">
        <p-table [value]="costCenters" [paginator]="true" [rows]="10" [globalFilterFields]="['code','nameAr','description']">
          <ng-template pTemplate="caption">
            <div class="table-header">
              <span class="p-input-icon-left">
                <i class="pi pi-search"></i>
                <input pInputText type="text" (input)="onSearch($event)" placeholder="بحث..." />
              </span>
            </div>
          </ng-template>
          
          <ng-template pTemplate="header">
            <tr>
              <th>الكود</th>
              <th>الاسم</th>
              <th>الوصف</th>
              <th>الحالة</th>
              <th style="width: 150px">الإجراءات</th>
            </tr>
          </ng-template>
          
          <ng-template pTemplate="body" let-costCenter>
            <tr>
              <td>{{ costCenter.code }}</td>
              <td>{{ costCenter.nameAr }}</td>
              <td>{{ costCenter.description }}</td>
              <td>
                <span [class]="'status-badge ' + (costCenter.isActive ? 'status-active' : 'status-inactive')">
                  {{ costCenter.isActive ? 'نشط' : 'غير نشط' }}
                </span>
              </td>
              <td>
                <button pButton icon="pi pi-pencil" class="p-button-rounded p-button-text" (click)="edit(costCenter)"></button>
                <button pButton icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger" (click)="delete(costCenter)"></button>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <p-dialog [(visible)]="dialog" [header]="dialogTitle" [modal]="true" [style]="{width: '500px'}">
        <div class="form-grid">
          <div class="form-group">
            <label>الكود *</label>
            <input pInputText [(ngModel)]="costCenter.code" required />
          </div>
          
          <div class="form-group">
            <label>الاسم بالعربي *</label>
            <input pInputText [(ngModel)]="costCenter.nameAr" required />
          </div>
          
          <div class="form-group">
            <label>الاسم بالإنجليزي</label>
            <input pInputText [(ngModel)]="costCenter.nameEn" />
          </div>
          
          <div class="form-group">
            <label>الوصف</label>
            <input pInputText [(ngModel)]="costCenter.description" />
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

    .status-active {
      background: #e8f5e9;
      color: #388e3c;
    }

    .status-inactive {
      background: #ffebee;
      color: #c62828;
    }

    .form-grid {
      display: grid;
      gap: 1rem;
      padding: 1rem 0;
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
export class CostCentersComponent implements OnInit {
  costCenters: CostCenter[] = [];
  costCenter: any = {};
  dialog = false;
  dialogTitle = '';
  isEditMode = false;

  constructor(
    private costCentersService: CostCentersService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadCostCenters();
  }

  loadCostCenters() {
    this.costCentersService.getAll().subscribe({
      next: (data) => {
        this.costCenters = data;
      },
      error: (error) => {
        console.error('Error loading cost centers:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل تحميل مراكز التكلفة'
        });
      }
    });
  }

  openNew() {
    this.costCenter = {
      code: '',
      nameAr: '',
      nameEn: '',
      description: '',
      isActive: true
    };
    this.isEditMode = false;
    this.dialogTitle = 'مركز تكلفة جديد';
    this.dialog = true;
  }

  edit(costCenter: CostCenter) {
    this.costCenter = { ...costCenter };
    this.isEditMode = true;
    this.dialogTitle = 'تعديل مركز التكلفة';
    this.dialog = true;
  }

  delete(costCenter: CostCenter) {
    if (confirm('هل أنت متأكد من حذف هذا المركز؟')) {
      this.costCentersService.delete(costCenter.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'نجح',
            detail: 'تم حذف مركز التكلفة بنجاح'
          });
          this.loadCostCenters();
        },
        error: (error) => {
          console.error('Error deleting cost center:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'فشل حذف مركز التكلفة'
          });
        }
      });
    }
  }

  save() {
    if (!this.costCenter.code || !this.costCenter.nameAr) {
      this.messageService.add({
        severity: 'error',
        summary: 'خطأ',
        detail: 'يرجى ملء جميع الحقول المطلوبة'
      });
      return;
    }

    if (this.isEditMode) {
      this.costCentersService.update(this.costCenter.id, this.costCenter).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'نجح',
            detail: 'تم تحديث مركز التكلفة بنجاح'
          });
          this.hideDialog();
          this.loadCostCenters();
        },
        error: (error) => {
          console.error('Error updating cost center:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'فشل تحديث مركز التكلفة'
          });
        }
      });
    } else {
      this.costCentersService.create(this.costCenter).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'نجح',
            detail: 'تم إضافة مركز التكلفة بنجاح'
          });
          this.hideDialog();
          this.loadCostCenters();
        },
        error: (error) => {
          console.error('Error creating cost center:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'فشل إضافة مركز التكلفة'
          });
        }
      });
    }
  }

  hideDialog() {
    this.dialog = false;
    this.costCenter = {};
  }

  onSearch(event: any) {
    // Implement search logic
  }
}
