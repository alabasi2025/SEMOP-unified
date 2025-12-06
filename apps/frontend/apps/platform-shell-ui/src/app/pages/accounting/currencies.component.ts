import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';

// واجهة لتمثيل بيانات العملة
interface Currency {
  id: number | null;
  name_ar: string; // اسم العملة بالعربية
  name_en: string; // اسم العملة بالإنجليزية
  code: string; // رمز العملة (مثل USD)
  symbol: string; // علامة العملة (مثل $)
  is_base: boolean; // هل هي العملة الأساسية للنظام
  is_active: boolean; // هل العملة نشطة
}

// واجهة لتمثيل سعر الصرف
interface ExchangeRate {
  id: number;
  from_currency_code: string; // رمز العملة المصدر
  to_currency_code: string; // رمز العملة الهدف (عادةً العملة الأساسية)
  rate: number; // سعر الصرف
  last_updated: string; // تاريخ آخر تحديث
}

@Component({
  selector: 'app-currencies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>إدارة العملات وأسعار الصرف</h2>
      
      <!-- حالة التحميل -->
      <div *ngIf="loading" class="loading-indicator">
        <p>جاري تحميل البيانات...</p>
      </div>

      <!-- رسالة الخطأ -->
      <div *ngIf="error" class="error-message">
        <p><strong>خطأ:</strong> {{ error }}</p>
      </div>

      <!-- جدول العملات -->
      <div *ngIf="!loading && !error">
        <h3>قائمة العملات</h3>
        <button (click)="openCurrencyForm()" class="btn-primary">إضافة عملة جديدة</button>
        
        <table class="data-table">
          <thead>
            <tr>
              <th>الرمز</th>
              <th>الاسم (عربي)</th>
              <th>الاسم (إنجليزي)</th>
              <th>الرمز</th>
              <th>أساسية</th>
              <th>نشطة</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let currency of currencies">
              <td>{{ currency.code }}</td>
              <td>{{ currency.name_ar }}</td>
              <td>{{ currency.name_en }}</td>
              <td>{{ currency.symbol }}</td>
              <td>{{ currency.is_base ? 'نعم' : 'لا' }}</td>
              <td>{{ currency.is_active ? 'نعم' : 'لا' }}</td>
              <td>
                <button (click)="editCurrency(currency)" class="btn-secondary">تعديل</button>
                <button (click)="deleteCurrency(currency.id!)" class="btn-danger" [disabled]="currency.is_base">حذف</button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- نموذج إضافة/تعديل عملة -->
        <div *ngIf="showCurrencyForm" class="form-container">
          <h4>{{ editingCurrency.id ? 'تعديل العملة' : 'إضافة عملة جديدة' }}</h4>
          <form (ngSubmit)="saveCurrency()">
            <label>الرمز (Code): <input type="text" [(ngModel)]="editingCurrency.code" name="code" required></label>
            <label>الاسم (عربي): <input type="text" [(ngModel)]="editingCurrency.name_ar" name="name_ar" required></label>
            <label>الاسم (إنجليزي): <input type="text" [(ngModel)]="editingCurrency.name_en" name="name_en" required></label>
            <label>الرمز (Symbol): <input type="text" [(ngModel)]="editingCurrency.symbol" name="symbol" required></label>
            <label>
              <input type="checkbox" [(ngModel)]="editingCurrency.is_active" name="is_active"> نشطة
            </label>
            <button type="submit" class="btn-primary" [disabled]="saving">{{ saving ? 'جاري الحفظ...' : 'حفظ' }}</button>
            <button type="button" (click)="cancelCurrencyForm()" class="btn-secondary">إلغاء</button>
          </form>
        </div>

        <!-- جدول أسعار الصرف -->
        <h3>أسعار الصرف (مقابل العملة الأساسية)</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>العملة</th>
              <th>سعر الصرف</th>
              <th>آخر تحديث</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let rate of exchangeRates">
              <td>{{ rate.from_currency_code }}</td>
              <td>
                <input type="number" [(ngModel)]="rate.rate" [ngModelOptions]="{standalone: true}" step="0.0001">
              </td>
              <td>{{ rate.last_updated | date: 'short' }}</td>
              <td>
                <button (click)="updateExchangeRate(rate)" class="btn-primary">تحديث</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .container { 
      padding: 20px; 
      font-family: 'Arial', sans-serif;
      direction: rtl; /* دعم اللغة العربية */
      text-align: right;
    }
    h2, h3 { 
      color: #333; 
      border-bottom: 2px solid #eee;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    .loading-indicator { 
      padding: 15px; 
      background-color: #f0f8ff; 
      border: 1px solid #bfe0ff; 
      color: #0056b3;
      text-align: center;
    }
    .error-message { 
      padding: 15px; 
      background-color: #ffe0e0; 
      border: 1px solid #ffb3b3; 
      color: #cc0000;
      text-align: center;
    }
    .data-table { 
      width: 100%; 
      border-collapse: collapse; 
      margin-top: 15px;
    }
    .data-table th, .data-table td { 
      border: 1px solid #ddd; 
      padding: 8px; 
      text-align: right;
    }
    .data-table th { 
      background-color: #f2f2f2; 
      color: #555;
    }
    .btn-primary, .btn-secondary, .btn-danger {
      padding: 8px 12px;
      margin: 5px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    .btn-primary { background-color: #007bff; color: white; }
    .btn-primary:hover { background-color: #0056b3; }
    .btn-secondary { background-color: #6c757d; color: white; }
    .btn-secondary:hover { background-color: #5a6268; }
    .btn-danger { background-color: #dc3545; color: white; }
    .btn-danger:hover { background-color: #bd2130; }
    .form-container {
      margin-top: 20px;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
      background-color: #f9f9f9;
    }
    .form-container label {
      display: block;
      margin-bottom: 10px;
      font-weight: bold;
    }
    .form-container input[type="text"], .form-container input[type="number"] {
      width: 100%;
      padding: 8px;
      margin-top: 5px;
      box-sizing: border-box;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .form-container input[type="checkbox"] {
      margin-left: 5px;
    }
  `]
})
export class CurrenciesComponent implements OnInit {
  // قائمة العملات
  currencies: Currency[] = [];
  // قائمة أسعار الصرف
  exchangeRates: ExchangeRate[] = [];
  // حالة التحميل
  loading = false;
  // رسالة الخطأ
  error: string | null = null;
  // حالة عرض نموذج العملة
  showCurrencyForm = false;
  // العملة التي يتم تعديلها/إضافتها
  editingCurrency: Currency = {
    id: null,
    name_ar: '',
    name_en: '',
    code: '',
    symbol: '',
    is_base: false,
    is_active: true,
  };
  // حالة الحفظ
  saving = false;

  // نقطة نهاية API
  private apiUrl = '/api/accounting/currencies';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // تحميل البيانات عند تهيئة المكون
    this.loadData();
  }

  /**
   * تحميل قائمة العملات وأسعار الصرف
   */
  async loadData(): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      // تحميل العملات
      const currenciesPromise = lastValueFrom(this.http.get<Currency[]>(this.apiUrl));
      // تحميل أسعار الصرف
      const ratesPromise = lastValueFrom(this.http.get<ExchangeRate[]>(`${this.apiUrl}/rates`));

      const [currencies, rates] = await Promise.all([currenciesPromise, ratesPromise]);
      
      this.currencies = currencies;
      this.exchangeRates = rates;

    } catch (err) {
      this.handleError(err, 'فشل في تحميل بيانات العملات وأسعار الصرف');
    } finally {
      this.loading = false;
    }
  }

  /**
   * فتح نموذج إضافة عملة جديدة
   */
  openCurrencyForm(): void {
    this.editingCurrency = {
      id: null,
      name_ar: '',
      name_en: '',
      code: '',
      symbol: '',
      is_base: false,
      is_active: true,
    };
    this.showCurrencyForm = true;
  }

  /**
   * تعبئة النموذج لتعديل عملة موجودة
   * @param currency بيانات العملة المراد تعديلها
   */
  editCurrency(currency: Currency): void {
    // استخدام Spread Operator لعمل نسخة لتجنب التعديل المباشر على البيانات
    this.editingCurrency = { ...currency };
    this.showCurrencyForm = true;
  }

  /**
   * إلغاء عملية الإضافة/التعديل وإخفاء النموذج
   */
  cancelCurrencyForm(): void {
    this.showCurrencyForm = false;
  }

  /**
   * حفظ (إضافة أو تعديل) العملة
   */
  async saveCurrency(): Promise<void> {
    this.saving = true;
    this.error = null;
    try {
      if (this.editingCurrency.id) {
        // عملية تعديل (Update)
        await lastValueFrom(this.http.put(`${this.apiUrl}/${this.editingCurrency.id}`, this.editingCurrency));
        alert('تم تعديل العملة بنجاح.');
      } else {
        // عملية إضافة (Create)
        await lastValueFrom(this.http.post(this.apiUrl, this.editingCurrency));
        alert('تم إضافة العملة بنجاح.');
      }
      
      this.showCurrencyForm = false;
      await this.loadData(); // إعادة تحميل البيانات
      
    } catch (err) {
      this.handleError(err, 'فشل في حفظ بيانات العملة');
    } finally {
      this.saving = false;
    }
  }

  /**
   * حذف عملة
   * @param id معرف العملة المراد حذفها
   */
  async deleteCurrency(id: number): Promise<void> {
    if (!confirm('هل أنت متأكد من حذف هذه العملة؟')) {
      return;
    }
    this.loading = true;
    this.error = null;
    try {
      // عملية حذف (Delete)
      await lastValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
      alert('تم حذف العملة بنجاح.');
      await this.loadData(); // إعادة تحميل البيانات
    } catch (err) {
      this.handleError(err, 'فشل في حذف العملة');
    } finally {
      this.loading = false;
    }
  }

  /**
   * تحديث سعر صرف معين
   * @param rate سعر الصرف المراد تحديثه
   */
  async updateExchangeRate(rate: ExchangeRate): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      // عملية تحديث سعر الصرف
      await lastValueFrom(this.http.put(`${this.apiUrl}/rates/${rate.id}`, { rate: rate.rate }));
      alert(`تم تحديث سعر صرف ${rate.from_currency_code} بنجاح.`);
      await this.loadData(); // إعادة تحميل البيانات لتحديث تاريخ آخر تحديث
    } catch (err) {
      this.handleError(err, `فشل في تحديث سعر صرف ${rate.from_currency_code}`);
    } finally {
      this.loading = false;
    }
  }

  /**
   * معالج الأخطاء العام
   * @param error كائن الخطأ
   * @param defaultMessage رسالة الخطأ الافتراضية
   */
  private handleError(error: any, defaultMessage: string): void {
    console.error(defaultMessage, error);
    if (error instanceof HttpErrorResponse) {
      // التعامل مع أخطاء HTTP
      this.error = error.error?.message || `${defaultMessage}: ${error.status} ${error.statusText}`;
    } else {
      this.error = defaultMessage;
    }
  }
}
