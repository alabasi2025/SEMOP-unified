// PHASE-15: Smart Journal Entries - Create Smart Entry Component
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SmartJournalEntriesService } from './smart-journal-entries.service';

@Component({
  selector: 'app-create-smart-entry',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">إنشاء قيد ذكي</h2>
          <button
            type="button"
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            (click)="goBack()"
          >
            رجوع
          </button>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="mb-4">
            <label class="block mb-2 font-semibold">نوع العملية *</label>
            <select formControlName="operationType" class="w-full p-2 border rounded">
              <option value="">اختر نوع العملية</option>
              <option *ngFor="let type of operationTypes" [value]="type.value">
                {{ type.label }}
              </option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block mb-2 font-semibold">تاريخ القيد *</label>
            <input type="date" formControlName="entryDate" class="w-full p-2 border rounded" />
          </div>

          <div class="mb-4">
            <label class="block mb-2 font-semibold">الوصف</label>
            <textarea formControlName="description" rows="3" class="w-full p-2 border rounded"></textarea>
          </div>

          <div class="mb-4">
            <label class="block mb-2 font-semibold">المبلغ الإجمالي *</label>
            <input type="number" formControlName="totalAmount" step="0.01" class="w-full p-2 border rounded" />
          </div>

          <div class="mb-4">
            <label class="block mb-2 font-semibold">الحساب *</label>
            <input type="text" formControlName="accountId" placeholder="معرف الحساب" class="w-full p-2 border rounded" />
          </div>

          <div class="flex gap-2">
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              [disabled]="!form.valid || loading"
            >
              {{ loading ? 'جاري الحفظ...' : 'حفظ' }}
            </button>
            <button type="button" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" (click)="goBack()">
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class CreateSmartEntryComponent implements OnInit {
  form!: FormGroup;
  loading = false;

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
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    const today = new Date().toISOString().split('T')[0];
    this.form = this.fb.group({
      operationType: ['', Validators.required],
      entryDate: [today, Validators.required],
      description: [''],
      totalAmount: [0, [Validators.required, Validators.min(0.01)]],
      accountId: ['', Validators.required],
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
        alert('تم إنشاء القيد بنجاح');
        this.router.navigate(['/accounting/smart-journal-entries']);
      },
      error: () => {
        alert('فشل إنشاء القيد');
        this.loading = false;
      },
    });
  }

  goBack() {
    this.router.navigate(['/accounting/smart-journal-entries']);
  }
}
