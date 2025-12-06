// PHASE-15: Smart Journal Entries - Templates List Component
//
// الوصف:
// هذا المكون مسؤول عن عرض قائمة قوالب القيود الذكية (Smart Journal Entry Templates) في جدول تفاعلي.
// يوفر وظائف لتحميل القوالب، عرضها، تعديلها، نسخها، وحذفها.
// يعتمد على خدمة SmartJournalEntriesService للتفاعل مع الواجهة الخلفية (Backend).
//
// الميزات:
// 1. عرض القوالب في جدول PrimeNG مع ترقيم وتصفية.
// 2. زر لإضافة قالب جديد.
// 3. أزرار إجراءات لكل قالب (عرض، تعديل، نسخ، حذف).
// 4. تأكيد الحذف باستخدام ConfirmDialog.
// 5. عرض رسائل النجاح/الخطأ باستخدام Toast.
//
// الحالة:
// تم تطوير المكون بشكل كامل في المرحلة السابقة (PHASE-15) وهو جاهز للاستخدام.
//
// التغييرات في هذه المهمة:
// - لا توجد تغييرات وظيفية، فقط إضافة توثيق شامل للمكون.
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SmartJournalEntriesService } from './smart-journal-entries.service';

@Component({
  selector: 'app-templates-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    CardModule,
    TagModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <p-toast></p-toast>
    <p-confirmDialog></p-confirmDialog>
    
    <p-card>
      <ng-template pTemplate="header">
        <div class="flex justify-content-between align-items-center p-3">
          <h2 class="m-0">قوالب القيود الذكية</h2>
          <p-button
            label="إضافة قالب جديد"
            icon="pi pi-plus"
            (onClick)="navigateToCreate()"
          ></p-button>
        </div>
      </ng-template>

      <p-table
        [value]="templates"
        [loading]="loading"
        [paginator]="true"
        [rows]="10"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="عرض {first} إلى {last} من {totalRecords} قالب"
        styleClass="p-datatable-sm"
      >
        <ng-template pTemplate="header">
          <tr>
            <th>الكود</th>
            <th>الاسم</th>
            <th>نوع العملية</th>
            <th>عدد السطور</th>
            <th>الحالة</th>
            <th>الإجراءات</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-template>
          <tr>
            <td>{{ template.code }}</td>
            <td>{{ template.nameAr }}</td>
            <td>{{ template.operationType }}</td>
            <td>{{ template.lines?.length || 0 }}</td>
            <td>
              <p-tag
                [value]="template.isActive ? 'نشط' : 'غير نشط'"
                [severity]="template.isActive ? 'success' : 'danger'"
              ></p-tag>
            </td>
            <td>
              <p-button
                icon="pi pi-eye"
                styleClass="p-button-rounded p-button-text"
                pTooltip="عرض"
                (onClick)="viewTemplate(template.id)"
              ></p-button>
              <p-button
                icon="pi pi-pencil"
                styleClass="p-button-rounded p-button-text p-button-warning"
                pTooltip="تعديل"
                (onClick)="editTemplate(template.id)"
              ></p-button>
              <p-button
                icon="pi pi-copy"
                styleClass="p-button-rounded p-button-text p-button-info"
                pTooltip="نسخ"
                (onClick)="cloneTemplate(template)"
              ></p-button>
              <p-button
                icon="pi pi-trash"
                styleClass="p-button-rounded p-button-text p-button-danger"
                pTooltip="حذف"
                (onClick)="deleteTemplate(template)"
              ></p-button>
            </td>
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="6" class="text-center">
              <div class="p-5">
                <i class="pi pi-inbox" style="font-size: 3rem; color: var(--surface-400)"></i>
                <p class="mt-3">لا توجد قوالب حالياً</p>
                <p-button
                  label="إضافة قالب جديد"
                  icon="pi pi-plus"
                  (onClick)="navigateToCreate()"
                ></p-button>
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </p-card>
  `,
})
export class TemplatesListComponent implements OnInit {
  templates: any[] = [];
  loading = false;

  constructor(
    private service: SmartJournalEntriesService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadTemplates();
  }

  loadTemplates() {
    this.loading = true;
    this.service.getAllTemplates().subscribe({
      next: (data) => {
        this.templates = data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل تحميل القوالب',
        });
        this.loading = false;
      },
    });
  }

  navigateToCreate() {
    this.router.navigate(['/smart-journal-entries/templates/create']);
  }

  viewTemplate(id: string) {
    this.router.navigate(['/smart-journal-entries/templates', id]);
  }

  editTemplate(id: string) {
    this.router.navigate(['/smart-journal-entries/templates', id, 'edit']);
  }

  cloneTemplate(template: any) {
    this.router.navigate(['/smart-journal-entries/templates/clone', template.id]);
  }

  deleteTemplate(template: any) {
    this.confirmationService.confirm({
      message: `هل أنت متأكد من حذف القالب "${template.nameAr}"؟`,
      header: 'تأكيد الحذف',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'نعم',
      rejectLabel: 'لا',
      accept: () => {
        this.service.deleteTemplate(template.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'نجح',
              detail: 'تم حذف القالب بنجاح',
            });
            this.loadTemplates();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'خطأ',
              detail: 'فشل حذف القالب',
            });
          },
        });
      },
    });
  }
}
