#!/bin/bash

# Function to create component with API integration
create_component() {
  DIR=$1
  NAME=$2
  SERVICE=$3
  ARABIC_NAME=$4
  ARABIC_SINGULAR=$5
  
  cat > ${DIR}/${DIR}.component.ts << 'COMP'
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SERVICE_IMPORT } from '../../services/SERVICE_FILE';

@Component({
  selector: 'app-COMPONENT_NAME',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  template: \`
    <div class="p-4">
      <h2>ARABIC_TITLE</h2>
      
      <p-button label="إضافة ARABIC_SINGULAR" icon="pi pi-plus" (onClick)="showAddDialog()"></p-button>
      
      <p-table [value]="items" [loading]="loading" styleClass="p-datatable-gridlines mt-3">
        <ng-template pTemplate="header">
          <tr>
            <th>الرقم</th>
            <th>الاسم</th>
            <th>الوصف</th>
            <th>الإجراءات</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-item>
          <tr>
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.description }}</td>
            <td>
              <p-button icon="pi pi-pencil" class="p-button-sm p-button-warning mr-2" (onClick)="editItem(item)"></p-button>
              <p-button icon="pi pi-trash" class="p-button-sm p-button-danger" (onClick)="deleteItem(item)"></p-button>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="4" class="text-center">لا توجد بيانات</td>
          </tr>
        </ng-template>
      </p-table>

      <p-dialog [(visible)]="displayDialog" [header]="editMode ? 'تعديل ARABIC_SINGULAR' : 'إضافة ARABIC_SINGULAR جديد'" [modal]="true" [style]="{width: '500px'}">
        <div class="p-fluid">
          <div class="field">
            <label for="name">الاسم *</label>
            <input pInputText id="name" [(ngModel)]="currentItem.name" required />
          </div>
          <div class="field">
            <label for="description">الوصف</label>
            <input pInputText id="description" [(ngModel)]="currentItem.description" />
          </div>
        </div>
        <ng-template pTemplate="footer">
          <p-button label="إلغاء" icon="pi pi-times" (onClick)="displayDialog = false" styleClass="p-button-text"></p-button>
          <p-button label="حفظ" icon="pi pi-check" (onClick)="saveItem()" [loading]="saving"></p-button>
        </ng-template>
      </p-dialog>

      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>
    </div>
  \`
})
export class COMPONENT_CLASS implements OnInit {
  items: any[] = [];
  loading = false;
  displayDialog = false;
  editMode = false;
  saving = false;
  currentItem: any = {};

  constructor(
    private service: SERVICE_IMPORT,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (data) => {
        this.items = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading items:', error);
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل تحميل البيانات' });
      }
    });
  }

  showAddDialog() {
    this.currentItem = {};
    this.editMode = false;
    this.displayDialog = true;
  }

  editItem(item: any) {
    this.currentItem = { ...item };
    this.editMode = true;
    this.displayDialog = true;
  }

  saveItem() {
    this.saving = true;
    const operation = this.editMode 
      ? this.service.update(this.currentItem.id, this.currentItem)
      : this.service.create(this.currentItem);

    operation.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'نجح', detail: this.editMode ? 'تم التحديث' : 'تم الإضافة' });
        this.displayDialog = false;
        this.saving = false;
        this.loadItems();
      },
      error: (error) => {
        console.error('Error saving item:', error);
        this.saving = false;
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل الحفظ' });
      }
    });
  }

  deleteItem(item: any) {
    this.confirmationService.confirm({
      message: \`هل أنت متأكد من حذف "\${item.name}"؟\`,
      header: 'تأكيد الحذف',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'نعم',
      rejectLabel: 'لا',
      accept: () => {
        this.service.delete(item.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'نجح', detail: 'تم الحذف' });
            this.loadItems();
          },
          error: (error) => {
            console.error('Error deleting item:', error);
            this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل الحذف' });
          }
        });
      }
    });
  }
}
COMP

  # Replace placeholders
  sed -i "s/SERVICE_IMPORT/${NAME}Service/g" ${DIR}/${DIR}.component.ts
  sed -i "s/SERVICE_FILE/${SERVICE}.service/g" ${DIR}/${DIR}.component.ts
  sed -i "s/COMPONENT_NAME/${DIR}/g" ${DIR}/${DIR}.component.ts
  sed -i "s/COMPONENT_CLASS/${NAME}Component/g" ${DIR}/${DIR}.component.ts
  sed -i "s/ARABIC_TITLE/${ARABIC_NAME}/g" ${DIR}/${DIR}.component.ts
  sed -i "s/ARABIC_SINGULAR/${ARABIC_SINGULAR}/g" ${DIR}/${DIR}.component.ts
}

# Create all components
create_component "permissions" "Permissions" "permissions" "إدارة الصلاحيات" "صلاحية"
create_component "holdings" "Holdings" "holdings" "إدارة الشركات القابضة" "شركة قابضة"
create_component "units" "Units" "units" "إدارة الوحدات" "وحدة"
create_component "projects" "Projects" "projects" "إدارة المشاريع" "مشروع"
create_component "customers" "Customers" "customers" "إدارة العملاء" "عميل"
create_component "suppliers" "Suppliers" "suppliers" "إدارة الموردين" "مورد"
create_component "items" "Items" "items" "إدارة الأصناف" "صنف"

echo "All components updated successfully"
