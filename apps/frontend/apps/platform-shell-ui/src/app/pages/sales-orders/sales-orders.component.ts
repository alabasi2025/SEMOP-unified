import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SalesOrdersService } from '../../services/sales-orders.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sales-orders',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    TableModule, ButtonModule, DialogModule, InputTextModule, InputNumberModule,
    DatePickerModule, SelectModule, BadgeModule, ToastModule, ConfirmDialogModule,
    ToolbarModule, CardModule, TooltipModule, TranslateModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './sales-orders.component.html',
  styleUrls: ['./sales-orders.component.css']
})
export class SalesOrdersComponent implements OnInit {
  // البيانات الأساسية
  salesOrders: any[] = [];
  filteredOrders: any[] = [];
  selectedOrder: any = null;
  
  // Dialog states
  orderDialog = false;
  detailsDialog = false;
  dialogTitle = '';
  
  // Loading states
  loading = false;
  saving = false;
  
  // Filters
  searchText = '';
  selectedCustomer: any = null;
  selectedStatus: any = null;
  startDate: Date | null = null;
  endDate: Date | null = null;
  
  // Dropdown options
  customers: any[] = [];
  items: any[] = [];
  statuses = [
    { label: 'مسودة', value: 'DRAFT' },
    { label: 'قيد الانتظار', value: 'PENDING' },
    { label: 'معتمد', value: 'APPROVED' },
    { label: 'مفوتر جزئياً', value: 'PARTIALLY_INVOICED' },
    { label: 'مفوتر', value: 'INVOICED' }
  ];
  
  // Statistics
  statistics = {
    totalOrders: 0,
    totalSalesAmount: 0,
    approvedOrders: 0,
    invoicedOrders: 0
  };
  
  // Current order being edited
  currentOrder: any = {
    orderNumber: '',
    orderDate: new Date(),
    customerId: '',
    expectedDeliveryDate: null,
    paymentTerms: '',
    notes: '',
    lines: []
  };

  constructor(
    private salesOrdersService: SalesOrdersService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadData();
    this.loadCustomers();
    this.loadItems();
    this.loadStatistics();
  }

  loadData() {
    this.loading = true;
    this.salesOrdersService.getAll().subscribe({
      next: (data: any) => {
        this.salesOrders = data;
        this.filteredOrders = data;
        this.loading = false;
      },
      error: (error: any) => {
        this.messageService.add({ 
          severity: 'danger', 
          summary: 'خطأ', 
          detail: 'فشل تحميل أوامر البيع' 
        });
        this.loading = false;
      }
    });
  }

  loadCustomers() {
    // TODO: استدعاء خدمة العملاء
    this.customers = [
      { id: '1', name: 'عميل 1' },
      { id: '2', name: 'عميل 2' }
    ];
  }

  loadItems() {
    // TODO: استدعاء خدمة الأصناف
    this.items = [
      { id: '1', name: 'صنف 1', price: 100, stock: 50 },
      { id: '2', name: 'صنف 2', price: 200, stock: 30 }
    ];
  }

  loadStatistics() {
    this.salesOrdersService.getStatistics().subscribe({
      next: (data: any) => {
        this.statistics = data;
      },
      error: (error: any) => {
        console.error('Failed to load statistics', error);
      }
    });
  }

  // Filter methods
  applyFilters() {
    this.filteredOrders = this.salesOrders.filter(order => {
      let matches = true;
      
      if (this.searchText) {
        matches = matches && order.orderNumber.toLowerCase().includes(this.searchText.toLowerCase());
      }
      
      if (this.selectedCustomer) {
        matches = matches && order.customerId === this.selectedCustomer.id;
      }
      
      if (this.selectedStatus) {
        matches = matches && order.status === this.selectedStatus.value;
      }
      
      if (this.startDate) {
        matches = matches && new Date(order.orderDate) >= this.startDate;
      }
      
      if (this.endDate) {
        matches = matches && new Date(order.orderDate) <= this.endDate;
      }
      
      return matches;
    });
  }

  clearFilters() {
    this.searchText = '';
    this.selectedCustomer = null;
    this.selectedStatus = null;
    this.startDate = null;
    this.endDate = null;
    this.filteredOrders = this.salesOrders;
  }

  // CRUD Operations
  openNew() {
    this.currentOrder = {
      orderNumber: this.generateOrderNumber(),
      orderDate: new Date(),
      customerId: '',
      expectedDeliveryDate: null,
      paymentTerms: '',
      notes: '',
      lines: []
    };
    this.dialogTitle = 'إضافة أمر بيع جديد';
    this.orderDialog = true;
  }

  editOrder(order: any) {
    this.currentOrder = { ...order, lines: [...order.lines] };
    this.dialogTitle = 'تعديل أمر البيع';
    this.orderDialog = true;
  }

  viewDetails(order: any) {
    this.selectedOrder = order;
    this.detailsDialog = true;
  }

  deleteOrder(order: any) {
    this.confirmationService.confirm({
      message: `هل أنت متأكد من حذف أمر البيع ${order.orderNumber}؟`,
      header: 'تأكيد الحذف',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'نعم',
      rejectLabel: 'لا',
      accept: () => {
        this.salesOrdersService.delete(order.id).subscribe({
          next: () => {
            this.messageService.add({ 
              severity: 'success', 
              summary: 'نجح', 
              detail: 'تم حذف أمر البيع بنجاح' 
            });
            this.loadData();
          },
          error: (error: any) => {
            this.messageService.add({ 
              severity: 'danger', 
              summary: 'خطأ', 
              detail: 'فشل حذف أمر البيع' 
            });
          }
        });
      }
    });
  }

  saveOrder() {
    if (!this.validateOrder()) {
      return;
    }

    this.saving = true;
    const operation = this.currentOrder.id 
      ? this.salesOrdersService.update(this.currentOrder.id, this.currentOrder)
      : this.salesOrdersService.create(this.currentOrder);

    operation.subscribe({
      next: () => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'نجح', 
          detail: 'تم حفظ أمر البيع بنجاح' 
        });
        this.saving = false;
        this.orderDialog = false;
        this.loadData();
        this.loadStatistics();
      },
      error: (error: any) => {
        this.messageService.add({ 
          severity: 'danger', 
          summary: 'خطأ', 
          detail: error.error?.message || 'فشل حفظ أمر البيع' 
        });
        this.saving = false;
      }
    });
  }

  validateOrder(): boolean {
    if (!this.currentOrder.customerId) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'تنبيه', 
        detail: 'الرجاء اختيار العميل' 
      });
      return false;
    }

    if (!this.currentOrder.lines || this.currentOrder.lines.length === 0) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'تنبيه', 
        detail: 'الرجاء إضافة سطر واحد على الأقل' 
        });
      return false;
    }

    return true;
  }

  // Status Actions
  approveOrder(order: any) {
    this.confirmationService.confirm({
      message: `هل أنت متأكد من اعتماد أمر البيع ${order.orderNumber}؟`,
      header: 'تأكيد الاعتماد',
      icon: 'pi pi-check-circle',
      acceptLabel: 'نعم',
      rejectLabel: 'لا',
      accept: () => {
        this.salesOrdersService.approve(order.id).subscribe({
          next: () => {
            this.messageService.add({ 
              severity: 'success', 
              summary: 'نجح', 
              detail: 'تم اعتماد أمر البيع بنجاح' 
            });
            this.loadData();
          },
          error: (error: any) => {
            this.messageService.add({ 
              severity: 'danger', 
              summary: 'خطأ', 
              detail: 'فشل اعتماد أمر البيع' 
            });
          }
        });
      }
    });
  }

  cancelOrder(order: any) {
    this.confirmationService.confirm({
      message: `هل أنت متأكد من إلغاء أمر البيع ${order.orderNumber}؟`,
      header: 'تأكيد الإلغاء',
      icon: 'pi pi-times-circle',
      acceptLabel: 'نعم',
      rejectLabel: 'لا',
      accept: () => {
        this.salesOrdersService.cancel(order.id).subscribe({
          next: () => {
            this.messageService.add({ 
              severity: 'success', 
              summary: 'نجح', 
              detail: 'تم إلغاء أمر البيع بنجاح' 
            });
            this.loadData();
          },
          error: (error: any) => {
            this.messageService.add({ 
              severity: 'danger', 
              summary: 'خطأ', 
              detail: 'فشل إلغاء أمر البيع' 
            });
          }
        });
      }
    });
  }

  // Line Management
  addLine() {
    this.currentOrder.lines.push({
      itemId: '',
      quantity: 1,
      unitPrice: 0,
      taxRate: 15,
      discountRate: 0,
      lineTotal: 0
    });
  }

  removeLine(index: number) {
    this.currentOrder.lines.splice(index, 1);
    this.calculateTotal();
  }

  onItemChange(line: any) {
    const item = this.items.find(i => i.id === line.itemId);
    if (item) {
      line.unitPrice = item.price;
      line.availableStock = item.stock;
      this.calculateLineTotal(line);
    }
  }

  calculateLineTotal(line: any) {
    const subtotal = line.quantity * line.unitPrice;
    const discount = subtotal * (line.discountRate / 100);
    const taxable = subtotal - discount;
    const tax = taxable * (line.taxRate / 100);
    line.lineTotal = taxable + tax;
    this.calculateTotal();
  }

  calculateTotal() {
    this.currentOrder.totalAmount = this.currentOrder.lines.reduce(
      (sum: number, line: any) => sum + (line.lineTotal || 0), 
      0
    );
  }

  // Utility methods
  generateOrderNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000000);
    return `SO-${year}-${random.toString().padStart(6, '0')}`;
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'secondary' | 'warn' | 'danger' | 'contrast' {
    const severityMap: any = {
      'DRAFT': 'secondary',
      'PENDING': 'warn',
      'APPROVED': 'info',
      'PARTIALLY_INVOICED': 'warn',
      'INVOICED': 'success'
    };
    return severityMap[status] || 'secondary';
  }

  getStatusLabel(status: string): string {
    const labelMap: any = {
      'DRAFT': 'مسودة',
      'PENDING': 'قيد الانتظار',
      'APPROVED': 'معتمد',
      'PARTIALLY_INVOICED': 'مفوتر جزئياً',
      'INVOICED': 'مفوتر'
    };
    return labelMap[status] || status;
  }

  printOrder(order: any) {
    // TODO: تنفيذ وظيفة الطباعة
    this.messageService.add({ 
      severity: 'info', 
      summary: 'معلومات', 
      detail: 'وظيفة الطباعة قيد التطوير' 
    });
  }
}
