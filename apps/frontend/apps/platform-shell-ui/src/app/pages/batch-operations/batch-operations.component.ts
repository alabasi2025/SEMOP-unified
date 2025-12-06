import { Component, OnInit } from '@angular/core';
import { BatchOperationsService, BatchOperationDto, BatchOperationResponseDto } from './batch-operations.service';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-batch-operations',
  templateUrl: './batch-operations.component.html',
  styleUrls: ['./batch-operations.component.css']
})
export class BatchOperationsComponent implements OnInit {
  availableItems: any[] = [];
  selectedItems: any[] = [];
  operationTypes: any[] = [
    { label: 'تحديث الحالة', value: 'updateStatus' },
    { label: 'تحديث الموقع', value: 'updateLocation' },
    { label: 'حذف المنتجات', value: 'delete' }
  ];
  selectedOperationType: 'updateStatus' | 'delete' | 'updateLocation' | null = null;
  operationValue: string = '';
  showValueInput: boolean = false;
  valueInputLabel: string = '';
  valueInputPlaceholder: string = '';
  isProcessing: boolean = false;
  messages: Message[] = [];
  batchResult: BatchOperationResponseDto | null = null;

  constructor(private batchService: BatchOperationsService) { }

  ngOnInit(): void {
    this.loadAvailableItems();
  }

  loadAvailableItems(): void {
    this.batchService.getAvailableItems().subscribe(items => {
      this.availableItems = items;
    });
  }

  onOperationTypeChange(event: any): void {
    this.selectedOperationType = event.value;
    this.operationValue = '';
    this.batchResult = null;
    this.messages = [];

    switch (this.selectedOperationType) {
      case 'updateStatus':
        this.showValueInput = true;
        this.valueInputLabel = 'الحالة الجديدة (مثال: متاح، غير متاح)';
        this.valueInputPlaceholder = 'أدخل الحالة الجديدة';
        break;
      case 'updateLocation':
        this.showValueInput = true;
        this.valueInputLabel = 'الموقع الجديد (مثال: المخزن د)';
        this.valueInputPlaceholder = 'أدخل الموقع الجديد';
        break;
      case 'delete':
        this.showValueInput = false;
        break;
      default:
        this.showValueInput = false;
        break;
    }
  }

  executeBatchOperation(): void {
    if (!this.selectedItems.length || !this.selectedOperationType || (this.showValueInput && !this.operationValue)) {
      this.messages = [{ severity: 'error', summary: 'خطأ', detail: 'الرجاء اختيار المنتجات وتحديد نوع العملية والقيمة المطلوبة.' }];
      return;
    }

    this.isProcessing = true;
    this.messages = [];
    this.batchResult = null;

    const itemIds = this.selectedItems.map(item => item.id);

    const operationDto: BatchOperationDto = {
      itemIds: itemIds,
      operationType: this.selectedOperationType,
      value: this.operationValue || undefined
    };

    this.batchService.processBatchOperation(operationDto).subscribe({
      next: (response) => {
        this.batchResult = response;
        this.isProcessing = false;
        if (response.success) {
          this.messages = [{ severity: 'success', summary: 'نجاح', detail: response.message }];
          this.selectedItems = []; // مسح التحديد بعد النجاح
          this.loadAvailableItems(); // إعادة تحميل القائمة المحدثة
        } else {
          this.messages = [{ severity: 'warn', summary: 'تحذير', detail: response.message }];
        }
      },
      error: (err) => {
        this.isProcessing = false;
        const errorMessage = err.error?.message || 'حدث خطأ غير متوقع أثناء الاتصال بالخادم.';
        this.messages = [{ severity: 'error', summary: 'فشل العملية', detail: errorMessage }];
      }
    });
  }
}
