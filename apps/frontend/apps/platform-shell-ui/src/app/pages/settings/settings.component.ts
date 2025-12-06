import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  template: `
    <div class="settings-container">
      <div class="page-header">
        <div class="header-content">
          <h1>⚙️ إعدادات النظام</h1>
          <p>إدارة إعدادات وتكوينات النظام</p>
        </div>
        <button pButton label="حفظ التغييرات" icon="pi pi-save" class="p-button-success"></button>
      </div>

      <div class="settings-grid">
        <!-- General Settings -->
        <p-card>
          <ng-template pTemplate="header">
            <div class="card-header">
              <i class="pi pi-cog"></i>
              <h3>الإعدادات العامة</h3>
            </div>
          </ng-template>
          <div class="settings-list">
            <div class="setting-item">
              <span class="setting-label">اسم النظام</span>
              <span class="setting-value">SEMOP ERP v2.2.0</span>
            </div>
            <div class="setting-item">
              <span class="setting-label">اللغة الافتراضية</span>
              <span class="setting-value">العربية</span>
            </div>
            <div class="setting-item">
              <span class="setting-label">المنطقة الزمنية</span>
              <span class="setting-value">Asia/Riyadh</span>
            </div>
          </div>
        </p-card>

        <!-- Security Settings -->
        <p-card>
          <ng-template pTemplate="header">
            <div class="card-header">
              <i class="pi pi-shield"></i>
              <h3>إعدادات الأمان</h3>
            </div>
          </ng-template>
          <div class="settings-list">
            <div class="setting-item">
              <span class="setting-label">مدة الجلسة</span>
              <span class="setting-value">30 دقيقة</span>
            </div>
            <div class="setting-item">
              <span class="setting-label">الحد الأدنى لطول كلمة المرور</span>
              <span class="setting-value">8 أحرف</span>
            </div>
            <div class="setting-item">
              <span class="setting-label">المصادقة الثنائية</span>
              <span class="setting-value badge success">مفعل</span>
            </div>
          </div>
        </p-card>

        <!-- Email Settings -->
        <p-card>
          <ng-template pTemplate="header">
            <div class="card-header">
              <i class="pi pi-envelope"></i>
              <h3>إعدادات البريد الإلكتروني</h3>
            </div>
          </ng-template>
          <div class="settings-list">
            <div class="setting-item">
              <span class="setting-label">خادم SMTP</span>
              <span class="setting-value">smtp.gmail.com</span>
            </div>
            <div class="setting-item">
              <span class="setting-label">منفذ SMTP</span>
              <span class="setting-value">587</span>
            </div>
            <div class="setting-item">
              <span class="setting-label">SSL</span>
              <span class="setting-value badge success">مفعل</span>
            </div>
          </div>
        </p-card>

        <!-- Notifications Settings -->
        <p-card>
          <ng-template pTemplate="header">
            <div class="card-header">
              <i class="pi pi-bell"></i>
              <h3>إعدادات الإشعارات</h3>
            </div>
          </ng-template>
          <div class="settings-list">
            <div class="setting-item">
              <span class="setting-label">إشعارات البريد الإلكتروني</span>
              <span class="setting-value badge success">مفعل</span>
            </div>
            <div class="setting-item">
              <span class="setting-label">إشعارات SMS</span>
              <span class="setting-value badge danger">معطل</span>
            </div>
            <div class="setting-item">
              <span class="setting-label">الإشعارات الفورية</span>
              <span class="setting-value badge success">مفعل</span>
            </div>
          </div>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      padding: 0;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding: 2rem;
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      border-radius: 16px;
      color: white;
    }

    .header-content h1 {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
      font-weight: 700;
    }

    .header-content p {
      margin: 0;
      opacity: 0.9;
    }

    .settings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    :host ::ng-deep .p-card {
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      border-radius: 16px;
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1.5rem;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    }

    .card-header i {
      font-size: 1.5rem;
      color: #667eea;
    }

    .card-header h3 {
      margin: 0;
      font-size: 1.25rem;
      color: #2c3e50;
      font-weight: 600;
    }

    .settings-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1.5rem;
    }

    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
      transition: all 0.2s;
    }

    .setting-item:hover {
      background: #e9ecef;
    }

    .setting-label {
      font-weight: 600;
      color: #2c3e50;
    }

    .setting-value {
      color: #7f8c8d;
    }

    .setting-value.badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .setting-value.badge.success {
      background: #d4edda;
      color: #155724;
    }

    .setting-value.badge.danger {
      background: #f8d7da;
      color: #721c24;
    }

    @media (max-width: 768px) {
      .settings-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SettingsComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Load settings from API
  }
}
