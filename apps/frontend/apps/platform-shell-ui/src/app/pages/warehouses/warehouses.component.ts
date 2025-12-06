import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { WarehousesService, Warehouse } from '../../services/warehouses.service';

@Component({
  selector: 'app-warehouses',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    CheckboxModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="warehouses-page">
      <p-toast position="top-center"></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <div class="page-header">
        <h2>المستودعات</h2>
        <button pButton label="مستودع جديد" icon="pi pi-plus" (click)="openNew()"></button>
      </div>

      <div class="card">
        <p-table 
          #warehousesTable
          [value]="warehouses" 
          [paginator]="true" 
          [rows]="10"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="عرض {first} إلى {last} من {totalRecords} مستودع"
          [globalFilterFields]="['code', 'nameAr', 'location']"
          styleClass="p-datatable-gridlines">
          
          <ng-template pTemplate="caption">
            <div class="table-header">
              <span class="p-input-icon-left">
                <i class="pi pi-search"></i>
                <input 
                  pInputText 
                  type="text" 
                  #searchInput
                  (input)="warehousesTable.filterGlobal(searchInput.value, 'contains')" 
                  placeholder="بحث..." />
              </span>
            </div>
          </ng-template>

          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="code">الرمز <p-sortIcon field="code"></p-sortIcon></th>
              <th pSortableColumn="nameAr">اسم المستودع <p-sortIcon field="nameAr"></p-sortIcon></th>
              <th pSortableColumn="location">الموقع <p-sortIcon field="location"></p-sortIcon></th>
              <th pSortableColumn="managerName">المدير <p-sortIcon field="managerName"></p-sortIcon></th>
              <th pSortableColumn="capacity">السعة <p-sortIcon field="capacity"></p-sortIcon></th>
              <th pSortableColumn="currentStock">المخزون الحالي <p-sortIcon field="currentStock"></p-sortIcon></th>
              <th>نسبة الامتلاء</th>
              <th pSortableColumn="isActive">نشط <p-sortIcon field="isActive"></p-sortIcon></th>
              <th>الإجراءات</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-warehouse>
            <tr>
              <td>{{ warehouse.code }}</td>
              <td>{{ warehouse.nameAr }}</td>
              <td>{{ warehouse.location }}</td>
              <td>{{ warehouse.managerName }}</td>
              <td>{{ warehouse.capacity | number }}</td>
              <td>{{ warehouse.currentStock | number }}</td>
              <td>
                <div class="usage-indicator">
                  <div class="usage-bar" [style.width.%]="getUsagePercentage(warehouse)">
                    {{ getUsagePercentage(warehouse) }}%
                  </div>
                </div>
              </td>
              <td>
                <span [class]="'status-badge ' + (warehouse.isActive ? 'status-active' : 'status-inactive')">
                  {{ warehouse.isActive ? 'نشط' : 'غير نشط' }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button 
                    pButton 
                    icon="pi pi-eye" 
                    class="p-button-rounded p-button-text p-button-info"
                    (click)="viewWarehouse(warehouse)"
                    pTooltip="عرض"></button>
                  <button 
                    pButton 
                    icon="pi pi-pencil" 
                    class="p-button-rounded p-button-text p-button-warning"
                    (click)="editWarehouse(warehouse)"
                    pTooltip="تعديل"></button>
                  <button 
                    pButton 
                    icon="pi pi-trash" 
                    class="p-button-rounded p-button-text p-button-danger"
                    (click)="deleteWarehouse(warehouse)"
                    pTooltip="حذف"></button>
                </div>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="9" class="text-center">لا توجد مستودعات</td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <!-- Dialog للإضافة/التعديل -->
      <p-dialog 
        [(visible)]="warehouseDialog" 
        [header]="dialogTitle"
        [modal]="true" 
        [style]="{width: '600px'}"
        [draggable]="false"
        [resizable]="false">
        
        <div class="form-grid">
          <div class="form-field">
            <label for="code">رمز المستودع *</label>
            <input 
              pInputText 
              id="code" 
              [(ngModel)]="warehouse.code" 
              required 
              placeholder="مثال: WH-001" />
          </div>

          <div class="form-field">
            <label for="nameAr">الاسم بالعربية *</label>
            <input 
              pInputText 
              id="nameAr" 
              [(ngModel)]="warehouse.nameAr" 
              required 
              placeholder="مثال: المستودع الرئيسي" />
          </div>

          <div class="form-field">
            <label for="nameEn">الاسم بالإنجليزية</label>
            <input 
              pInputText 
              id="nameEn" 
              [(ngModel)]="warehouse.nameEn" 
              placeholder="Example: Main Warehouse" />
          </div>

          <div class="form-field">
            <label for="location">الموقع</label>
            <input 
              pInputText 
              id="location" 
              [(ngModel)]="warehouse.location" 
              placeholder="مثال: صنعاء - شارع الزبيري" />
          </div>

          <div class="form-field">
            <label for="capacity">السعة</label>
            <p-inputNumber 
              id="capacity" 
              [(ngModel)]="warehouse.capacity" 
              [min]="0"
              placeholder="0">
            </p-inputNumber>
          </div>

          <div class="form-field checkbox-field">
            <p-checkbox 
              [(ngModel)]="warehouse.isActive" 
              [binary]="true" 
              inputId="isActive">
            </p-checkbox>
            <label for="isActive">مستودع نشط</label>
          </div>
        </div>

        <ng-template pTemplate="footer">
          <button 
            pButton 
            label="إلغاء" 
            icon="pi pi-times" 
            class="p-button-text"
            (click)="hideDialog()"></button>
          <button 
            pButton 
            label="حفظ" 
            icon="pi pi-check" 
            (click)="saveWarehouse()"
            [disabled]="!isValid()"></button>
        </ng-template>
      </p-dialog>

      <!-- Dialog للعرض -->
      <p-dialog 
        [(visible)]="viewDialog" 
        header="تفاصيل المستودع"
        [modal]="true" 
        [style]="{width: '500px'}"
        [draggable]="false"
        [resizable]="false">
        
        <div class="view-details" *ngIf="selectedWarehouse">
          <div class="detail-row">
            <span class="label">الرمز:</span>
            <span class="value">{{ selectedWarehouse.code }}</span>
          </div>
          <div class="detail-row">
            <span class="label">الاسم بالعربية:</span>
            <span class="value">{{ selectedWarehouse.nameAr }}</span>
          </div>
          <div class="detail-row" *ngIf="selectedWarehouse.nameEn">
            <span class="label">الاسم بالإنجليزية:</span>
            <span class="value">{{ selectedWarehouse.nameEn }}</span>
          </div>
          <div class="detail-row">
            <span class="label">الموقع:</span>
            <span class="value">{{ selectedWarehouse.location }}</span>
          </div>
          <div class="detail-row">
            <span class="label">المدير:</span>
            <span class="value">{{ selectedWarehouse.managerName }}</span>
          </div>
          <div class="detail-row">
            <span class="label">السعة:</span>
            <span class="value">{{ selectedWarehouse.capacity | number }}</span>
          </div>
          <div class="detail-row">
            <span class="label">المخزون الحالي:</span>
            <span class="value">{{ selectedWarehouse.currentStock | number }}</span>
          </div>
          <div class="detail-row">
            <span class="label">نسبة الامتلاء:</span>
            <span class="value">{{ getUsagePercentage(selectedWarehouse) }}%</span>
          </div>
          <div class="detail-row">
            <span class="label">الحالة:</span>
            <span [class]="'status-badge ' + (selectedWarehouse.isActive ? 'status-active' : 'status-inactive')">
              {{ selectedWarehouse.isActive ? 'نشط' : 'غير نشط' }}
            </span>
          </div>
          <div class="detail-row">
            <span class="label">تاريخ الإنشاء:</span>
            <span class="value">{{ selectedWarehouse.createdAt }}</span>
          </div>
        </div>

        <ng-template pTemplate="footer">
          <button 
            pButton 
            label="إغلاق" 
            icon="pi pi-times" 
            class="p-button-text"
            (click)="viewDialog = false"></button>
        </ng-template>
      </p-dialog>
    </div>
  `,
  styles: [`
    .warehouses-page {
      padding: 1.5rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .page-header h2 {
      margin: 0;
      color: #333;
    }

    .card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 1.5rem;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
    }

    .form-grid {
      display: grid;
      gap: 1.5rem;
      padding: 1rem 0;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-field label {
      font-weight: 600;
      color: #333;
    }

    .checkbox-field {
      flex-direction: row;
      align-items: center;
      gap: 0.75rem;
    }

    .checkbox-field label {
      margin: 0;
    }

    .view-details {
      padding: 1rem 0;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .detail-row .label {
      font-weight: 600;
      color: #666;
    }

    .detail-row .value {
      color: #333;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .status-active {
      background: #d4edda;
      color: #155724;
    }

    .status-inactive {
      background: #f8d7da;
      color: #721c24;
    }

    .usage-indicator {
      width: 100%;
      height: 24px;
      background: #f0f0f0;
      border-radius: 4px;
      overflow: hidden;
      position: relative;
    }

    .usage-bar {
      height: 100%;
      background: linear-gradient(90deg, #4CAF50, #8BC34A);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 0.75rem;
      transition: width 0.3s ease;
    }

    .text-center {
      text-align: center;
    }

    :host ::ng-deep {
      .p-datatable .p-datatable-thead > tr > th {
        background: #f8f9fa;
        color: #333;
        font-weight: 600;
        text-align: right;
      }

      .p-datatable .p-datatable-tbody > tr > td {
        text-align: right;
      }

      .p-dialog .p-dialog-header {
        background: #667eea;
        color: white;
      }

      .p-dialog .p-dialog-content {
        padding: 1.5rem;
      }
    }
  `]
})
export class WarehousesComponent implements OnInit {
  warehouses: Warehouse[] = [];
  warehouse: Warehouse = this.getEmptyWarehouse();
  selectedWarehouse: Warehouse | null = null;
  warehouseDialog = false;
  viewDialog = false;
  isEditMode = false;
  dialogTitle = '';

  constructor(
    private warehousesService: WarehousesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadWarehouses();
  }

  loadWarehouses() {
    this.warehousesService.getAll().subscribe({
      next: (data) => {
        this.warehouses = data;
      },
      error: (error) => {
        console.error('Error loading warehouses:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل في تحميل المستودعات'
        });
      }
    });
  }

  openNew() {
    this.warehouse = this.getEmptyWarehouse();
    this.isEditMode = false;
    this.dialogTitle = 'مستودع جديد';
    this.warehouseDialog = true;
  }

  editWarehouse(warehouse: Warehouse) {
    this.warehouse = { ...warehouse };
    this.isEditMode = true;
    this.dialogTitle = 'تعديل المستودع';
    this.warehouseDialog = true;
  }

  viewWarehouse(warehouse: Warehouse) {
    this.selectedWarehouse = warehouse;
    this.viewDialog = true;
  }

  deleteWarehouse(warehouse: Warehouse) {
    this.confirmationService.confirm({
      message: `هل أنت متأكد من حذف المستودع "${warehouse.nameAr}"؟`,
      header: 'تأكيد الحذف',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'نعم',
      rejectLabel: 'لا',
      accept: () => {
        this.warehousesService.delete(warehouse.id!).subscribe({
          next: () => {
            this.loadWarehouses();
            this.messageService.add({
              severity: 'success',
              summary: 'نجح',
              detail: 'تم حذف المستودع بنجاح'
            });
          },
          error: (error) => {
            console.error('Error deleting warehouse:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'خطأ',
              detail: 'فشل في حذف المستودع'
            });
          }
        });
      }
    });
  }

  saveWarehouse() {
    if (!this.isValid()) {
      this.messageService.add({
        severity: 'error',
        summary: 'خطأ',
        detail: 'يرجى ملء جميع الحقول المطلوبة'
      });
      return;
    }

    const request = this.isEditMode
      ? this.warehousesService.update(this.warehouse.id!, this.warehouse)
      : this.warehousesService.create(this.warehouse);

    request.subscribe({
      next: () => {
        this.loadWarehouses();
        this.messageService.add({
          severity: 'success',
          summary: 'نجح',
          detail: 'تم حفظ المستودع بنجاح'
        });
        this.hideDialog();
      },
      error: (error) => {
        console.error('Error saving warehouse:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل في حفظ المستودع'
        });
      }
    });
  }

  hideDialog() {
    this.warehouseDialog = false;
    this.warehouse = this.getEmptyWarehouse();
  }

  isValid(): boolean {
    return !!this.warehouse.code && !!this.warehouse.nameAr;
  }

  getUsagePercentage(warehouse: Warehouse): number {
    if (!warehouse.capacity || warehouse.capacity === 0) return 0;
    return Math.round(((warehouse.currentStock || 0) / warehouse.capacity) * 100);
  }

  getEmptyWarehouse(): Warehouse {
    return {
      code: '',
      nameAr: '',
      nameEn: '',
      location: '',
      capacity: 0,
      isActive: true
    };
  }
}
