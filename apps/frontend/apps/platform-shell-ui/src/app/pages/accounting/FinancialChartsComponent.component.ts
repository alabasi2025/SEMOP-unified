import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, throwError, Observable } from 'rxjs';

// واجهة لتمثيل نقطة بيانات واحدة في الرسم البياني
interface ChartDataPoint {
  label: string; // تسمية النقطة (مثل: شهر، حساب)
  value: number; // قيمة النقطة
}

// واجهة لتمثيل هيكل بيانات الرسم البياني المالي
interface FinancialChart {
  id: string; // معرف فريد للرسم البياني
  title: string; // عنوان الرسم البياني (مثل: اتجاهات الإيرادات)
  type: 'bar' | 'line' | 'pie' | 'doughnut'; // نوع الرسم البياني
  data: ChartDataPoint[]; // نقاط البيانات
}

@Component({
  selector: 'app-financial-charts',
  // القالب المضمن: يعرض حالة التحميل، الخطأ، أو الرسوم البيانية
  template: `
    <div class="financial-charts-container">
      <!-- عنوان الصفحة -->
      <h2 class="page-title">الرسوم البيانية المالية</h2>

      <!-- حالة التحميل -->
      <div *ngIf="loading" class="loading-state">
        <p>جاري تحميل البيانات المالية والرسوم البيانية...</p>
        <!-- يمكن إضافة مؤشر تحميل هنا -->
      </div>

      <!-- حالة الخطأ -->
      <div *ngIf="error" class="error-state">
        <h3>حدث خطأ أثناء تحميل البيانات</h3>
        <p>{{ error }</p>
        <button (click)="loadFinancialCharts()">إعادة المحاولة</button>
      </div>

      <!-- عرض الرسوم البيانية -->
      <div *ngIf="!loading && !error && charts.length > 0" class="charts-grid">
        <!-- حلقة تكرارية لعرض كل رسم بياني -->
        <div *ngFor="let chart of charts" class="chart-card">
          <h4>{{ chart.title }}</h4>
          <!-- هذا هو المكان الذي سيتم فيه عرض الرسم البياني الفعلي.
               في تطبيق حقيقي، سيتم استخدام مكتبة رسوم بيانية (مثل Chart.js أو D3)
               مع توجيه مخصص (Directive) أو مكون فرعي (Sub-component) لعرض البيانات.
               هنا نستخدم تمثيلاً بسيطاً للبيانات كقائمة. -->
          <div class="chart-placeholder">
            <p>نوع الرسم: {{ chart.type }}</p>
            <ul>
              <li *ngFor="let point of chart.data">
                {{ point.label }}: <strong>{{ point.value | number }}</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- حالة عدم وجود بيانات -->
      <div *ngIf="!loading && !error && charts.length === 0" class="no-data-state">
        <p>لا توجد رسوم بيانية مالية لعرضها حالياً.</p>
      </div>
    </div>
  `,
  // الأنماط المضمنة: لتنسيق المكون
  styles: [`
    .financial-charts-container {
      padding: 20px;
      font-family: 'Arial', sans-serif;
      direction: rtl; /* دعم اللغة العربية */
      text-align: right;
    }
    .page-title {
      color: #0056b3;
      border-bottom: 2px solid #eee;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    .loading-state, .error-state, .no-data-state {
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
      text-align: center;
    }
    .loading-state {
      background-color: #f0f8ff;
      color: #0056b3;
    }
    .error-state {
      background-color: #ffe0e0;
      color: #cc0000;
      border: 1px solid #cc0000;
    }
    .error-state button {
      margin-top: 10px;
      padding: 8px 15px;
      cursor: pointer;
    }
    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }
    .chart-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.05);
      background-color: #fff;
    }
    .chart-card h4 {
      color: #333;
      margin-top: 0;
      border-bottom: 1px dashed #eee;
      padding-bottom: 10px;
    }
    .chart-placeholder ul {
      list-style: none;
      padding: 0;
    }
    .chart-placeholder li {
      padding: 5px 0;
      border-bottom: 1px dotted #f0f0f0;
    }
  `]
})
export class FinancialChartsComponent implements OnInit {
  // مصفوفة لتخزين بيانات الرسوم البيانية المالية
  charts: FinancialChart[] = [];
  // حالة التحميل: صحيح عند جلب البيانات
  loading: boolean = false;
  // رسالة الخطأ: لتخزين أي خطأ يحدث أثناء الاتصال بالخادم
  error: string | null = null;
  // مسار API لجلب البيانات
  private readonly API_URL = '/api/accounting/financial-charts';

  // حقن خدمة HttpClient للاتصال بالخادم
  constructor(private http: HttpClient) {}

  // يتم استدعاؤها عند تهيئة المكون
  ngOnInit(): void {
    this.loadFinancialCharts();
  }

  /**
   * @description جلب بيانات الرسوم البيانية المالية من الخادم.
   */
  loadFinancialCharts(): void {
    // إعادة تعيين حالة الخطأ والتحميل
    this.loading = true;
    this.error = null;
    this.charts = [];

    // استخدام Observable لجلب البيانات مع معالجة الأخطاء وحالة الانتهاء
    this.http.get<FinancialChart[]>(this.API_URL)
      .pipe(
        // معالجة الأخطاء التي قد تحدث أثناء الاتصال
        catchError(this.handleError),
        // يتم تنفيذها دائماً سواء نجح الطلب أو فشل
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        // عند نجاح جلب البيانات
        next: (data) => {
          // مثال على بيانات وهمية في حال عدم وجود بيانات حقيقية من الخادم
          if (data && data.length > 0) {
            this.charts = data;
          } else {
            // بيانات وهمية للاختبار إذا كانت الاستجابة فارغة
            this.charts = this.getMockCharts();
          }
        },
        // عند حدوث خطأ (تمت معالجته بالفعل في catchError لكن هذا للتأكد)
        error: (err) => {
          // تم تعيين الخطأ في handleError، لكن يمكن إضافة منطق إضافي هنا
          console.error('خطأ في الاشتراك:', err);
        }
      });
  }

  /**
   * @description معالج الأخطاء لطلبات HTTP.
   * @param error - استجابة الخطأ من HTTP.
   * @returns Observable يرمي خطأ.
   */
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'حدث خطأ غير معروف!';
    if (error.error instanceof ErrorEvent) {
      // خطأ من جانب العميل أو الشبكة
      errorMessage = `خطأ: ${error.error.message}`;
    } else {
      // خطأ من جانب الخادم
      if (error.status === 0) {
        errorMessage = 'تعذر الاتصال بالخادم. يرجى التحقق من اتصال الشبكة.';
      } else {
        errorMessage = `خطأ في الخادم (الكود: ${error.status}): ${error.message}`;
      }
    }
    console.error(errorMessage);
    this.error = `فشل تحميل الرسوم البيانية: ${errorMessage}`;
    // يجب رمي الخطأ للسماح للمشتركين بمعرفة أن شيئًا ما حدث
    return throwError(() => new Error(errorMessage));
  };

  /**
   * @description توليد بيانات رسوم بيانية وهمية للاختبار.
   * @returns مصفوفة من FinancialChart.
   */
  private getMockCharts(): FinancialChart[] {
    return [
      {
        id: 'budget-vs-actual',
        title: 'مقارنة الميزانية الفعلية بالمخططة (Q3)',
        type: 'bar',
        data: [
          { label: 'الإيرادات المخططة', value: 150000 },
          { label: 'الإيرادات الفعلية', value: 165000 },
          { label: 'المصروفات المخططة', value: 80000 },
          { label: 'المصروفات الفعلية', value: 75000 }
        ]
      },
      {
        id: 'income-trend',
        title: 'اتجاهات صافي الدخل الشهري (آخر 6 أشهر)',
        type: 'line',
        data: [
          { label: 'يوليو', value: 25000 },
          { label: 'أغسطس', value: 30000 },
          { label: 'سبتمبر', value: 28000 },
          { label: 'أكتوبر', value: 35000 },
          { label: 'نوفمبر', value: 32000 },
          { label: 'ديسمبر', value: 40000 }
        ]
      },
      {
        id: 'cash-flow-composition',
        title: 'تكوين التدفقات النقدية التشغيلية',
        type: 'doughnut',
        data: [
          { label: 'من العملاء', value: 85 },
          { label: 'مدفوعات الموردين', value: -40 },
          { label: 'مدفوعات الرواتب', value: -25 }
        ]
      }
    ];
  }
}
