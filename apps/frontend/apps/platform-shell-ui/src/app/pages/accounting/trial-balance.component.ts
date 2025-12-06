import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

// 1. تعريف واجهة لمدخل ميزان المراجعة
interface TrialBalanceEntry {
  // رقم الحساب
  accountNumber: string;
  // اسم الحساب
  accountName: string;
  // الرصيد المدين
  debit: number;
  // الرصيد الدائن
  credit: number;
}

// 2. تعريف واجهة لبيانات ميزان المراجعة (البيانات التي يتوقع استقبالها من الـ Backend)
interface TrialBalanceData {
  entries: TrialBalanceEntry[];
  // يمكن أن يرسل الـ Backend الإجماليات، لكن سنقوم بحسابها محلياً للتحقق
}

@Component({
  selector: 'app-trial-balance',
  // استخدام القالب المضمن (Inline Template)
  template: `
    <div class="trial-balance-container">
      <!-- عنوان المكون -->
      <h2>ميزان المراجعة</h2>

      <!-- حالة التحميل -->
      <div *ngIf="loading" class="loading-state">
        <p>جاري تحميل بيانات ميزان المراجعة... الرجاء الانتظار.</p>
      </div>

      <!-- رسالة الخطأ -->
      <div *ngIf="error" class="error-state">
        <p><strong>خطأ في التحميل:</strong> {{ error }}</p>
        <button (click)="loadTrialBalance()">إعادة المحاولة</button>
      </div>

      <!-- عرض البيانات بعد التحميل بنجاح -->
      <div *ngIf="!loading && !error">
        <!-- زر التصدير -->
        <button (click)="exportData()" class="export-button" [disabled]="entries.length === 0">
          تصدير إلى Excel
        </button>

        <!-- جدول ميزان المراجعة -->
        <table class="trial-balance-table">
          <thead>
            <tr>
              <th>رقم الحساب</th>
              <th>اسم الحساب</th>
              <th class="debit">مدين</th>
              <th class="credit">دائن</th>
            </tr>
          </thead>
          <tbody>
            <!-- عرض مدخلات الحسابات -->
            <tr *ngFor="let entry of entries">
              <td>{{ entry.accountNumber }}</td>
              <td>{{ entry.accountName }}</td>
              <td class="debit">{{ entry.debit | number:'1.2-2' }}</td>
              <td class="credit">{{ entry.credit | number:'1.2-2' }}</td>
            </tr>
          </tbody>
          <tfoot>
            <!-- صف الإجماليات -->
            <tr class="totals-row">
              <td colspan="2"><strong>الإجمالي</strong></td>
              <td class="debit"><strong>{{ totalDebit | number:'1.2-2' }}</strong></td>
              <td class="credit"><strong>{{ totalCredit | number:'1.2-2' }}</strong></td>
            </tr>
            <!-- صف التحقق من التوازن -->
            <tr class="balance-check-row">
              <td colspan="4" [class.balanced]="isBalanced" [class.unbalanced]="!isBalanced">
                <strong>حالة التوازن:</strong>
                {{ isBalanced ? 'متوازن' : 'غير متوازن' }}
                <span *ngIf="!isBalanced"> (الفرق: {{ Math.abs(totalDebit - totalCredit) | number:'1.2-2' }})</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  `,
  // استخدام الأنماط المضمنة (Inline Styles)
  styles: [`
    .trial-balance-container {
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
      margin-bottom: 15px;
      border-radius: 4px;
    }
    .loading-state {
      background-color: #f0f8ff;
      color: #0056b3;
    }
    .error-state {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
    .trial-balance-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      box-shadow: 0 2px 3px rgba(0,0,0,0.1);
    }
    .trial-balance-table th, .trial-balance-table td {
      border: 1px solid #ddd;
      padding: 12px 8px;
      text-align: right;
    }
    .trial-balance-table th {
      background-color: #f2f2f2;
      color: #555;
      font-weight: bold;
    }
    .trial-balance-table tbody tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    .debit, .credit {
      text-align: center;
      width: 15%;
    }
    .totals-row td {
      background-color: #e9ecef;
      font-size: 1.1em;
    }
    .balance-check-row td {
      text-align: center !important;
      font-weight: bold;
      padding: 15px;
    }
    .balanced {
      background-color: #d4edda;
      color: #155724;
    }
    .unbalanced {
      background-color: #f8d7da;
      color: #721c24;
    }
    .export-button {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 4px;
      cursor: pointer;
      margin-bottom: 15px;
      transition: background-color 0.3s;
    }
    .export-button:hover:not([disabled]) {
      background-color: #0056b3;
    }
    .export-button[disabled] {
      background-color: #cccccc;
      cursor: not-allowed;
    }
  `]
})
export class TrialBalanceComponent implements OnInit {
  // 3. تعريف الخصائص وحالات المكون
  // قائمة مدخلات ميزان المراجعة
  entries: TrialBalanceEntry[] = [];
  // حالة التحميل
  loading: boolean = false;
  // رسالة الخطأ
  error: string | null = null;
  // إجمالي الرصيد المدين
  totalDebit: number = 0;
  // إجمالي الرصيد الدائن
  totalCredit: number = 0;
  // حالة التوازن (هل الإجمالي المدين يساوي الإجمالي الدائن)
  isBalanced: boolean = false;

  // 4. حقن خدمة HttpClient
  constructor(private http: HttpClient) {}

  // 5. دورة حياة المكون: يتم استدعاؤها عند تهيئة المكون
  ngOnInit(): void {
    this.loadTrialBalance();
  }

  // 6. دالة تحميل بيانات ميزان المراجعة من الـ Backend
  loadTrialBalance(): void {
    // إعادة تعيين الحالات
    this.loading = true;
    this.error = null;
    this.entries = [];
    this.totalDebit = 0;
    this.totalCredit = 0;
    this.isBalanced = false;

    // نقطة نهاية API (يجب تعديلها لتناسب مسار الـ Backend الفعلي)
    const apiUrl = '/api/accounting/trial-balance';

    // استخدام HttpClient لجلب البيانات
    this.http.get<TrialBalanceData>(apiUrl)
      .pipe(
        // معالجة الأخطاء باستخدام RxJS
        catchError(this.handleError)
      )
      .subscribe({
        next: (data: TrialBalanceData) => {
          // في حالة النجاح
          this.entries = data.entries;
          this.calculateTotals();
          this.loading = false;
        },
        error: (err) => {
          // يتم التعامل مع الخطأ هنا بعد معالجته في دالة handleError
          this.error = err;
          this.loading = false;
        }
      });
  }

  // 7. دالة معالجة أخطاء الاتصال بالـ Backend
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'حدث خطأ غير معروف!';
    if (error.error instanceof ErrorEvent) {
      // خطأ من جانب العميل أو الشبكة
      errorMessage = `خطأ: ${error.error.message}`;
    } else {
      // خطأ من جانب الخادم
      errorMessage = `رمز الخطأ: ${error.status}, الرسالة: ${error.message}`;
    }
    console.error(errorMessage);
    // إرجاع رسالة الخطأ ليتم التعامل معها في subscribe
    return throwError(() => errorMessage);
  }

  // 8. دالة حساب الإجماليات والتحقق من التوازن
  calculateTotals(): void {
    this.totalDebit = this.entries.reduce((sum, entry) => sum + entry.debit, 0);
    this.totalCredit = this.entries.reduce((sum, entry) => sum + entry.credit, 0);
    // التحقق من التوازن مع مراعاة الأخطاء العشرية الصغيرة
    this.isBalanced = Math.abs(this.totalDebit - this.totalCredit) < 0.01;
  }

  // 9. دالة تصدير البيانات (وظيفة وهمية)
  exportData(): void {
    if (this.entries.length > 0) {
      // منطق تصدير البيانات إلى ملف (مثل CSV أو Excel)
      console.log('جاري تصدير بيانات ميزان المراجعة...');
      alert('تم طلب تصدير ميزان المراجعة. (هذه وظيفة وهمية)');
    }
  }
}
