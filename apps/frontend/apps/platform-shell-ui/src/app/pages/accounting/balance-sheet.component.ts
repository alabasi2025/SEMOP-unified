import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { catchError, finalize, Observable, of, throwError } from 'rxjs';

// واجهة لتمثيل بند واحد في الميزانية العمومية
interface BalanceSheetItem {
  name: string; // اسم البند (مثل النقد، الذمم المدينة)
  currentPeriod: number; // قيمة البند في الفترة الحالية
  previousPeriod: number; // قيمة البند في الفترة السابقة
}

// واجهة لتمثيل قسم رئيسي في الميزانية العمومية (الأصول، الخصوم، حقوق الملكية)
interface BalanceSheetSection {
  title: string; // عنوان القسم (مثل الأصول المتداولة)
  items: BalanceSheetItem[]; // قائمة البنود
  total: number; // إجمالي القسم
}

// واجهة لتمثيل هيكل بيانات الميزانية العمومية الكامل
interface BalanceSheetData {
  reportDate: string; // تاريخ إعداد التقرير
  currentPeriodLabel: string; // تسمية الفترة الحالية (مثل 2024)
  previousPeriodLabel: string; // تسمية الفترة السابقة (مثل 2023)
  assets: {
    current: BalanceSheetSection[]; // الأصول المتداولة وغير المتداولة
    total: number; // إجمالي الأصول
  };
  liabilities: {
    current: BalanceSheetSection[]; // الخصوم المتداولة وغير المتداولة
    total: number; // إجمالي الخصوم
  };
  equity: {
    current: BalanceSheetSection[]; // حقوق الملكية
    total: number; // إجمالي حقوق الملكية
  };
  totalLiabilitiesAndEquity: number; // إجمالي الخصوم وحقوق الملكية (يجب أن يساوي إجمالي الأصول)
}

@Component({
  selector: 'app-balance-sheet',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="balance-sheet-container">
      <h2 class="report-title">الميزانية العمومية المقارنة (قائمة المركز المالي)</h2>
      
      <!-- حالة التحميل -->
      <div *ngIf="loading" class="loading-state">
        <p>جاري تحميل بيانات الميزانية العمومية...</p>
        <div class="spinner"></div>
      </div>

      <!-- حالة الخطأ -->
      <div *ngIf="error" class="error-state">
        <p><strong>خطأ في التحميل:</strong> {{ errorMessage }}</p>
        <p>الرجاء المحاولة مرة أخرى أو الاتصال بالدعم الفني.</p>
      </div>

      <!-- عرض البيانات -->
      <div *ngIf="!loading && !error && balanceSheetData" class="balance-sheet-content">
        <div class="report-meta">
          <span>تاريخ التقرير: {{ balanceSheetData.reportDate }}</span>
        </div>

        <div class="section assets-section">
          <h3>الأصول</h3>
          <table class="data-table">
            <thead>
              <tr>
                <th>البند</th>
                <th class="amount-col">{{ balanceSheetData.currentPeriodLabel }}</th>
                <th class="amount-col">{{ balanceSheetData.previousPeriodLabel }}</th>
              </tr>
            </thead>
            <tbody>
              <!-- عرض أقسام الأصول (مثل الأصول المتداولة) -->
              <ng-container *ngFor="let section of balanceSheetData.assets.current">
                <tr class="section-header">
                  <td colspan="3">{{ section.title }}</td>
                </tr>
                <!-- عرض بنود القسم -->
                <tr *ngFor="let item of section.items">
                  <td class="item-name">{{ item.name }}</td>
                  <td class="amount-col">{{ item.currentPeriod | number:'1.2-2' }}</td>
                  <td class="amount-col">{{ item.previousPeriod | number:'1.2-2' }}</td>
                </tr>
                <tr class="section-total">
                  <td>إجمالي {{ section.title }}</td>
                  <td class="amount-col">{{ section.total | number:'1.2-2' }}</td>
                  <td class="amount-col">{{ section.total | number:'1.2-2' }}</td>
                </tr>
              </ng-container>
              <!-- إجمالي الأصول -->
              <tr class="grand-total assets-total">
                <td><strong>إجمالي الأصول</strong></td>
                <td class="amount-col"><strong>{{ balanceSheetData.assets.total | number:'1.2-2' }}</strong></td>
                <td class="amount-col"><strong>{{ balanceSheetData.assets.total | number:'1.2-2' }}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="section liabilities-equity-section">
          <h3>الخصوم وحقوق الملكية</h3>
          
          <!-- قسم الخصوم -->
          <div class="sub-section liabilities-section">
            <h4>الخصوم</h4>
            <table class="data-table">
              <tbody>
                <!-- عرض أقسام الخصوم -->
                <ng-container *ngFor="let section of balanceSheetData.liabilities.current">
                  <tr class="section-header">
                    <td colspan="3">{{ section.title }}</td>
                  </tr>
                  <!-- عرض بنود القسم -->
                  <tr *ngFor="let item of section.items">
                    <td class="item-name">{{ item.name }}</td>
                    <td class="amount-col">{{ item.currentPeriod | number:'1.2-2' }}</td>
                    <td class="amount-col">{{ item.previousPeriod | number:'1.2-2' }}</td>
                  </tr>
                  <tr class="section-total">
                    <td>إجمالي {{ section.title }}</td>
                    <td class="amount-col">{{ section.total | number:'1.2-2' }}</td>
                    <td class="amount-col">{{ section.total | number:'1.2-2' }}</td>
                  </tr>
                </ng-container>
                <!-- إجمالي الخصوم -->
                <tr class="grand-total liabilities-total">
                  <td><strong>إجمالي الخصوم</strong></td>
                  <td class="amount-col"><strong>{{ balanceSheetData.liabilities.total | number:'1.2-2' }}</strong></td>
                  <td class="amount-col"><strong>{{ balanceSheetData.liabilities.total | number:'1.2-2' }}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- قسم حقوق الملكية -->
          <div class="sub-section equity-section">
            <h4>حقوق الملكية</h4>
            <table class="data-table">
              <tbody>
                <!-- عرض أقسام حقوق الملكية -->
                <ng-container *ngFor="let section of balanceSheetData.equity.current">
                  <tr class="section-header">
                    <td colspan="3">{{ section.title }}</td>
                  </tr>
                  <!-- عرض بنود القسم -->
                  <tr *ngFor="let item of section.items">
                    <td class="item-name">{{ item.name }}</td>
                    <td class="amount-col">{{ item.currentPeriod | number:'1.2-2' }}</td>
                    <td class="amount-col">{{ item.previousPeriod | number:'1.2-2' }}</td>
                  </tr>
                  <tr class="section-total">
                    <td>إجمالي {{ section.title }}</td>
                    <td class="amount-col">{{ section.total | number:'1.2-2' }}</td>
                    <td class="amount-col">{{ section.total | number:'1.2-2' }}</td>
                  </tr>
                </ng-container>
                <!-- إجمالي حقوق الملكية -->
                <tr class="grand-total equity-total">
                  <td><strong>إجمالي حقوق الملكية</strong></td>
                  <td class="amount-col"><strong>{{ balanceSheetData.equity.total | number:'1.2-2' }}</strong></td>
                  <td class="amount-col"><strong>{{ balanceSheetData.equity.total | number:'1.2-2' }}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- إجمالي الخصوم وحقوق الملكية -->
          <div class="final-total">
            <table class="data-table">
              <tbody>
                <tr class="grand-total final-total-row">
                  <td><strong>إجمالي الخصوم وحقوق الملكية</strong></td>
                  <td class="amount-col"><strong>{{ balanceSheetData.totalLiabilitiesAndEquity | number:'1.2-2' }}</strong></td>
                  <td class="amount-col"><strong>{{ balanceSheetData.totalLiabilitiesAndEquity | number:'1.2-2' }}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .balance-sheet-container {
      padding: 20px;
      font-family: 'Arial', sans-serif;
      direction: rtl; /* لدعم اللغة العربية */
      text-align: right;
    }
    .report-title {
      text-align: center;
      color: #004d40;
      margin-bottom: 30px;
      border-bottom: 2px solid #004d40;
      padding-bottom: 10px;
    }
    .report-meta {
      margin-bottom: 20px;
      font-size: 0.9em;
      color: #555;
    }
    .section {
      margin-bottom: 40px;
      border: 1px solid #ddd;
      padding: 15px;
      border-radius: 5px;
    }
    .section h3 {
      color: #00796b;
      border-bottom: 1px solid #b2dfdb;
      padding-bottom: 5px;
      margin-top: 0;
    }
    .sub-section h4 {
      color: #009688;
      margin-top: 15px;
      margin-bottom: 10px;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    .data-table th, .data-table td {
      padding: 8px 12px;
      border: 1px solid #eee;
    }
    .data-table th {
      background-color: #e0f2f1;
      color: #004d40;
      text-align: right;
    }
    .data-table td {
      text-align: right;
    }
    .amount-col {
      text-align: left !important; /* لجعل الأرقام محاذية لليسار */
      width: 150px;
      font-family: 'Courier New', monospace;
    }
    .item-name {
      padding-right: 20px; /* مسافة بادئة للبنود الفرعية */
    }
    .section-header td {
      background-color: #f0f0f0;
      font-weight: bold;
      color: #333;
    }
    .section-total td {
      background-color: #e8f5e9;
      font-weight: bold;
      border-top: 2px solid #004d40;
    }
    .grand-total td {
      background-color: #c8e6c9;
      font-size: 1.1em;
      border-top: 3px double #004d40;
    }
    .final-total {
      margin-top: 20px;
    }
    .final-total-row td {
      background-color: #a5d6a7;
      font-size: 1.2em;
    }
    .loading-state, .error-state {
      text-align: center;
      padding: 50px;
      border: 1px solid #ffccbc;
      background-color: #fff3e0;
      color: #d84315;
      border-radius: 5px;
    }
    .loading-state {
      border-color: #b2dfdb;
      background-color: #e0f7fa;
      color: #006064;
    }
    .spinner {
      border: 4px solid rgba(0, 0, 0, 0.1);
      border-left-color: #009688;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      animation: spin 1s linear infinite;
      margin: 10px auto;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class BalanceSheetComponent implements OnInit {
  // متغير لتخزين بيانات الميزانية العمومية
  balanceSheetData: BalanceSheetData | null = null;
  // حالة التحميل
  loading: boolean = false;
  // حالة الخطأ
  error: boolean = false;
  // رسالة الخطأ
  errorMessage: string = '';
  // نقطة نهاية API
  private readonly API_URL = '/api/accounting/balance-sheet';

  // حقن خدمة HttpClient
  constructor(private http: HttpClient) {}

  // عند تهيئة المكون
  ngOnInit(): void {
    this.loadBalanceSheetData();
  }

  /**
   * تحميل بيانات الميزانية العمومية من الـ Backend
   */
  loadBalanceSheetData(): void {
    this.loading = true;
    this.error = false;
    this.errorMessage = '';
    this.balanceSheetData = null;

    // استخدام Observable والـ pipe لمعالجة التحميل والخطأ
    this.http.get<BalanceSheetData>(this.API_URL)
      .pipe(
        // معالجة الأخطاء
        catchError(this.handleError),
        // إيقاف حالة التحميل بغض النظر عن النتيجة
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (data) => {
          // تعيين البيانات عند النجاح
          this.balanceSheetData = data;
        },
        error: (err) => {
          // يتم التعامل مع الخطأ بالفعل في handleError، هنا فقط للتأكد
          console.error('Subscription Error:', err);
        }
      });
  }

  /**
   * معالج الأخطاء لطلبات HTTP
   * @param error - كائن الخطأ
   * @returns Observable يحتوي على خطأ
   */
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    this.error = true;
    if (error.status === 0) {
      // خطأ من جانب العميل أو الشبكة
      this.errorMessage = 'فشل الاتصال بالخادم. الرجاء التحقق من اتصال الشبكة.';
      console.error('An error occurred:', error.error);
    } else {
      // خطأ من جانب الخادم
      this.errorMessage = `خطأ في الخادم: ${error.status} - ${error.statusText || 'حدث خطأ غير معروف'}`;
      // محاولة استخراج رسالة خطأ أكثر تفصيلاً من جسم الاستجابة
      if (error.error && error.error.message) {
        this.errorMessage += `: ${error.error.message}`;
      }
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`);
    }
    // إرجاع Observable يحتوي على خطأ ليتم التعامل معه من قبل المشترك
    return throwError(() => new Error(this.errorMessage));
  }

  // دالة مساعدة لإنشاء بيانات وهمية للاختبار إذا لزم الأمر
  // private getMockData(): BalanceSheetData {
  //   // ... (بيانات وهمية)
  // }
}
