import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, throwError } from 'rxjs';

// واجهة لملخص البيانات المالية الرئيسية
interface FinancialSummary {
  totalRevenue: number; // إجمالي الإيرادات
  totalExpenses: number; // إجمالي المصروفات
  netProfit: number; // صافي الربح
}

// واجهة لمؤشرات الأداء الرئيسية (KPIs)
interface KeyPerformanceIndicator {
  name: string; // اسم المؤشر
  value: number; // القيمة الحالية
  trend: 'up' | 'down' | 'stable'; // الاتجاه
  description: string; // وصف مختصر
}

// واجهة لبيانات الرسم البياني (مثال: الإيرادات والمصروفات الشهرية)
interface ChartDataPoint {
  month: string; // الشهر
  revenue: number; // الإيرادات
  expenses: number; // المصروفات
}

// واجهة البيانات الكاملة للوحة التحكم
interface AccountingDashboardData {
  summary: FinancialSummary;
  kpis: KeyPerformanceIndicator[];
  monthlyTrend: ChartDataPoint[];
}

@Component({
  selector: 'app-accounting-dashboard',
  // القالب المضمن (Inline Template)
  template: `
    <div class="dashboard-container">
      <!-- عنوان لوحة التحكم -->
      <h2>لوحة التحكم المالية</h2>

      <!-- حالة التحميل -->
      <div *ngIf="loading" class="loading-state">
        جاري تحميل بيانات لوحة التحكم...
      </div>

      <!-- حالة الخطأ -->
      <div *ngIf="error" class="error-state">
        <p>حدث خطأ أثناء تحميل البيانات:</p>
        <p>{{ error }}</p>
        <button (click)="loadDashboardData()">إعادة المحاولة</button>
      </div>

      <!-- عرض البيانات بعد التحميل بنجاح -->
      <div *ngIf="!loading && !error && dashboardData" class="content-grid">
        
        <!-- 1. ملخص البيانات المالية -->
        <section class="summary-section">
          <h3>ملخص المركز المالي</h3>
          <div class="summary-cards">
            <div class="card revenue-card">
              <h4>إجمالي الإيرادات</h4>
              <p>{{ dashboardData.summary.totalRevenue | currency:'SAR' }}</p>
            </div>
            <div class="card expenses-card">
              <h4>إجمالي المصروفات</h4>
              <p>{{ dashboardData.summary.totalExpenses | currency:'SAR' }}</p>
            </div>
            <div class="card profit-card">
              <h4>صافي الربح</h4>
              <p>{{ dashboardData.summary.netProfit | currency:'SAR' }}</p>
            </div>
          </div>
        </section>

        <!-- 2. مؤشرات الأداء الرئيسية (KPIs) -->
        <section class="kpis-section">
          <h3>مؤشرات الأداء الرئيسية</h3>
          <div class="kpi-cards">
            <div *ngFor="let kpi of dashboardData.kpis" class="card kpi-card">
              <h4>{{ kpi.name }}</h4>
              <p class="kpi-value">{{ kpi.value | number:'1.2-2' }}</p>
              <span [class]="'trend-' + kpi.trend">
                {{ kpi.trend === 'up' ? '▲' : (kpi.trend === 'down' ? '▼' : '▬') }}
              </span>
              <small>{{ kpi.description }}</small>
            </div>
          </div>
        </section>

        <!-- 3. الرسم البياني للاتجاه الشهري -->
        <section class="chart-section">
          <h3>اتجاه الإيرادات والمصروفات الشهرية</h3>
          <!-- ملاحظة: في تطبيق حقيقي، سيتم استخدام مكتبة رسوم بيانية هنا (مثل Chart.js أو Ngx-charts) -->
          <div class="chart-placeholder">
            <p>الرسم البياني يظهر هنا (بيانات وهمية):</p>
            <ul>
              <li *ngFor="let dataPoint of dashboardData.monthlyTrend">
                {{ dataPoint.month }}: إيرادات ({{ dataPoint.revenue | number }}) - مصروفات ({{ dataPoint.expenses | number }})
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  `,
  // الأنماط المضمنة (Inline Styles)
  styles: [`
    .dashboard-container {
      padding: 20px;
      font-family: 'Arial', sans-serif;
      direction: rtl; /* دعم اللغة العربية */
      text-align: right;
    }
    h2 {
      color: #0056b3;
      border-bottom: 2px solid #eee;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    h3 {
      color: #333;
      margin-top: 30px;
      margin-bottom: 15px;
    }
    .loading-state, .error-state {
      padding: 20px;
      border-radius: 5px;
      text-align: center;
      margin-bottom: 20px;
    }
    .loading-state {
      background-color: #e9f7fe;
      color: #0056b3;
    }
    .error-state {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
    .content-grid {
      display: grid;
      gap: 20px;
    }
    .summary-cards, .kpi-cards {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }
    .card {
      flex: 1;
      min-width: 250px;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      background-color: #fff;
      transition: transform 0.2s;
    }
    .card:hover {
      transform: translateY(-5px);
    }
    .revenue-card { border-right: 5px solid #28a745; }
    .expenses-card { border-right: 5px solid #dc3545; }
    .profit-card { border-right: 5px solid #007bff; }

    .kpi-value {
      font-size: 1.5em;
      font-weight: bold;
      margin: 5px 0;
    }
    .trend-up { color: #28a745; }
    .trend-down { color: #dc3545; }
    .trend-stable { color: #6c757d; }

    .chart-placeholder {
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      border: 1px dashed #ccc;
      min-height: 200px;
    }
  `]
})
export class AccountingDashboardComponent implements OnInit {
  // بيانات لوحة التحكم
  dashboardData: AccountingDashboardData | null = null;
  // حالة التحميل
  loading: boolean = false;
  // رسالة الخطأ
  error: string | null = null;
  // نقطة نهاية API (يجب تعديلها لتناسب الـ Backend الفعلي)
  private readonly API_URL = '/api/accounting/dashboard';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // تحميل البيانات عند تهيئة المكون
    this.loadDashboardData();
  }

  /**
   * @description تحميل بيانات لوحة التحكم من الـ Backend
   */
  loadDashboardData(): void {
    // إعادة تعيين حالة الخطأ والتحميل
    this.loading = true;
    this.error = null;
    this.dashboardData = null;

    // استخدام HttpClient لجلب البيانات
    this.http.get<AccountingDashboardData>(this.API_URL)
      .pipe(
        // معالجة الأخطاء
        catchError(this.handleError),
        // إنهاء حالة التحميل بغض النظر عن النتيجة
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (data) => {
          // تخزين البيانات المستلمة
          this.dashboardData = data;
        },
        error: (err) => {
          // يتم تعيين رسالة الخطأ هنا من دالة handleError
          this.error = err;
        }
      });
  }

  /**
   * @description دالة لمعالجة أخطاء HTTP
   * @param error - كائن الخطأ المستلم
   * @returns Observable يحتوي على رسالة الخطأ
   */
  private handleError(error: HttpErrorResponse): any {
    let errorMessage = 'حدث خطأ غير معروف!';
    if (error.error instanceof ErrorEvent) {
      // خطأ من جانب العميل أو الشبكة
      errorMessage = `خطأ: ${error.error.message}`;
    } else {
      // خطأ من جانب الخادم
      errorMessage = `رمز الخطأ: ${error.status}, الرسالة: ${error.message}`;
    }
    console.error(errorMessage);
    // إرجاع رسالة الخطأ كنص ليتم عرضها في الواجهة
    return throwError(() => errorMessage);
  }
}
