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
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ItemsService, Item } from '../../services/items.service';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, ButtonModule, DialogModule,
    InputTextModule, InputNumberModule, CheckboxModule,
    ToastModule, ConfirmDialogModule, TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {
  items: Item[] = [];
  item: Item = this.getEmptyItem();
  itemDialog = false;
  dialogTitle = '';
  isEditMode = false;

  constructor(
    private itemsService: ItemsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.itemsService.getAll().subscribe({
      next: (data) => this.items = data,
      error: (err) => this.showError('فشل تحميل الأصناف')
    });
  }

  openNew() {
    this.item = this.getEmptyItem();
    this.dialogTitle = 'صنف جديد';
    this.isEditMode = false;
    this.itemDialog = true;
  }

  editItem(item: Item) {
    this.item = { ...item };
    this.dialogTitle = 'تعديل صنف';
    this.isEditMode = true;
    this.itemDialog = true;
  }

  viewItem(item: Item) {
    this.messageService.add({ severity: 'info', summary: 'عرض', detail: `عرض تفاصيل ${item.nameAr}` });
  }

  deleteItem(item: Item) {
    this.confirmationService.confirm({
      message: `هل تريد حذف الصنف ${item.nameAr}؟`,
      header: 'تأكيد الحذف',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'نعم',
      rejectLabel: 'لا',
      accept: () => {
        this.itemsService.delete(item.id!).subscribe({
          next: () => {
            this.loadItems();
            this.showSuccess('تم حذف الصنف بنجاح');
          },
          error: () => this.showError('فشل حذف الصنف')
        });
      }
    });
  }

  saveItem() {
    if (!this.isValid()) return;

    if (this.isEditMode) {
      this.itemsService.update(this.item.id!, this.item).subscribe({
        next: () => {
          this.loadItems();
          this.hideDialog();
          this.showSuccess('تم تحديث الصنف بنجاح');
        },
        error: () => this.showError('فشل تحديث الصنف')
      });
    } else {
      this.itemsService.create(this.item).subscribe({
        next: () => {
          this.loadItems();
          this.hideDialog();
          this.showSuccess('تم إضافة الصنف بنجاح');
        },
        error: () => this.showError('فشل إضافة الصنف')
      });
    }
  }

  showLowStock() {
    this.itemsService.getLowStock().subscribe({
      next: (data) => {
        this.items = data;
        this.showInfo(`عدد الأصناف منخفضة المخزون: ${data.length}`);
      },
      error: () => this.showError('فشل تحميل الأصناف منخفضة المخزون')
    });
  }

  hideDialog() {
    this.itemDialog = false;
    this.item = this.getEmptyItem();
  }

  isValid(): boolean {
    return !!(this.item.code && this.item.nameAr);
  }

  getEmptyItem(): Item {
    return {
      code: '',
      nameAr: '',
      isActive: true,
      costPrice: 0,
      sellingPrice: 0,
      minStock: 0
    };
  }

  showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'نجح', detail: message });
  }

  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'خطأ', detail: message });
  }

  showInfo(message: string) {
    this.messageService.add({ severity: 'info', summary: 'معلومة', detail: message });
  }
}
