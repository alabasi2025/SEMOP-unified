import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MobileDashboardDto, Activity } from './mobile-dashboard.dto';

@Injectable({
  providedIn: 'root'
})
export class MobileDashboardService {
  private baseUrl = '/api/mobile-dashboard'; // يجب تعديل المسار حسب إعدادات الـ Proxy

  constructor(private http: HttpClient) { }

  /**
   * جلب ملخص بيانات لوحة التحكم من الـ Backend
   */
  getSummary(): Observable<MobileDashboardDto> {
    return this.http.get<MobileDashboardDto>(`${this.baseUrl}/summary`);
  }

  /**
   * جلب قائمة بأحدث الأنشطة من الـ Backend
   */
  getActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.baseUrl}/activities`);
  }
}
