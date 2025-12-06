import { Component, OnInit } from '@angular/core';
import { MultiWarehouseTransferService } from './multi-warehouse-transfer.service';
import { MultiWarehouseTransferResponseDto, CreateMultiWarehouseTransferDto, Warehouse, Item, TransferItem } from './multi-warehouse-transfer.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-multi-warehouse-transfer',
  templateUrl: './multi-warehouse-transfer.component.html',
  styleUrls: ['./multi-warehouse-transfer.component.css'],
  providers: [MessageService]
})
export class MultiWarehouseTransferComponent implements OnInit {
  transfers: MultiWarehouseTransferResponseDto[] = [];
  warehouses: Warehouse[] = [
    { id: 1, name: 'المخزن الرئيسي' },
    { id: 2, name: 'مخزن الفرع أ' },
    { id: 3, name: 'مخزن الفرع ب' },
  ];
  items: Item[] = [
    { id: 101, name: 'صنف 1', unit: 'حبة' },
    { id: 102, name: 'صنف 2', unit: 'كرتون' },
    { id: 103, name: 'صنف 3', unit: 'متر' },
  ];

  displayDialog: boolean = false;
  newTransfer: CreateMultiWarehouseTransferDto = this.getEmptyTransfer();
  selectedTransfer: MultiWarehouseTransferResponseDto | null = null;
  isEditMode: boolean = false;

  constructor(
    private transferService: MultiWarehouseTransferService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadTransfers();
  }

  loadTransfers(): void {
    this.transferService.getAllTransfers().subscribe({
      next: (data) => {
        this.transfers = data;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل في تحميل طلبات النقل' });
        console.error(err);
      }
    });
  }

  showNewTransferDialog(): void {
    this.newTransfer = this.getEmptyTransfer();
    this.isEditMode = false;
    this.displayDialog = true;
  }

  showEditTransferDialog(transfer: MultiWarehouseTransferResponseDto): void {
    this.selectedTransfer = transfer;
    this.newTransfer = {
      sourceWarehouseId: transfer.sourceWarehouseId,
      destinationWarehouseId: transfer.destinationWarehouseId,
      transferDate: new Date(transfer.transferDate).toISOString().substring(0, 10),
      notes: transfer.notes,
      items: transfer.items.map(item => ({ ...item }))
    };
    this.isEditMode = true;
    this.displayDialog = true;
  }

  saveTransfer(): void {
    if (this.newTransfer.sourceWarehouseId === this.newTransfer.destinationWarehouseId) {
      this.messageService.add({ severity: 'warn', summary: 'تحذير', detail: 'لا يمكن النقل من وإلى نفس المخزن' });
      return;
    }

    if (this.newTransfer.items.length === 0 || this.newTransfer.items.some(item => !item.itemId || item.quantity <= 0)) {
      this.messageService.add({ severity: 'warn', summary: 'تحذير', detail: 'يجب إضافة أصناف بكميات صحيحة' });
      return;
    }

    if (this.isEditMode && this.selectedTransfer) {
      this.transferService.updateTransfer(this.selectedTransfer.id, this.newTransfer).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم تحديث طلب النقل بنجاح' });
          this.loadTransfers();
          this.displayDialog = false;
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'خطأ', detail: err.error?.message || 'فشل في تحديث طلب النقل' });
        }
      });
    } else {
      this.transferService.createTransfer(this.newTransfer).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم إنشاء طلب النقل بنجاح' });
          this.loadTransfers();
          this.displayDialog = false;
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'خطأ', detail: err.error?.message || 'فشل في إنشاء طلب النقل' });
        }
      });
    }
  }

  deleteTransfer(id: number): void {
    if (confirm('هل أنت متأكد من حذف طلب النقل هذا؟')) {
      this.transferService.deleteTransfer(id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم حذف طلب النقل بنجاح' });
          this.loadTransfers();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'خطأ', detail: err.error?.message || 'فشل في حذف طلب النقل' });
        }
      });
    }
  }

  completeTransfer(id: number): void {
    if (confirm('هل أنت متأكد من اعتماد طلب النقل هذا؟ سيؤثر على المخزون.')) {
      this.transferService.completeTransfer(id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم اعتماد طلب النقل بنجاح' });
          this.loadTransfers();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'خطأ', detail: err.error?.message || 'فشل في اعتماد طلب النقل' });
        }
      });
    }
  }

  cancelTransfer(id: number): void {
    if (confirm('هل أنت متأكد من إلغاء طلب النقل هذا؟')) {
      this.transferService.cancelTransfer(id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم إلغاء طلب النقل بنجاح' });
          this.loadTransfers();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'خطأ', detail: err.error?.message || 'فشل في إلغاء طلب النقل' });
        }
      });
    }
  }

  addItem(): void {
    this.newTransfer.items.push({ itemId: 0, quantity: 1 });
  }

  removeItem(index: number): void {
    this.newTransfer.items.splice(index, 1);
  }

  getWarehouseName(id: number): string {
    return this.warehouses.find(w => w.id === id)?.name || 'غير معروف';
  }

  getItemName(id: number): string {
    return this.items.find(i => i.id === id)?.name || 'غير معروف';
  }

  getItemUnit(id: number): string {
    return this.items.find(i => i.id === id)?.unit || '';
  }

  getEmptyTransfer(): CreateMultiWarehouseTransferDto {
    return {
      sourceWarehouseId: 0,
      destinationWarehouseId: 0,
      transferDate: new Date().toISOString().substring(0, 10),
      notes: '',
      items: [{ itemId: 0, quantity: 1 }]
    };
  }
}
