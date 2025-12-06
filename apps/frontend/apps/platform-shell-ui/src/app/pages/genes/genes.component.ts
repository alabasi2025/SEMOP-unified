import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { TabViewModule } from 'primeng/tabview'; // Not available in current PrimeNG version
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
// import { DropdownModule } from 'primeng/dropdown'; // Not available in current PrimeNG version
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { MessageService, ConfirmationService } from 'primeng/api';
import { GenesService, Gene, GeneActivation, Sector } from '../../services/genes.service';

interface CategoryGroup {
  category: string;
  categoryNameAr: string;
  icon: string;
  publicGenes: Gene[];
  privateGenes: Gene[];
}

@Component({
  selector: 'app-genes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    // TabViewModule,
    ButtonModule,
    CardModule,
    ChipModule,
    ToastModule,
    ConfirmDialogModule,
    InputTextModule,
    // DropdownModule,
    AccordionModule,
    BadgeModule,
    DividerModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="genes-page">
      <p-toast position="top-center"></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>🧬 نظام الجينات</h1>
          <p class="subtitle">إدارة موحدة لجميع الميزات الإضافية</p>
        </div>
        <div class="header-actions">
          <div class="sector-info">
            <span class="sector-label">قطاع عملك:</span>
            <select 
              [(ngModel)]="selectedSector"
              (change)="onSectorChange()"
              class="sector-select">
              <option *ngFor="let sector of sectors" [value]="sector.id">
                {{ sector.icon }} {{ sector.nameAr }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Search and Filter -->
      <div class="filters-section">
        <div class="search-box">
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <input 
              pInputText 
              type="text" 
              [(ngModel)]="searchTerm"
              (input)="filterGenes()"
              placeholder="بحث في الجينات..." />
          </span>
        </div>
        
        <div class="category-filters">
          <button 
            pButton 
            [label]="'الكل (' + getTotalCount() + ')'"
            [class]="selectedCategory === 'ALL' ? 'p-button-raised' : 'p-button-outlined'"
            (click)="selectCategory('ALL')"></button>
          <button 
            pButton 
            [label]="'📊 المحاسبة (' + getCategoryCount('ACCOUNTING') + ')'"
            [class]="selectedCategory === 'ACCOUNTING' ? 'p-button-raised' : 'p-button-outlined'"
            (click)="selectCategory('ACCOUNTING')"></button>
          <button 
            pButton 
            [label]="'📦 المخزون (' + getCategoryCount('INVENTORY') + ')'"
            [class]="selectedCategory === 'INVENTORY' ? 'p-button-raised' : 'p-button-outlined'"
            (click)="selectCategory('INVENTORY')"></button>
          <button 
            pButton 
            [label]="'🛒 المشتريات (' + getCategoryCount('PURCHASES') + ')'"
            [class]="selectedCategory === 'PURCHASES' ? 'p-button-raised' : 'p-button-outlined'"
            (click)="selectCategory('PURCHASES')"></button>
          <button 
            pButton 
            [label]="'💰 المبيعات (' + getCategoryCount('SALES') + ')'"
            [class]="selectedCategory === 'SALES' ? 'p-button-raised' : 'p-button-outlined'"
            (click)="selectCategory('SALES')"></button>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="loading-state">
        <i class="pi pi-spin pi-spinner" style="font-size: 3rem; color: var(--primary-color);"></i>
        <p>جاري تحميل الجينات...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="loadError && !isLoading" class="error-state">
        <i class="pi pi-exclamation-triangle" style="font-size: 3rem; color: #ef4444;"></i>
        <p>{{ loadError }}</p>
        <button pButton label="إعادة المحاولة" icon="pi pi-refresh" (click)="retryLoad()"></button>
      </div>

      <!-- Genes List -->
      <div *ngIf="!isLoading && !loadError" class="genes-content">
        <div *ngFor="let group of filteredGroups" class="category-section">
          <div class="category-header">
            <h2>{{ group.icon }} {{ group.categoryNameAr }}</h2>
            <p-badge 
              [value]="(group.publicGenes.length + group.privateGenes.length).toString()" 
              severity="info">
            </p-badge>
          </div>

          <!-- Public Genes -->
          <div *ngIf="group.publicGenes.length > 0" class="genes-group">
            <div class="group-title">
              <span class="group-icon">🌍</span>
              <h3>جينات عامة (متاحة للجميع)</h3>
            </div>
            
            <div class="genes-grid">
              <div *ngFor="let gene of group.publicGenes" class="gene-card">
                <p-card>
                  <div class="gene-header">
                    <div class="gene-info">
                      <h4>{{ gene.nameAr }}</h4>
                      <p class="gene-description">{{ gene.description }}</p>
                    </div>
                    <div class="gene-status">
                      <span 
                        [class]="'status-badge ' + (isGeneActive(gene.id) ? 'status-active' : 'status-inactive')">
                        {{ isGeneActive(gene.id) ? 'مفعّل' : 'معطّل' }}
                      </span>
                    </div>
                  </div>

                  <p-divider></p-divider>

                  <div class="gene-features">
                    <h5>الميزات المضافة:</h5>
                    <ul>
                      <li *ngFor="let feature of gene.features">
                        <i [class]="getFeatureIcon(feature.featureType)"></i>
                        {{ feature.featureNameAr }}
                        <span *ngIf="feature.isRequired" class="required-badge">إلزامي</span>
                      </li>
                    </ul>
                  </div>

                  <div class="gene-actions">
                    <button 
                      *ngIf="!isGeneActive(gene.id)"
                      pButton 
                      label="تفعيل" 
                      icon="pi pi-check"
                      class="p-button-success"
                      (click)="activateGene(gene)"></button>
                    <button 
                      *ngIf="isGeneActive(gene.id)"
                      pButton 
                      label="تعطيل" 
                      icon="pi pi-times"
                      class="p-button-danger p-button-outlined"
                      (click)="deactivateGene(gene)"></button>
                    <button 
                      *ngIf="isGeneActive(gene.id)"
                      pButton 
                      icon="pi pi-cog" 
                      class="p-button-text"
                      pTooltip="إعدادات"></button>
                  </div>
                </p-card>
              </div>
            </div>
          </div>

          <!-- Private Genes -->
          <div *ngIf="group.privateGenes.length > 0" class="genes-group">
            <div class="group-title">
              <span class="group-icon">{{ getCurrentSectorIcon() }}</span>
              <h3>جينات خاصة بـ{{ getCurrentSectorName() }}</h3>
            </div>
            
            <div class="genes-grid">
              <div *ngFor="let gene of group.privateGenes" class="gene-card private">
                <p-card>
                  <div class="gene-header">
                    <div class="gene-info">
                      <h4>{{ gene.nameAr }}</h4>
                      <p class="gene-description">{{ gene.description }}</p>
                      <p-chip 
                        [label]="gene.sectorName || ''" 
                        icon="pi pi-tag"
                        styleClass="sector-chip">
                      </p-chip>
                    </div>
                    <div class="gene-status">
                      <span 
                        [class]="'status-badge ' + (isGeneActive(gene.id) ? 'status-active' : 'status-inactive')">
                        {{ isGeneActive(gene.id) ? 'مفعّل' : 'معطّل' }}
                      </span>
                    </div>
                  </div>

                  <p-divider></p-divider>

                  <div class="gene-features">
                    <h5>الميزات المضافة:</h5>
                    <ul>
                      <li *ngFor="let feature of gene.features">
                        <i [class]="getFeatureIcon(feature.featureType)"></i>
                        {{ feature.featureNameAr }}
                        <span *ngIf="feature.isRequired" class="required-badge">إلزامي</span>
                      </li>
                    </ul>
                  </div>

                  <div class="gene-actions">
                    <button 
                      *ngIf="!isGeneActive(gene.id)"
                      pButton 
                      label="تفعيل" 
                      icon="pi pi-check"
                      class="p-button-success"
                      (click)="activateGene(gene)"></button>
                    <button 
                      *ngIf="isGeneActive(gene.id)"
                      pButton 
                      label="تعطيل" 
                      icon="pi pi-times"
                      class="p-button-danger p-button-outlined"
                      (click)="deactivateGene(gene)"></button>
                    <button 
                      *ngIf="isGeneActive(gene.id)"
                      pButton 
                      icon="pi pi-cog" 
                      class="p-button-text"
                      pTooltip="إعدادات"></button>
                  </div>
                </p-card>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredGroups.length === 0" class="empty-state">
          <i class="pi pi-search" style="font-size: 3rem; color: #ccc;"></i>
          <h3>لا توجد جينات مطابقة</h3>
          <p>جرب تغيير معايير البحث أو الفلترة</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .genes-page {
      padding: 1.5rem;
      background: #f5f7fa;
      min-height: 100vh;
    }

    .page-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .header-content h1 {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
      font-weight: 700;
    }

    .subtitle {
      margin: 0;
      opacity: 0.9;
      font-size: 1.1rem;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .sector-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: rgba(255, 255, 255, 0.2);
      padding: 0.75rem 1.25rem;
      border-radius: 8px;
    }

    .sector-label {
      font-weight: 600;
      font-size: 0.95rem;
    }

    .filters-section {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      margin-bottom: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .search-box {
      margin-bottom: 1rem;
    }

    .search-box input {
      width: 100%;
      padding: 0.75rem;
      font-size: 1rem;
    }

    .category-filters {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .category-filters button {
      flex: 1;
      min-width: 150px;
    }

    .genes-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .category-section {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .category-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #f0f0f0;
    }

    .category-header h2 {
      margin: 0;
      font-size: 1.5rem;
      color: #333;
    }

    .genes-group {
      margin-bottom: 2rem;
    }

    .genes-group:last-child {
      margin-bottom: 0;
    }

    .group-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
      padding: 0.75rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .group-icon {
      font-size: 1.5rem;
    }

    .group-title h3 {
      margin: 0;
      font-size: 1.1rem;
      color: #555;
    }

    .genes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .gene-card {
      transition: transform 0.2s;
    }

    .gene-card:hover {
      transform: translateY(-4px);
    }

    .gene-card.private :host ::ng-deep .p-card {
      border: 2px solid #667eea;
      border-left: 6px solid #667eea;
    }

    .gene-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
    }

    .gene-info {
      flex: 1;
    }

    .gene-info h4 {
      margin: 0 0 0.5rem 0;
      font-size: 1.2rem;
      color: #333;
    }

    .gene-description {
      margin: 0 0 0.75rem 0;
      color: #666;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    .sector-chip {
      background: #667eea !important;
      color: white !important;
    }

    .status-badge {
      padding: 0.4rem 0.9rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      white-space: nowrap;
    }

    .status-active {
      background: #d4edda;
      color: #155724;
    }

    .status-inactive {
      background: #f8d7da;
      color: #721c24;
    }

    .gene-features {
      margin: 1rem 0;
    }

    .gene-features h5 {
      margin: 0 0 0.75rem 0;
      font-size: 0.95rem;
      color: #555;
      font-weight: 600;
    }

    .gene-features ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .gene-features li {
      padding: 0.5rem 0;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: #666;
    }

    .gene-features li:last-child {
      border-bottom: none;
    }

    .gene-features li i {
      color: #667eea;
    }

    .required-badge {
      margin-right: auto;
      background: #ffc107;
      color: #000;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .gene-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .gene-actions button {
      flex: 1;
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

    .error-state button {
      margin-top: 1rem;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #999;
    }

    .empty-state h3 {
      margin: 1rem 0 0.5rem 0;
      color: #666;
    }

    .empty-state p {
      margin: 0;
    }

    :host ::ng-deep {
      .p-card {
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        border-radius: 8px;
      }

      .p-card .p-card-body {
        padding: 1.25rem;
      }

      .p-divider {
        margin: 1rem 0;
      }

      .p-dropdown {
        background: white;
      }
    }
  `]
})
export class GenesComponent implements OnInit {
  genes: Gene[] = [];
  sectors: Sector[] = [];
  activeGenes: GeneActivation[] = [];
  
  selectedSector: string = '3'; // Default: Pharmacy
  selectedCategory: string = 'ALL';
  searchTerm: string = '';
  isLoading: boolean = false;
  loadError: string | null = null;
  
  categoryGroups: CategoryGroup[] = [];
  filteredGroups: CategoryGroup[] = [];
  
  holdingId: string = '1'; // Mock holding ID

  categoryMap: { [key: string]: { nameAr: string; icon: string } } = {
    'ACCOUNTING': { nameAr: 'المحاسبة', icon: '📊' },
    'INVENTORY': { nameAr: 'المخزون', icon: '📦' },
    'PURCHASES': { nameAr: 'المشتريات', icon: '🛒' },
    'SALES': { nameAr: 'المبيعات', icon: '💰' },
    'HR': { nameAr: 'الموارد البشرية', icon: '👥' },
    'CRM': { nameAr: 'إدارة العملاء', icon: '🤝' }
  };

  constructor(
    private genesService: GenesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadSectors();
    this.loadGenes();
    this.loadActiveGenes();
  }

  loadSectors() {
    this.genesService.getAllSectors().subscribe({
      next: (data) => {
        this.sectors = data;
      },
      error: (error) => {
        console.error('Error loading sectors:', error);
      }
    });
  }

  loadGenes() {
    this.isLoading = true;
    this.loadError = null;
    
    this.genesService.getAvailableGenes(this.holdingId).subscribe({
      next: (data) => {
        this.genes = data;
        this.groupGenes();
        this.filterGenes();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading genes:', error);
        this.isLoading = false;
        this.loadError = 'فشل في تحميل الجينات. الرجاء المحاولة مرة أخرى.';
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: this.loadError
        });
      }
    });
  }

  retryLoad() {
    this.loadGenes();
    this.loadActiveGenes();
  }

  loadActiveGenes() {
    this.genesService.getActiveGenes(this.holdingId).subscribe({
      next: (data) => {
        this.activeGenes = data;
      },
      error: (error) => {
        console.error('Error loading active genes:', error);
      }
    });
  }

  groupGenes() {
    const categories = ['ACCOUNTING', 'INVENTORY', 'PURCHASES', 'SALES', 'HR', 'CRM'];
    
    this.categoryGroups = categories.map(category => {
      const categoryGenes = this.genes.filter(g => g.category === category);
      
      return {
        category: category,
        categoryNameAr: this.categoryMap[category]?.nameAr || category,
        icon: this.categoryMap[category]?.icon || '📋',
        publicGenes: categoryGenes.filter(g => g.geneType === 'PUBLIC'),
        privateGenes: categoryGenes.filter(g => g.geneType === 'PRIVATE')
      };
    }).filter(group => group.publicGenes.length > 0 || group.privateGenes.length > 0);
  }

  filterGenes() {
    let filtered = [...this.categoryGroups];
    
    // Filter by category
    if (this.selectedCategory !== 'ALL') {
      filtered = filtered.filter(g => g.category === this.selectedCategory);
    }
    
    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.map(group => ({
        ...group,
        publicGenes: group.publicGenes.filter(g => 
          g.nameAr.toLowerCase().includes(term) || 
          g.description?.toLowerCase().includes(term)
        ),
        privateGenes: group.privateGenes.filter(g => 
          g.nameAr.toLowerCase().includes(term) || 
          g.description?.toLowerCase().includes(term)
        )
      })).filter(group => group.publicGenes.length > 0 || group.privateGenes.length > 0);
    }
    
    this.filteredGroups = filtered;
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.filterGenes();
  }

  onSectorChange() {
    this.loadGenes();
  }

  isGeneActive(geneId: string): boolean {
    return this.activeGenes.some(a => a.geneId === geneId && a.isActive);
  }

  activateGene(gene: Gene) {
    this.confirmationService.confirm({
      message: `هل تريد تفعيل جين "${gene.nameAr}"؟`,
      header: 'تأكيد التفعيل',
      icon: 'pi pi-check-circle',
      acceptLabel: 'نعم، فعّل',
      rejectLabel: 'إلغاء',
      accept: () => {
        this.genesService.activate(gene.id, this.holdingId).subscribe({
          next: () => {
            this.loadActiveGenes();
            this.messageService.add({
              severity: 'success',
              summary: 'تم التفعيل',
              detail: `تم تفعيل جين "${gene.nameAr}" بنجاح`
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
    });
  }

  deactivateGene(gene: Gene) {
    this.confirmationService.confirm({
      message: `هل تريد تعطيل جين "${gene.nameAr}"؟`,
      header: 'تأكيد التعطيل',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'نعم، عطّل',
      rejectLabel: 'إلغاء',
      accept: () => {
        this.genesService.deactivate(gene.id, this.holdingId).subscribe({
          next: () => {
            this.loadActiveGenes();
            this.messageService.add({
              severity: 'success',
              summary: 'تم التعطيل',
              detail: `تم تعطيل جين "${gene.nameAr}" بنجاح`
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
    });
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

  getCurrentSectorIcon(): string {
    const sector = this.sectors.find(s => s.id === this.selectedSector);
    return sector?.icon || '📦';
  }

  getCurrentSectorName(): string {
    const sector = this.sectors.find(s => s.id === this.selectedSector);
    return sector?.nameAr || '';
  }

  getTotalCount(): number {
    return this.genes.length;
  }

  getCategoryCount(category: string): number {
    return this.genes.filter(g => g.category === category).length;
  }
}
