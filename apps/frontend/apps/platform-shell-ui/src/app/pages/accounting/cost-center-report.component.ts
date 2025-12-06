import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, throwError, Observable } from 'rxjs';

// واجهة لمركز التكلفة
interface CostCenter {
  id: number;
  name: string; // اسم مركز التكلفة
}

// واجهة لبيانات التقرير لكل مركز تكلفة
interface CostCenterReportItem {
  costCenter: CostCenter; // مركز التكلفة
  totalExpenses: number; // إجمالي المصروفات
  comparisonValue: number; // قيمة للمقارنة (مثل ميزانية أو مصروفات الفترة السابقة)
  expenseDetails: {
    category: string; // فئة المصروف (مثل رواتب، إيجار، تسويق)
    amount: number; // المبلغ
  }[];
}

// واجهة البيانات الرئيسية للتقرير
interface CostCenterReportData {
  reportItems: CostCenterReportItem[];
  totalReportExpenses: number; // إجمالي المصروفات في التقرير
  reportPeriod: string; // الفترة الزمنية للتقرير
}

@Component({
  selector: 'app-cost-center-report',
  template: `
    <!-- قالب HTML مضمن لتقرير مراكز التكلفة -->
    <div class="report-container">
      <!-- عنوان التقرير -->
      <h2>تقرير مراكز التكلفة</h2>

      <!-- حالة التحميل -->
      <div *ngIf="loading" class="loading-state">
        جاري تحميل بيانات التقرير... <span class="spinner"></span>
      </div>

      <!-- حالة الخطأ -->
      <div *ngIf="error" class="error-state">
        <p><strong>خطأ في النظام:</strong> حدث خطأ أثناء تحميل التقرير.</p>
        <p>التفاصيل: {{ error }}</p>
      </div>

      <!-- عرض التقرير -->
      <div *ngIf="!loading && !error && reportData" class="report-content">
        <!-- ملخص التقرير -->
        <div class="summary">
          <p><strong>الفترة الزمنية:</strong> {{ reportData.reportPeriod }}</p>
          <p><strong>إجمالي المصروفات:</strong> {{ reportData.totalReportExpenses | currency:'SAR' }}</p>
        </div>

        <!-- جدول عرض المصروفات حسب مركز التكلفة -->
        <h3>المصروفات حسب مركز التكلفة والمقارنة</h3>
        <table>
          <thead>
            <tr>
              <th>مركز التكلفة</th>
              <th>إجمالي المصروفات</th>
              <th>قيمة المقارنة</th>
              <th>الفرق</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of reportData.reportItems">
              <td>{{ item.costCenter.name }}</td>
              <td>{{ item.totalExpenses | currency:'SAR' }}</td>
              <td>{{ item.comparisonValue | currency:'SAR' }}</td>
              <!-- عرض الفرق مع تمييز اللون -->
              <td [class.positive-diff]="item.totalExpenses < item.comparisonValue"
                  [class.negative-diff]="item.totalExpenses > item.comparisonValue">
                {{ item.totalExpenses - item.comparisonValue | currency:'SAR' }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- قسم الرسوم البيانية (مثال) -->
        <div class="charts-section">
          <h3>الرسوم البيانية</h3>
          <p class="placeholder">
            هنا سيتم عرض الرسوم البيانية لمقارنة المصروفات بين مراكز التكلفة المختلفة.
            (يتطلب مكتبة رسوم بيانية خارجية مثل Chart.js أو D3.js)
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* تنسيقات CSS مضمنة */
    .report-container {
      padding: 20px;
      font-family: 'Arial', sans-serif;
      direction: rtl; /* لدعم اللغة العربية */
      text-align: right;
    }

    h2, h3 {
      color: #333;
      border-bottom: 2px solid #eee;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }

    .loading-state, .error-state {
      padding: 15px;
      margin-bottom: 20px;
      border-radius: 4px;
      text-align: center;
    }

    .loading-state {
      background-color: #e9f7ef;
      color: #0e7041;
    }

    .error-state {
      background-color: #fbe5e5;
      color: #d9534f;
      border: 1px solid #d9534f;
    }

    .spinner {
      display: inline-block;
      width: 15px;
      height: 15px;
      border: 2px solid #ccc;
      border-top-color: #0e7041;
      border-radius: 50%;
      animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .summary {
      background-color: #f9f9f9;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 20px;
      border-right: 5px solid #007bff;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      box-shadow: 0 2px 3px rgba(0,0,0,0.1);
    }

    th, td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: right;
    }

    th {
      background-color: #007bff;
      color: white;
      font-weight: bold;
    }

    tr:nth-child(even) {
      background-color: #f2f2f2;
    }

    .positive-diff {
      color: #0e7041; /* أخضر - المصروفات أقل من المقارنة (جيد) */
      font-weight: bold;
    }

    .negative-diff {
      color: #d9534f; /* أحمر - المصروفات أعلى من المقارنة (سيئ) */
      font-weight: bold;
    }

    .charts-section .placeholder {
      background-color: #fff3cd;
      color: #856404;
      padding: 15px;
      border: 1px solid #ffeeba;
      border-radius: 4px;
    }
  `]
})
export class CostCenterReportComponent implements OnInit {
  // بيانات التقرير
  reportData: CostCenterReportData | null = null;
  // حالة التحميل
  loading: boolean = false;
  // رسالة الخطأ
  error: string | null = null;

  // عنوان الـ API (يجب استبداله بعنوان الـ API الفعلي)
  private apiUrl = '/api/accounting/cost-center-report';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // عند تهيئة المكون، يتم تحميل البيانات
    this.loadReportData();
  }

  /**
   * @description تحميل بيانات تقرير مراكز التكلفة من الـ Backend
   */
  loadReportData(): void {
    this.loading = true;
    this.error = null; // مسح أي أخطاء سابقة

    this.http.get<CostCenterReportData>(this.apiUrl)
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
          // تعيين البيانات عند النجاح
          this.reportData = data;
        },
        error: (err) => {
          // تعيين رسالة الخطأ
          this.error = err;
          this.reportData = null; // مسح البيانات في حالة الخطأ
        }
      });
  }

  /**
   * @description معالج الأخطاء لطلبات الـ HTTP
   * @param error الخطأ الذي تم إرجاعه من الـ HttpClient
   * @returns Observable يحتوي على رسالة خطأ يمكن استخدامها في الـ subscribe
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'حدث خطأ غير معروف!';
    if (error.error instanceof ErrorEvent) {
      // خطأ من جانب العميل أو الشبكة
      errorMessage = \`خطأ في العميل: \${error.error.message}\`;
    } else {
      // خطأ من جانب الخادم
      if (error.status === 0) {
        errorMessage = 'تعذر الاتصال بالخادم. يرجى التحقق من اتصال الشبكة.';
      } else {
        errorMessage = \`خطأ في الخادم (\${error.status}): \${error.message}\`;
      }
    }
    console.error(errorMessage);
    // إرجاع رسالة الخطأ ليتم معالجتها في الـ subscribe
    return throwError(() => errorMessage);
  }

  // يمكن إضافة المزيد من الدوال هنا مثل:
  // - دالة لتصفية التقرير حسب التاريخ
  // - دالة لتحديث الرسوم البيانية
}
