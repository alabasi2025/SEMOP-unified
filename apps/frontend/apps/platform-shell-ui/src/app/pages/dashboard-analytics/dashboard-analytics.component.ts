// /root/task_outputs/Task7_Dashboard_Analytics/frontend/dashboard-analytics.component.ts

import { Component, OnInit } from '@angular/core';
import { DashboardAnalyticsService, DashboardAnalytics } from './dashboard-analytics.service';
import { MessageService } from 'primeng/api'; // PrimeNG dependency

@Component({
  selector: 'app-dashboard-analytics',
  templateUrl: './dashboard-analytics.component.html',
  styleUrls: ['./dashboard-analytics.component.css'],
  providers: [MessageService] // توفير خدمة الرسائل
})
export class DashboardAnalyticsComponent implements OnInit {
  analyticsData: DashboardAnalytics | null = null;
  loading: boolean = true;
  dateRange: Date[] = []; // [startDate, endDate]

  // إعدادات الرسوم البيانية
  categoryChartData: any;
  monthlyMovementChartData: any;
  chartOptions: any;

  constructor(
    private analyticsService: DashboardAnalyticsService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadAnalytics();
  }

  loadAnalytics(): void {
    this.loading = true;
    const startDate = this.dateRange[0];
    const endDate = this.dateRange[1];

    this.analyticsService.getAnalytics(startDate, endDate).subscribe({
      next: (data) => {
        this.analyticsData = data;
        this.prepareChartData(data);
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل في جلب بيانات لوحة التحكم' });
        console.error(err);
        this.loading = false;
      }
    });
  }

  prepareChartData(data: DashboardAnalytics): void {
    // إعداد بيانات الرسم البياني الدائري لتوزيع الأصناف
    this.categoryChartData = {
      labels: data.categoryDistribution.map(d => d.name),
      datasets: [
        {
          data: data.categoryDistribution.map(d => d.value),
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
          hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"]
        }
      ]
    };

    // إعداد بيانات الرسم البياني الخطي لحركة المخزون الشهرية
    this.monthlyMovementChartData = {
      labels: data.monthlyStockMovement.map(d => d.month),
      datasets: [
        {
          label: 'الكمية الواردة',
          data: data.monthlyStockMovement.map(d => d.incoming),
          fill: false,
          borderColor: '#42A5F5',
          tension: 0.4
        },
        {
          label: 'الكمية الصادرة',
          data: data.monthlyStockMovement.map(d => d.outgoing),
          fill: false,
          borderColor: '#FFA726',
          tension: 0.4
        }
      ]
    };

    // إعداد خيارات الرسوم البيانية
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            font: {
              family: 'Tajawal, sans-serif' // افتراض خط عربي
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'الكمية',
            font: {
              family: 'Tajawal, sans-serif'
            }
          }
        },
        x: {
          title: {
            display: true,
            text: 'الشهر',
            font: {
              family: 'Tajawal, sans-serif'
            }
          }
        }
      }
    };
  }

  onDateRangeChange(event: any): void {
    if (this.dateRange && this.dateRange.length === 2 && this.dateRange[0] && this.dateRange[1]) {
      this.loadAnalytics();
    }
  }
}
