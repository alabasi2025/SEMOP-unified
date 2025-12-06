import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, finalize, firstValueFrom, throwError } from 'rxjs';

// واجهة لتمثيل قيد واحد في دفتر الأستاذ العام
interface GeneralLedgerEntry {
  // تاريخ الحركة
  date: string;
  // وصف الحركة (مثلاً: فاتورة رقم 123، قيد يومية)
  description: string;
  // رقم القيد أو المستند
  documentNumber: string;
  // المبلغ المدين
  debit: number;
  // المبلغ الدائن
  credit: number;
  // الرصيد الجاري بعد هذه الحركة
  runningBalance: number;
}

// واجهة لتمثيل معلومات الحساب
interface AccountInfo {
  // معرف الحساب
  accountId: string;
  // اسم الحساب
  accountName: string;
  // الرصيد الافتتاحي
  initialBalance: number;
}

// واجهة لتمثيل استجابة API لدفتر الأستاذ العام
interface GeneralLedgerResponse {
  // معلومات الحساب
  account: AccountInfo;
  // قائمة القيود/الحركات
  entries: GeneralLedgerEntry[];
}

@Component({
  selector: 'app-general-ledger',
  template: `
    <div class="ledger-container">
      <!-- عنوان الصفحة -->
      <h2>دفتر الأستاذ العام</h2>

      <!-- شريط الفلترة والتحكم -->
      <div class="controls-bar">
        <!-- حقل اختيار الحساب (افتراضيًا نستخدم حقل إدخال بسيط) -->
        <input type="text" [(ngModel)]="selectedAccountId" placeholder="أدخل رقم الحساب" />
        
        <!-- حقول اختيار الفترة -->
        <input type="date" [(ngModel)]="startDate" placeholder="من تاريخ" />
        <input type="date" [(ngModel)]="endDate" placeholder="إلى تاريخ" />
        
        <!-- زر التحميل/التطبيق -->
        <button (click)="loadLedger()" [disabled]="loading || !selectedAccountId">
          <span *ngIf="loading">جاري التحميل...</span>
          <span *ngIf="!loading">عرض الدفتر</span>
        </button>

        <!-- أزرار التصدير -->
        <button (click)="exportToPdf()" [disabled]="!entries.length || loading">تصدير PDF</button>
        <button (click)="exportToExcel()" [disabled]="!entries.length || loading">تصدير Excel</button>
      </div>

      <!-- حالة التحميل -->
      <div *ngIf="loading" class="loading-state">
        <p>جاري تحميل بيانات دفتر الأستاذ للحساب {{ selectedAccountId }}...</p>
      </div>

      <!-- حالة الخطأ -->
      <div *ngIf="error" class="error-state">
        <p>حدث خطأ أثناء تحميل البيانات: {{ error }}</p>
        <button (click)="error = null; loadLedger()">إعادة المحاولة</button>
      </div>

      <!-- عرض البيانات -->
      <div *ngIf="!loading && !error && accountInfo">
        <!-- معلومات الحساب -->
        <div class="account-summary">
          <h3>الحساب: {{ accountInfo.accountName }} ({{ accountInfo.accountId }})</h3>
          <p>الرصيد الافتتاحي: {{ accountInfo.initialBalance | number: '1.2-2' }}</p>
          <p>الرصيد النهائي: {{ runningTotal | number: '1.2-2' }}</p>
        </div>

        <!-- جدول الحركات -->
        <table class="ledger-table">
          <thead>
            <tr>
              <th>التاريخ</th>
              <th>الوصف</th>
              <th>رقم المستند</th>
              <th>مدين</th>
              <th>دائن</th>
              <th>الرصيد الجاري</th>
            </tr>
          </thead>
          <tbody>
            <!-- عرض الرصيد الافتتاحي كقيد وهمي -->
            <tr class="initial-balance-row">
              <td></td>
              <td>الرصيد الافتتاحي</td>
              <td></td>
              <td></td>
              <td></td>
              <td>{{ accountInfo.initialBalance | number: '1.2-2' }}</td>
            </tr>
            <!-- تكرار القيود -->
            <tr *ngFor="let entry of entries">
              <td>{{ entry.date }}</td>
              <td>{{ entry.description }}</td>
              <td>{{ entry.documentNumber }}</td>
              <td class="debit">{{ entry.debit | number: '1.2-2' }}</td>
              <td class="credit">{{ entry.credit | number: '1.2-2' }}</td>
              <td [class.negative]="entry.runningBalance < 0">{{ entry.runningBalance | number: '1.2-2' }}</td>
            </tr>
          </tbody>
        </table>
        
        <!-- حالة عدم وجود بيانات -->
        <div *ngIf="!entries.length" class="no-data-state">
          <p>لا توجد حركات لهذا الحساب في الفترة المحددة.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ledger-container {
      padding: 20px;
      font-family: 'Arial', sans-serif;
      direction: rtl; /* لدعم اللغة العربية */
      text-align: right;
    }
    .controls-bar {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      align-items: center;
    }
    .controls-bar input, .controls-bar button {
      padding: 8px 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .controls-bar button {
      cursor: pointer;
      background-color: #007bff;
      color: white;
      border: none;
      transition: background-color 0.3s;
    }
    .controls-bar button:hover:not([disabled]) {
      background-color: #0056b3;
    }
    .controls-bar button[disabled] {
      background-color: #a0c8ff;
      cursor: not-allowed;
    }
    .loading-state, .error-state, .no-data-state {
      padding: 15px;
      margin-top: 15px;
      border-radius: 4px;
      text-align: center;
    }
    .loading-state {
      background-color: #e9f7ef;
      color: #0e7041;
    }
    .error-state {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
    .account-summary {
      background-color: #f4f4f4;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 20px;
      border-right: 5px solid #007bff;
    }
    .ledger-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      font-size: 14px;
    }
    .ledger-table th, .ledger-table td {
      border: 1px solid #ddd;
      padding: 10px;
      text-align: right;
    }
    .ledger-table th {
      background-color: #f2f2f2;
      font-weight: bold;
    }
    .debit {
      color: #d9534f; /* أحمر للمدين */
      font-weight: bold;
    }
    .credit {
      color: #5cb85c; /* أخضر للدائن */
      font-weight: bold;
    }
    .negative {
      color: #d9534f; /* الرصيد السالب باللون الأحمر */
    }
    .initial-balance-row {
      background-color: #e6f7ff;
      font-weight: bold;
    }
  `]
})
export class GeneralLedgerComponent implements OnInit {
  // معلومات الحساب المعروضة
  accountInfo: AccountInfo | null = null;
  // قائمة قيود دفتر الأستاذ
  entries: GeneralLedgerEntry[] = [];
  // حالة التحميل
  loading = false;
  // رسالة الخطأ
  error: string | null = null;
  // رقم الحساب المحدد للفلترة
  selectedAccountId: string = '';
  // تاريخ بداية الفترة للفلترة
  startDate: string = '';
  // تاريخ نهاية الفترة للفلترة
  endDate: string = '';
  // الرصيد الجاري النهائي
  runningTotal: number = 0;

  // نقطة نهاية API لدفتر الأستاذ العام
  private readonly API_URL = '/api/accounting/general-ledger';
  // نقطة نهاية API للتصدير
  private readonly EXPORT_API_URL = '/api/accounting/general-ledger/export';

  // حقن خدمة HttpClient
  constructor(private http: HttpClient) {}

  // عند تهيئة المكون
  ngOnInit(): void {
    // يمكن هنا تحميل قائمة الحسابات المتاحة أو تعيين قيمة افتراضية
    // this.loadDefaultAccount();
  }

  /**
   * تحميل بيانات دفتر الأستاذ العام للحساب المحدد والفترة الزمنية.
   */
  async loadLedger(): Promise<void> {
    // التحقق من وجود رقم حساب محدد
    if (!this.selectedAccountId) {
      this.error = 'الرجاء إدخال رقم الحساب أولاً.';
      return;
    }

    this.loading = true;
    this.error = null;
    this.entries = [];
    this.accountInfo = null;
    this.runningTotal = 0;

    // بناء معاملات الاستعلام (Query Parameters)
    let params = new HttpParams()
      .set('accountId', this.selectedAccountId);
    
    if (this.startDate) {
      params = params.set('startDate', this.startDate);
    }
    if (this.endDate) {
      params = params.set('endDate', this.endDate);
    }

    try {
      // استخدام firstValueFrom لتحويل Observable إلى Promise
      const response = await firstValueFrom(
        this.http.get<GeneralLedgerResponse>(this.API_URL, { params }).pipe(
          // معالجة الأخطاء
          catchError(err => {
            console.error('خطأ في تحميل دفتر الأستاذ:', err);
            // إرجاع خطأ يمكن معالجته في try/catch
            return throwError(() => new Error(err.message || 'فشل تحميل بيانات دفتر الأستاذ.'));
          }),
          // إيقاف حالة التحميل بغض النظر عن النتيجة
          finalize(() => this.loading = false)
        )
      );

      // تحديث حالة المكون بالبيانات المسترجعة
      this.accountInfo = response.account;
      this.entries = response.entries;
      
      // حساب الرصيد الجاري النهائي
      if (this.entries.length > 0) {
        this.runningTotal = this.entries[this.entries.length - 1].runningBalance;
      } else if (this.accountInfo) {
        this.runningTotal = this.accountInfo.initialBalance;
      }

    } catch (err) {
      // عرض رسالة الخطأ
      this.error = (err as Error).message;
      this.loading = false; // للتأكد من إيقاف التحميل في حالة الخطأ
    }
  }

  /**
   * تصدير بيانات دفتر الأستاذ إلى ملف PDF.
   */
  exportToPdf(): void {
    if (!this.entries.length || this.loading) return;

    this.loading = true;
    this.error = null;

    // بناء معاملات الاستعلام (Query Parameters) للتصدير
    let params = new HttpParams()
      .set('accountId', this.selectedAccountId)
      .set('format', 'pdf');
    
    if (this.startDate) {
      params = params.set('startDate', this.startDate);
    }
    if (this.endDate) {
      params = params.set('endDate', this.endDate);
    }

    // طلب التصدير من الـ Backend
    this.http.get(this.EXPORT_API_URL, { params, responseType: 'blob' as 'json' })
      .pipe(
        catchError(err => {
          console.error('خطأ في تصدير PDF:', err);
          this.error = 'فشل في تصدير ملف PDF.';
          return throwError(() => new Error('Export failed'));
        }),
        finalize(() => this.loading = false)
      )
      .subscribe((response: any) => {
        // إنشاء رابط لتنزيل الملف
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = \`دفتر-الأستاذ-\${this.selectedAccountId}.pdf\`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      });
  }

  /**
   * تصدير بيانات دفتر الأستاذ إلى ملف Excel.
   */
  exportToExcel(): void {
    if (!this.entries.length || this.loading) return;

    this.loading = true;
    this.error = null;

    // بناء معاملات الاستعلام (Query Parameters) للتصدير
    let params = new HttpParams()
      .set('accountId', this.selectedAccountId)
      .set('format', 'excel');
    
    if (this.startDate) {
      params = params.set('startDate', this.startDate);
    }
    if (this.endDate) {
      params = params.set('endDate', this.endDate);
    }

    // طلب التصدير من الـ Backend
    this.http.get(this.EXPORT_API_URL, { params, responseType: 'blob' as 'json' })
      .pipe(
        catchError(err => {
          console.error('خطأ في تصدير Excel:', err);
          this.error = 'فشل في تصدير ملف Excel.';
          return throwError(() => new Error('Export failed'));
        }),
        finalize(() => this.loading = false)
      )
      .subscribe((response: any) => {
        // إنشاء رابط لتنزيل الملف
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = \`دفتر-الأستاذ-\${this.selectedAccountId}.xlsx\`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      });
  }
}
