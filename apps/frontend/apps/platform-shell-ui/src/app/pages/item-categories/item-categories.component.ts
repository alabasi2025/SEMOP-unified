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
import { CheckboxModule } from 'primeng/checkbox';
import { ItemCategoriesService, ItemCategory } from '../../services/item-categories.service';

@Component({
  selector: 'app-item-categories',
  standalone: true,
  imports: [
    CommonModule, TableModule, ButtonModule, DialogModule, 
    InputTextModule, FormsModule, ToastModule, ConfirmDialogModule,
    ToolbarModule, TagModule, TooltipModule, CheckboxModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="page-container">
      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <div class="page-header">
        <div class="header-content">
          <div class="header-icon">
            <i class="pi pi-sitemap"></i>
          </div>
          <div class="header-text">
            <h1>فئات الأصناف</h1>
            <p>إدارة فئات الأصناف في المخزون</p>
          </div>
        </div>
        <button pButton label="إضافة فئة" icon="pi pi-plus" class="add-btn" (click)="openNew()"></button>
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
                 currentPageReportTemplate="عرض {first} إلى {last} من {totalRecords} فئة"
                 styleClass="custom-table">
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="code">الكود</th>
              <th pSortableColumn="nameAr">الاسم بالعربية</th>
              <th>الاسم بالإنجليزية</th>
              <th>الوصف</th>
              <th pSortableColumn="isActive">الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-item>
            <tr>
              <td>{{ item.code }}</td>
              <td>
                <div class="item-cell">
                  <div class="item-avatar">{{ item.nameAr.charAt(0).toUpperCase() }}</div>
                  <span class="item-name">{{ item.nameAr }}</span>
                </div>
              </td>
              <td>{{ item.nameEn || '-' }}</td>
              <td>{{ item.description || '-' }}</td>
              <td>
                <p-tag [value]="item.isActive ? 'نشط' : 'غير نشط'" 
                       [severity]="item.isActive ? 'success' : 'danger'"></p-tag>
              </td>
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
              <td colspan="6" class="empty-message">
                <div class="empty-state">
                  <i class="pi pi-sitemap"></i>
                  <h3>لا توجد بيانات</h3>
                  <p>لم يتم العثور على فئات</p>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <p-dialog [(visible)]="itemDialog" [header]="dialogTitle" [modal]="true" 
                [style]="{width: '600px'}" styleClass="custom-dialog">
        <div class="dialog-content">
          <div class="form-group">
            <label for="nameAr">الاسم بالعربية <span class="required">*</span></label>
            <input pInputText id="nameAr" [(ngModel)]="item.nameAr" required class="w-full" placeholder="أدخل الاسم بالعربية" />
          </div>
          <div class="form-group">
            <label for="nameEn">الاسم بالإنجليزية</label>
            <input pInputText id="nameEn" [(ngModel)]="item.nameEn" class="w-full" placeholder="أدخل الاسم بالإنجليزية" />
          </div>
          <div class="form-group">
            <label for="description">الوصف</label>
            <textarea pInputText id="description" [(ngModel)]="item.description" rows="3" class="w-full" 
                      placeholder="أدخل الوصف"></textarea>
          </div>
          <div class="form-group">
            <p-checkbox [(ngModel)]="item.isActive" [binary]="true" inputId="isActive" label="نشط"></p-checkbox>
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
export class ItemCategoriesComponent implements OnInit {
  items: ItemCategory[] = [];
  filteredItems: ItemCategory[] = [];
  item: Partial<ItemCategory> = {};
  itemDialog = false;
  loading = false;
  saving = false;
  searchText = '';
  dialogTitle = '';

  constructor(
    private itemCategoriesService: ItemCategoriesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() { this.loadData(); }

  loadData() {
    this.loading = true;
    this.itemCategoriesService.getAll().subscribe({
      next: (data) => {
        this.items = data;
        this.filteredItems = data;
        this.loading = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل تحميل البيانات' });
        this.loading = false;
      }
    });
  }

  onSearch() {
    if (!this.searchText) {
      this.filteredItems = this.items;
      return;
    }
    const search = this.searchText.toLowerCase();
    this.filteredItems = this.items.filter(item =>
      item.nameAr.toLowerCase().includes(search) ||
      (item.nameEn && item.nameEn.toLowerCase().includes(search)) ||
      item.code.toLowerCase().includes(search)
    );
  }

  openNew() {
    this.item = { isActive: true };
    this.dialogTitle = 'إضافة فئة جديدة';
    this.itemDialog = true;
  }

  editItem(item: ItemCategory) {
    this.item = { ...item };
    this.dialogTitle = 'تعديل الفئة';
    this.itemDialog = true;
  }

  deleteItem(item: ItemCategory) {
    this.confirmationService.confirm({
      message: `هل أنت متأكد من حذف ${item.nameAr}؟`,
      header: 'تأكيد الحذف',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'نعم',
      rejectLabel: 'لا',
      accept: () => {
        this.itemCategoriesService.delete(item.id).subscribe({
          next: () => {
            this.loadData();
            this.messageService.add({ severity: 'success', summary: 'نجح', detail: 'تم الحذف بنجاح' });
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل الحذف' });
          }
        });
      }
    });
  }

  saveItem() {
    if (!this.item.nameAr) {
      this.messageService.add({ severity: 'warn', summary: 'تنبيه', detail: 'الرجاء ملء الحقول المطلوبة' });
      return;
    }
    
    this.saving = true;
    
    if (this.item.id) {
      this.itemCategoriesService.update(this.item.id, this.item).subscribe({
        next: () => {
          this.loadData();
          this.saving = false;
          this.itemDialog = false;
          this.messageService.add({ severity: 'success', summary: 'نجح', detail: 'تم التحديث بنجاح' });
        },
        error: () => {
          this.saving = false;
          this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل التحديث' });
        }
      });
    } else {
      this.itemCategoriesService.create(this.item).subscribe({
        next: () => {
          this.loadData();
          this.saving = false;
          this.itemDialog = false;
          this.messageService.add({ severity: 'success', summary: 'نجح', detail: 'تم الإضافة بنجاح' });
        },
        error: () => {
          this.saving = false;
          this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل الإضافة' });
        }
      });
    }
  }
}
