import { Component, OnInit } from '@angular/core';
import { MobileDashboardService } from './mobile-dashboard.service';
import { MobileDashboardDto, Activity } from './mobile-dashboard.dto';
import { MessageService } from 'primeng/api'; // افتراض استخدام PrimeNG MessageService

@Component({
  selector: 'app-mobile-dashboard',
  templateUrl: './mobile-dashboard.component.html',
  styleUrls: ['./mobile-dashboard.component.css'],
  providers: [MessageService]
})
export class MobileDashboardComponent implements OnInit {
  summary: MobileDashboardDto | null = null;
  activities: Activity[] = [];
  loading: boolean = true;

  constructor(
    private dashboardService: MobileDashboardService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    // جلب الملخص
    this.dashboardService.getSummary().subscribe({
      next: (data) => {
        this.summary = data;
        this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم تحديث ملخص لوحة التحكم' });
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل في جلب الملخص' });
        console.error('Error loading summary:', err);
      }
    });

    // جلب الأنشطة
    this.dashboardService.getActivities().subscribe({
      next: (data) => {
        this.activities = data;
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل في جلب الأنشطة' });
        console.error('Error loading activities:', err);
        this.loading = false;
      }
    });
  }

  // دالة مساعدة لتحديد شدة اللون بناءً على نوع النشاط
  getActivitySeverity(type: string): string {
    switch (type) {
      case 'إدخال':
        return 'success';
      case 'إخراج':
        return 'danger';
      case 'جرد':
        return 'info';
      default:
        return 'secondary';
    }
  }
}
