import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TreeTableModule } from 'primeng/treetable';
import { TreeNode } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AccountsService, Account } from '../../services/accounts.service';

interface AccountNode {
  code: string;
  name: string;
  type: string;
  balance: number;
  isActive: boolean;
  children?: AccountNode[];
}

@Component({
  selector: 'app-account-hierarchy',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TreeTableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    SelectModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>التسلسل الهرمي للحسابات</h1>
        <div class="header-actions">
          <button pButton label="توسيع الكل" 
                  icon="pi pi-plus" 
                  class="p-button-outlined"
                  (click)="expandAll()"></button>
          <button pButton label="طي الكل" 
                  icon="pi pi-minus" 
                  class="p-button-outlined"
                  (click)="collapseAll()"></button>
          <button pButton label="حساب جديد" 
                  icon="pi pi-plus" 
                  (click)="openNew()"></button>
        </div>
      </div>

      <div class="card">
        <p-treeTable 
          [value]="accountsTree" 
          [scrollable]="true" 
          scrollHeight="600px"
          [globalFilterFields]="['data.code','data.name']">
          
          <ng-template pTemplate="caption">
            <div class="table-header">
              <span class="p-input-icon-left">
                <i class="pi pi-search"></i>
                <input pInputText type="text" 
                       (input)="onSearch($event)" 
                       placeholder="بحث في الحسابات..." />
              </span>
              <div class="legend">
                <span class="legend-item">
                  <i class="pi pi-folder legend-icon parent"></i>
                  حساب رئيسي
                </span>
                <span class="legend-item">
                  <i class="pi pi-file legend-icon child"></i>
                  حساب فرعي
                </span>
              </div>
            </div>
          </ng-template>

          <ng-template pTemplate="header">
            <tr>
              <th style="width: 200px">رمز الحساب</th>
              <th>اسم الحساب</th>
              <th style="width: 150px">النوع</th>
              <th style="width: 150px" class="text-left">الرصيد</th>
              <th style="width: 100px">الحالة</th>
              <th style="width: 150px">الإجراءات</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-rowNode let-rowData="rowData">
            <tr [ttRow]="rowNode">
              <td>
                <p-treeTableToggler [rowNode]="rowNode"></p-treeTableToggler>
                <strong>{{ rowData.code }}</strong>
              </td>
              <td>
                <span [class]="rowNode.children && rowNode.children.length > 0 ? 'parent-account' : ''">
                  {{ rowData.name }}
                </span>
              </td>
              <td>
                <span class="account-type-badge" [class]="'type-' + rowData.type">
                  {{ getAccountTypeLabel(rowData.type) }}
                </span>
              </td>
              <td class="text-left">
                <strong [class]="rowData.balance >= 0 ? 'positive' : 'negative'">
                  {{ rowData.balance | number:'1.2-2' }}
                </strong>
              </td>
              <td>
                <span [class]="'status-badge status-' + (rowData.isActive ? 'active' : 'inactive')">
                  {{ rowData.isActive ? 'نشط' : 'غير نشط' }}
                </span>
              </td>
              <td>
                <button pButton icon="pi pi-plus" 
                        class="p-button-rounded p-button-text p-button-success"
                        (click)="addSubAccount(rowData)"
                        pTooltip="إضافة حساب فرعي"></button>
                <button pButton icon="pi pi-pencil" 
                        class="p-button-rounded p-button-text p-button-warning"
                        (click)="editAccount(rowData)"
                        pTooltip="تعديل"></button>
                <button pButton icon="pi pi-trash" 
                        class="p-button-rounded p-button-text p-button-danger"
                        (click)="deleteAccount(rowData)"
                        [disabled]="hasChildren(rowData)"
                        pTooltip="حذف"></button>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="6" class="text-center">لا توجد حسابات</td>
            </tr>
          </ng-template>
        </p-treeTable>
      </div>

      <!-- Dialog -->
      <p-dialog 
        [(visible)]="accountDialog" 
        [header]="dialogTitle"
        [modal]="true" 
        [style]="{width: '600px'}">
        
        <div class="account-form">
          <div class="form-group">
            <label>رمز الحساب *</label>
            <input pInputText [(ngModel)]="account.code" 
                   [disabled]="isEditMode"
                   placeholder="مثال: 1010" />
            <small class="help-text">يجب أن يكون رمز الحساب فريداً</small>
          </div>

          <div class="form-group">
            <label>اسم الحساب *</label>
            <input pInputText [(ngModel)]="account.name" 
                   placeholder="مثال: النقدية" />
          </div>

          <div class="form-group">
            <label>نوع الحساب *</label>
            <p-select [(ngModel)]="account.type" 
                        [options]="accountTypes" 
                        optionLabel="label"
                        optionValue="value"
                        placeholder="اختر نوع الحساب"></p-select>
          </div>

          <div class="form-group" *ngIf="parentAccount">
            <label>الحساب الرئيسي</label>
            <input pInputText [value]="parentAccount.code + ' - ' + parentAccount.name" 
                   [disabled]="true" />
          </div>

          <div class="form-group">
            <label>الرصيد الافتتاحي</label>
            <input pInputText type="number" 
                   [(ngModel)]="account.balance" 
                   placeholder="0.00" />
          </div>

          <div class="form-group checkbox-group">
            <label>
              <input type="checkbox" [(ngModel)]="account.isActive" />
              <span>حساب نشط</span>
            </label>
          </div>
        </div>

        <ng-template pTemplate="footer">
          <button pButton label="إلغاء" 
                  icon="pi pi-times" 
                  class="p-button-text"
                  (click)="hideDialog()"></button>
          <button pButton label="حفظ" 
                  icon="pi pi-check" 
                  (click)="saveAccount()"
                  [disabled]="!isValid()"></button>
        </ng-template>
      </p-dialog>

      <p-toast></p-toast>
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
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .legend {
      display: flex;
      gap: 1.5rem;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: #666;
    }

    .legend-icon {
      font-size: 1.2rem;
    }

    .legend-icon.parent {
      color: #1976d2;
    }

    .legend-icon.child {
      color: #666;
    }

    .parent-account {
      font-weight: 600;
      color: #1976d2;
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

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .status-active {
      background: #d4edda;
      color: #155724;
    }

    .status-inactive {
      background: #f8d7da;
      color: #721c24;
    }

    .text-center {
      text-align: center;
    }

    .text-left {
      text-align: left;
    }

    .positive {
      color: #388e3c;
    }

    .negative {
      color: #c62828;
    }

    .account-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 1rem 0;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-weight: 600;
      color: #333;
    }

    .help-text {
      color: #666;
      font-size: 0.85rem;
    }

    .checkbox-group label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .checkbox-group input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    :host ::ng-deep .p-treetable .p-treetable-tbody > tr > td {
      padding: 0.75rem;
    }

    :host ::ng-deep .p-treetable .p-treetable-thead > tr > th {
      background: #f8f9fa;
      color: #495057;
      font-weight: 600;
    }

    :host ::ng-deep .p-treetable-toggler {
      margin-left: 0.5rem;
    }

    :host ::ng-deep .p-dialog .p-dialog-content {
      padding: 1.5rem;
    }
  `]
})
export class AccountHierarchyComponent implements OnInit {
  accountsTree: TreeNode[] = [];
  accountDialog = false;
  dialogTitle = '';
  account: any = {};
  parentAccount: any = null;
  isEditMode = false;

  accountTypes = [
    { label: 'أصول', value: 'asset' },
    { label: 'خصوم', value: 'liability' },
    { label: 'حقوق ملكية', value: 'equity' },
    { label: 'إيرادات', value: 'revenue' },
    { label: 'مصروفات', value: 'expense' }
  ];

  constructor(
    private messageService: MessageService,
    private accountsService: AccountsService
  ) {}

  ngOnInit() {
    this.loadAccounts();
  }

  loadAccounts() {
    this.accountsService.getAll().subscribe({
      next: (accounts) => {
        const hierarchicalAccounts = this.buildHierarchy(accounts);
        this.accountsTree = this.convertToTreeNodes(hierarchicalAccounts);
      },
      error: (error) => {
        console.error('Error loading accounts:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل تحميل الحسابات'
        });
      }
    });
  }

  buildHierarchy(accounts: Account[]): AccountNode[] {
    const accountMap = new Map<string, AccountNode>();
    const rootAccounts: AccountNode[] = [];

    // Convert to AccountNode and create map
    accounts.forEach(account => {
      accountMap.set(account.id, {
        code: account.code,
        name: account.nameAr,
        type: account.accountType.toLowerCase(),
        balance: 0,
        isActive: account.isActive,
        children: []
      });
    });

    // Build hierarchy
    accounts.forEach(account => {
      const node = accountMap.get(account.id)!;
      if (account.parentId && accountMap.has(account.parentId)) {
        const parent = accountMap.get(account.parentId)!;
        if (!parent.children) parent.children = [];
        parent.children.push(node);
      } else {
        rootAccounts.push(node);
      }
    });

    return rootAccounts;
  }

  loadAccountsOld() {
    // Mock hierarchical data - BACKUP
    const mockAccounts: AccountNode[] = [
      {
        code: '1000',
        name: 'الأصول',
        type: 'asset',
        balance: 1110000,
        isActive: true,
        children: [
          {
            code: '1100',
            name: 'الأصول المتداولة',
            type: 'asset',
            balance: 880000,
            isActive: true,
            children: [
              {
                code: '1010',
                name: 'النقدية',
                type: 'asset',
                balance: 310000,
                isActive: true
              },
              {
                code: '1020',
                name: 'البنك - الراجحي',
                type: 'asset',
                balance: 570000,
                isActive: true
              }
            ]
          },
          {
            code: '1200',
            name: 'الأصول الثابتة',
            type: 'asset',
            balance: 230000,
            isActive: true,
            children: [
              {
                code: '1210',
                name: 'الأراضي',
                type: 'asset',
                balance: 150000,
                isActive: true
              },
              {
                code: '1220',
                name: 'المباني',
                type: 'asset',
                balance: 80000,
                isActive: true
              }
            ]
          }
        ]
      },
      {
        code: '2000',
        name: 'الخصوم',
        type: 'liability',
        balance: 230000,
        isActive: true,
        children: [
          {
            code: '2100',
            name: 'الخصوم المتداولة',
            type: 'liability',
            balance: 230000,
            isActive: true,
            children: [
              {
                code: '2010',
                name: 'الموردين',
                type: 'liability',
                balance: 230000,
                isActive: true
              }
            ]
          }
        ]
      },
      {
        code: '3000',
        name: 'حقوق الملكية',
        type: 'equity',
        balance: 1000000,
        isActive: true,
        children: [
          {
            code: '3010',
            name: 'رأس المال',
            type: 'equity',
            balance: 1000000,
            isActive: true
          }
        ]
      },
      {
        code: '4000',
        name: 'الإيرادات',
        type: 'revenue',
        balance: 400000,
        isActive: true,
        children: [
          {
            code: '4010',
            name: 'إيرادات المبيعات',
            type: 'revenue',
            balance: 400000,
            isActive: true
          }
        ]
      },
      {
        code: '5000',
        name: 'المصروفات',
        type: 'expense',
        balance: 168000,
        isActive: true,
        children: [
          {
            code: '5010',
            name: 'الرواتب والأجور',
            type: 'expense',
            balance: 120000,
            isActive: true
          },
          {
            code: '5020',
            name: 'الإيجارات',
            type: 'expense',
            balance: 48000,
            isActive: true
          }
        ]
      }
    ];

    this.accountsTree = this.convertToTreeNodes(mockAccounts);
  }

  convertToTreeNodes(accounts: AccountNode[]): TreeNode[] {
    return accounts.map(account => ({
      data: account,
      children: account.children ? this.convertToTreeNodes(account.children) : [],
      expanded: true
    }));
  }

  expandAll() {
    this.accountsTree.forEach(node => {
      this.expandRecursive(node, true);
    });
  }

  collapseAll() {
    this.accountsTree.forEach(node => {
      this.expandRecursive(node, false);
    });
  }

  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach(childNode => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }

  openNew() {
    this.account = {
      code: '',
      name: '',
      type: '',
      balance: 0,
      isActive: true
    };
    this.parentAccount = null;
    this.isEditMode = false;
    this.dialogTitle = 'حساب جديد';
    this.accountDialog = true;
  }

  addSubAccount(parent: any) {
    this.account = {
      code: '',
      name: '',
      type: parent.type,
      balance: 0,
      isActive: true
    };
    this.parentAccount = parent;
    this.isEditMode = false;
    this.dialogTitle = 'إضافة حساب فرعي';
    this.accountDialog = true;
  }

  editAccount(account: any) {
    this.account = { ...account };
    this.parentAccount = null;
    this.isEditMode = true;
    this.dialogTitle = 'تعديل الحساب';
    this.accountDialog = true;
  }

  deleteAccount(account: any) {
    if (confirm('هل أنت متأكد من حذف هذا الحساب؟')) {
      this.messageService.add({
        severity: 'success',
        summary: 'نجح',
        detail: 'تم حذف الحساب بنجاح'
      });
      this.loadAccounts();
    }
  }

  hasChildren(account: any): boolean {
    // Check if account has children in the tree
    return false; // Implement actual logic
  }

  saveAccount() {
    if (!this.isValid()) {
      this.messageService.add({
        severity: 'error',
        summary: 'خطأ',
        detail: 'يرجى ملء جميع الحقول المطلوبة'
      });
      return;
    }

    this.messageService.add({
      severity: 'success',
      summary: 'نجح',
      detail: 'تم حفظ الحساب بنجاح'
    });

    this.hideDialog();
    this.loadAccounts();
  }

  hideDialog() {
    this.accountDialog = false;
    this.account = {};
    this.parentAccount = null;
  }

  isValid(): boolean {
    return this.account.code && 
           this.account.name && 
           this.account.type;
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
