// PHASE-15: Smart Journal Entries - Dashboard Component
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-smart-entries-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  template: `
    <div class="grid">
      <div class="col-12">
        <p-card>
          <ng-template pTemplate="header">
            <div class="p-3">
              <h1 class="m-0">نظام القيود الذكية</h1>
              <p class="mt-2 mb-0 text-color-secondary">
                إنشاء وإدارة القيود المحاسبية بذكاء اصطناعي
              </p>
            </div>
          </ng-template>

          <div class="grid">
            <!-- Create Smart Entry -->
            <div class="col-12 md:col-6 lg:col-4">
              <div
                class="surface-card p-4 border-round cursor-pointer hover:surface-hover transition-colors transition-duration-150"
                (click)="navigateTo('/smart-journal-entries/create')"
              >
                <div class="flex align-items-center gap-3">
                  <div
                    class="flex align-items-center justify-content-center bg-blue-100 border-circle"
                    style="width: 3rem; height: 3rem"
                  >
                    <i class="pi pi-plus text-blue-600" style="font-size: 1.5rem"></i>
                  </div>
                  <div>
                    <h3 class="m-0 mb-1">إنشاء قيد ذكي</h3>
                    <p class="m-0 text-sm text-color-secondary">
                      إنشاء قيد محاسبي بذكاء اصطناعي
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Manage Templates -->
            <div class="col-12 md:col-6 lg:col-4">
              <div
                class="surface-card p-4 border-round cursor-pointer hover:surface-hover transition-colors transition-duration-150"
                (click)="navigateTo('/smart-journal-entries/templates')"
              >
                <div class="flex align-items-center gap-3">
                  <div
                    class="flex align-items-center justify-content-center bg-green-100 border-circle"
                    style="width: 3rem; height: 3rem"
                  >
                    <i class="pi pi-file text-green-600" style="font-size: 1.5rem"></i>
                  </div>
                  <div>
                    <h3 class="m-0 mb-1">إدارة القوالب</h3>
                    <p class="m-0 text-sm text-color-secondary">
                      عرض وتعديل قوالب القيود
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Learning Analytics -->
            <div class="col-12 md:col-6 lg:col-4">
              <div
                class="surface-card p-4 border-round cursor-pointer hover:surface-hover transition-colors transition-duration-150"
                (click)="navigateTo('/smart-journal-entries/analytics')"
              >
                <div class="flex align-items-center gap-3">
                  <div
                    class="flex align-items-center justify-content-center bg-purple-100 border-circle"
                    style="width: 3rem; height: 3rem"
                  >
                    <i class="pi pi-chart-line text-purple-600" style="font-size: 1.5rem"></i>
                  </div>
                  <div>
                    <h3 class="m-0 mb-1">تحليلات التعلم</h3>
                    <p class="m-0 text-sm text-color-secondary">
                      إحصائيات الذكاء الاصطناعي
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </p-card>
      </div>

      <!-- Features -->
      <div class="col-12">
        <p-card>
          <ng-template pTemplate="header">
            <div class="p-3">
              <h2 class="m-0">الميزات الرئيسية</h2>
            </div>
          </ng-template>

          <div class="grid">
            <div class="col-12 md:col-6 lg:col-3">
              <div class="text-center p-3">
                <i class="pi pi-bolt text-primary mb-3" style="font-size: 2rem"></i>
                <h4 class="mb-2">إنشاء تلقائي</h4>
                <p class="text-sm text-color-secondary m-0">
                  إنشاء القيود تلقائياً من العمليات
                </p>
              </div>
            </div>

            <div class="col-12 md:col-6 lg:col-3">
              <div class="text-center p-3">
                <i class="pi pi-brain text-primary mb-3" style="font-size: 2rem"></i>
                <h4 class="mb-2">ذكاء اصطناعي</h4>
                <p class="text-sm text-color-secondary m-0">
                  التعلم من العمليات السابقة
                </p>
              </div>
            </div>

            <div class="col-12 md:col-6 lg:col-3">
              <div class="text-center p-3">
                <i class="pi pi-shield text-primary mb-3" style="font-size: 2rem"></i>
                <h4 class="mb-2">تحقق تلقائي</h4>
                <p class="text-sm text-color-secondary m-0">
                  التحقق من توازن القيود تلقائياً
                </p>
              </div>
            </div>

            <div class="col-12 md:col-6 lg:col-3">
              <div class="text-center p-3">
                <i class="pi pi-cog text-primary mb-3" style="font-size: 2rem"></i>
                <h4 class="mb-2">قوالب مرنة</h4>
                <p class="text-sm text-color-secondary m-0">
                  قوالب قابلة للتخصيص لكل عملية
                </p>
              </div>
            </div>
          </div>
        </p-card>
      </div>
    </div>
  `,
})
export class DashboardComponent {
  constructor(private router: Router) {}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
