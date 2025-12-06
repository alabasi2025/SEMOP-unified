import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, catchError, finalize, of, throwError } from 'rxjs';

// المسار الافتراضي لواجهة برمجة التطبيقات (API)
const API_URL = '/api/accounting/journal-entries/report';

// واجهة لتفاصيل القيد اليومي
interface JournalEntryItem {
  accountId: string; // معرف الحساب
  accountName: string; // اسم الحساب
  debit: number; // مدين
  credit: number; // دائن
  description: string; // الوصف
}

// واجهة للقيد اليومي
interface JournalEntry {
  id: string; // معرف القيد
  entryNumber: string; // رقم القيد
  date: string; // تاريخ القيد
  type: string; // نوع القيد (مثل: يومية عامة، تسوية)
  totalDebit: number; // إجمالي المدين للقيد
  totalCredit: number; // إجمالي الدائن للقيد
  items: JournalEntryItem[]; // تفاصيل القيد
}

// واجهة لملخص التقرير
interface ReportSummary {
  totalDebit: number; // الإجمالي العام للمدين
  totalCredit: number; // الإجمالي العام للدائن
}

// واجهة لمعايير الفلترة
interface FilterParams {
  startDate: string; // تاريخ البدء
  endDate: string; // تاريخ الانتهاء
  entryType: string; // نوع القيد
}

@Component({
  selector: 'app-journal-entries-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="report-container">
      <h2>تقرير القيود اليومية</h2>

      <!-- قسم الفلترة -->
      <div class="filter-section">
        <form (ngSubmit)="loadReport()">
          <label for="startDate">من تاريخ:</label>
          <input type="date" id="startDate" [(ngModel)]="filterParams.startDate" name="startDate" required>

          <label for="endDate">إلى تاريخ:</label>
          <input type="date" id="endDate" [(ngModel)]="filterParams.endDate" name="endDate" required>

          <label for="entryType">نوع القيد:</label>
          <select id="entryType" [(ngModel)]="filterParams.entryType" name="entryType">
            <option *ngFor="let type of availableEntryTypes" [value]="type">{{ type === 'all' ? 'الكل' : type }}</option>
          </select>

          <button type="submit" [disabled]="loading">تطبيق الفلتر</button>
        </form>
      </div>

      <!-- حالة التحميل والخطأ -->
      <div *ngIf="loading" class="loading-state">
        <p>جاري تحميل تقرير القيود اليومية...</p>
      </div>

      <div *ngIf="error" class="error-state">
        <p><strong>خطأ في التحميل:</strong> {{ error }}</p>
        <p>الرجاء المحاولة مرة أخرى.</p>
      </div>

      <!-- ملخص التقرير -->
      <div *ngIf="!loading && !error && reportData.length > 0" class="summary-section">
        <h3>ملخص التقرير</h3>
        <table>
          <tr>
            <th>الإجمالي العام للمدين</th>
            <th>الإجمالي العام للدائن</th>
            <th>الفرق</th>
          </tr>
          <tr>
            <td>{{ summary.totalDebit | number:'1.2-2' }}</td>
            <td>{{ summary.totalCredit | number:'1.2-2' }}</td>
            <td [class.imbalanced]="summary.totalDebit !== summary.totalCredit">
              {{ (summary.totalDebit - summary.totalCredit) | number:'1.2-2' }}
            </td>
          </tr>
        </table>
      </div>

      <!-- جدول القيود اليومية -->
      <div *ngIf="!loading && !error && reportData.length > 0" class="report-table-section">
        <h3>القيود اليومية</h3>
        <div *ngFor="let entry of reportData" class="journal-entry-card">
          <div class="entry-header">
            <span><strong>رقم القيد:</strong> {{ entry.entryNumber }}</span>
            <span><strong>التاريخ:</strong> {{ entry.date }}</span>
            <span><strong>النوع:</strong> {{ entry.type }}</span>
          </div>
          <table class="entry-details-table">
            <thead>
              <tr>
                <th>الحساب</th>
                <th>الوصف</th>
                <th class="debit">مدين</th>
                <th class="credit">دائن</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of entry.items">
                <td>{{ item.accountName }}</td>
                <td>{{ item.description }}</td>
                <td class="debit">{{ item.debit | number:'1.2-2' }}</td>
                <td class="credit">{{ item.credit | number:'1.2-2' }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="entry-totals">
                <td colspan="2"><strong>إجمالي القيد:</strong></td>
                <td class="debit"><strong>{{ entry.totalDebit | number:'1.2-2' }}</strong></td>
                <td class="credit"><strong>{{ entry.totalCredit | number:'1.2-2' }}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- حالة عدم وجود بيانات -->
      <div *ngIf="!loading && !error && reportData.length === 0" class="no-data-state">
        <p>لا توجد قيود يومية مطابقة لمعايير الفلترة المحددة.</p>
      </div>
    </div>
  `,
  styles: [`
    .report-container {
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
    .filter-section {
      background-color: #f9f9f9;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
      border: 1px solid #eee;
    }
    .filter-section label {
      margin-left: 10px;
      font-weight: bold;
    }
    .filter-section input[type="date"],
    .filter-section select,
    .filter-section button {
      padding: 8px;
      margin-left: 15px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .filter-section button {
      background-color: #007bff;
      color: white;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    .filter-section button:hover:not(:disabled) {
      background-color: #0056b3;
    }
    .filter-section button:disabled {
      background-color: #a0c9ff;
      cursor: not-allowed;
    }
    .loading-state, .no-data-state {
      text-align: center;
      padding: 20px;
      color: #555;
      background-color: #fffbe6;
      border: 1px solid #ffe58f;
      border-radius: 4px;
    }
    .error-state {
      padding: 15px;
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
      margin-bottom: 20px;
    }
    .summary-section table {
      width: 50%;
      margin-bottom: 20px;
      border-collapse: collapse;
      text-align: center;
    }
    .summary-section th, .summary-section td {
      border: 1px solid #ddd;
      padding: 10px;
    }
    .summary-section th {
      background-color: #e9ecef;
    }
    .imbalanced {
      color: red;
      font-weight: bold;
    }
    .journal-entry-card {
      border: 1px solid #ccc;
      border-radius: 8px;
      margin-bottom: 25px;
      overflow: hidden;
    }
    .entry-header {
      background-color: #f1f1f1;
      padding: 10px 15px;
      display: flex;
      justify-content: space-between;
      font-size: 1.1em;
      border-bottom: 1px solid #ccc;
    }
    .entry-details-table {
      width: 100%;
      border-collapse: collapse;
    }
    .entry-details-table th, .entry-details-table td {
      padding: 10px 15px;
      border-bottom: 1px solid #eee;
      text-align: right;
    }
    .entry-details-table th {
      background-color: #f8f8f8;
    }
    .entry-details-table .debit {
      color: #28a745; /* أخضر */
      text-align: center;
    }
    .entry-details-table .credit {
      color: #dc3545; /* أحمر */
      text-align: center;
    }
    .entry-totals td {
      background-color: #e9ecef;
      font-size: 1.1em;
      border-top: 2px solid #ccc;
    }
  `]
})
export class JournalEntriesReportComponent implements OnInit {
  // بيانات القيود اليومية
  reportData: JournalEntry[] = [];
  // ملخص التقرير
  summary: ReportSummary = { totalDebit: 0, totalCredit: 0 };
  // حالة التحميل
  loading: boolean = false;
  // رسالة الخطأ
  error: string | null = null;
  // معايير الفلترة الافتراضية (تاريخ اليوم)
  filterParams: FilterParams = {
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    entryType: 'all'
  };
  // أنواع القيود المتاحة للاختيار
  availableEntryTypes: string[] = ['all', 'General', 'Adjustment', 'Opening'];

  // حقن خدمة HttpClient
  constructor(private http: HttpClient) {}

  // عند تهيئة المكون
  ngOnInit(): void {
    // تحميل التقرير عند بدء التشغيل بالفلتر الافتراضي
    this.loadReport();
  }

  /**
   * دالة مساعدة لحساب الملخص الإجمالي من بيانات القيود.
   * @param entries قائمة القيود اليومية.
   */
  private calculateSummary(entries: JournalEntry[]): ReportSummary {
    const totalDebit = entries.reduce((sum, entry) => sum + entry.totalDebit, 0);
    const totalCredit = entries.reduce((sum, entry) => sum + entry.totalCredit, 0);
    return { totalDebit, totalCredit };
  }

  /**
   * تحميل تقرير القيود اليومية من الخادم بناءً على معايير الفلترة.
   */
  loadReport(): void {
    // إعادة تعيين حالة الخطأ والتحميل
    this.loading = true;
    this.error = null;
    this.reportData = [];
    this.summary = { totalDebit: 0, totalCredit: 0 };

    // بناء معاملات الاستعلام (Query Parameters)
    let params = new HttpParams()
      .set('startDate', this.filterParams.startDate)
      .set('endDate', this.filterParams.endDate);

    if (this.filterParams.entryType !== 'all') {
      params = params.set('entryType', this.filterParams.entryType);
    }

    // إجراء طلب HTTP
    this.http.get<JournalEntry[]>(API_URL, { params })
      .pipe(
        // معالجة الأخطاء
        catchError(err => {
          console.error('خطأ في تحميل تقرير القيود اليومية:', err);
          this.error = 'فشل في الاتصال بالخادم أو تحميل البيانات. يرجى التحقق من اتصالك.';
          // إرجاع Observable بخطأ ليتم التعامل معه في subscribe
          return throwError(() => new Error(err));
        }),
        // إنهاء حالة التحميل سواء نجح الطلب أو فشل
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (data) => {
          // تحديث البيانات والملخص
          this.reportData = data;
          this.summary = this.calculateSummary(data);
        },
        error: (err) => {
          // يتم التعامل مع الخطأ بالفعل في catchError، ولكن يمكن إضافة منطق إضافي هنا إذا لزم الأمر
          // هذا الجزء يتم تنفيذه فقط إذا لم يتم "إمساك" الخطأ بالكامل في catchError
        }
      });
  }
}
