import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { catchError, finalize, firstValueFrom, of } from 'rxjs';

// واجهة لتمثيل بند واحد في قائمة الدخل (مثل الإيرادات أو المصروفات)
interface IncomeStatementItem {
  id: number; // معرف البند
  name: string; // اسم البند (مثل إيرادات المبيعات)
  amount: number; // المبلغ للفترة الحالية
  comparisonAmount: number; // المبلغ للفترة المقارنة
  type: 'revenue' | 'expense' | 'subtotal' | 'net'; // نوع البند (إيراد، مصروف، إجمالي فرعي، صافي)
}

// واجهة لتمثيل بيانات قائمة الدخل لفترة واحدة
interface IncomeStatementPeriod {
  startDate: string; // تاريخ بداية الفترة
  endDate: string; // تاريخ نهاية الفترة
  totalRevenue: number; // إجمالي الإيرادات
  totalExpense: number; // إجمالي المصروفات
  netIncome: number; // صافي الربح/الخسارة
  items: IncomeStatementItem[]; // تفاصيل البنود
}

// واجهة لتمثيل بيانات المقارنة بين فترتين
interface IncomeStatementData {
  currentPeriod: IncomeStatementPeriod; // بيانات الفترة الحالية
  comparisonPeriod: IncomeStatementPeriod; // بيانات الفترة المقارنة
}

// بيانات وهمية للاختبار
const MOCK_DATA: IncomeStatementData = {
  currentPeriod: {
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    totalRevenue: 150000,
    totalExpense: 80000,
    netIncome: 70000,
    items: [
      { id: 1, name: 'إيرادات المبيعات', amount: 150000, comparisonAmount: 120000, type: 'revenue' },
      { id: 2, name: 'تكلفة البضاعة المباعة', amount: 40000, comparisonAmount: 30000, type: 'expense' },
      { id: 3, name: 'مصروفات التشغيل', amount: 30000, comparisonAmount: 25000, type: 'expense' },
      { id: 4, name: 'مصروفات إدارية وعمومية', amount: 10000, comparisonAmount: 8000, type: 'expense' },
      { id: 5, name: 'صافي الربح', amount: 70000, comparisonAmount: 57000, type: 'net' },
    ],
  },
  comparisonPeriod: {
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    totalRevenue: 120000,
    totalExpense: 63000,
    netIncome: 57000,
    items: [], // لا نحتاج لتفاصيل البنود هنا، فقط في الفترة الحالية
  },
};

@Component({
  selector: 'app-income-statement',
  // يجب إضافة CommonModule للسماح باستخدام *ngIf و *ngFor في القالب المضمن
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="income-statement-container">
      <h2>قائمة الدخل - مقارنة الفترات</h2>

      <!-- حالة التحميل -->
      <div *ngIf="loading" class="loading-state">
        جاري تحميل بيانات قائمة الدخل...
      </div>

      <!-- حالة الخطأ -->
      <div *ngIf="error" class="error-state">
        <p>حدث خطأ أثناء جلب البيانات:</p>
        <p>{{ error }}</p>
        <button (click)="loadIncomeStatementData()">إعادة المحاولة</button>
      </div>

      <!-- عرض البيانات -->
      <div *ngIf="!loading && !error && data" class="data-view">
        <div class="period-info">
          <p><strong>الفترة الحالية:</strong> {{ data.currentPeriod.startDate }} - {{ data.currentPeriod.endDate }}</p>
          <p><strong>فترة المقارنة:</strong> {{ data.comparisonPeriod.startDate }} - {{ data.comparisonPeriod.endDate }}</p>
        </div>

        <table class="statement-table">
          <thead>
            <tr>
              <th>البند</th>
              <th class="amount-col">الفترة الحالية ({{ data.currentPeriod.endDate | slice:0:4 }})</th>
              <th class="amount-col">فترة المقارنة ({{ data.comparisonPeriod.endDate | slice:0:4 }})</th>
              <th class="amount-col">الفرق</th>
            </tr>
          </thead>
          <tbody>
            <!-- عرض بنود قائمة الدخل -->
            <ng-container *ngFor="let item of data.currentPeriod.items">
              <tr [ngClass]="{'net-row': item.type === 'net', 'subtotal-row': item.type === 'subtotal'}">
                <td>{{ item.name }}</td>
                <td class="amount-col">{{ item.amount | number:'1.2-2' }}</td>
                <td class="amount-col">{{ item.comparisonAmount | number:'1.2-2' }}</td>
                <td class="amount-col">
                  {{ (item.amount - item.comparisonAmount) | number:'1.2-2' }}
                  <span *ngIf="item.type !== 'net'" [class.positive]="item.amount > item.comparisonAmount" [class.negative]="item.amount < item.comparisonAmount">
                    ({{ getPercentageChange(item.amount, item.comparisonAmount) }}%)
                  </span>
                </td>
              </tr>
            </ng-container>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .income-statement-container {
      padding: 20px;
      font-family: 'Arial', sans-serif;
      direction: rtl; /* لدعم اللغة العربية */
      text-align: right;
    }
    h2 {
      color: #333;
      border-bottom: 2px solid #eee;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    .loading-state, .error-state {
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 15px;
      text-align: center;
    }
    .loading-state {
      background-color: #e6f7ff;
      color: #0050b3;
    }
    .error-state {
      background-color: #fff1f0;
      color: #cf1322;
      border: 1px solid #ffa39e;
    }
    .period-info {
      margin-bottom: 20px;
      padding: 10px;
      background-color: #f9f9f9;
      border-radius: 4px;
      border-right: 3px solid #1890ff;
    }
    .statement-table {
      width: 100%;
      border-collapse: collapse;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
    }
    .statement-table th, .statement-table td {
      border: 1px solid #f0f0f0;
      padding: 12px 15px;
    }
    .statement-table th {
      background-color: #fafafa;
      color: #595959;
      font-weight: bold;
      text-align: right;
    }
    .amount-col {
      text-align: left !important; /* لجعل الأرقام محاذية لليسار */
      font-family: 'Courier New', monospace; /* خط أحادي للمبالغ */
    }
    .net-row {
      font-weight: bold;
      background-color: #e6f7ff;
      border-top: 2px solid #91d5ff;
    }
    .subtotal-row {
      font-weight: bold;
      background-color: #f6ffed;
    }
    .positive {
      color: #52c41a; /* أخضر للزيادة الإيجابية */
      font-weight: normal;
    }
    .negative {
      color: #ff4d4f; /* أحمر للزيادة السلبية */
      font-weight: normal;
    }
  `]
})
export class IncomeStatementComponent implements OnInit {
  // بيانات قائمة الدخل
  data: IncomeStatementData | null = null;
  // حالة التحميل
  loading = false;
  // رسالة الخطأ
  error: string | null = null;

  // عنوان API الافتراضي
  private readonly API_URL = '/api/accounting/income-statement';

  constructor(private http: HttpClient) {}

  /**
   * @description يتم استدعاؤها عند تهيئة المكون لجلب البيانات الأولية.
   */
  ngOnInit(): void {
    // يمكن تحديد فترات افتراضية هنا، أو جلبها من إعدادات المستخدم
    this.loadIncomeStatementData('2024-01-01', '2023-01-01');
  }

  /**
   * @description جلب بيانات قائمة الدخل من الـ Backend.
   * @param currentPeriodStart تاريخ بداية الفترة الحالية
   * @param comparisonPeriodStart تاريخ بداية فترة المقارنة
   */
  async loadIncomeStatementData(currentPeriodStart?: string, comparisonPeriodStart?: string): Promise<void> {
    this.loading = true;
    this.error = null;
    this.data = null;

    // بناء معامل الاستعلام (Query Parameters)
    const params = {
      current_start: currentPeriodStart || '2024-01-01',
      comparison_start: comparisonPeriodStart || '2023-01-01',
    };

    try {
      // استخدام firstValueFrom لتحويل Observable إلى Promise والتعامل معه بـ async/await
      // ملاحظة: تم استخدام بيانات وهمية مؤقتًا لضمان عمل القالب
      // this.data = await firstValueFrom(
      //   this.http.get<IncomeStatementData>(this.API_URL, { params })
      //     .pipe(
      //       catchError(err => {
      //         console.error('HTTP Error:', err);
      //         this.error = 'فشل في الاتصال بالخادم أو جلب البيانات.';
      //         return of(null); // إرجاع Observable بقيمة null عند الخطأ
      //       })
      //     )
      // );

      // محاكاة جلب البيانات بنجاح
      await new Promise(resolve => setTimeout(resolve, 1000)); // تأخير وهمي
      this.data = MOCK_DATA;

    } catch (err) {
      // التعامل مع الأخطاء التي قد تحدث قبل أو بعد طلب HTTP
      console.error('General Error:', err);
      this.error = this.error || 'حدث خطأ غير متوقع أثناء معالجة البيانات.';
    } finally {
      this.loading = false;
    }
  }

  /**
   * @description حساب نسبة التغير بين المبلغ الحالي ومبلغ المقارنة.
   * @param currentAmount المبلغ الحالي
   * @param comparisonAmount مبلغ المقارنة
   * @returns نسبة التغير كـ string
   */
  getPercentageChange(currentAmount: number, comparisonAmount: number): string {
    if (comparisonAmount === 0) {
      return currentAmount > 0 ? '+100.00' : '0.00';
    }
    const change = currentAmount - comparisonAmount;
    const percentage = (change / comparisonAmount) * 100;
    return (percentage > 0 ? '+' : '') + percentage.toFixed(2);
  }
}
