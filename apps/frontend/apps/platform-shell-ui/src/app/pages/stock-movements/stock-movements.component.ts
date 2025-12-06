import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Tooltip } from 'primeng/tooltip';
import { Card } from 'primeng/card';
import { MessageService, ConfirmationService } from 'primeng/api';
import { StockMovementsService, StockMovement, CreateStockMovementDto, StockMovementStatistics } from '../../services/stock-movements.service';

interface FilterOptions {
  warehouseId?: string;
  itemId?: string;
  movementType?: string;
  startDate?: Date;
  endDate?: Date;
}

@Component({
  selector: 'app-stock-movements',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    Button,
    Dialog,
    InputText,
    InputNumber,
    Select,
    DatePicker,
    Toast,
    ConfirmDialog,
    Tooltip,
    Card
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="stock-movements-page">
      <p-toast position="top-center"></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <!-- Page Header -->
      <div class="page-header">
        <h1>حركات المخزون</h1>
        <button 
          pButton 
          type="button" 
          label="إضافة حركة جديدة" 
          icon="pi pi-plus"
          (click)="openDialog()"
          class="p-button-success">
        </button>
      </div>

      <!-- Statistics Cards -->
      <div class="statistics-section">
        <p-card class="stat-card">
          <ng-template pTemplate="header">
            <div class="stat-icon">📥</div>
          </ng-template>
          <div class="stat-content">
            <h3>إجمالي الوارد</h3>
            <p class="stat-value">{{ statistics?.totalInbound || 0 }}</p>
          </div>
        </p-card>

        <p-card class="stat-card">
          <ng-template pTemplate="header">
            <div class="stat-icon">📤</div>
          </ng-template>
          <div class="stat-content">
            <h3>إجمالي الصادر</h3>
            <p class="stat-value">{{ statistics?.totalOutbound || 0 }}</p>
          </div>
        </p-card>

        <p-card class="stat-card">
          <ng-template pTemplate="header">
            <div class="stat-icon">📊</div>
          </ng-template>
          <div class="stat-content">
            <h3>حركات اليوم</h3>
            <p class="stat-value">{{ statistics?.totalMovementsToday || 0 }}</p>
          </div>
        </p-card>
      </div>

      <!-- Filters Section -->
      <div class="filters-section">
        <h3>الفلاتر</h3>
        <div class="filter-row">
          <div class="filter-group">
            <label>المستودع:</label>
            <p-select 
              [options]="warehouses" 
              optionLabel="name" 
              optionValue="id"
              [(ngModel)]="filters.warehouseId"
              placeholder="اختر المستودع"
              [showClear]="true">
            </p-select>
          </div>

          <div class="filter-group">
            <label>الصنف:</label>
            <p-select 
              [options]="items" 
              optionLabel="name" 
              optionValue="id"
              [(ngModel)]="filters.itemId"
              placeholder="اختر الصنف"
              [showClear]="true">
            </p-select>
          </div>

          <div class="filter-group">
            <label>نوع الحركة:</label>
            <p-select 
              [options]="movementTypes" 
              optionLabel="label" 
              optionValue="value"
              [(ngModel)]="filters.movementType"
              placeholder="اختر النوع"
              [showClear]="true">
            </p-select>
          </div>

          <div class="filter-group">
            <label>من التاريخ:</label>
            <p-datePicker 
              [(ngModel)]="filters.startDate"
              placeholder="اختر التاريخ"
              [showIcon]="true">
            </p-datePicker>
          </div>

          <div class="filter-group">
            <label>إلى التاريخ:</label>
            <p-datePicker 
              [(ngModel)]="filters.endDate"
              placeholder="اختر التاريخ"
              [showIcon]="true">
            </p-datePicker>
          </div>

          <div class="filter-actions">
            <button 
              pButton 
              type="button" 
              label="بحث" 
              icon="pi pi-search"
              (click)="applyFilters()"
              class="p-button-info">
            </button>
            <button 
              pButton 
              type="button" 
              label="إعادة تعيين" 
              icon="pi pi-refresh"
              (click)="resetFilters()"
              class="p-button-secondary">
            </button>
          </div>
        </div>
      </div>

      <!-- Data Table -->
      <p-table 
        #dt 
        [value]="movements" 
        [paginator]="true" 
        [rows]="10"
        [globalFilterFields]="['warehouseName','itemName','movementType']"
        responsiveLayout="scroll"
        styleClass="p-datatable-striped">
        
        <ng-template pTemplate="header">
          <tr>
            <th>المستودع</th>
            <th>الصنف</th>
            <th>نوع الحركة</th>
            <th>الكمية</th>
            <th>الملاحظات</th>
            <th>التاريخ</th>
            <th>الإجراءات</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-movement>
          <tr>
            <td>{{ movement.warehouseName }}</td>
            <td>{{ movement.itemName }}</td>
            <td>
              <span [ngClass]="getMovementTypeClass(movement.movementType)">
                {{ getMovementTypeLabel(movement.movementType) }}
              </span>
            </td>
            <td>{{ movement.quantity }}</td>
            <td>{{ movement.notes }}</td>
            <td>{{ movement.createdAt | date: 'short' }}</td>
            <td>
              <button 
                pButton 
                pRipple 
                type="button" 
                pTooltip="تعديل" 
                icon="pi pi-pencil" 
                class="p-button-rounded p-button-warning p-button-sm"
                (click)="editMovement(movement)">
              </button>
              <button 
                pButton 
                pRipple 
                type="button" 
                pTooltip="حذف" 
                icon="pi pi-trash" 
                class="p-button-rounded p-button-danger p-button-sm"
                (click)="deleteMovement(movement)">
              </button>
            </td>
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="7" class="text-center">لا توجد حركات مخزون</td>
          </tr>
        </ng-template>
      </p-table>

      <!-- Add/Edit Dialog -->
      <p-dialog 
        [(visible)]="displayDialog" 
        [header]="isEditMode ? 'تعديل حركة مخزون' : 'إضافة حركة مخزون جديدة'" 
        [modal]="true" 
        [style]="{ width: '50vw' }"
        (onHide)="closeDialog()">
        
        <form (ngSubmit)="saveMovement()">
          <div class="form-group">
            <label>المستودع:</label>
            <p-select 
              [options]="warehouses" 
              optionLabel="name" 
              optionValue="id"
              [(ngModel)]="formData.warehouseId"
              name="warehouseId"
              placeholder="اختر المستودع"
              required>
            </p-select>
          </div>

          <div class="form-group">
            <label>الصنف:</label>
            <p-select 
              [options]="items" 
              optionLabel="name" 
              optionValue="id"
              [(ngModel)]="formData.itemId"
              name="itemId"
              placeholder="اختر الصنف"
              required>
            </p-select>
          </div>

          <div class="form-group">
            <label>نوع الحركة:</label>
            <p-select 
              [options]="movementTypes" 
              optionLabel="label" 
              optionValue="value"
              [(ngModel)]="formData.movementType"
              name="movementType"
              placeholder="اختر النوع"
              required>
            </p-select>
          </div>

          <div class="form-group">
            <label>الكمية:</label>
            <p-inputNumber 
              [(ngModel)]="formData.quantity"
              name="quantity"
              [min]="0"
              placeholder="أدخل الكمية"
              required>
            </p-inputNumber>
          </div>

          <div class="form-group">
            <label>الملاحظات:</label>
            <input 
              pInputText 
              [(ngModel)]="formData.notes"
              name="notes"
              placeholder="أدخل الملاحظات"
              type="text">
          </div>

          <ng-template pTemplate="footer">
            <button 
              pButton 
              type="button" 
              label="إلغاء" 
              icon="pi pi-times"
              (click)="closeDialog()"
              class="p-button-text">
            </button>
            <button 
              pButton 
              type="submit" 
              label="حفظ" 
              icon="pi pi-check"
              class="p-button-success">
            </button>
          </ng-template>
        </form>
      </p-dialog>
    </div>
  `,
  styles: [`
    .stock-movements-page {
      padding: 20px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .page-header h1 {
      margin: 0;
      font-size: 28px;
      color: #333;
    }

    .statistics-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      text-align: center;
    }

    .stat-icon {
      font-size: 32px;
      margin-bottom: 10px;
    }

    .stat-content h3 {
      margin: 10px 0 5px 0;
      color: #666;
      font-size: 14px;
    }

    .stat-value {
      margin: 0;
      font-size: 28px;
      font-weight: bold;
      color: #2196F3;
    }

    .filters-section {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }

    .filters-section h3 {
      margin-top: 0;
      color: #333;
    }

    .filter-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      align-items: flex-end;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
    }

    .filter-group label {
      margin-bottom: 5px;
      font-weight: 500;
      color: #333;
    }

    .filter-actions {
      display: flex;
      gap: 10px;
    }

    .form-group {
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
    }

    .text-center {
      text-align: center;
    }

    .movement-in {
      background-color: #c8e6c9;
      color: #2e7d32;
      padding: 4px 8px;
      border-radius: 4px;
    }

    .movement-out {
      background-color: #ffccbc;
      color: #d84315;
      padding: 4px 8px;
      border-radius: 4px;
    }

    .movement-transfer {
      background-color: #bbdefb;
      color: #1565c0;
      padding: 4px 8px;
      border-radius: 4px;
    }

    .movement-adjustment {
      background-color: #fff9c4;
      color: #f57f17;
      padding: 4px 8px;
      border-radius: 4px;
    }
  `]
})
export class StockMovementsComponent implements OnInit {
  movements: StockMovement[] = [];
  statistics: StockMovementStatistics | null = null;
  displayDialog: boolean = false;
  isEditMode: boolean = false;
  selectedMovement: StockMovement | null = null;

  filters: FilterOptions = {};
  formData: CreateStockMovementDto = {
    warehouseId: '',
    itemId: '',
    movementType: 'IN',
    quantity: 0,
    notes: ''
  };

  warehouses: any[] = [
    { id: '1', name: 'المستودع الرئيسي' },
    { id: '2', name: 'مستودع الفرع' }
  ];

  items: any[] = [
    { id: '1', name: 'منتج أ' },
    { id: '2', name: 'منتج ب' },
    { id: '3', name: 'منتج ج' }
  ];

  movementTypes: any[] = [
    { label: 'وارد', value: 'IN' },
    { label: 'صادر', value: 'OUT' },
    { label: 'تحويل', value: 'TRANSFER' },
    { label: 'تسوية', value: 'ADJUSTMENT' }
  ];

  constructor(
    private stockMovementsService: StockMovementsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadMovements();
    this.loadStatistics();
  }

  loadMovements(): void {
    this.stockMovementsService.getAll().subscribe({
      next: (data: any) => {
        this.movements = data;
      },
      error: (error: any) => {
        console.error('Error loading movements:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل تحميل الحركات'
        });
      }
    });
  }

  loadStatistics(): void {
    this.stockMovementsService.getStatistics().subscribe({
      next: (data: StockMovementStatistics) => {
        this.statistics = data;
      },
      error: (error: any) => {
        console.error('Error loading statistics:', error);
      }
    });
  }

  applyFilters(): void {
    this.stockMovementsService.getAll(this.filters).subscribe({
      next: (data: any) => {
        this.movements = data;
        this.messageService.add({
          severity: 'success',
          summary: 'نجح',
          detail: 'تم تطبيق الفلاتر'
        });
      },
      error: (error: any) => {
        console.error('Error applying filters:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل تطبيق الفلاتر'
        });
      }
    });
  }

  resetFilters(): void {
    this.filters = {};
    this.loadMovements();
    this.messageService.add({
      severity: 'info',
      summary: 'تم',
      detail: 'تم إعادة تعيين الفلاتر'
    });
  }

  openDialog(): void {
    this.isEditMode = false;
    this.formData = {
      warehouseId: '',
      itemId: '',
      movementType: 'IN',
      quantity: 0,
      notes: ''
    };
    this.displayDialog = true;
  }

  editMovement(movement: StockMovement): void {
    this.isEditMode = true;
    this.selectedMovement = movement;
    this.formData = {
      warehouseId: movement.warehouseId,
      itemId: movement.itemId,
      movementType: movement.movementType,
      quantity: movement.quantity,
      notes: movement.notes
    };
    this.displayDialog = true;
  }

  saveMovement(): void {
    if (this.isEditMode && this.selectedMovement) {
      this.stockMovementsService.update(this.selectedMovement.id, this.formData).subscribe({
        next: (data: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'نجح',
            detail: 'تم تحديث الحركة بنجاح'
          });
          this.closeDialog();
          this.loadMovements();
        },
        error: (error: any) => {
          console.error('Error updating movement:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'فشل تحديث الحركة'
          });
        }
      });
    } else {
      this.stockMovementsService.create(this.formData).subscribe({
        next: (data: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'نجح',
            detail: 'تم إضافة الحركة بنجاح'
          });
          this.closeDialog();
          this.loadMovements();
        },
        error: (error: any) => {
          console.error('Error creating movement:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'فشل إضافة الحركة'
          });
        }
      });
    }
  }

  deleteMovement(movement: StockMovement): void {
    this.confirmationService.confirm({
      message: 'هل أنت متأكد من حذف هذه الحركة؟',
      header: 'تأكيد الحذف',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.stockMovementsService.delete(movement.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'نجح',
              detail: 'تم حذف الحركة بنجاح'
            });
            this.loadMovements();
          },
          error: (error: any) => {
            console.error('Error deleting movement:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'خطأ',
              detail: 'فشل حذف الحركة'
            });
          }
        });
      }
    });
  }

  closeDialog(): void {
    this.displayDialog = false;
    this.isEditMode = false;
    this.selectedMovement = null;
  }

  getMovementTypeLabel(type: string): string {
    const typeMap: { [key: string]: string } = {
      'IN': 'وارد',
      'OUT': 'صادر',
      'TRANSFER': 'تحويل',
      'ADJUSTMENT': 'تسوية'
    };
    return typeMap[type] || type;
  }

  getMovementTypeClass(type: string): string {
    const classMap: { [key: string]: string } = {
      'IN': 'movement-in',
      'OUT': 'movement-out',
      'TRANSFER': 'movement-transfer',
      'ADJUSTMENT': 'movement-adjustment'
    };
    return classMap[type] || '';
  }
}
