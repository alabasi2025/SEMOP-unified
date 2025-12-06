import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { BadgeModule } from 'primeng/badge';
import { MessageService } from 'primeng/api';
import { GenesService, Gene } from '../../services/genes.service';

@Component({
  selector: 'app-gene-details',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    ChipModule,
    DividerModule,
    ToastModule,
    BadgeModule
  ],
  providers: [MessageService],
  template: `
    <div class="gene-details-page">
      <p-toast position="top-center"></p-toast>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="loading-state">
        <i class="pi pi-spin pi-spinner" style="font-size: 3rem; color: var(--primary-color);"></i>
        <p>جاري تحميل تفاصيل الجين...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="loadError && !isLoading" class="error-state">
        <i class="pi pi-exclamation-triangle" style="font-size: 3rem; color: #ef4444;"></i>
        <p>{{ loadError }}</p>
        <button pButton label="العودة للقائمة" icon="pi pi-arrow-right" (click)="goBack()"></button>
      </div>

      <!-- Gene Details -->
      <div *ngIf="gene && !isLoading && !loadError" class="gene-details">
        <!-- Header -->
        <div class="details-header">
          <button pButton icon="pi pi-arrow-right" class="p-button-text" (click)="goBack()" pTooltip="العودة"></button>
          <div class="header-content">
            <h1>{{ gene.nameAr }}</h1>
            <p class="gene-description">{{ gene.description }}</p>
          </div>
          <div class="header-actions">
            <span [class]="'status-badge ' + (gene.isActive ? 'status-active' : 'status-inactive')">
              {{ gene.isActive ? 'مفعّل' : 'معطّل' }}
            </span>
          </div>
        </div>

        <!-- Statistics Cards -->
        <div class="stats-grid">
          <p-card>
            <div class="stat-card">
              <i class="pi pi-star stat-icon" style="color: #f59e0b;"></i>
              <div class="stat-content">
                <h3>{{ gene.features?.length || 0 }}</h3>
                <p>ميزة مضافة</p>
              </div>
            </div>
          </p-card>

          <p-card>
            <div class="stat-card">
              <i class="pi pi-calendar stat-icon" style="color: #3b82f6;"></i>
              <div class="stat-content">
                <h3>{{ formatDate(gene.createdAt) }}</h3>
                <p>تاريخ الإنشاء</p>
              </div>
            </div>
          </p-card>

          <p-card>
            <div class="stat-card">
              <i class="pi pi-tag stat-icon" style="color: #8b5cf6;"></i>
              <div class="stat-content">
                <h3>{{ getCategoryName(gene.category) }}</h3>
                <p>التصنيف</p>
              </div>
            </div>
          </p-card>

          <p-card>
            <div class="stat-card">
              <i class="pi pi-globe stat-icon" style="color: #10b981;"></i>
              <div class="stat-content">
                <h3>{{ gene.geneType === 'PUBLIC' ? 'عام' : 'خاص' }}</h3>
                <p>نوع الجين</p>
              </div>
            </div>
          </p-card>
        </div>

        <!-- Features Section -->
        <p-card class="features-section">
          <div class="section-header">
            <h2>🎯 الميزات المضافة</h2>
            <p-badge [value]="(gene.features?.length || 0).toString()" severity="info"></p-badge>
          </div>

          <p-divider></p-divider>

          <div *ngIf="gene.features && gene.features.length > 0" class="features-list">
            <div *ngFor="let feature of gene.features" class="feature-item">
              <div class="feature-icon">
                <i [class]="getFeatureIcon(feature.featureType)"></i>
              </div>
              <div class="feature-content">
                <h4>{{ feature.featureNameAr }}</h4>
                <p *ngIf="feature.description">{{ feature.description }}</p>
                <div class="feature-meta">
                  <span class="feature-type">{{ getFeatureTypeName(feature.featureType) }}</span>
                  <span *ngIf="feature.isRequired" class="required-badge">إلزامي</span>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="!gene.features || gene.features.length === 0" class="empty-features">
            <i class="pi pi-info-circle" style="font-size: 2rem; color: #ccc;"></i>
            <p>لا توجد ميزات مضافة لهذا الجين</p>
          </div>
        </p-card>

        <!-- Actions -->
        <div class="details-actions">
          <button 
            *ngIf="!gene.isActive"
            pButton 
            label="تفعيل الجين" 
            icon="pi pi-check"
            class="p-button-success p-button-lg"
            (click)="activateGene()"></button>
          <button 
            *ngIf="gene.isActive"
            pButton 
            label="تعطيل الجين" 
            icon="pi pi-times"
            class="p-button-danger p-button-lg"
            (click)="deactivateGene()"></button>
          <button 
            pButton 
            label="العودة للقائمة" 
            icon="pi pi-arrow-right"
            class="p-button-outlined p-button-lg"
            (click)="goBack()"></button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .gene-details-page {
      padding: 1.5rem;
      background: #f5f7fa;
      min-height: 100vh;
    }

    .loading-state,
    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      text-align: center;
      min-height: 400px;
    }

    .loading-state p,
    .error-state p {
      margin: 1.5rem 0;
      font-size: 1.1rem;
      color: #666;
    }

    .details-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
      display: flex;
      gap: 1.5rem;
      align-items: center;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .header-content {
      flex: 1;
    }

    .header-content h1 {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
      font-weight: 700;
    }

    .gene-description {
      margin: 0;
      opacity: 0.9;
      font-size: 1.1rem;
    }

    .status-badge {
      padding: 0.5rem 1.25rem;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.95rem;
    }

    .status-active {
      background: #10b981;
      color: white;
    }

    .status-inactive {
      background: #ef4444;
      color: white;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .stat-icon {
      font-size: 2.5rem;
    }

    .stat-content h3 {
      margin: 0 0 0.25rem 0;
      font-size: 1.75rem;
      font-weight: 700;
      color: #1f2937;
    }

    .stat-content p {
      margin: 0;
      color: #6b7280;
      font-size: 0.95rem;
    }

    .features-section {
      margin-bottom: 2rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .section-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
    }

    .features-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .feature-item {
      display: flex;
      gap: 1.25rem;
      padding: 1.25rem;
      background: #f9fafb;
      border-radius: 8px;
      border-right: 4px solid #667eea;
    }

    .feature-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      background: #667eea;
      color: white;
      border-radius: 8px;
      font-size: 1.5rem;
    }

    .feature-content {
      flex: 1;
    }

    .feature-content h4 {
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #1f2937;
    }

    .feature-content p {
      margin: 0 0 0.75rem 0;
      color: #6b7280;
      font-size: 0.95rem;
    }

    .feature-meta {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .feature-type {
      padding: 0.25rem 0.75rem;
      background: #e5e7eb;
      color: #4b5563;
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .required-badge {
      padding: 0.25rem 0.75rem;
      background: #fef3c7;
      color: #92400e;
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .empty-features {
      text-align: center;
      padding: 3rem 2rem;
      color: #9ca3af;
    }

    .empty-features p {
      margin-top: 1rem;
      font-size: 1.1rem;
    }

    .details-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .details-actions button {
      min-width: 200px;
    }
  `]
})
export class GeneDetailsComponent implements OnInit {
  gene: Gene | null = null;
  isLoading: boolean = false;
  loadError: string | null = null;
  geneId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private genesService: GenesService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.geneId = this.route.snapshot.paramMap.get('id');
    if (this.geneId) {
      this.loadGeneDetails();
    } else {
      this.loadError = 'معرف الجين غير صحيح';
    }
  }

  loadGeneDetails() {
    if (!this.geneId) return;

    this.isLoading = true;
    this.loadError = null;

    this.genesService.getGeneById(this.geneId).subscribe({
      next: (data) => {
        this.gene = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading gene details:', error);
        this.isLoading = false;
        this.loadError = 'فشل في تحميل تفاصيل الجين. الرجاء المحاولة مرة أخرى.';
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: this.loadError
        });
      }
    });
  }

  activateGene() {
    if (!this.gene) return;

    this.genesService.activate(this.gene.id, '1').subscribe({
      next: () => {
        if (this.gene) {
          this.gene.isActive = true;
        }
        this.messageService.add({
          severity: 'success',
          summary: 'تم التفعيل',
          detail: `تم تفعيل جين "${this.gene?.nameAr}" بنجاح`
        });
      },
      error: (error) => {
        console.error('Error activating gene:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل في تفعيل الجين'
        });
      }
    });
  }

  deactivateGene() {
    if (!this.gene) return;

    this.genesService.deactivate(this.gene.id, '1').subscribe({
      next: () => {
        if (this.gene) {
          this.gene.isActive = false;
        }
        this.messageService.add({
          severity: 'success',
          summary: 'تم التعطيل',
          detail: `تم تعطيل جين "${this.gene?.nameAr}" بنجاح`
        });
      },
      error: (error) => {
        console.error('Error deactivating gene:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل في تعطيل الجين'
        });
      }
    });
  }

  goBack() {
    this.router.navigate(['/genes']);
  }

  formatDate(date: any): string {
    if (!date) return 'غير محدد';
    const d = new Date(date);
    return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  getCategoryName(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'ACCOUNTING': 'المحاسبة',
      'INVENTORY': 'المخزون',
      'PURCHASES': 'المشتريات',
      'SALES': 'المبيعات',
      'HR': 'الموارد البشرية',
      'CRM': 'إدارة العملاء'
    };
    return categoryMap[category] || category;
  }

  getFeatureIcon(featureType: string): string {
    const icons: { [key: string]: string } = {
      'UI_FIELD': 'pi pi-pencil',
      'PAGE': 'pi pi-file',
      'MENU_ITEM': 'pi pi-bars',
      'REPORT': 'pi pi-chart-bar',
      'VALIDATION': 'pi pi-shield',
      'WORKFLOW': 'pi pi-sitemap'
    };
    return icons[featureType] || 'pi pi-circle';
  }

  getFeatureTypeName(featureType: string): string {
    const typeNames: { [key: string]: string } = {
      'UI_FIELD': 'حقل واجهة',
      'PAGE': 'صفحة',
      'MENU_ITEM': 'عنصر قائمة',
      'REPORT': 'تقرير',
      'VALIDATION': 'تحقق',
      'WORKFLOW': 'سير عمل'
    };
    return typeNames[featureType] || featureType;
  }
}
