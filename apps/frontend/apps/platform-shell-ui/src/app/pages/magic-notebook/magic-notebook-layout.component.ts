import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MagicNotebookService, Notebook } from '../../services/magic-notebook.service';

interface NavItem {
  title: string;
  icon: string;
  route: string;
  color: string;
  badge?: number;
}

@Component({
  selector: 'app-magic-notebook-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="magic-notebook-container">
      <!-- Header -->
      <header class="magic-header">
        <div class="header-left">
          <button class="back-btn" (click)="goBack()">
            <span>←</span>
            <span>العودة للرئيسية</span>
          </button>
          <div class="header-title">
            <span class="notebook-icon">📓</span>
            <h1>الدفتر السحري</h1>
          </div>
        </div>
        
        <div class="header-stats">
          <div class="stat-card">
            <div class="stat-icon">📚</div>
            <div class="stat-info">
              <span class="stat-value">{{notebooks.length}}</span>
              <span class="stat-label">دفتر</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📄</div>
            <div class="stat-info">
              <span class="stat-value">{{getTotalPages()}}</span>
              <span class="stat-label">صفحة</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-info">
              <span class="stat-value">{{getTotalTasks()}}</span>
              <span class="stat-label">مهمة</span>
            </div>
          </div>
        </div>

        <div class="header-actions">
          <button class="action-btn primary" (click)="createNotebook()">
            <span>➕</span>
            <span>دفتر جديد</span>
          </button>
        </div>
      </header>

      <div class="magic-content">
        <!-- Sidebar -->
        <aside class="magic-sidebar">
          <div class="sidebar-section">
            <h3 class="section-title">الدفاتر</h3>
            <div class="notebooks-list">
              <div *ngFor="let notebook of notebooks" 
                   class="notebook-card"
                   [class.active]="currentNotebookId === notebook.id"
                   (click)="selectNotebook(notebook.id)">
                <div class="notebook-icon">📔</div>
                <div class="notebook-info">
                  <h4>{{notebook.title}}</h4>
                  <p>{{notebook.description}}</p>
                  <div class="notebook-meta">
                    <span>{{getNotebookPageCount(notebook.id)}} صفحة</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="sidebar-section">
            <h3 class="section-title">إجراءات سريعة</h3>
            <div class="quick-actions">
              <button class="quick-action-btn" (click)="quickAddPage()">
                <span>📄</span>
                <span>صفحة سريعة</span>
              </button>
              <button class="quick-action-btn" (click)="quickAddIdea()">
                <span>💡</span>
                <span>فكرة سريعة</span>
              </button>
              <button class="quick-action-btn" (click)="quickAddTask()">
                <span>✅</span>
                <span>مهمة سريعة</span>
              </button>
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="magic-main">
          <!-- Navigation Tabs -->
          <nav class="magic-nav" *ngIf="currentNotebookId">
            <div *ngFor="let item of navItems" 
                 class="nav-item"
                 [class.active]="isActiveRoute(item.route)"
                 [style.--nav-color]="item.color"
                 (click)="navigateTo(item.route)">
              <span class="nav-icon">{{item.icon}}</span>
              <span class="nav-title">{{item.title}}</span>
              <span class="nav-badge" *ngIf="item.badge">{{item.badge}}</span>
            </div>
          </nav>

          <!-- Content Area -->
          <div class="content-area">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .magic-notebook-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      flex-direction: column;
    }

    /* Header Styles */
    .magic-header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      padding: 20px 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      border-bottom: 3px solid #667eea;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .back-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .back-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    .header-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .notebook-icon {
      font-size: 32px;
      animation: bounce 2s infinite;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .header-title h1 {
      font-size: 28px;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0;
    }

    .header-stats {
      display: flex;
      gap: 15px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 20px;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
    }

    .stat-icon {
      font-size: 24px;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
      color: white;
    }

    .stat-value {
      font-size: 20px;
      font-weight: 700;
    }

    .stat-label {
      font-size: 12px;
      opacity: 0.9;
    }

    .header-actions {
      display: flex;
      gap: 10px;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border: none;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .action-btn.primary {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      color: white;
    }

    .action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }

    /* Content Area */
    .magic-content {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    /* Sidebar Styles */
    .magic-sidebar {
      width: 320px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      padding: 20px;
      overflow-y: auto;
      box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
    }

    .sidebar-section {
      margin-bottom: 30px;
    }

    .section-title {
      font-size: 14px;
      font-weight: 700;
      color: #667eea;
      text-transform: uppercase;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #667eea;
    }

    .notebooks-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .notebook-card {
      display: flex;
      gap: 12px;
      padding: 15px;
      background: white;
      border-radius: 12px;
      border: 2px solid transparent;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .notebook-card:hover {
      border-color: #667eea;
      transform: translateX(-5px);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
    }

    .notebook-card.active {
      border-color: #667eea;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    }

    .notebook-icon {
      font-size: 32px;
    }

    .notebook-info {
      flex: 1;
    }

    .notebook-info h4 {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin: 0 0 5px 0;
    }

    .notebook-info p {
      font-size: 13px;
      color: #666;
      margin: 0 0 8px 0;
    }

    .notebook-meta {
      font-size: 12px;
      color: #999;
    }

    .quick-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .quick-action-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 15px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .quick-action-btn:hover {
      transform: translateX(-5px);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    /* Main Content Styles */
    .magic-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* Navigation Tabs */
    .magic-nav {
      display: flex;
      gap: 8px;
      padding: 20px;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      overflow-x: auto;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      background: white;
      border-radius: 12px;
      border: 2px solid transparent;
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;
      position: relative;
    }

    .nav-item:hover {
      border-color: var(--nav-color);
      transform: translateY(-3px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .nav-item.active {
      background: var(--nav-color);
      color: white;
      border-color: var(--nav-color);
    }

    .nav-icon {
      font-size: 20px;
    }

    .nav-title {
      font-size: 14px;
      font-weight: 600;
    }

    .nav-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: #f5576c;
      color: white;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 7px;
      border-radius: 10px;
    }

    /* Content Area */
    .content-area {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(10px);
    }

    /* Scrollbar Styles */
    .magic-sidebar::-webkit-scrollbar,
    .content-area::-webkit-scrollbar {
      width: 8px;
    }

    .magic-sidebar::-webkit-scrollbar-track,
    .content-area::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.05);
    }

    .magic-sidebar::-webkit-scrollbar-thumb,
    .content-area::-webkit-scrollbar-thumb {
      background: #667eea;
      border-radius: 4px;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .magic-sidebar {
        width: 280px;
      }

      .header-stats {
        display: none;
      }
    }

    @media (max-width: 768px) {
      .magic-sidebar {
        position: absolute;
        left: -320px;
        z-index: 100;
        transition: left 0.3s ease;
      }

      .magic-sidebar.open {
        left: 0;
      }
    }
  `]
})
export class MagicNotebookLayoutComponent implements OnInit {
  notebooks: Notebook[] = [];
  currentNotebookId: string | null = null;
  totalPages: number = 0;
  totalTasks: number = 0;

  navItems: NavItem[] = [
    { title: 'نظرة عامة', icon: '📊', route: 'overview', color: '#667eea' },
    { title: 'الصفحات', icon: '📄', route: 'pages', color: '#4facfe' },
    { title: 'الأقسام', icon: '📂', route: 'sections', color: '#43e97b' },
    { title: 'الأفكار', icon: '💡', route: 'ideas', color: '#fa709a' },
    { title: 'المهام', icon: '✅', route: 'tasks', color: '#f093fb' },
    { title: 'الملاحظات', icon: '📌', route: 'sticky-notes', color: '#feca57' },
    { title: 'الخط الزمني', icon: '⏱️', route: 'timeline', color: '#ff6b6b' },
    { title: 'الأرشيف', icon: '📦', route: 'archive', color: '#a29bfe' },
    { title: 'البحث', icon: '🔍', route: 'search', color: '#fd79a8' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private notebookService: MagicNotebookService
  ) {}

  ngOnInit() {
    this.loadNotebooks();
    
    // Get current notebook ID from route
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.currentNotebookId = params['id'];
        this.loadStats();
      }
    });
  }

  loadNotebooks() {
    this.notebookService.getNotebooks().subscribe(notebooks => {
      this.notebooks = notebooks;
      
      // Select first notebook if none selected
      if (!this.currentNotebookId && this.notebooks.length > 0) {
        this.currentNotebookId = this.notebooks[0].id;
        this.loadStats();
      }
    });
  }

  selectNotebook(id: string) {
    this.currentNotebookId = id;
    this.loadStats();
    this.router.navigate(['/magic-notebook', id, 'overview']);
  }

  navigateTo(route: string) {
    if (this.currentNotebookId) {
      this.router.navigate(['/magic-notebook', this.currentNotebookId, route]);
    }
  }

  isActiveRoute(route: string): boolean {
    return this.router.url.includes(route);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  createNotebook() {
    // TODO: Implement create notebook modal
    alert('إنشاء دفتر جديد - قريباً!');
  }

  quickAddPage() {
    alert('إضافة صفحة سريعة - قريباً!');
  }

  quickAddIdea() {
    alert('إضافة فكرة سريعة - قريباً!');
  }

  quickAddTask() {
    alert('إضافة مهمة سريعة - قريباً!');
  }

  loadStats() {
    if (this.currentNotebookId) {
      this.notebookService.getPages(this.currentNotebookId).subscribe(pages => {
        this.totalPages = pages.length;
      });
      this.notebookService.getTasks(this.currentNotebookId).subscribe(tasks => {
        this.totalTasks = tasks.length;
      });
    }
  }

  getTotalPages(): number {
    return this.totalPages;
  }

  getTotalTasks(): number {
    return this.totalTasks;
  }

  getNotebookPageCount(notebookId: string): number {
    let count = 0;
    this.notebookService.getPages(notebookId).subscribe(pages => {
      count = pages.length;
    });
    return count;
  }
}
