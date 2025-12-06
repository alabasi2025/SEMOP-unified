// PHASE-15: Smart Journal Entries - Create Smart Entry Component
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { SmartJournalEntriesService } from './smart-journal-entries.service';

@Component({
  selector: 'app-create-smart-entry',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    InputTextareaModule,
    InputNumberModule,
    ToastModule,
    ChipModule,
    DividerModule,
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>

    <p-card>
      <ng-template pTemplate="header">
        <div class="flex justify-content-between align-items-center p-3">
          <h2 class="m-0">إنشاء قيد ذكي</h2>
          <p-button
            label="رجوع"
            icon="pi pi-arrow-right"
            styleClass="p-button-text"
            (onClick)="goBack()"
          ></p-button>
        </div>
      </ng-template>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <!-- Operation Type -->
        <div class="field">
          <label for="operationType">نوع العملية *</label>
          <p-dropdown
            id="operationType"
            formControlName="operationType"
            [options]="operationTypes"
            optionLabel="label"
            optionValue="value"
            placeholder="اختر نوع العملية"
            [style]="{ width: '100%' }"
            (onChange)="onOperationTypeChange()"
          ></p-dropdown>
        </div>

        <!-- Template (if found) -->
        <div *ngIf="selectedTemplate" class="field">
          <label>القالب المستخدم</label>
          <div class="p-3 surface-100 border-round">
            <div class="flex align-items-center gap-2">
              <i class="pi pi-file text-primary"></i>
              <span class="font-semibold">{{ selectedTemplate.nameAr }}</span>
              <p-chip [label]="selectedTemplate.code" styleClass="ml-auto"></p-chip>
            </div>
            <p class="mt-2 mb-0 text-sm text-color-secondary">
              {{ selectedTemplate.lines?.length }} سطر
            </p>
          </div>
        </div>

        <p-divider></p-divider>

        <!-- Entry Date -->
        <div class="field">
          <label for="entryDate">تاريخ القيد *</label>
          <p-calendar
            id="entryDate"
            formControlName="entryDate"
            dateFormat="yy-mm-dd"
            [showIcon]="true"
            [style]="{ width: '100%' }"
          ></p-calendar>
        </div>

        <!-- Description -->
        <div class="field">
          <label for="description">الوصف</label>
          <textarea
            id="description"
            pInputTextarea
            formControlName="description"
            rows="3"
            [style]="{ width: '100%' }"
          ></textarea>
        </div>

        <p-divider></p-divider>

        <!-- Source Data -->
        <h3>بيانات المصدر</h3>

        <div class="field">
          <label for="totalAmount">المبلغ الإجمالي *</label>
          <p-inputNumber
            id="totalAmount"
            formControlName="totalAmount"
            mode="decimal"
            [minFractionDigits]="2"
            [maxFractionDigits]="2"
            [style]="{ width: '100%' }"
          ></p-inputNumber>
        </div>

        <!-- Suggested Accounts -->
        <div *ngIf="suggestedAccounts.length > 0" class="field">
          <label>الحسابات المقترحة</label>
          <div class="flex flex-wrap gap-2">
            <p-chip
              *ngFor="let account of suggestedAccounts"
              [label]="account.accountNameAr + ' (' + account.confidence + '%)'"
              icon="pi pi-star-fill"
              styleClass="cursor-pointer"
              (click)="selectSuggestedAccount(account)"
            ></p-chip>
          </div>
        </div>

        <!-- Account Selection -->
        <div class="field">
          <label for="accountId">الحساب *</label>
          <input
            id="accountId"
            type="text"
            pInputText
            formControlName="accountId"
            placeholder="معرف الحساب"
            [style]="{ width: '100%' }"
          />
        </div>

        <!-- Validation Result -->
        <div *ngIf="validationResult" class="field">
          <div
            class="p-3 border-round"
            [ngClass]="{
              'bg-green-50 border-green-500': validationResult.isValid,
              'bg-red-50 border-red-500': !validationResult.isValid
            }"
            style="border-width: 1px; border-style: solid"
          >
            <div class="flex align-items-center gap-2 mb-2">
              <i
                [class]="validationResult.isValid ? 'pi pi-check-circle text-green-600' : 'pi pi-times-circle text-red-600'"
                style="font-size: 1.5rem"
              ></i>
              <span class="font-semibold">
                {{ validationResult.isValid ? 'القيد صحيح' : 'القيد غير صحيح' }}
              </span>
            </div>

            <div class="grid">
              <div class="col-6">
                <span class="text-sm">المدين: {{ validationResult.totalDebit }}</span>
              </div>
              <div class="col-6">
                <span class="text-sm">الدائن: {{ validationResult.totalCredit }}</span>
              </div>
            </div>

            <div *ngIf="validationResult.errors.length > 0" class="mt-2">
              <p class="font-semibold text-sm mb-1">الأخطاء:</p>
              <ul class="m-0 pl-3">
                <li *ngFor="let error of validationResult.errors" class="text-sm">
                  {{ error }}
                </li>
              </ul>
            </div>

            <div *ngIf="validationResult.warnings.length > 0" class="mt-2">
              <p class="font-semibold text-sm mb-1">التحذيرات:</p>
              <ul class="m-0 pl-3">
                <li *ngFor="let warning of validationResult.warnings" class="text-sm">
                  {{ warning }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 mt-4">
          <p-button
            label="حفظ"
            icon="pi pi-check"
            type="submit"
            [loading]="loading"
            [disabled]="!form.valid"
          ></p-button>
          <p-button
            label="التحقق"
            icon="pi pi-shield"
            styleClass="p-button-secondary"
            (onClick)="validate()"
            [loading]="validating"
          ></p-button>
          <p-button
            label="إلغاء"
            icon="pi pi-times"
            styleClass="p-button-text"
            (onClick)="goBack()"
          ></p-button>
        </div>
      </form>
    </p-card>
  `,
})
export class CreateSmartEntryComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  validating = false;
  selectedTemplate: any = null;
  suggestedAccounts: any[] = [];
  validationResult: any = null;

  operationTypes = [
    { label: 'مبيعات نقدية', value: 'sales_cash' },
    { label: 'مبيعات آجلة', value: 'sales_credit' },
    { label: 'مشتريات نقدية', value: 'purchase_cash' },
    { label: 'مشتريات آجلة', value: 'purchase_credit' },
    { label: 'صرف رواتب', value: 'payroll_payment' },
    { label: 'صرف من مخزون', value: 'inventory_issue' },
  ];

  constructor(
    private fb: FormBuilder,
    private service: SmartJournalEntriesService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      operationType: ['', Validators.required],
      entryDate: [new Date(), Validators.required],
      description: [''],
      totalAmount: [0, [Validators.required, Validators.min(0.01)]],
      accountId: ['', Validators.required],
    });
  }

  onOperationTypeChange() {
    const operationType = this.form.get('operationType')?.value;
    if (operationType) {
      // Load template
      this.service.getTemplateByOperationType(operationType).subscribe({
        next: (template) => {
          this.selectedTemplate = template;
        },
        error: () => {
          this.selectedTemplate = null;
        },
      });

      // Load suggested accounts
      this.service.suggestAccounts({
        operationType,
        limit: 5,
      }).subscribe({
        next: (accounts) => {
          this.suggestedAccounts = accounts;
        },
        error: () => {
          this.suggestedAccounts = [];
        },
      });
    }
  }

  selectSuggestedAccount(account: any) {
    this.form.patchValue({
      accountId: account.accountId,
    });
  }

  validate() {
    if (!this.form.valid) {
      return;
    }

    this.validating = true;
    const formValue = this.form.value;

    this.service.validateJournalEntry({
      lines: [
        {
          accountId: formValue.accountId,
          debit: formValue.totalAmount,
          credit: 0,
        },
      ],
      entryDate: formValue.entryDate,
    }).subscribe({
      next: (result) => {
        this.validationResult = result;
        this.validating = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل التحقق من القيد',
        });
        this.validating = false;
      },
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    this.loading = true;
    const formValue = this.form.value;

    const payload = {
      operationType: formValue.operationType,
      sourceType: 'manual',
      sourceId: 'manual-' + Date.now(),
      sourceData: {
        totalAmount: formValue.totalAmount,
        accountId: formValue.accountId,
      },
      entryDate: formValue.entryDate,
      description: formValue.description,
    };

    this.service.createFromOperation(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'نجح',
          detail: 'تم إنشاء القيد بنجاح',
        });
        this.router.navigate(['/smart-journal-entries']);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل إنشاء القيد',
        });
        this.loading = false;
      },
    });
  }

  goBack() {
    this.router.navigate(['/smart-journal-entries']);
  }
}
