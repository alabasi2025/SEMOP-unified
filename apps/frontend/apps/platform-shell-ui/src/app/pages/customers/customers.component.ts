import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule, TableModule, ButtonModule, DialogModule, 
    InputTextModule, FormsModule, ToastModule, ConfirmDialogModule,
    ToolbarModule, TagModule, TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="page-container">
      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <div class="page-header">
        <div class="header-content">
          <div class="header-icon">
            <i class="pi-users"></i>
          </div>
          <div class="header-text">
            <h1>العملاء</h1>
            <p>إدارة العملاء في النظام</p>
          </div>
        </div>
        <button pButton label="إضافة العميل" icon="pi pi-plus" class="add-btn" (click)="openNew()"></button>
      </div>

      <p-toolbar styleClass="toolbar">
        <ng-template pTemplate="left">
          <span class="p-input-icon-left search-box">
            <i class="pi pi-search"></i>
            <input pInputText type="text" [(ngModel)]="searchText" (input)="onSearch()" placeholder="بحث..." />
          </span>
        </ng-template>
        <ng-template pTemplate="right">
          <button pButton label="تحديث" icon="pi pi-refresh" class="p-button-outlined" (click)="loadData()"></button>
        </ng-template>
      </p-toolbar>

      <div class="table-container">
        <p-table [value]="filteredItems" [loading]="loading" [paginator]="true" [rows]="10" 
                 [rowsPerPageOptions]="[10,25,50]" [showCurrentPageReport]="true"
                 currentPageReportTemplate="عرض {first} إلى {last} من {totalRecords} العميل"
                 styleClass="custom-table">
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="id">الرقم <p-sortIcon field="id"></p-sortIcon></th>
              <th pSortableColumn="name">الاسم <p-sortIcon field="name"></p-sortIcon></th>
              <th>الوصف</th>
              <th>الإجراءات</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-item>
            <tr>
              <td>{{ item.id }}</td>
              <td>
                <div class="item-cell">
                  <div class="item-avatar">{{ item.name.charAt(0).toUpperCase() }}</div>
                  <span class="item-name">{{ item.name }}</span>
                </div>
              </td>
              <td>{{ item.description || '-' }}</td>
              <td>
                <div class="action-buttons">
                  <button pButton icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-info" 
                          pTooltip="تعديل" (click)="editItem(item)"></button>
                  <button pButton icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger" 
                          pTooltip="حذف" (click)="deleteItem(item)"></button>
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="4" class="empty-message">
                <div class="empty-state">
                  <i class="pi-users"></i>
                  <h3>لا توجد بيانات</h3>
                  <p>لم يتم العثور على العملاء</p>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <p-dialog [(visible)]="itemDialog" [header]="dialogTitle" [modal]="true" 
                [style]="{width: '500px'}" styleClass="custom-dialog">
        <div class="dialog-content">
          <div class="form-group">
            <label for="name">الاسم <span class="required">*</span></label>
            <input pInputText id="name" [(ngModel)]="item.name" required class="w-full" placeholder="أدخل الاسم" />
          </div>
          <div class="form-group">
            <label for="description">الوصف</label>
            <textarea pInputText id="description" [(ngModel)]="item.description" rows="3" class="w-full" 
                      placeholder="أدخل الوصف"></textarea>
          </div>
        </div>
        <ng-template pTemplate="footer">
          <button pButton label="إلغاء" icon="pi pi-times" class="p-button-text" (click)="itemDialog = false"></button>
          <button pButton label="حفظ" icon="pi pi-check" (click)="saveItem()" [loading]="saving"></button>
        </ng-template>
      </p-dialog>
    </div>
  `,
  styles: [`
    .page-container { padding: 0; }
    .page-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 2rem; background: white; padding: 2rem;
      border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .header-content { display: flex; align-items: center; gap: 1.5rem; }
    .header-icon {
      width: 64px; height: 64px; border-radius: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex; align-items: center; justify-content: center;
      color: white; font-size: 2rem;
    }
    .header-text h1 { margin: 0 0 0.5rem 0; font-size: 1.75rem; color: #2c3e50; }
    .header-text p { margin: 0; color: #7f8c8d; }
    .add-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none; padding: 0.75rem 1.5rem; font-size: 1rem;
    }
    :host ::ng-deep .toolbar {
      background: white; border: none; border-radius: 12px;
      padding: 1rem; margin-bottom: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .search-box { width: 300px; }
    .search-box input { width: 100%; padding-left: 2.5rem; }
    .table-container {
      background: white; border-radius: 16px; padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    :host ::ng-deep .custom-table .p-datatable-thead > tr > th {
      background: #f8f9fa; color: #2c3e50; font-weight: 600; padding: 1rem; border: none;
    }
    :host ::ng-deep .custom-table .p-datatable-tbody > tr:hover { background: #f8f9fa; }
    :host ::ng-deep .custom-table .p-datatable-tbody > tr > td {
      padding: 1rem; border-bottom: 1px solid #e9ecef;
    }
    .item-cell { display: flex; align-items: center; gap: 0.75rem; }
    .item-avatar {
      width: 40px; height: 40px; border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white; display: flex; align-items: center; justify-content: center;
      font-weight: 600; font-size: 1.125rem;
    }
    .item-name { font-weight: 500; color: #2c3e50; }
    .action-buttons { display: flex; gap: 0.5rem; }
    .empty-state { text-align: center; padding: 3rem; }
    .empty-state i { font-size: 4rem; color: #dee2e6; margin-bottom: 1rem; }
    .empty-state h3 { margin: 0 0 0.5rem 0; color: #6c757d; }
    .empty-state p { margin: 0; color: #adb5bd; }
    :host ::ng-deep .custom-dialog .p-dialog-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white; border-radius: 12px 12px 0 0;
    }
    :host ::ng-deep .custom-dialog .p-dialog-content { padding: 2rem; }
    .dialog-content { display: flex; flex-direction: column; gap: 1.5rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .form-group label { font-weight: 600; color: #2c3e50; }
    .required { color: #e74c3c; }
    .w-full { width: 100%; }
  `]
})
export class CustomersComponent implements OnInit {
  items: any[] = [];
  filteredItems: any[] = [];
  item: any = {};
  itemDialog = false;
  loading = false;
  saving = false;
  searchText = '';
  dialogTitle = '';

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() { this.loadData(); }

  loadData() {
    this.loading = true;
    // Simulated data
    setTimeout(() => {
      this.items = [];
      this.filteredItems = [];
      this.loading = false;
    }, 500);
  }

  onSearch() {
    if (!this.searchText) {
      this.filteredItems = this.items;
      return;
    }
    const search = this.searchText.toLowerCase();
    this.filteredItems = this.items.filter(item =>
      item.name.toLowerCase().includes(search)
    );
  }

  openNew() {
    this.item = {};
    this.dialogTitle = 'إضافة العميل جديد';
    this.itemDialog = true;
  }

  editItem(item: any) {
    this.item = { ...item };
    this.dialogTitle = 'تعديل العميل';
    this.itemDialog = true;
  }

  deleteItem(item: any) {
    this.confirmationService.confirm({
      message: `هل أنت متأكد من حذف ${item.name}؟`,
      header: 'تأكيد الحذف',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'نعم',
      rejectLabel: 'لا',
      accept: () => {
        this.items = this.items.filter(i => i.id !== item.id);
        this.filteredItems = this.filteredItems.filter(i => i.id !== item.id);
        this.messageService.add({ severity: 'success', summary: 'نجح', detail: 'تم الحذف بنجاح' });
      }
    });
  }

  saveItem() {
    if (!this.item.name) {
      this.messageService.add({ severity: 'warn', summary: 'تنبيه', detail: 'الرجاء ملء الحقول المطلوبة' });
      return;
    }
    this.saving = true;
    setTimeout(() => {
      if (this.item.id) {
        const index = this.items.findIndex(i => i.id === this.item.id);
        this.items[index] = this.item;
      } else {
        this.item.id = this.items.length + 1;
        this.items.push(this.item);
      }
      this.filteredItems = [...this.items];
      this.saving = false;
      this.itemDialog = false;
      this.messageService.add({ severity: 'success', summary: 'نجح', detail: 'تم الحفظ بنجاح' });
    }, 500);
  }

}
