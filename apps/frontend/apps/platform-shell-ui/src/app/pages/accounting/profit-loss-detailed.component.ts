import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Observable, catchError, finalize, throwError } from 'rxjs';

// واجهة لتمثيل تفاصيل حساب واحد في تقرير الأرباح والخسائر
interface AccountDetail {
  accountId: string;
  accountName: string; // اسم الحساب
  currentPeriodAmount: number; // مبلغ الفترة الحالية
  comparisonPeriodAmount: number; // مبلغ الفترة المقارنة (مثل العام الماضي)
  percentageChange: number; // نسبة التغير (مقارنة بالفترة المقارنة)
  percentageOfRevenue: number; // نسبة من إجمالي الإيرادات (لتحليل الأداء)
}

// واجهة لتمثيل قسم رئيسي في تقرير الأرباح والخسائر (مثل الإيرادات، المصروفات)
interface ProfitLossSection {
  title: string; // عنوان القسم
  accounts: AccountDetail[]; // قائمة الحسابات التفصيلية
  subTotal: number; // إجمالي القسم
}

// واجهة لتمثيل هيكل تقرير الأرباح والخسائر التفصيلي بالكامل
interface ProfitLossDetailedReport {
  reportTitle: string; // عنوان التقرير
  startDate: string; // تاريخ بداية الفترة
  endDate: string; // تاريخ نهاية الفترة
  totalRevenue: number; // إجمالي الإيرادات (قيمة مرجعية لحساب النسب)
  sections: ProfitLossSection[]; // أقسام التقرير الرئيسية
  grossProfit: number; // مجمل الربح
  operatingIncome: number; // الدخل التشغيلي
  netIncome: number; // صافي الربح/الخسارة
}

@Component({
  selector: 'app-profit-loss-detailed',
  // استخدام CommonModule لدعم التوجيهات الهيكلية مثل *ngIf و *ngFor
  standalone: true,
  imports: [CommonModule],
  // القالب المضمن (Inline Template)
  template: `
    <div class="report-container">
      <h2 class="report-title">تقرير الأرباح والخسائر التفصيلي</h2>
      
      <!-- حالة التحميل -->
      <div *ngIf="loading" class="loading-state">
        <p>جاري تحميل بيانات تقرير الأرباح والخسائر... الرجاء الانتظار.</p>
      </div>

      <!-- حالة الخطأ -->
      <div *ngIf="error" class="error-state">
        <h3>حدث خطأ أثناء تحميل التقرير</h3>
        <p>{{ error }}</p>
        <button (click)="loadReportData()">إعادة المحاولة</button>
      </div>

      <!-- عرض التقرير بعد التحميل الناجح -->
      <div *ngIf="!loading && reportData" class="report-content">
        <div class="report-header">
          <p><strong>الفترة:</strong> {{ reportData.startDate }} - {{ reportData.endDate }}</p>
        </div>

        <!-- جدول التقرير -->
        <table class="profit-loss-table">
          <thead>
            <tr>
              <th>الحساب</th>
              <th class="amount-col">المبلغ الحالي</th>
              <th class="amount-col">المبلغ المقارن</th>
              <th class="percent-col">نسبة التغير</th>
              <th class="percent-col">نسبة من الإيراد</th>
            </tr>
          </thead>
          <tbody>
            <!-- المرور على أقسام التقرير -->
            <ng-container *ngFor="let section of reportData.sections">
              <tr class="section-header">
                <td colspan="5"><strong>{{ section.title }}</strong></td>
              </tr>
              <!-- المرور على تفاصيل الحسابات داخل كل قسم -->
              <tr *ngFor="let account of section.accounts" class="account-row">
                <td>{{ account.accountName }}</td>
                <td class="amount-col">{{ account.currentPeriodAmount | number:'1.2-2' }}</td>
                <td class="amount-col">{{ account.comparisonPeriodAmount | number:'1.2-2' }}</td>
                <td class="percent-col" [class.positive]="account.percentageChange > 0" [class.negative]="account.percentageChange < 0">
                  {{ account.percentageChange | number:'1.2-2' }}%
                </td>
                <td class="percent-col">{{ account.percentageOfRevenue | number:'1.2-2' }}%</td>
              </tr>
              <!-- إجمالي القسم -->
              <tr class="section-subtotal">
                <td><strong>إجمالي {{ section.title }}</strong></td>
                <td class="amount-col" colspan="4"><strong>{{ section.subTotal | number:'1.2-2' }}</strong></td>
              </tr>
            </ng-container>

            <!-- ملخص الأرباح الرئيسية -->
            <tr class="summary-row gross-profit">
              <td><strong>مجمل الربح (Gross Profit)</strong></td>
              <td class="amount-col" colspan="4"><strong>{{ reportData.grossProfit | number:'1.2-2' }}</strong></td>
            </tr>
            <tr class="summary-row operating-income">
              <td><strong>الدخل التشغيلي (Operating Income)</strong></td>
              <td class="amount-col" colspan="4"><strong>{{ reportData.operatingIncome | number:'1.2-2' }}</strong></td>
            </tr>
            <tr class="summary-row net-income">
              <td><strong>صافي الربح/الخسارة (Net Income)</strong></td>
              <td class="amount-col" colspan="4"><strong>{{ reportData.netIncome | number:'1.2-2' }}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  // الأنماط المضمنة (Inline Styles)
  styles: [`
    .report-container {
      padding: 20px;
      font-family: 'Arial', sans-serif;
      direction: rtl; /* لدعم اللغة العربية */
      text-align: right;
    }
    .report-title {
      color: #0056b3;
      border-bottom: 2px solid #eee;
      padding-bottom: 10px;
      margin-bottom: 20px;
      text-align: center;
    }
    .loading-state, .error-state {
      padding: 20px;
      text-align: center;
      border: 1px solid #ffc107;
      background-color: #fff3cd;
      color: #856404;
      margin-bottom: 20px;
    }
    .error-state {
      border-color: #dc3545;
      background-color: #f8d7da;
      color: #721c24;
    }
    .profit-loss-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .profit-loss-table th, .profit-loss-table td {
      padding: 12px 15px;
      border: 1px solid #ddd;
    }
    .profit-loss-table thead th {
      background-color: #f8f9fa;
      color: #333;
      font-weight: bold;
      text-align: right;
    }
    .amount-col, .percent-col {
      text-align: left; /* لجعل الأرقام محاذاة لليسار */
      width: 15%;
    }
    .section-header td {
      background-color: #e9ecef;
      font-size: 1.1em;
      padding: 10px 15px;
    }
    .section-subtotal td {
      background-color: #f1f1f1;
      font-weight: bold;
    }
    .summary-row td {
      font-size: 1.2em;
      background-color: #d1e7dd;
      color: #0f5132;
    }
    .net-income td {
      background-color: #cff4fc;
      color: #055160;
      border-top: 3px double #000;
    }
    .positive {
      color: green;
      font-weight: bold;
    }
    .negative {
      color: red;
      font-weight: bold;
    }
  `]
})
export class ProfitLossDetailedComponent implements OnInit {
  // بيانات التقرير، تكون فارغة في البداية
  reportData: ProfitLossDetailedReport | null = null;
  // حالة التحميل
  loading: boolean = false;
  // رسالة الخطأ في حال فشل الاتصال
  error: string | null = null;

  // نقطة نهاية API لجلب بيانات التقرير
  private readonly API_URL = '/api/accounting/profit-loss/detailed';

  // حقن خدمة HttpClient
  constructor(private http: HttpClient) {}

  // دورة حياة المكون: يتم استدعاؤها عند تهيئة المكون
  ngOnInit(): void {
    this.loadReportData();
  }

  /**
   * جلب بيانات تقرير الأرباح والخسائر التفصيلي من الخادم.
   */
  loadReportData(): void {
    this.loading = true;
    this.error = null; // مسح أي أخطاء سابقة

    this.http.get<ProfitLossDetailedReport>(this.API_URL)
      .pipe(
        // معالجة الأخطاء
        catchError(this.handleError),
        // إنهاء حالة التحميل سواء نجحت العملية أو فشلت
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (data) => {
          // تعيين البيانات المستلمة
          this.reportData = data;
        },
        error: (err) => {
          // تعيين رسالة الخطأ ليتم عرضها في القالب
          this.error = err;
          this.reportData = null; // التأكد من إخفاء التقرير عند وجود خطأ
        }
      });
  }

  /**
   * دالة مساعدة لمعالجة أخطاء HTTP.
   * @param error استجابة الخطأ من HttpClient
   * @returns Observable يحتوي على رسالة خطأ
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'حدث خطأ غير معروف!';
    if (error.error instanceof ErrorEvent) {
      // خطأ من جانب العميل أو الشبكة
      errorMessage = `خطأ: ${error.error.message}`;
    } else {
      // خطأ من جانب الخادم
      errorMessage = `رمز الخطأ: ${error.status}, الرسالة: ${error.message}`;
      if (error.status === 404) {
        errorMessage = 'لم يتم العثور على نقطة نهاية التقرير (404).';
      } else if (error.status === 500) {
        errorMessage = 'خطأ داخلي في الخادم أثناء جلب التقرير (500).';
      }
    }
    console.error(errorMessage);
    // إرجاع رسالة الخطأ ليتم معالجتها في دالة subscribe
    return throwError(() => errorMessage);
  }
}
