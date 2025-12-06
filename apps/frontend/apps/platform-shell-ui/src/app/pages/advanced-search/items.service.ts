// /root/task_outputs/Task2_Advanced_Search_Filters/frontend/items.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item, AdvancedSearchFilter } from './item.interface';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private apiUrl = '/api/items'; // يجب تعديل المسار حسب إعدادات الـ Proxy

  constructor(private http: HttpClient) { }

  /**
   * إرسال طلب البحث المتقدم إلى الـ Backend.
   * @param filters معايير البحث المتقدم.
   * @returns Observable بقائمة الأصناف المفلترة.
   */
  advancedSearch(filters: AdvancedSearchFilter): Observable<Item[]> {
    // نستخدم POST لإرسال جسم الطلب الذي يحتوي على الفلاتر
    return this.http.post<Item[]>(`${this.apiUrl}/search`, filters);
  }

  // دالة وهمية لجلب الخيارات المتاحة للفلاتر (مثل الفئات والحالات)
  getFilterOptions(): Observable<{ categories: string[], statuses: string[] }> {
    // في التطبيق الحقيقي، سيتم جلب هذه البيانات من الـ Backend
    return new Observable(observer => {
      observer.next({
        categories: ['إلكترونيات', 'أدوات', 'قرطاسية', 'ملابس'],
        statuses: ['نشط', 'غير نشط', 'نفد']
      });
      observer.complete();
    });
  }
}
