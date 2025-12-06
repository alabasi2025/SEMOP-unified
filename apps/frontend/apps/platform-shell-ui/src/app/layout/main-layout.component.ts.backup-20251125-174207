import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../services/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
// import { NotificationsComponent } from '../shared/notifications/notifications.component';
import { environment } from '../../environments/environment';

interface MenuSection {
  title: string;
  icon: string;
  items: MenuItem[];
  expanded?: boolean;
  color?: string;
  iconBg?: string;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    AvatarModule,
    TooltipModule,
    // NotificationsComponent
  ],
  animations: [
    trigger('slideDown', [
      state('collapsed', style({
        height: '0',
        opacity: '0',
        overflow: 'hidden'
      })),
      state('expanded', style({
        height: '*',
        opacity: '1',
        overflow: 'visible'
      })),
      transition('collapsed <=> expanded', animate('350ms cubic-bezier(0.4, 0, 0.2, 1)'))
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
  template: `
    <div class="layout-wrapper rtl">
      <!-- Sidebar -->
      <div class="layout-sidebar" [class.collapsed]="sidebarCollapsed">
        <div class="sidebar-header">
          <button 
            pButton 
            icon="pi pi-bars" 
            class="p-button-text p-button-rounded toggle-btn"
            (click)="toggleSidebar()">
          </button>
          <div class="logo" *ngIf="!sidebarCollapsed" @fadeIn>
            <div class="logo-icon">
              <i class="pi pi-bolt"></i>
            </div>
            <span class="logo-text">SEMOP ERP</span>
          </div>
          
          <!-- Version & DateTime Info -->
          <div class="system-info" *ngIf="!sidebarCollapsed" @fadeIn>
            <div class="version-badge">
              <i class="pi pi-tag"></i>
              <span>v{{ appVersion }}</span>
            </div>
            <div class="datetime-display">
              <div class="time">{{ currentTime }}</div>
              <div class="date">{{ currentDate }}</div>
            </div>
          </div>
        </div>

        <div class="sidebar-menu">
          <!-- الرئيسية -->
          <div class="menu-section">
            <a routerLink="/dashboard" routerLinkActive="active" class="menu-item dashboard-item">
              <div class="menu-icon-wrapper">
                <div class="menu-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                  <i class="pi pi-home"></i>
                </div>
              </div>
              <span *ngIf="!sidebarCollapsed" class="menu-label">لوحة التحكم</span>
              <div class="menu-ripple"></div>
            </a>
          </div>

          <!-- الأنظمة مع تبويبات منبثقة -->
          <div class="menu-section" *ngFor="let section of menuSections">
            <div class="menu-item parent" 
                 [class.active]="section.expanded"
                 [class.has-glow]="section.expanded"
                 (click)="toggleSection(section)">
              <div class="menu-icon-wrapper">
                <div class="menu-icon" 
                     [style.background]="section.color"
                     [style.box-shadow]="section.expanded ? section.iconBg : 'none'">
                  <i [class]="section.icon"></i>
                </div>
              </div>
              <span *ngIf="!sidebarCollapsed" class="menu-label">{{ section.title }}</span>
              <i *ngIf="!sidebarCollapsed" 
                 class="pi toggle-icon"
                 [class.pi-chevron-down]="!section.expanded"
                 [class.pi-chevron-up]="section.expanded"></i>
              <div class="menu-ripple" [style.background]="section.color"></div>
            </div>
            
            <div class="submenu" 
                 [class.expanded]="section.expanded && !sidebarCollapsed"
                 [@slideDown]="section.expanded && !sidebarCollapsed ? 'expanded' : 'collapsed'">
              <a *ngFor="let item of section.items" 
                 [routerLink]="item.routerLink" 
                 routerLinkActive="active"
                 class="menu-item sub">
                <div class="sub-icon">
                  <i [class]="item.icon"></i>
                </div>
                <span>{{ item.label }}</span>
                <div class="sub-ripple"></div>
              </a>
            </div>
          </div>
        </div>

        <div class="sidebar-footer" *ngIf="!sidebarCollapsed">
          <div class="user-info">
            <p-avatar 
              [label]="getUserInitial()" 
              shape="circle" 
              [style]="{'background-color': '#667eea', 'color': '#ffffff', 'font-weight': 'bold'}">
            </p-avatar>
            <div class="user-details">
              <span class="user-name">{{ currentUser?.username }}</span>
              <span class="user-role">{{ currentUser?.role }}</span>
            </div>
          </div>
          <button 
            pButton 
            icon="pi pi-sign-out" 
            class="p-button-text p-button-rounded logout-btn"
            (click)="logout()"
            pTooltip="تسجيل الخروج"
            tooltipPosition="top">
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="layout-main" [class.expanded]="sidebarCollapsed">
        <div class="layout-topbar">
          <div class="topbar-left">
            <h2 class="page-title">{{ getPageTitle() }}</h2>
          </div>
          <div class="topbar-right">
            <!-- <app-notifications></app-notifications> -->
            <button pButton icon="pi pi-bell" class="p-button-text p-button-rounded" title="الإشعارات"></button>
            <button pButton icon="pi pi-cog" class="p-button-text p-button-rounded" routerLink="/settings"></button>
          </div>
        </div>

        <div class="layout-content">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Professional Modern Sidebar Design */
    .layout-wrapper {
      display: flex;
      height: 100vh;
      background: #f8f9fa;
      direction: rtl;
    }

    .layout-sidebar {
      width: 280px;
      background: linear-gradient(180deg, #1a1f36 0%, #0f1419 100%);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
      box-shadow: 4px 0 24px rgba(0, 0, 0, 0.12);
      position: relative;
      overflow: hidden;
    }

    .layout-sidebar::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 100%;
      background: radial-gradient(circle at top right, rgba(102, 126, 234, 0.1) 0%, transparent 50%);
      pointer-events: none;
    }

    .layout-sidebar.collapsed {
      width: 80px;
    }

    /* Sidebar Header */
    .sidebar-header {
      padding: 24px 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .toggle-btn {
      color: #ffffff !important;
      transition: all 0.3s ease;
    }

    .toggle-btn:hover {
      background: rgba(255, 255, 255, 0.1) !important;
      transform: scale(1.1);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      animation: pulse 2s infinite;
    }

    .logo-icon i {
      font-size: 20px;
      color: #ffffff;
    }

    .logo-text {
      font-size: 20px;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    /* System Info - Version & DateTime */
    .system-info {
      padding: 16px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .version-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      transition: all 0.3s ease;
      cursor: pointer;
      align-self: flex-start;
    }

    .version-badge:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
    }

    .version-badge i {
      font-size: 12px;
      animation: rotate 3s linear infinite;
    }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .datetime-display {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
    }

    .datetime-display .time {
      font-size: 24px;
      font-weight: 700;
      color: #ffffff;
      font-family: 'Courier New', monospace;
      letter-spacing: 2px;
      text-align: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .datetime-display .date {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
      text-align: center;
      font-weight: 500;
    }

    /* Sidebar Menu */
    .sidebar-menu {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 16px 12px;
    }

    .sidebar-menu::-webkit-scrollbar {
      width: 6px;
    }

    .sidebar-menu::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
    }

    .sidebar-menu::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 10px;
    }

    .sidebar-menu::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .menu-section {
      margin-bottom: 8px;
    }

    /* Menu Items - Professional Style */
    .menu-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 16px;
      border-radius: 14px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      text-decoration: none;
      color: rgba(255, 255, 255, 0.7);
      font-weight: 500;
      font-size: 15px;
      margin-bottom: 4px;
    }

    .menu-item:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
      transform: translateX(-4px);
    }

    .menu-item.active {
      background: rgba(102, 126, 234, 0.15);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
    }

    .menu-item.parent.has-glow {
      background: rgba(255, 255, 255, 0.1);
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
    }

    /* Icon Wrapper - Larger and Clearer */
    .menu-icon-wrapper {
      flex-shrink: 0;
    }

    .menu-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }

    .menu-icon i {
      font-size: 20px;
      color: #ffffff;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .menu-item:hover .menu-icon {
      transform: scale(1.1) rotate(5deg);
    }

    .menu-item.active .menu-icon {
      transform: scale(1.15);
      animation: iconBounce 0.6s ease;
    }

    @keyframes iconBounce {
      0%, 100% { transform: scale(1.15); }
      50% { transform: scale(1.25); }
    }

    .menu-label {
      flex: 1;
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 0.3px;
    }

    .toggle-icon {
      font-size: 14px;
      transition: all 0.3s ease;
      color: rgba(255, 255, 255, 0.5);
    }

    .menu-item.active .toggle-icon {
      color: #ffffff;
    }

    /* Ripple Effect */
    .menu-ripple {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }

    .menu-item:active .menu-ripple {
      opacity: 1;
      animation: ripple 0.6s ease-out;
    }

    @keyframes ripple {
      from {
        transform: scale(0);
        opacity: 1;
      }
      to {
        transform: scale(2);
        opacity: 0;
      }
    }

    /* Submenu */
    .submenu {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
      padding-right: 16px;
    }

    .submenu.expanded {
      max-height: 1000px;
    }

    .menu-item.sub {
      padding: 12px 16px 12px 60px;
      font-size: 14px;
      margin-bottom: 2px;
      border-radius: 10px;
    }

    .sub-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .sub-icon i {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.7);
    }

    .menu-item.sub:hover .sub-icon {
      background: rgba(102, 126, 234, 0.3);
      transform: scale(1.1);
    }

    .menu-item.sub:hover .sub-icon i {
      color: #ffffff;
    }

    .menu-item.sub.active {
      background: linear-gradient(90deg, rgba(102, 126, 234, 0.2) 0%, transparent 100%);
      border-right: 3px solid #667eea;
    }

    .menu-item.sub.active .sub-icon {
      background: #667eea;
    }

    .menu-item.sub.active .sub-icon i {
      color: #ffffff;
    }

    /* Sidebar Footer */
    .sidebar-footer {
      padding: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(0, 0, 0, 0.2);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .user-name {
      font-size: 14px;
      font-weight: 600;
      color: #ffffff;
    }

    .user-role {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
    }

    .logout-btn {
      color: #ff6b6b !important;
    }

    .logout-btn:hover {
      background: rgba(255, 107, 107, 0.1) !important;
    }

    /* Main Content */
    .layout-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      transition: all 0.3s ease;
    }

    .layout-topbar {
      height: 70px;
      background: #ffffff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
      z-index: 10;
    }

    .page-title {
      font-size: 24px;
      font-weight: 700;
      color: #1a1f36;
      margin: 0;
    }

    .topbar-right {
      display: flex;
      gap: 12px;
    }

    .notification-btn {
      position: relative;
    }

    .notification-badge {
      position: absolute;
      top: 8px;
      left: 8px;
      background: #ff6b6b;
      color: #ffffff;
      font-size: 10px;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 10px;
      min-width: 18px;
      text-align: center;
    }

    .layout-content {
      flex: 1;
      padding: 32px;
      overflow-y: auto;
      background: #f8f9fa;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .layout-sidebar {
        position: fixed;
        z-index: 1000;
        height: 100vh;
      }

      .layout-sidebar.collapsed {
        transform: translateX(100%);
      }
    }
  `]
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  sidebarCollapsed = false;
  currentUser: any;
  menuSections: MenuSection[] = [];
  currentTime: string = '';
  currentDate: string = '';
  appVersion: string = environment.version;
  private timeInterval: any;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.initializeMenu();
    this.updateDateTime();
    this.timeInterval = setInterval(() => this.updateDateTime(), 1000);
  }

  ngOnDestroy() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  updateDateTime() {
    const now = new Date();
    
    // Format time (HH:MM:SS)
    this.currentTime = now.toLocaleTimeString('ar-YE', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    // Format date (Arabic)
    this.currentDate = now.toLocaleDateString('ar-YE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  initializeMenu() {
    this.menuSections = [
      {
        title: 'الإدارة',
        icon: 'pi pi-users',
        color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        iconBg: '0 4px 20px rgba(240, 147, 251, 0.5)',
        expanded: false,
        items: [
          { label: 'المستخدمين', icon: 'pi pi-user', routerLink: '/users' },
          { label: 'الأدوار', icon: 'pi pi-shield', routerLink: '/roles' },
          { label: 'الصلاحيات', icon: 'pi pi-key', routerLink: '/permissions' }
        ]
      },
      {
        title: 'الهيكل التنظيمي',
        icon: 'pi pi-sitemap',
        color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        iconBg: '0 4px 20px rgba(79, 172, 254, 0.5)',
        expanded: false,
        items: [
          { label: 'الشركات القابضة', icon: 'pi pi-building', routerLink: '/holding-companies' },
          { label: 'الوحدات', icon: 'pi pi-box', routerLink: '/units' },
          { label: 'المشاريع', icon: 'pi pi-briefcase', routerLink: '/projects' }
        ]
      },
      {
        title: 'المحاسبة',
        icon: 'pi pi-calculator',
        color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        iconBg: '0 4px 20px rgba(67, 233, 123, 0.5)',
        expanded: false,
        items: [
          { label: 'دليل الحسابات', icon: 'pi pi-book', routerLink: '/chart-of-accounts' },
          { label: 'التسلسل الهرمي', icon: 'pi pi-share-alt', routerLink: '/account-hierarchy' },
          { label: 'أرصدة الحسابات', icon: 'pi pi-wallet', routerLink: '/account-balances' },
          { label: 'القيود اليومية', icon: 'pi pi-file-edit', routerLink: '/journal-entries' },
          { label: 'مراكز التكلفة', icon: 'pi pi-chart-pie', routerLink: '/cost-centers' },
          { label: 'السنوات المالية', icon: 'pi pi-calendar', routerLink: '/fiscal-years' },
          { label: 'الفترات المالية', icon: 'pi pi-clock', routerLink: '/fiscal-periods' }
        ]
      },
      {
        title: 'المخزون',
        icon: 'pi pi-box',
        color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        iconBg: '0 4px 20px rgba(250, 112, 154, 0.5)',
        expanded: false,
        items: [
          { label: 'المستودعات', icon: 'pi pi-home', routerLink: '/warehouses' },
          { label: 'الأصناف', icon: 'pi pi-tags', routerLink: '/items' },
          { label: 'حركات المخزون', icon: 'pi pi-arrows-h', routerLink: '/stock-movements' },
          { label: 'جرد المخزون', icon: 'pi pi-list', routerLink: '/stock-taking' }
        ]
      },
      {
        title: 'المشتريات',
        icon: 'pi pi-shopping-cart',
        color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        iconBg: '0 4px 20px rgba(48, 207, 208, 0.5)',
        expanded: false,
        items: [
          { label: 'أوامر الشراء', icon: 'pi pi-file', routerLink: '/purchase-orders' },
          { label: 'فواتير الشراء', icon: 'pi pi-file-pdf', routerLink: '/purchase-invoices' },
          { label: 'مرتجعات المشتريات', icon: 'pi pi-replay', routerLink: '/purchase-returns' }
        ]
      },
      {
        title: 'المبيعات',
        icon: 'pi pi-chart-line',
        color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        iconBg: '0 4px 20px rgba(168, 237, 234, 0.5)',
        expanded: false,
        items: [
          { label: 'أوامر البيع', icon: 'pi pi-file', routerLink: '/sales-orders' },
          { label: 'فواتير البيع', icon: 'pi pi-file-pdf', routerLink: '/sales-invoices' },
          { label: 'مرتجعات المبيعات', icon: 'pi pi-replay', routerLink: '/sales-returns' }
        ]
      },
      {
        title: 'العملاء والموردين',
        icon: 'pi pi-users',
        color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        iconBg: '0 4px 20px rgba(255, 154, 158, 0.5)',
        expanded: false,
        items: [
          { label: 'العملاء', icon: 'pi pi-user', routerLink: '/customers' },
          { label: 'الموردين', icon: 'pi pi-truck', routerLink: '/suppliers' }
        ]
      },
      {
        title: 'التقارير',
        icon: 'pi pi-chart-bar',
        color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        iconBg: '0 4px 20px rgba(255, 236, 210, 0.5)',
        expanded: false,
        items: [
          { label: 'التقارير المالية', icon: 'pi pi-file', routerLink: '/financial-reports' }
        ]
      },
      {
        title: 'نظام الجينات',
        icon: 'pi pi-sliders-h',
        color: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
        iconBg: '0 4px 20px rgba(161, 196, 253, 0.5)',
        expanded: false,
        items: [
          { label: '🧬 إدارة الجينات', icon: 'pi pi-cog', routerLink: '/genes' }
        ]
      },
      {
        title: '🗺️ نظام الخرائط',
        icon: 'pi pi-map',
        color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        iconBg: '0 4px 20px rgba(102, 126, 234, 0.5)',
        expanded: false,
        items: [
          { label: '🇾🇪 خريطة اليمن', icon: 'pi pi-map-marker', routerLink: '/maps' }
        ]
      },
      {
        title: 'نظام المطور',
        icon: 'pi pi-code',
        color: 'linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)',
        iconBg: '0 4px 20px rgba(253, 203, 241, 0.5)',
        expanded: false,
        items: [
          { label: 'الوحدة المركزية للذكاء الاصطناعي', icon: 'pi pi-bolt', routerLink: '/ai-hub' },
          { label: "📔 الدفتر السحري", icon: "pi pi-book", routerLink: "/magic-notebook" },
        ]
      }
    ];
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    if (this.sidebarCollapsed) {
      this.menuSections.forEach(section => section.expanded = false);
    }
  }

  toggleSection(section: MenuSection) {
    if (!this.sidebarCollapsed) {
      section.expanded = !section.expanded;
    }
  }

  getUserInitial(): string {
    return this.currentUser?.username?.charAt(0).toUpperCase() || 'A';
  }

  getPageTitle(): string {
    const url = this.router.url;
    if (url.includes('dashboard')) return 'لوحة التحكم';
    if (url.includes('users')) return 'إدارة المستخدمين';
    if (url.includes('chart-of-accounts')) return 'دليل الحسابات';
    if (url.includes('warehouses')) return 'المستودعات';
    if (url.includes('stock-movements')) return 'حركات المخزون';
    if (url.includes('fiscal-periods')) return 'الفترات المالية';
    if (url.includes('genes')) return 'نظام الجينات';
    return 'SEMOP ERP';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
