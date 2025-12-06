import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { UsersService } from '../../services/users.service';
import { UserResponseDto, CreateUserDto } from '@semop/contracts';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule, 
    TableModule, 
    ButtonModule, 
    DialogModule, 
    InputTextModule, 
    FormsModule, 
    ToastModule, 
    ConfirmDialogModule,
    ToolbarModule,
    TagModule,
    TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="page-container">
      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-icon">
            <i class="pi pi-users"></i>
          </div>
          <div class="header-text">
            <h1>إدارة المستخدمين</h1>
            <p>إدارة حسابات المستخدمين وصلاحياتهم</p>
          </div>
        </div>
        <button 
          pButton 
          label="إضافة مستخدم" 
          icon="pi pi-plus" 
          class="add-btn"
          (click)="showCreateDialog()">
        </button>
      </div>

      <!-- Toolbar -->
      <p-toolbar styleClass="toolbar">
        <ng-template pTemplate="left">
          <span class="p-input-icon-left search-box">
            <i class="pi pi-search"></i>
            <input 
              pInputText 
              type="text" 
              [(ngModel)]="searchText"
              (input)="onSearch()"
              placeholder="بحث في المستخدمين..." 
            />
          </span>
        </ng-template>
        <ng-template pTemplate="right">
          <button 
            pButton 
            label="تحديث" 
            icon="pi pi-refresh" 
            class="p-button-outlined"
            (click)="loadUsers()">
          </button>
        </ng-template>
      </p-toolbar>

      <!-- Table -->
      <div class="table-container">
        <p-table 
          [value]="filteredUsers" 
          [loading]="loading"
          [paginator]="true"
          [rows]="10"
          [rowsPerPageOptions]="[10, 25, 50]"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="عرض {first} إلى {last} من {totalRecords} مستخدم"
          styleClass="custom-table">
          
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="id">
                الرقم
                <p-sortIcon field="id"></p-sortIcon>
              </th>
              <th pSortableColumn="username">
                اسم المستخدم
                <p-sortIcon field="username"></p-sortIcon>
              </th>
              <th pSortableColumn="email">
                البريد الإلكتروني
                <p-sortIcon field="email"></p-sortIcon>
              </th>
              <th>الاسم الكامل</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-user>
            <tr>
              <td>{{ user.id }}</td>
              <td>
                <div class="user-cell">
                  <div class="user-avatar">{{ user.username.charAt(0).toUpperCase() }}</div>
                  <span class="user-name">{{ user.username }}</span>
                </div>
              </td>
              <td>{{ user.email }}</td>
              <td>{{ user.firstName }} {{ user.lastName }}</td>
              <td>
                <p-tag 
                  [value]="user.isActive ? 'نشط' : 'غير نشط'" 
                  [severity]="user.isActive ? 'success' : 'danger'">
                </p-tag>
              </td>
              <td>
                <div class="action-buttons">
                  <button 
                    pButton 
                    icon="pi pi-pencil" 
                    class="p-button-rounded p-button-text p-button-info"
                    pTooltip="تعديل"
                    (click)="editUser(user)">
                  </button>
                  <button 
                    pButton 
                    icon="pi pi-trash" 
                    class="p-button-rounded p-button-text p-button-danger"
                    pTooltip="حذف"
                    (click)="confirmDelete(user)">
                  </button>
                </div>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="6" class="empty-message">
                <div class="empty-state">
                  <i class="pi pi-users"></i>
                  <h3>لا توجد بيانات</h3>
                  <p>لم يتم العثور على مستخدمين</p>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <!-- Dialog -->
      <p-dialog 
        [(visible)]="displayDialog" 
        [header]="editMode ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'"
        [modal]="true" 
        [style]="{width: '500px'}"
        styleClass="custom-dialog">
        
        <div class="dialog-content">
          <div class="form-group">
            <label for="username">اسم المستخدم <span class="required">*</span></label>
            <input 
              pInputText 
              id="username" 
              [(ngModel)]="currentUser.username" 
              [disabled]="editMode"
              required 
              class="w-full"
              placeholder="أدخل اسم المستخدم"
            />
          </div>

          <div class="form-group">
            <label for="email">البريد الإلكتروني <span class="required">*</span></label>
            <input 
              pInputText 
              id="email" 
              [(ngModel)]="currentUser.email" 
              required 
              type="email"
              class="w-full"
              placeholder="example@domain.com"
            />
          </div>

          @if (!editMode) {
            <div class="form-group">
              <label for="password">كلمة المرور <span class="required">*</span></label>
              <input 
                pInputText 
                id="password" 
                [(ngModel)]="currentUser.password" 
                type="password"
                class="w-full"
                placeholder="••••••••"
              />
            </div>
          }

          <div class="form-group">
            <label for="firstName">الاسم الأول</label>
            <input 
              pInputText 
              id="firstName" 
              [(ngModel)]="currentUser.firstName" 
              class="w-full"
              placeholder="أدخل الاسم الأول"
            />
          </div>

          <div class="form-group">
            <label for="lastName">اسم العائلة</label>
            <input 
              pInputText 
              id="lastName" 
              [(ngModel)]="currentUser.lastName" 
              class="w-full"
              placeholder="أدخل اسم العائلة"
            />
          </div>
        </div>

        <ng-template pTemplate="footer">
          <button 
            pButton 
            label="إلغاء" 
            icon="pi pi-times" 
            class="p-button-text"
            (click)="displayDialog = false">
          </button>
          <button 
            pButton 
            label="حفظ" 
            icon="pi pi-check" 
            (click)="saveUser()"
            [loading]="saving">
          </button>
        </ng-template>
      </p-dialog>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 0;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      background: white;
      padding: 2rem;
      border-radius: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .header-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 2rem;
    }

    .header-text h1 {
      margin: 0 0 0.5rem 0;
      font-size: 1.75rem;
      color: #2c3e50;
    }

    .header-text p {
      margin: 0;
      color: #7f8c8d;
    }

    .add-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
    }

    .add-btn:hover {
      background: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
    }

    :host ::ng-deep .toolbar {
      background: white;
      border: none;
      border-radius: 12px;
      padding: 1rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .search-box {
      width: 300px;
    }

    .search-box input {
      width: 100%;
      padding-left: 2.5rem;
    }

    .table-container {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    :host ::ng-deep .custom-table {
      .p-datatable-header {
        background: transparent;
        border: none;
      }

      .p-datatable-thead > tr > th {
        background: #f8f9fa;
        color: #2c3e50;
        font-weight: 600;
        padding: 1rem;
        border: none;
      }

      .p-datatable-tbody > tr {
        transition: all 0.2s;
      }

      .p-datatable-tbody > tr:hover {
        background: #f8f9fa;
      }

      .p-datatable-tbody > tr > td {
        padding: 1rem;
        border-bottom: 1px solid #e9ecef;
      }
    }

    .user-cell {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 1.125rem;
    }

    .user-name {
      font-weight: 500;
      color: #2c3e50;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
    }

    .empty-state i {
      font-size: 4rem;
      color: #dee2e6;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      margin: 0 0 0.5rem 0;
      color: #6c757d;
    }

    .empty-state p {
      margin: 0;
      color: #adb5bd;
    }

    :host ::ng-deep .custom-dialog {
      .p-dialog-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 12px 12px 0 0;
      }

      .p-dialog-content {
        padding: 2rem;
      }
    }

    .dialog-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-weight: 600;
      color: #2c3e50;
    }

    .required {
      color: #e74c3c;
    }

    .w-full {
      width: 100%;
    }
  `]
})
export class UsersComponent implements OnInit {
  users: UserResponseDto[] = [];
  filteredUsers: UserResponseDto[] = [];
  loading = false;
  displayDialog = false;
  editMode = false;
  saving = false;
  currentUser: any = {};
  searchText = '';

  constructor(
    private router: Router,
    private usersService: UsersService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.usersService.getAll().subscribe({
      next: (data: any) => {
        this.users = data;
        this.filteredUsers = data;
        this.loading = false;
      },
      error: (error: any) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل تحميل المستخدمين' });
        console.error('Error loading users:', error);
      }
    });
  }

  onSearch() {
    if (!this.searchText) {
      this.filteredUsers = this.users;
      return;
    }

    const search = this.searchText.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.username.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      (user.firstName && user.firstName.toLowerCase().includes(search)) ||
      (user.lastName && user.lastName.toLowerCase().includes(search))
    );
  }

  showCreateDialog() {
    this.editMode = false;
    this.currentUser = {};
    this.displayDialog = true;
  }

  editUser(user: UserResponseDto) {
    this.editMode = true;
    this.currentUser = { ...user };
    this.displayDialog = true;
  }

  saveUser() {
    if (!this.currentUser.username || !this.currentUser.email) {
      this.messageService.add({ severity: 'warn', summary: 'تحذير', detail: 'الرجاء ملء الحقول المطلوبة' });
      return;
    }

    if (!this.editMode && !this.currentUser.password) {
      this.messageService.add({ severity: 'warn', summary: 'تحذير', detail: 'الرجاء إدخال كلمة المرور' });
      return;
    }

    this.saving = true;

    if (this.editMode) {
      this.usersService.update(this.currentUser.id, this.currentUser).subscribe({
        next: () => {
          this.saving = false;
          this.displayDialog = false;
          this.messageService.add({ severity: 'success', summary: 'نجح', detail: 'تم تحديث المستخدم بنجاح' });
          this.loadUsers();
        },
        error: (error: any) => {
          this.saving = false;
          this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل تحديث المستخدم' });
          console.error('Error updating user:', error);
        }
      });
    } else {
      this.usersService.create(this.currentUser as CreateUserDto).subscribe({
        next: () => {
          this.saving = false;
          this.displayDialog = false;
          this.messageService.add({ severity: 'success', summary: 'نجح', detail: 'تم إضافة المستخدم بنجاح' });
          this.loadUsers();
        },
        error: (error: any) => {
          this.saving = false;
          this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل إضافة المستخدم' });
          console.error('Error creating user:', error);
        }
      });
    }
  }

  confirmDelete(user: UserResponseDto) {
    this.confirmationService.confirm({
      message: `هل أنت متأكد من حذف المستخدم ${user.username}؟`,
      header: 'تأكيد الحذف',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'نعم',
      rejectLabel: 'لا',
      accept: () => {
        this.deleteUser(user.id);
      }
    });
  }

  deleteUser(id: string) {
    this.usersService.delete(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'نجح', detail: 'تم حذف المستخدم بنجاح' });
        this.loadUsers();
      },
      error: (error: any) => {
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل حذف المستخدم' });
        console.error('Error deleting user:', error);
      }
    });
  }
}
