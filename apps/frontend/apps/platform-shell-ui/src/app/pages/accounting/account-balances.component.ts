import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { CardModule } from 'primeng/card';
import { AccountsService } from '../../services/accounts.service';

interface AccountBalance {
  id: number;
  accountCode: string;
  accountName: string;
  accountType: string;
  openingBalance: number;
  debit: number;
  credit: number;
  closingBalance: number;
  currency: string;
}

@Component({
  selector: 'app-account-balances',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    CardModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>أرصدة الحسابات</h1>
        <div class="header-actions">
          <button pButton label="تصدير Excel" icon="pi pi-file-excel" class="p-button-success"></button>
          <button pButton label="طباعة" icon="pi pi-print"></button>
        </div>
      </div>

      <!-- Filters -->
      <div class="card filters-card">
        <div class="filters-grid">
          <div class="filter-group">
            <label>من تاريخ</label>
            <p-datepicker [(ngModel)]="fromDate" dateFormat="dd/mm/yy" [showIcon]="true"></p-datepicker>
          </div>
          <div class="filter-group">
            <label>إلى تاريخ</label>
            <p-datepicker [(ngModel)]="toDate" dateFormat="dd/mm/yy" [showIcon]="true"></p-datepicker>
          </div>
          <div class="filter-group">
            <label>نوع الحساب</label>
            <p-select [(ngModel)]="selectedAccountType" 
                        [options]="accountTypes" 
                        optionLabel="label"
                        optionValue="value"
                        placeholder="الكل"></p-select>
          </div>
          <div class="filter-group">
            <label>&nbsp;</label>
            <button pButton label="عرض" icon="pi pi-search" (click)="loadBalances()"></button>
          </div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="summary-cards">
        <p-card>
          <div class="summary-card-content">
            <i class="pi pi-arrow-up summary-icon debit"></i>
            <div class="summary-details">
              <span class="summary-label">إجمالي المدين</span>
              <span class="summary-value">{{ totalDebit | number:'1.2-2' }} ر.ي</span>
            </div>
          </div>
        </p-card>
        
        <p-card>
          <div class="summary-card-content">
            <i class="pi pi-arrow-down summary-icon credit"></i>
            <div class="summary-details">
              <span class="summary-label">إجمالي الدائن</span>
              <span class="summary-value">{{ totalCredit | number:'1.2-2' }} ر.ي</span>
            </div>
          </div>
        </p-card>
        
        <p-card>
          <div class="summary-card-content">
            <i class="pi pi-wallet summary-icon balance"></i>
            <div class="summary-details">
              <span class="summary-label">الرصيد الختامي</span>
              <span class="summary-value">{{ totalClosingBalance | number:'1.2-2' }} ر.ي</span>
            </div>
          </div>
        </p-card>
      </div>

      <!-- Balances Table -->
      <div class="card">
        <p-table 
          [value]="balances" 
          [paginator]="true" 
          [rows]="15"
          [globalFilterFields]="['accountCode','accountName','accountType']"
          responsiveLayout="scroll"
          [exportFilename]="'account-balances'"
          [scrollable]="true"
          scrollHeight="500px">
          
          <ng-template pTemplate="caption">
            <div class="table-header">
              <span class="p-input-icon-left">
                <i class="pi pi-search"></i>
                <input pInputText type="text" 
                       (input)="onSearch($event)" 
                       placeholder="بحث..." />
              </span>
            </div>
          </ng-template>

          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="accountCode">
                رمز الحساب <p-sortIcon field="accountCode"></p-sortIcon>
              </th>
              <th pSortableColumn="accountName">
                اسم الحساب <p-sortIcon field="accountName"></p-sortIcon>
              </th>
              <th>نوع الحساب</th>
              <th class="text-left">رصيد افتتاحي</th>
              <th class="text-left">مدين</th>
              <th class="text-left">دائن</th>
              <th class="text-left">رصيد ختامي</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-balance>
            <tr>
              <td><strong>{{ balance.accountCode }}</strong></td>
              <td>{{ balance.accountName }}</td>
              <td>
                <span class="account-type-badge" [class]="'type-' + balance.accountType">
                  {{ getAccountTypeLabel(balance.accountType) }}
                </span>
              </td>
              <td class="text-left">{{ balance.openingBalance | number:'1.2-2' }}</td>
              <td class="text-left debit-amount">{{ balance.debit | number:'1.2-2' }}</td>
              <td class="text-left credit-amount">{{ balance.credit | number:'1.2-2' }}</td>
              <td class="text-left">
                <strong [class]="balance.closingBalance >= 0 ? 'positive' : 'negative'">
                  {{ balance.closingBalance | number:'1.2-2' }}
                </strong>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="footer">
            <tr class="totals-row">
              <td colspan="3"><strong>الإجمالي</strong></td>
              <td class="text-left"><strong>{{ totalOpeningBalance | number:'1.2-2' }}</strong></td>
              <td class="text-left"><strong>{{ totalDebit | number:'1.2-2' }}</strong></td>
              <td class="text-left"><strong>{{ totalCredit | number:'1.2-2' }}</strong></td>
              <td class="text-left"><strong>{{ totalClosingBalance | number:'1.2-2' }}</strong></td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="7" class="text-center">لا توجد بيانات</td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 1.5rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .page-header h1 {
      margin: 0;
      font-size: 1.75rem;
      color: #333;
    }

    .header-actions {
      display: flex;
      gap: 0.75rem;
    }

    .card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .filters-card {
      margin-bottom: 1.5rem;
    }

    .filters-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filter-group label {
      font-weight: 600;
      color: #333;
      font-size: 0.9rem;
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .summary-card-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .summary-icon {
      font-size: 2.5rem;
      padding: 1rem;
      border-radius: 12px;
    }

    .summary-icon.debit {
      background: #e3f2fd;
      color: #1976d2;
    }

    .summary-icon.credit {
      background: #f3e5f5;
      color: #7b1fa2;
    }

    .summary-icon.balance {
      background: #e8f5e9;
      color: #388e3c;
    }

    .summary-details {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .summary-label {
      font-size: 0.9rem;
      color: #666;
    }

    .summary-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #333;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .account-type-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .type-asset {
      background: #e3f2fd;
      color: #1976d2;
    }

    .type-liability {
      background: #fff3e0;
      color: #e65100;
    }

    .type-equity {
      background: #f3e5f5;
      color: #7b1fa2;
    }

    .type-revenue {
      background: #e8f5e9;
      color: #388e3c;
    }

    .type-expense {
      background: #ffebee;
      color: #c62828;
    }

    .text-center {
      text-align: center;
    }

    .text-left {
      text-align: left;
    }

    .debit-amount {
      color: #1976d2;
      font-weight: 600;
    }

    .credit-amount {
      color: #7b1fa2;
      font-weight: 600;
    }

    .positive {
      color: #388e3c;
    }

    .negative {
      color: #c62828;
    }

    .totals-row {
      background: #f8f9fa;
      font-weight: 700;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
      padding: 0.75rem;
    }

    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
      background: #f8f9fa;
      color: #495057;
      font-weight: 600;
    }

    :host ::ng-deep .p-card .p-card-body {
      padding: 1rem;
    }

    @media (max-width: 1024px) {
      .filters-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .summary-cards {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AccountBalancesComponent implements OnInit {
  balances: AccountBalance[] = [];
  fromDate: Date = new Date(new Date().getFullYear(), 0, 1);
  toDate: Date = new Date();
  selectedAccountType: string = '';

  constructor(private accountsService: AccountsService) {}
  
  accountTypes = [
    { label: 'الكل', value: '' },
    { label: 'أصول', value: 'asset' },
    { label: 'خصوم', value: 'liability' },
    { label: 'حقوق ملكية', value: 'equity' },
    { label: 'إيرادات', value: 'revenue' },
    { label: 'مصروفات', value: 'expense' }
  ];

  totalOpeningBalance = 0;
  totalDebit = 0;
  totalCredit = 0;
  totalClosingBalance = 0;

  ngOnInit() {
    this.loadBalances();
  }

  loadBalances() {
    this.accountsService.getAll().subscribe({
      next: (accounts) => {
        this.balances = accounts.map((account, index) => ({
          id: parseInt(account.id),
          accountCode: account.code,
          accountName: account.nameAr,
          accountType: account.accountType.toLowerCase(),
          openingBalance: 0,
          debit: 0,
          credit: 0,
          closingBalance: 0,
          currency: 'YER'
        }));
        this.calculateTotals();
      },
      error: (error) => {
        console.error('Error loading balances:', error);
      }
    });
  }

  loadBalancesOld() {
    // Mock data - BACKUP
    this.balances = [
      {
        id: 1,
        accountCode: '1010',
        accountName: 'النقدية',
        accountType: 'asset',
        openingBalance: 250000,
        debit: 180000,
        credit: 120000,
        closingBalance: 310000,
        currency: 'YER'
      },
      {
        id: 2,
        accountCode: '1020',
        accountName: 'البنك - الراجحي',
        accountType: 'asset',
        openingBalance: 500000,
        debit: 350000,
        credit: 280000,
        closingBalance: 570000,
        currency: 'YER'
      },
      {
        id: 3,
        accountCode: '1110',
        accountName: 'العملاء',
        accountType: 'asset',
        openingBalance: 180000,
        debit: 250000,
        credit: 200000,
        closingBalance: 230000,
        currency: 'YER'
      },
      {
        id: 4,
        accountCode: '2010',
        accountName: 'الموردين',
        accountType: 'liability',
        openingBalance: 150000,
        debit: 100000,
        credit: 180000,
        closingBalance: 230000,
        currency: 'YER'
      },
      {
        id: 5,
        accountCode: '3010',
        accountName: 'رأس المال',
        accountType: 'equity',
        openingBalance: 1000000,
        debit: 0,
        credit: 0,
        closingBalance: 1000000,
        currency: 'YER'
      },
      {
        id: 6,
        accountCode: '4010',
        accountName: 'إيرادات المبيعات',
        accountType: 'revenue',
        openingBalance: 0,
        debit: 50000,
        credit: 450000,
        closingBalance: 400000,
        currency: 'YER'
      },
      {
        id: 7,
        accountCode: '5010',
        accountName: 'الرواتب والأجور',
        accountType: 'expense',
        openingBalance: 0,
        debit: 120000,
        credit: 0,
        closingBalance: 120000,
        currency: 'YER'
      },
      {
        id: 8,
        accountCode: '5020',
        accountName: 'الإيجارات',
        accountType: 'expense',
        openingBalance: 0,
        debit: 48000,
        credit: 0,
        closingBalance: 48000,
        currency: 'YER'
      }
    ];

    this.calculateTotals();
  }

  calculateTotals() {
    this.totalOpeningBalance = this.balances.reduce((sum, b) => sum + b.openingBalance, 0);
    this.totalDebit = this.balances.reduce((sum, b) => sum + b.debit, 0);
    this.totalCredit = this.balances.reduce((sum, b) => sum + b.credit, 0);
    this.totalClosingBalance = this.balances.reduce((sum, b) => sum + b.closingBalance, 0);
  }

  onSearch(event: any) {
    // Implement search logic
  }

  getAccountTypeLabel(type: string): string {
    const labels: any = {
      'asset': 'أصول',
      'liability': 'خصوم',
      'equity': 'حقوق ملكية',
      'revenue': 'إيرادات',
      'expense': 'مصروفات'
    };
    return labels[type] || type;
  }
}
