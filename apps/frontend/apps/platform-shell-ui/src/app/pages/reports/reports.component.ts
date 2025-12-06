import { Component, OnInit } from '@angular/core';
import { ReportsService, GetReportDto } from './reports.service';
import { MessageService } from 'primeng/api'; // لاستخدام PrimeNG Toast

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
  providers: [MessageService] // إضافة MessageService
})
export class ReportsComponent implements OnInit {
  selectedReport: string = 'inventory-summary';
  reportData: any[] = [];
  loading: boolean = false;
  filter: GetReportDto = {};

  constructor(
    private reportsService: ReportsService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // تحميل التقرير الافتراضي عند بدء التشغيل
    this.generateReport();
  }

  generateReport(): void {
    this.loading = true;
    this.reportData = []; // مسح البيانات القديمة

    let reportObservable: Observable<any>;

    switch (this.selectedReport) {
      case 'inventory-summary':
        reportObservable = this.reportsService.getInventorySummary(this.filter);
        break;
      case 'sales-by-item':
        reportObservable = this.reportsService.getSalesByItem(this.filter);
        break;
      case 'stock-movement':
        reportObservable = this.reportsService.getStockMovement(this.filter);
        break;
      default:
        this.loading = false;
        return;
    }

    reportObservable.subscribe({
      next: (response) => {
        this.reportData = response.data;
        this.messageService.add({
          severity: 'success',
          summary: 'نجاح',
          detail: response.message,
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل في جلب التقرير: ' + err.error.message,
        });
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  // دالة مساعدة للحصول على رؤوس الأعمدة للجدول
  getReportColumns(): any[] {
    if (this.reportData.length === 0) {
      return [];
    }
    const keys = Object.keys(this.reportData[0]);
    // تحويل أسماء المفاتيح الإنجليزية إلى أسماء عربية للعرض
    const columnMap: { [key: string]: string } = {
      itemName: 'اسم الصنف',
      totalQuantity: 'إجمالي الكمية',
      totalValue: 'إجمالي القيمة',
      lastUpdate: 'آخر تحديث',
      salesQuantity: 'كمية المبيعات',
      salesRevenue: 'إيرادات المبيعات',
      period: 'الفترة',
      date: 'التاريخ',
      movementType: 'نوع الحركة',
      quantity: 'الكمية',
      source: 'المصدر',
      destination: 'الوجهة',
    };

    return keys.map((key) => ({
      field: key,
      header: columnMap[key] || key,
    }));
  }
}
