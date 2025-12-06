// PHASE-15: Smart Journal Entries - Frontend Service
//
// الوصف:
// هذه الخدمة مسؤولة عن التفاعل مع الواجهة الخلفية (Backend) لإدارة القيود الذكية وقوالبها.
// تستخدم HttpClient للتواصل مع نقاط النهاية (Endpoints) المحددة في environment.apiUrl.
//
// الميزات:
// 1. إدارة القوالب (Templates): جلب، جلب حسب المعرف، جلب حسب نوع العملية، إنشاء، تحديث، حذف، ونسخ.
// 2. إنشاء قيد ذكي (Smart Journal Entry): إنشاء من قالب أو من عملية، والتحقق من صحة القيد.
// 3. التعلم الذكي والاقتراحات (Smart Learning & Suggestions): اقتراح الحسابات، تسجيل الاستخدام، إحصائيات الاستخدام، ومسح بيانات التعلم.
//
// الحالة:
// تم تطوير الخدمة بشكل كامل في المرحلة السابقة (PHASE-15) وهي جاهزة للاستخدام.
//
// التغييرات في هذه المهمة:
// - لا توجد تغييرات وظيفية، فقط إضافة توثيق شامل للخدمة.
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SmartJournalEntriesService {
  private apiUrl = `${environment.apiUrl}/smart-journal-entries`;

  constructor(private http: HttpClient) {}

  // ============================================
  // Template Management
  // ============================================

  getAllTemplates(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/templates`);
  }

  getTemplate(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/templates/${id}`);
  }

  getTemplateByOperationType(operationType: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/templates/by-operation/${operationType}`);
  }

  createTemplate(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/templates`, data);
  }

  updateTemplate(id: string, data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/templates/${id}`, data);
  }

  deleteTemplate(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/templates/${id}`);
  }

  cloneTemplate(id: string, data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/templates/${id}/clone`, data);
  }

  // ============================================
  // Smart Journal Entry Creation
  // ============================================

  createFromTemplate(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/from-template`, data);
  }

  createFromOperation(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/from-operation`, data);
  }

  validateJournalEntry(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/validate`, data);
  }

  // ============================================
  // Smart Learning & Suggestions
  // ============================================

  suggestAccounts(data: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/suggest-accounts`, data);
  }

  recordUsage(data: any): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/record-usage`, data);
  }

  getUsageStatistics(accountId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usage-statistics/${accountId}`);
  }

  clearLearningData(operationType: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/learning-data/${operationType}`);
  }

  clearAllLearningData(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/learning-data`);
  }
}
