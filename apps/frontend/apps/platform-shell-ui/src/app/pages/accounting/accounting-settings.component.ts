import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';

/**
 * واجهة لنموذج بيانات إعدادات المحاسبة
 * تشمل العملة الأساسية، والسنة المالية الحالية، وإعدادات افتراضية.
 */
interface AccountingSettings {
  // العملة الأساسية للنظام (مثل SAR, USD)
  baseCurrency: string;
  // السنة المالية الحالية (مثلاً 2024)
  currentFiscalYear: number;
  // إعداد افتراضي عام (يمكن أن يكون أكثر تفصيلاً حسب الحاجة)
  useDefaultSettings: boolean;
}

@Component({
  selector: 'app-accounting-settings',
  // القالب المضمن (Inline Template)
  template: `
    <div class="settings-container">
      <h2>إعدادات المحاسبة</h2>

      <!-- حالة التحميل -->
      <div *ngIf="loading" class="loading-message">
        <p>جاري تحميل الإعدادات... الرجاء الانتظار.</p>
      </div>

      <!-- حالة الخطأ -->
      <div *ngIf="error" class="error-message">
        <p><strong>خطأ في النظام:</strong> {{ error }}</p>
        <button (click)="loadSettings()" class="retry-button">إعادة المحاولة</button>
      </div>

      <!-- نموذج الإعدادات -->
      <div *ngIf="!loading && !error && settings" class="settings-form">
        <form (ngSubmit)="saveSettings()">
          <!-- حقل العملة الأساسية -->
          <div class="form-group">
            <label for="baseCurrency">العملة الأساسية:</label>
            <input id="baseCurrency" type="text" [(ngModel)]="settings.baseCurrency" name="baseCurrency" required>
          </div>

          <!-- حقل السنة المالية الحالية -->
          <div class="form-group">
            <label for="fiscalYear">السنة المالية الحالية:</label>
            <input id="fiscalYear" type="number" [(ngModel)]="settings.currentFiscalYear" name="currentFiscalYear" required>
          </div>

          <!-- حقل الإعدادات الافتراضية -->
          <div class="form-group checkbox-group">
            <input id="defaultSettings" type="checkbox" [(ngModel)]="settings.useDefaultSettings" name="useDefaultSettings">
            <label for="defaultSettings">استخدام الإعدادات الافتراضية</label>
          </div>

          <!-- زر الحفظ -->
          <button type="submit" [disabled]="loading" class="save-button">
            {{ loading ? 'جاري الحفظ...' : 'حفظ الإعدادات' }}
          </button>
        </form>
      </div>
    </div>
  `,
  // الأنماط المضمنة (Inline Styles)
  styles: [`
    .settings-container {
      max-width: 600px;
      margin: 40px auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      direction: rtl; /* لدعم اللغة العربية */
      text-align: right;
    }
    h2 {
      border-bottom: 2px solid #eee;
      padding-bottom: 10px;
      margin-bottom: 20px;
      color: #333;
    }
    .form-group {
      margin-bottom: 15px;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: #555;
    }
    input[type="text"], input[type="number"] {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
    }
    .checkbox-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .checkbox-group label {
      margin-bottom: 0;
      font-weight: normal;
    }
    .save-button {
      background-color: #007bff;
      color: white;
      padding: 10px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      transition: background-color 0.3s;
    }
    .save-button:hover:not([disabled]) {
      background-color: #0056b3;
    }
    .save-button[disabled] {
      background-color: #a0c3e8;
      cursor: not-allowed;
    }
    .loading-message, .error-message {
      padding: 15px;
      margin-bottom: 20px;
      border-radius: 4px;
    }
    .loading-message {
      background-color: #e9f7ef;
      color: #0e7041;
    }
    .error-message {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
    .retry-button {
      background-color: #dc3545;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 10px;
    }
  `]
})
export class AccountingSettingsComponent implements OnInit {
  // متغير لتخزين إعدادات المحاسبة
  settings: AccountingSettings | null = null;
  // متغير لتتبع حالة التحميل (Loading state)
  loading: boolean = false;
  // متغير لتخزين رسالة الخطأ في حال حدوثه
  error: string | null = null;
  // المسار الأساسي لواجهة برمجة التطبيقات (API)
  private apiUrl = '/api/accounting/settings';

  /**
   * المُنشئ (Constructor)
   * يتم حقن خدمة HttpClient للاتصال بالخلفية (Backend).
   * @param http خدمة HttpClient
   */
  constructor(private http: HttpClient) {}

  /**
   * دورة حياة ngOnInit
   * يتم استدعاؤها عند تهيئة المكون، وتستخدم لتحميل الإعدادات الأولية.
   */
  ngOnInit(): void {
    this.loadSettings();
  }

  /**
   * معالج الأخطاء الخاص بطلبات HTTP
   * @param error استجابة الخطأ من HTTP
   * @returns Observable يحتوي على خطأ يمكن معالجته
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    this.loading = false;
    if (error.error instanceof ErrorEvent) {
      // خطأ من جانب العميل أو الشبكة
      this.error = 'حدث خطأ في الشبكة أو المتصفح.';
      console.error('An error occurred:', error.error.message);
    } else {
      // خطأ من جانب الخادم (Backend)
      this.error = `خطأ في الخادم: ${error.status} - ${error.error?.message || error.statusText}`;
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // إرجاع Observable يرمي الخطأ
    return throwError(() => new Error(this.error!));
  }

  /**
   * تحميل إعدادات المحاسبة من الخادم (Backend)
   */
  loadSettings(): void {
    this.loading = true;
    this.error = null; // مسح أي أخطاء سابقة

    this.http.get<AccountingSettings>(this.apiUrl)
      .pipe(
        // معالجة الأخطاء باستخدام الدالة المساعدة
        catchError(this.handleError.bind(this))
      )
      .subscribe({
        next: (data) => {
          // نجاح التحميل
          this.settings = data;
          this.loading = false;
        },
        error: (err) => {
          // يتم التعامل مع الخطأ في handleError، ولكن هذا للتأكد من إيقاف التحميل
          this.loading = false;
          // لا حاجة لتعيين this.error هنا لأن handleError قامت بذلك
        }
      });
  }

  /**
   * حفظ إعدادات المحاسبة المحدثة إلى الخادم (Backend)
   */
  saveSettings(): void {
    if (!this.settings) {
      this.error = 'لا توجد إعدادات لحفظها.';
      return;
    }

    this.loading = true;
    this.error = null; // مسح أي أخطاء سابقة

    // استخدام طلب PUT لتحديث المورد
    this.http.put<AccountingSettings>(this.apiUrl, this.settings)
      .pipe(
        // معالجة الأخطاء
        catchError(this.handleError.bind(this))
      )
      .subscribe({
        next: (data) => {
          // نجاح الحفظ
          this.settings = data; // تحديث الإعدادات بالاستجابة الجديدة (إذا كان الخادم يعيدها)
          this.loading = false;
          alert('تم حفظ الإعدادات بنجاح!'); // رسالة تأكيد بسيطة
        },
        error: (err) => {
          // يتم التعامل مع الخطأ في handleError
          this.loading = false;
        }
      });
  }
}
