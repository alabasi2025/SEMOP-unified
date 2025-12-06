import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

/**
 * Version Badge Component
 * 
 * يظهر معلومات الإصدار والتطوير في الزاوية اليسرى السفلى
 * يظهر فقط في Development Mode
 * يختفي تلقائياً في Production Mode
 * 
 * الاستخدام:
 * <app-version-badge
 *   componentName="Notebook Detail"
 *   status="complete"
 *   progress="100"
 * ></app-version-badge>
 */
@Component({
  selector: 'app-version-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './version-badge.component.html',
  styleUrls: ['./version-badge.component.css']
})
export class VersionBadgeComponent implements OnInit {
  /** اسم الـ Component الحالي */
  @Input() componentName: string = '';
  
  /** حالة التطوير: complete, in-progress, pending */
  @Input() status: 'complete' | 'in-progress' | 'pending' = 'pending';
  
  /** نسبة الإنجاز من 0 إلى 100 */
  @Input() progress: number = 0;
  
  /** تاريخ آخر تحديث (اختياري) */
  @Input() lastUpdate?: string;
  
  /** رقم الـ commit (اختياري) */
  @Input() commitHash?: string;
  
  /** رقم الإصدار */
  version: string = environment.version;
  
  /** اسم الفريق */
  author: string = 'SEMOP Team';
  
  /** هل Badge موسع أم مصغر */
  expanded: boolean = false;
  
  /** هل نحن في Development Mode */
  isDevMode: boolean = false;
  
  /** هل Badge مخفي */
  hidden: boolean = false;
  
  ngOnInit(): void {
    // التحقق من البيئة - يظهر فقط في Development
    this.isDevMode = !environment.production;
    
    // إذا لم يتم تحديد تاريخ التحديث، استخدم التاريخ الحالي
    if (!this.lastUpdate) {
      this.lastUpdate = new Date().toISOString().split('T')[0];
    }
  }
  
  /**
   * تبديل حالة التوسيع/التصغير
   */
  toggle(): void {
    this.expanded = !this.expanded;
  }
  
  /**
   * إخفاء Badge مؤقتاً
   */
  hide(): void {
    this.hidden = true;
  }
  
  /**
   * إظهار Badge
   */
  show(): void {
    this.hidden = false;
  }
  
  /**
   * الحصول على أيقونة الحالة
   */
  getStatusIcon(): string {
    switch (this.status) {
      case 'complete':
        return '✅';
      case 'in-progress':
        return '⏳';
      case 'pending':
        return '⏸️';
      default:
        return '❓';
    }
  }
  
  /**
   * الحصول على نص الحالة
   */
  getStatusText(): string {
    switch (this.status) {
      case 'complete':
        return 'مكتمل';
      case 'in-progress':
        return 'قيد التطوير';
      case 'pending':
        return 'معلق';
      default:
        return 'غير معروف';
    }
  }
  
  /**
   * الحصول على لون الحالة
   */
  getStatusColor(): string {
    switch (this.status) {
      case 'complete':
        return '#38a169'; // أخضر
      case 'in-progress':
        return '#3182ce'; // أزرق
      case 'pending':
        return '#718096'; // رمادي
      default:
        return '#a0aec0';
    }
  }
  
  /**
   * الحصول على لون شريط التقدم
   */
  getProgressColor(): string {
    if (this.progress >= 100) return '#38a169';
    if (this.progress >= 50) return '#3182ce';
    if (this.progress >= 25) return '#ed8936';
    return '#e53e3e';
  }
  
  /**
   * نسخ معلومات الإصدار إلى الحافظة
   */
  copyInfo(): void {
    const info = `
Version: ${this.version}
Component: ${this.componentName}
Status: ${this.getStatusText()} (${this.progress}%)
Last Update: ${this.lastUpdate}
${this.commitHash ? 'Commit: ' + this.commitHash : ''}
Author: ${this.author}
    `.trim();
    
    navigator.clipboard.writeText(info).then(() => {
      alert('تم نسخ معلومات الإصدار!');
    });
  }
}
