import { Component, OnInit } from '@angular/core';
import { BarcodeScannerService, ItemDetails } from './barcode-scanner.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.css'],
  providers: [MessageService],
})
export class BarcodeScannerComponent implements OnInit {
  barcode: string = '';
  itemDetails: ItemDetails | null = null;
  loading: boolean = false;

  constructor(
    private barcodeScannerService: BarcodeScannerService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    // يمكن إضافة منطق تهيئة هنا
  }

  /**
   * معالجة عملية مسح الباركود.
   */
  scanBarcode(): void {
    if (!this.barcode) {
      this.messageService.add({
        severity: 'warn',
        summary: 'تنبيه',
        detail: 'الرجاء إدخال الباركود للمسح.',
      });
      return;
    }

    this.loading = true;
    this.itemDetails = null; // مسح التفاصيل السابقة

    this.barcodeScannerService.scanBarcode(this.barcode).subscribe({
      next: (data) => {
        this.itemDetails = data;
        this.messageService.add({
          severity: 'success',
          summary: 'نجاح',
          detail: `تم العثور على المنتج: ${data.name}`,
        });
        this.loading = false;
        this.barcode = ''; // مسح حقل الباركود بعد النجاح
      },
      error: (error) => {
        console.error('خطأ في مسح الباركود:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: error.error.message || 'فشل في البحث عن المنتج.',
        });
        this.loading = false;
      },
    });
  }
}
