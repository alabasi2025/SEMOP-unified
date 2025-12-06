import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { catchError, throwError } from 'rxjs';

// =================================================================
// تعريف الواجهات (Interfaces) لهيكل بيانات قائمة التدفقات النقدية
// =================================================================

/**
 * يمثل بنداً واحداً في قائمة التدفقات النقدية.
 */
interface CashFlowItem {
  name: string; // اسم البند (مثل: صافي الدخل، شراء الأصول)
  amount: number; // المبلغ النقدي
  type: 'operating' | 'investing' | 'financing'; // نوع النشاط
}

/**
 * يمثل ملخصاً لقسم معين (التشغيلية، الاستثمارية، التمويلية).
 */
interface CashFlowSection {
  title: string; // عنوان القسم
  items: CashFlowItem[]; // قائمة البنود
  total: number; // إجمالي التدفق النقدي للقسم
}

/**
 * يمثل هيكل بيانات قائمة التدفقات النقدية الكاملة.
 */
interface CashFlowStatement {
  operatingActivities: CashFlowSection; // الأنشطة التشغيلية
  investingActivities: CashFlowSection; // الأنشطة الاستثمارية
  financingActivities: CashFlowSection; // الأنشطة التمويلية
  netChangeInCash: number; // صافي التغير في النقد
  beginningCashBalance: number; // رصيد النقد في بداية الفترة
  endingCashBalance: number; // رصيد النقد في نهاية الفترة
}

// =================================================================
// تعريف المكون (Component)
// =================================================================

@Component({
  selector: 'app-cash-flow-statement',
  // يجب إضافة CommonModule إذا كان هذا المكون مستقلاً (Standalone)
  // imports: [CommonModule], 
  template: `
    <div class="cash-flow-container">
      <h2 class="title">قائمة التدفقات النقدية</h2>
      
      <!-- حالة التحميل -->
      <div *ngIf="loading" class="loading-state">
        <p>جاري تحميل بيانات قائمة التدفقات النقدية...</p>
      </div>

      <!-- حالة الخطأ -->
      <div *ngIf="error" class="error-state">
        <h3>حدث خطأ أثناء جلب البيانات</h3>
        <p>{{ error }}</p>
        <button (click)="loadStatement()">إعادة المحاولة</button>
      </div>

      <!-- عرض البيانات -->
      <div *ngIf="!loading && !error && statement" class="statement-content">
        
        <!-- الأنشطة التشغيلية -->
        <section class="section operating">
          <h3>{{ statement.operatingActivities.title }}</h3>
          <table class="data-table">
            <tbody>
              <tr *ngFor="let item of statement.operatingActivities.items">
                <td>{{ item.name }}</td>
                <td class="amount">{{ item.amount | number:'1.2-2' }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td>إجمالي التدفقات النقدية من الأنشطة التشغيلية</td>
                <td class="amount total-amount">{{ statement.operatingActivities.total | number:'1.2-2' }}</td>
              </tr>
            </tfoot>
          </table>
        </section>

        <!-- الأنشطة الاستثمارية -->
        <section class="section investing">
          <h3>{{ statement.investingActivities.title }}</h3>
          <table class="data-table">
            <tbody>
              <tr *ngFor="let item of statement.investingActivities.items">
                <td>{{ item.name }}</td>
                <td class="amount">{{ item.amount | number:'1.2-2' }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td>إجمالي التدفقات النقدية من الأنشطة الاستثمارية</td>
                <td class="amount total-amount">{{ statement.investingActivities.total | number:'1.2-2' }}</td>
              </tr>
            </tfoot>
          </table>
        </section>

        <!-- الأنشطة التمويلية -->
        <section class="section financing">
          <h3>{{ statement.financingActivities.title }}</h3>
          <table class="data-table">
            <tbody>
              <tr *ngFor="let item of statement.financingActivities.items">
                <td>{{ item.name }}</td>
                <td class="amount">{{ item.amount | number:'1.2-2' }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td>إجمالي التدفقات النقدية من الأنشطة التمويلية</td>
                <td class="amount total-amount">{{ statement.financingActivities.total | number:'1.2-2' }}</td>
              </tr>
            </tfoot>
          </table>
        </section>

        <!-- الملخص النهائي -->
        <div class="summary-section">
          <div class="summary-item">
            <span>صافي التغير في النقد</span>
            <span class="total-amount">{{ statement.netChangeInCash | number:'1.2-2' }}</span>
          </div>
          <div class="summary-item">
            <span>رصيد النقد في بداية الفترة</span>
            <span class="amount">{{ statement.beginningCashBalance | number:'1.2-2' }}</span>
          </div>
          <div class="summary-item final-balance">
            <span>رصيد النقد في نهاية الفترة</span>
            <span class="total-amount">{{ statement.endingCashBalance | number:'1.2-2' }}</span>
          </div>
        </div>

        <!-- ملاحظة: يمكن إضافة رسوم بيانية هنا باستخدام مكتبة مثل Chart.js أو D3.js -->
        <div class="chart-placeholder">
          <p>مكان مخصص لعرض الرسوم البيانية للتدفقات النقدية</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cash-flow-container {
      padding: 20px;
      font-family: 'Arial', sans-serif;
      direction: rtl; /* لدعم اللغة العربية */
      text-align: right;
    }
    .title {
      color: #007bff;
      border-bottom: 2px solid #007bff;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    .loading-state, .error-state {
      padding: 20px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    .loading-state {
      background-color: #e9f7ff;
      color: #007bff;
    }
    .error-state {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
    .section {
      margin-bottom: 30px;
      border: 1px solid #eee;
      padding: 15px;
      border-radius: 5px;
    }
    .section h3 {
      color: #333;
      margin-top: 0;
      border-bottom: 1px dashed #ccc;
      padding-bottom: 5px;
      margin-bottom: 10px;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
    }
    .data-table td {
      padding: 8px 0;
      border-bottom: 1px dotted #ddd;
    }
    .data-table tfoot td {
      font-weight: bold;
      border-top: 2px solid #333;
      padding-top: 10px;
    }
    .amount {
      text-align: left; /* لجعل الأرقام محاذية لليسار */
      font-family: 'Courier New', monospace; /* خط أحادي للمبالغ */
    }
    .total-row td {
      background-color: #f0f0f0;
    }
    .total-amount {
      color: #007bff;
      font-size: 1.1em;
    }
    .summary-section {
      margin-top: 30px;
      border-top: 3px double #333;
      padding-top: 15px;
    }
    .summary-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 1.1em;
    }
    .final-balance {
      font-weight: bold;
      background-color: #e9f7ff;
      padding: 10px 0;
      border-radius: 3px;
    }
    .chart-placeholder {
      margin-top: 40px;
      padding: 20px;
      border: 1px dashed #ccc;
      text-align: center;
      color: #666;
    }
  `]
})
export class CashFlowStatementComponent implements OnInit {
  // متغير لتخزين بيانات قائمة التدفقات النقدية
  statement: CashFlowStatement | null = null;
  // حالة التحميل
  loading: boolean = false;
  // رسالة الخطأ في حال حدوثه
  error: string | null = null;
  
  // نقطة نهاية API لجلب البيانات
  private readonly API_URL = '/api/accounting/cash-flow-statement';
  
  /**
   * حقن خدمة HttpClient في المكون.
   * @param http خدمة HttpClient لجلب البيانات من الـ Backend.
   */
  constructor(private http: HttpClient) {}
  
  /**
   * دورة حياة المكون: يتم استدعاؤها عند تهيئة المكون.
   */
  ngOnInit(): void {
    this.loadStatement();
  }
  
  /**
   * جلب بيانات قائمة التدفقات النقدية من الـ Backend.
   */
  loadStatement(): void {
    this.loading = true; // تفعيل حالة التحميل
    this.error = null;   // مسح أي أخطاء سابقة

    this.http.get<CashFlowStatement>(this.API_URL)
      .pipe(
        // معالجة الأخطاء
        catchError(this.handleError)
      )
      .subscribe({
        next: (data) => {
          // تحديث البيانات عند النجاح
          this.statement = data;
          this.loading = false; // إيقاف حالة التحميل
        },
        error: (err) => {
          // يتم التعامل مع الخطأ بالفعل في handleError، لكن نضمن إيقاف التحميل هنا
          this.loading = false;
          // تعيين رسالة خطأ عامة إذا لم يتم تعيينها في handleError
          if (!this.error) {
            this.error = 'فشل في الاتصال بالخادم أو جلب البيانات.';
          }
          console.error('خطأ في جلب قائمة التدفقات النقدية:', err);
        },
        complete: () => {
          // يتم إيقاف التحميل في next أو error، لكن يمكن استخدامه هنا للتأكد
          if (this.loading) {
             this.loading = false;
          }
        }
      });
  }

  /**
   * دالة مساعدة لمعالجة أخطاء HTTP.
   * @param error استجابة الخطأ من HTTP.
   * @returns Observable يحتوي على الخطأ ليتم تمريره.
   */
  private handleError = (error: HttpErrorResponse) => {
    if (error.status === 0) {
      // خطأ من جانب العميل أو الشبكة
      this.error = 'خطأ في الشبكة: يرجى التحقق من اتصالك بالإنترنت.';
    } else if (error.status >= 400 && error.status < 500) {
      // خطأ من جانب العميل (مثل 404 Not Found)
      this.error = `خطأ في الخادم (الرمز ${error.status}): ${error.error?.message || 'البيانات المطلوبة غير موجودة أو الطلب غير صالح.'}`;
    } else {
      // خطأ من جانب الخادم (مثل 500 Internal Server Error)
      this.error = `خطأ في الخادم (الرمز ${error.status}): حدث خطأ غير متوقع.`;
    }
    
    // تسجيل الخطأ في وحدة التحكم للمطور
    console.error(
      `Backend returned code ${error.status}, body was: `, error.error);
      
    // إرجاع Observable مع رسالة خطأ موجهة للمستخدم
    return throwError(() => new Error(this.error || 'حدث خطأ غير معروف.'));
  }
}
