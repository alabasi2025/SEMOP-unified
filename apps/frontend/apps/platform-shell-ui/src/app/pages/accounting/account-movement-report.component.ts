import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

// 1. واجهة لبيانات الفلترة (مرشحات التقرير)
interface AccountMovementFilter {
  accountId: string; // معرف الحساب المطلوب
  startDate: string; // تاريخ البداية (مثال: '2023-01-01')
  endDate: string;   // تاريخ النهاية (مثال: '2023-12-31')
}

// 2. واجهة لسطر حركة حساب واحد (قيد)
interface AccountMovementTransaction {
  transactionId: string; // معرف القيد
  date: string;          // تاريخ الحركة
  description: string;   // وصف الحركة
  debit: number;         // مدين
  credit: number;        // دائن
  runningBalance: number; // الرصيد الجاري بعد هذه الحركة
}

// 3. واجهة لبيانات التقرير الكاملة
interface AccountMovementReport {
  accountName: string;                  // اسم الحساب
  initialBalance: number;               // الرصيد الافتتاحي
  finalBalance: number;                 // الرصيد الختامي
  transactions: AccountMovementTransaction[]; // قائمة الحركات
}

// 4. واجهة للاستجابة من الـ Backend
interface ApiResponse {
  success: boolean;
  data?: AccountMovementReport;
  message?: string;
}

@Component({
  selector: 'app-account-movement-report',
  // 6. القالب المضمن (Inline Template)
  template: `
    <div class="report-container">
      <!-- عنوان التقرير -->
      <h2 class="title">تقرير حركة حساب</h2>

      <!-- قسم الفلترة والبحث -->
      <div class="filter-section">
        <input type="text" [(ngModel)]="filter.accountId" placeholder="معرف الحساب" class="input-field" />
        <input type="date" [(ngModel)]="filter.startDate" placeholder="تاريخ البداية" class="input-field" />
        <input type="date" [(ngModel)]="filter.endDate" placeholder="تاريخ النهاية" class="input-field" />
        <button (click)="loadReport()" [disabled]="loading" class="btn-primary">
          {{ loading ? 'جاري التحميل...' : 'عرض التقرير' }}
        </button>
      </div>

      <!-- 5. حالة التحميل -->
      <div *ngIf="loading" class="loading-message">
        <p>جاري تحميل تقرير حركة الحساب...</p>
      </div>

      <!-- 4. معالجة الأخطاء -->
      <div *ngIf="error" class="error-message">
        <p><strong>خطأ في جلب البيانات:</strong> {{ error }}</p>
      </div>

      <!-- عرض التقرير في حال وجود بيانات وعدم وجود خطأ -->
      <div *ngIf="reportData && !loading && !error" class="report-content">
        <h3>الحساب: {{ reportData.accountName }}</h3>
        <div class="balance-summary">
          <p><strong>الرصيد الافتتاحي:</strong> {{ reportData.initialBalance | number:'1.2-2' }}</p>
          <p><strong>الرصيد الختامي:</strong> {{ reportData.finalBalance | number:'1.2-2' }}</p>
        </div>

        <!-- جدول عرض الحركات -->
        <table class="movement-table">
          <thead>
            <tr>
              <th>التاريخ</th>
              <th>الوصف</th>
              <th>مدين</th>
              <th>دائن</th>
              <th>الرصيد الجاري</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let transaction of reportData.transactions">
              <td>{{ transaction.date }}</td>
              <td>{{ transaction.description }}</td>
              <td class="debit">{{ transaction.debit | number:'1.2-2' }}</td>
              <td class="credit">{{ transaction.credit | number:'1.2-2' }}</td>
              <td [ngClass]="{'positive': transaction.runningBalance >= 0, 'negative': transaction.runningBalance < 0}">
                {{ transaction.runningBalance | number:'1.2-2' }}
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="reportData.transactions.length === 0" class="no-data-message">
          <p>لا توجد حركات لهذا الحساب في الفترة المحددة.</p>
        </div>
      </div>
    </div>
  `,
  // 6. الأنماط المضمنة (Inline Styles)
  styles: [`
    .report-container {
      padding: 20px;
      font-family: 'Arial', sans-serif;
      direction: rtl; /* دعم اللغة العربية */
      text-align: right;
    }
    .title {
      color: #0056b3;
      border-bottom: 2px solid #eee;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    .filter-section {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      align-items: center;
    }
    .input-field {
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      flex-grow: 1;
    }
    .btn-primary {
      padding: 8px 15px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
    }
    .btn-primary:disabled {
      background-color: #a0c0e0;
      cursor: not-allowed;
    }
    .loading-message, .error-message, .no-data-message {
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 15px;
    }
    .loading-message {
      background-color: #e9f7fe;
      color: #007bff;
    }
    .error-message {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
    .balance-summary {
      display: flex;
      justify-content: space-around;
      background-color: #f4f4f4;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 20px;
    }
    .movement-table {
      width: 100%;
      border-collapse: collapse;
      text-align: right;
    }
    .movement-table th, .movement-table td {
      border: 1px solid #ddd;
      padding: 10px;
    }
    .movement-table th {
      background-color: #f2f2f2;
      font-weight: bold;
    }
    .debit {
      color: #dc3545; /* أحمر للمدين */
    }
    .credit {
      color: #28a745; /* أخضر للدائن */
    }
    .positive {
      font-weight: bold;
      color: #28a745;
    }
    .negative {
      font-weight: bold;
      color: #dc3545;
    }
  `]
})
export class AccountMovementReportComponent implements OnInit {
  // 7. تعليقات بالعربية
  // 2. بيانات التقرير، حالة التحميل، والخطأ
  reportData: AccountMovementReport | null = null;
  loading = false;
  error: string | null = null;

  // مرشحات التقرير الافتراضية
  filter: AccountMovementFilter = {
    accountId: '10101', // مثال: حساب الصندوق
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0], // شهر سابق
    endDate: new Date().toISOString().split('T')[0], // تاريخ اليوم
  };

  // 2. استخدام HttpClient للاتصال بالـ Backend
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // تحميل التقرير عند تهيئة المكون بالمرشحات الافتراضية
    this.loadReport();
  }

  /**
   * جلب بيانات تقرير حركة الحساب من الـ Backend
   */
  async loadReport(): Promise<void> {
    // التحقق من وجود معرف الحساب
    if (!this.filter.accountId) {
      this.error = 'الرجاء إدخال معرف الحساب.';
      return;
    }

    this.loading = true;
    this.error = null;
    this.reportData = null;

    // بناء معاملات الاستعلام (Query Parameters)
    let params = new HttpParams()
      .set('accountId', this.filter.accountId)
      .set('startDate', this.filter.startDate)
      .set('endDate', this.filter.endDate);

    // نقطة نهاية الـ API (يجب تعديلها لتناسب الـ Backend الفعلي)
    const apiUrl = '/api/accounting/account-movement-report';

    try {
      // استخدام lastValueFrom لتحويل Observable إلى Promise
      const response = await lastValueFrom(
        this.http.get<ApiResponse>(apiUrl, { params })
      );

      if (response.success && response.data) {
        this.reportData = response.data;
      } else {
        // 4. معالجة الأخطاء من استجابة الـ API
        this.error = response.message || 'فشل في جلب التقرير من الخادم.';
      }

    } catch (err) {
      // 4. معالجة أخطاء الاتصال بالشبكة أو الخادم
      console.error('خطأ في الاتصال بالخادم:', err);
      if (err instanceof HttpErrorResponse) {
        this.error = `خطأ في الخادم: ${err.status} - ${err.message}`;
      } else {
        this.error = 'حدث خطأ غير متوقع أثناء جلب البيانات.';
      }
    } finally {
      // 5. إيقاف حالة التحميل
      this.loading = false;
    }
  }
}
