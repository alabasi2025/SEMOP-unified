import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

import { CheckboxModule } from 'primeng/checkbox';
import { AccountsService, Account } from '../../services/accounts.service';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    CheckboxModule
  ],
  template: `
    <div class="card">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">دليل الحسابات</h2>
        <button pButton label="إضافة حساب" icon="pi pi-plus" (click)="showDialog()"></button>
      </div>

      <p-table [value]="accounts" [loading]="loading" styleClass="p-datatable-sm">
        <ng-template pTemplate="header">
          <tr>
            <th>الكود</th>
            <th>الاسم بالعربي</th>
            <th>الاسم بالإنجليزي</th>
            <th>النوع</th>
            <th>الطبيعة</th>
            <th>المستوى</th>
            <th>رئيسي</th>
            <th>الحالة</th>
            <th>الإجراءات</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-account>
          <tr>
            <td>{{ account.code }}</td>
            <td>{{ account.nameAr }}</td>
            <td>{{ account.nameEn }}</td>
            <td>{{ getAccountTypeLabel(account.accountType) }}</td>
            <td>{{ getAccountNatureLabel(account.accountNature) }}</td>
            <td>{{ account.level }}</td>
            <td><i [class]="account.isParent ? 'pi pi-check text-green-500' : 'pi pi-times text-red-500'"></i></td>
            <td><span [class]="account.isActive ? 'text-green-600' : 'text-red-600'">{{ account.isActive ? 'نشط' : 'غير نشط' }}</span></td>
            <td>
              <button pButton icon="pi pi-pencil" class="p-button-text p-button-sm" (click)="editAccount(account)"></button>
              <button pButton icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" (click)="deleteAccount(account.id)"></button>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>

    <p-dialog [(visible)]="displayDialog" [header]="editMode ? 'تعديل حساب' : 'إضافة حساب'" [modal]="true" [style]="{width: '50vw'}">
      <div class="flex flex-col gap-4">
        <div class="field">
          <label>الكود *</label>
          <input pInputText [(ngModel)]="selectedAccount.code" class="w-full" [disabled]="editMode" />
        </div>

        <div class="field">
          <label>الاسم بالعربي *</label>
          <input pInputText [(ngModel)]="selectedAccount.nameAr" class="w-full" />
        </div>

        <div class="field">
          <label>الاسم بالإنجليزي *</label>
          <input pInputText [(ngModel)]="selectedAccount.nameEn" class="w-full" />
        </div>

        <div class="field">
          <label>الوصف</label>
          <input pInputText [(ngModel)]="selectedAccount.description" class="w-full" />
        </div>

        <div class="field">
          <label>نوع الحساب *</label>
          <p-select [(ngModel)]="selectedAccount.accountType" [options]="accountTypes" optionLabel="label" optionValue="value" class="w-full" [disabled]="editMode"></p-select>
        </div>

        <div class="field">
          <label>طبيعة الحساب *</label>
          <p-select [(ngModel)]="selectedAccount.accountNature" [options]="accountNatures" optionLabel="label" optionValue="value" class="w-full" [disabled]="editMode"></p-select>
        </div>

        <div class="field">
          <label>المستوى *</label>
          <input pInputText type="number" [(ngModel)]="selectedAccount.level" class="w-full" [disabled]="editMode" />
        </div>

        <div class="field-checkbox">
          <p-checkbox [(ngModel)]="selectedAccount.isParent" [binary]="true" inputId="isParent" [disabled]="editMode"></p-checkbox>
          <label for="isParent">حساب رئيسي</label>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <button pButton label="إلغاء" icon="pi pi-times" class="p-button-text" (click)="displayDialog = false"></button>
        <button pButton label="حفظ" icon="pi pi-check" (click)="saveAccount()"></button>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    :host ::ng-deep {
      .p-datatable .p-datatable-thead > tr > th {
        background-color: #f8f9fa;
        text-align: right;
      }
      .p-datatable .p-datatable-tbody > tr > td {
        text-align: right;
      }
    }
  `]
})
export class AccountsComponent implements OnInit {
  accounts: Account[] = [];
  loading = false;
  displayDialog = false;
  editMode = false;
  selectedAccount: Partial<Account> = {};

  accountTypes = [
    { label: 'أصول', value: 'ASSET' },
    { label: 'خصوم', value: 'LIABILITY' },
    { label: 'حقوق ملكية', value: 'EQUITY' },
    { label: 'إيرادات', value: 'REVENUE' },
    { label: 'مصروفات', value: 'EXPENSE' }
  ];

  accountNatures = [
    { label: 'مدين', value: 'DEBIT' },
    { label: 'دائن', value: 'CREDIT' }
  ];

  constructor(private accountsService: AccountsService) {}

  ngOnInit() {
    this.loadAccounts();
  }

  loadAccounts() {
    this.loading = true;
    this.accountsService.getAll().subscribe({
      next: (data) => {
        this.accounts = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading accounts:', error);
        this.loading = false;
      }
    });
  }

  showDialog() {
    this.editMode = false;
    this.selectedAccount = {
      isParent: false,
      level: 1,
      accountType: 'ASSET',
      accountNature: 'DEBIT'
    };
    this.displayDialog = true;
  }

  editAccount(account: Account) {
    this.editMode = true;
    this.selectedAccount = { ...account };
    this.displayDialog = true;
  }

  saveAccount() {
    if (this.editMode) {
      this.accountsService.update(this.selectedAccount.id!, this.selectedAccount).subscribe({
        next: () => {
          this.loadAccounts();
          this.displayDialog = false;
        },
        error: (error) => console.error('Error updating account:', error)
      });
    } else {
      this.accountsService.create(this.selectedAccount).subscribe({
        next: () => {
          this.loadAccounts();
          this.displayDialog = false;
        },
        error: (error) => console.error('Error creating account:', error)
      });
    }
  }

  deleteAccount(id: string) {
    if (confirm('هل أنت متأكد من حذف هذا الحساب؟')) {
      this.accountsService.delete(id).subscribe({
        next: () => this.loadAccounts(),
        error: (error) => console.error('Error deleting account:', error)
      });
    }
  }

  getAccountTypeLabel(type: string): string {
    const found = this.accountTypes.find(t => t.value === type);
    return found ? found.label : type;
  }

  getAccountNatureLabel(nature: string): string {
    const found = this.accountNatures.find(n => n.value === nature);
    return found ? found.label : nature;
  }
}
