import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationWidgetComponent } from '../shared/components/notification-widget.component';
import { environment } from '../../environments/environment';

interface MenuItem {
  title: string;
  icon: string;
  route?: string;
  color: string;
  children?: MenuItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NotificationWidgetComponent],
  template: `
    <div class="app-container">
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="version-badge">v{{appVersion}}</div>
          <h1 class="logo">
            <span class="logo-semop">SEMOP</span>
            <span class="logo-erp">ERP</span>
          </h1>
          <div class="datetime">
            <div class="time">{{currentTime}}</div>
            <div class="date">{{currentDate}}</div>
          </div>
        </div>

        <nav class="sidebar-menu">
          <div class="menu-item-wrapper" 
               [class.active]="isActive('/dashboard')"
               (click)="navigate('/dashboard')">
            <div class="menu-item">
              <div class="menu-content">
                <span class="menu-title">لوحة التحكم</span>
                <div class="menu-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                  <span class="icon-text">🏠</span>
                </div>
              </div>
            </div>
          </div>

          <div *ngFor="let item of menuItems" class="menu-item-wrapper">
            <div class="menu-item" 
                 [class.active]="isActive(item.route)"
                 [class.has-children]="item.children"
                 (click)="handleMenuClick(item)">
              <div class="menu-content">
                <span class="menu-title">{{item.title}}</span>
                <div class="menu-icon" [style.background]="item.color">
                  <span class="icon-text">{{item.icon}}</span>
                </div>
              </div>
              <i *ngIf="item.children" class="expand-icon" 
                 [class.expanded]="item.expanded">▲</i>
            </div>
            
            <div *ngIf="item.children && item.expanded" class="submenu">
              <div *ngFor="let child of item.children" 
                   class="submenu-item"
                   [class.active]="isActive(child.route)"
                   (click)="navigate(child.route)">
                <span>{{child.title}}</span>
                <i class="arrow">›</i>
              </div>
            </div>
          </div>
        </nav>

        <div class="sidebar-footer">
          <div class="user-profile">
            <div class="user-avatar">{{getUserInitial()}}</div>
            <span class="user-name">{{currentUser?.username || 'admin'}}</span>
          </div>
        </div>
      </aside>

      <main class="main-content">
        <header class="topbar">
          <button class="menu-toggle">☰</button>
          <div class="topbar-actions">
            <app-notification-widget></app-notification-widget>
            <button class="icon-btn">⚙️</button>
          </div>
        </header>
        
        <div class="content-wrapper">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .app-container {
      display: flex;
      height: 100vh;
      background: #0f172a;
      color: #fff;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      direction: rtl;
    }

    .sidebar {
      width: 320px;
      background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
      display: flex;
      flex-direction: column;
      border-left: 1px solid rgba(255, 255, 255, 0.05);
      overflow-y: auto;
      overflow-x: hidden;
    }

    .sidebar::-webkit-scrollbar {
      width: 6px;
    }

    .sidebar::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
    }

    .sidebar::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
    }

    .sidebar-header {
      padding: 24px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .version-badge {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      display: inline-block;
      margin-bottom: 12px;
    }

    .logo {
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 16px 0;
      display: flex;
      gap: 8px;
    }

    .logo-semop {
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .logo-erp {
      color: #fff;
    }

    .datetime {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
      text-align: center;
    }

    .time {
      font-weight: 500;
      margin-bottom: 4px;
    }

    .date {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
    }

    .sidebar-menu {
      flex: 1;
      padding: 16px 12px;
      overflow-y: auto;
    }

    .menu-item-wrapper {
      margin-bottom: 12px;
    }

    .menu-item {
      background: linear-gradient(135deg, #2d3748 0%, #1e293b 100%);
      border-radius: 14px;
      padding: 16px 18px;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      position: relative;
    }

    .menu-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
      border-color: rgba(59, 130, 246, 0.3);
    }

    .menu-item-wrapper.active .menu-item,
    .menu-item.active {
      border-color: #3b82f6;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1),
                  0 8px 20px rgba(59, 130, 246, 0.2);
      background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
    }

    .menu-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .menu-title {
      font-size: 16px;
      font-weight: 600;
      color: #fff;
      flex: 1;
      text-align: right;
    }

    .menu-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      flex-shrink: 0;
    }

    .icon-text {
      font-size: 24px;
    }

    .expand-icon {
      position: absolute;
      left: 18px;
      top: 50%;
      transform: translateY(-50%) rotate(180deg);
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
      transition: transform 0.3s ease;
    }

    .expand-icon.expanded {
      transform: translateY(-50%) rotate(0deg);
    }

    .submenu {
      margin-top: 8px;
      padding-right: 12px;
      animation: slideDown 0.3s ease;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .submenu-item {
      background: rgba(45, 55, 72, 0.5);
      border-radius: 10px;
      padding: 14px 16px;
      margin-bottom: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all 0.2s ease;
      border: 1px solid transparent;
    }

    .submenu-item:hover {
      background: rgba(59, 130, 246, 0.1);
      border-color: rgba(59, 130, 246, 0.3);
      transform: translateX(-4px);
    }

    .submenu-item.active {
      background: rgba(59, 130, 246, 0.15);
      border-color: #3b82f6;
    }

    .submenu-item span {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.9);
    }

    .submenu-item .arrow {
      color: rgba(255, 255, 255, 0.4);
      font-size: 18px;
    }

    .sidebar-footer {
      padding: 16px 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: rgba(45, 55, 72, 0.5);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .user-profile:hover {
      background: rgba(59, 130, 246, 0.1);
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 18px;
    }

    .user-name {
      font-size: 15px;
      font-weight: 600;
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .topbar {
      height: 70px;
      background: #1e293b;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
    }

    .menu-toggle {
      background: transparent;
      border: none;
      color: #fff;
      font-size: 24px;
      cursor: pointer;
      padding: 8px;
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .menu-toggle:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .topbar-actions {
      display: flex;
      gap: 12px;
    }

    .icon-btn {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.05);
      border: none;
      color: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      transition: all 0.2s ease;
    }

    .icon-btn:hover {
      background: rgba(59, 130, 246, 0.2);
      transform: translateY(-2px);
    }

    .content-wrapper {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      background: #0f172a;
    }

    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        right: 0;
        top: 0;
        height: 100vh;
        z-index: 1000;
        transform: translateX(100%);
      }
    }
  `]
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  appVersion = environment.version;
  currentDate = '';
  currentTime = '';
  currentUser: any;
  private timeInterval: any;

  menuItems: MenuItem[] = [
    { title: 'الإدارة',      icon: '⚙️',
      color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      children: [
        { title: 'المستخدمين', route: '/users', icon: '', color: '' },
        { title: 'الأدوار', route: '/roles', icon: '', color: '' },
        { title: 'الصلاحيات', route: '/permissions', icon: '', color: '' }
      ]
    },
    { title: 'الهيكل التنظيمي',
      icon: '🏢',
      color: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      children: [
        { title: 'الشركات القابضة', route: '/holding-companies', icon: '', color: '' },
        { title: 'الوحدات', route: '/units', icon: '', color: '' },
        { title: 'المشاريع', route: '/projects', icon: '', color: '' }
      ]
    },
    { title: 'المحاسبة',
      icon: '🧮',
      color: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      children: [
        { title: 'دليل الحسابات', route: '/chart-of-accounts', icon: '', color: '' },
        { title: 'التسلسل الهرمي', route: '/account-hierarchy', icon: '', color: '' },
        { title: 'أرصدة الحسابات', route: '/account-balances', icon: '', color: '' },
        { title: 'القيود اليومية', route: '/journal-entries', icon: '', color: '' },
        { title: 'القيود الذكية', route: '/smart-journal-entries', icon: '', color: '' },
        { title: 'مراكز التكلفة', route: '/cost-centers', icon: '', color: '' },
        { title: 'السنوات المالية', route: '/fiscal-years', icon: '', color: '' },
        { title: 'الفترات المالية', route: '/fiscal-periods', icon: '', color: '' }
      ]
    },
    { title: 'المخزون',      icon: '📦',
      color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      children: [
        { title: 'المستودعات', route: '/warehouses', icon: '', color: '' },
        { title: 'الأصناف', route: '/items', icon: '', color: '' },
        { title: 'حركات المخزون', route: '/stock-movements', icon: '', color: '' },
        { title: 'جرد المخزون', route: '/stock-taking', icon: '', color: '' }
      ]
    },
    { title: 'المشتريات',
      icon: '🛒',
      color: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
      children: [
        { title: 'أوامر الشراء', route: '/purchase-orders', icon: '', color: '' },
        { title: 'فواتير الشراء', route: '/purchase-invoices', icon: '', color: '' },
        { title: 'مرتجعات المشتريات', route: '/purchase-returns', icon: '', color: '' }
      ]
    },
    { title: 'المبيعات',      icon: '📊',
      color: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      children: [
        { title: 'أوامر البيع', route: '/sales-orders', icon: '', color: '' },
        { title: 'فواتير البيع', route: '/sales-invoices', icon: '', color: '' },
        { title: 'مرتجعات المبيعات', route: '/sales-returns', icon: '', color: '' }
      ]
    },
    { title: 'العملاء والموردين',      icon: '👥',
      color: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
      children: [
        { title: 'العملاء', route: '/customers', icon: '', color: '' },
        { title: 'الموردين', route: '/suppliers', icon: '', color: '' }
      ]
    },
    { title: 'التقارير',      icon: '📈',
      color: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      children: [
        { title: 'التقارير المالية', route: '/financial-reports', icon: '', color: '' }
      ]
    },
    {
      title: 'المهام وسير العمل',
      icon: '✅',
      color: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
      children: [
        { title: 'قائمة المهام', route: '/tasks/list', icon: '', color: '' },
        { title: 'لوحة كانبان', route: '/tasks/kanban', icon: '', color: '' },
        { title: 'سير العمل', route: '/tasks/workflows', icon: '', color: '' }
      ]
    },
    { title: 'نظام الجينات',
      icon: '🧬',
      color: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      children: [
        { title: 'إدارة الجينات', route: '/genes', icon: '', color: '' }
      ]
    },
    { title: 'نظام الخرائط',      icon: '🗺️',
      color: 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
      children: [
        { title: 'خريطة اليمن', route: '/maps', icon: '', color: '' }
      ]
    },
    { title: 'نظام المطور', icon: '💻', color: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)', children: [ { title: 'الوحدة المركزية للذكاء الاصطناعي', route: '/developer', icon: '', color: '' }, { title: 'الدفتر السحري', route: '/magic-notebook', icon: '', color: '' } ] },
    {
      title: 'الأنظمة الإضافية',
      icon: '🔧',
      color: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
      children: [
        { title: 'الإشعارات', route: '/notifications', icon: '🔔', color: '' },
        { title: 'المرفقات', route: '/attachments', icon: '📎', color: '' },
        { title: 'سجلات التدقيق', route: '/audit-logs', icon: '📋', color: '' },
        { title: 'النسخ الاحتياطية', route: '/backups', icon: '💾', color: '' },
        { title: 'الإعدادات', route: '/settings', icon: '⚙️', color: '' }
      ]
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
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
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 
                    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    
    this.currentDate = `${days[now.getDay()]}، ${now.getDate()} ${months[now.getMonth()]}`;
    this.currentTime = now.toLocaleTimeString('ar-EG', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  }

  handleMenuClick(item: MenuItem) {
    if (item.children) {
      item.expanded = !item.expanded;
    } else if (item.route) {
      this.navigate(item.route);
    }
  }

  navigate(route?: string) {
    if (route) {
      this.router.navigate([route]);
    }
  }

  isActive(route?: string): boolean {
    if (!route) return false;
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }

  getUserInitial(): string {
    return this.currentUser?.username?.charAt(0).toUpperCase() || 'A';
  }
}
