// /root/task_outputs/Task7_Dashboard_Analytics/frontend/dashboard-analytics.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// تعريف الواجهات للبيانات المتوقعة من الـ API
export interface CategoryDistribution {
  name: string;
  value: number;
}

export interface MonthlyStockMovement {
  month: string;
  incoming: number;
  outgoing: number;
}

export interface DashboardAnalytics {
  totalItems: number;
  totalStockQuantity: number;
  totalStockValue: number;
  categoryDistribution: CategoryDistribution[];
  monthlyStockMovement: MonthlyStockMovement[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardAnalyticsService {
  private apiUrl = '/api/dashboard-analytics'; // يجب تعديل المسار حسب إعدادات الـ Proxy أو البيئة

  constructor(private http: HttpClient) { }

  /**
   * جلب إحصائيات لوحة التحكم بناءً على الفترة الزمنية.
   * @param startDate تاريخ البدء (اختياري).
   * @param endDate تاريخ الانتهاء (اختياري).
   * @returns Observable لبيانات لوحة التحكم.
   */
  getAnalytics(startDate?: Date, endDate?: Date): Observable<DashboardAnalytics> {
    let params = new HttpParams();

    if (startDate) {
      params = params.set('startDate', startDate.toISOString().split('T')[0]);
    }
    if (endDate) {
      params = params.set('endDate', endDate.toISOString().split('T')[0]);
    }

    return this.http.get<DashboardAnalytics>(this.apiUrl, { params });
  }
}
