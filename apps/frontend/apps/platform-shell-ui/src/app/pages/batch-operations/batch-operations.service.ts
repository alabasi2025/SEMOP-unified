import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// تعريف الواجهات (Interfaces)
export interface BatchOperationDto {
  itemIds: string[];
  operationType: 'updateStatus' | 'delete' | 'updateLocation';
  value?: string;
}

export interface BatchOperationResponseDto {
  success: boolean;
  processedCount: number;
  message: string;
  errors?: { itemId: string; reason: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class BatchOperationsService {
  private apiUrl = '/api/batch-operations'; // يجب تعديل المسار حسب إعدادات NestJS

  constructor(private http: HttpClient) { }

  /**
   * إرسال طلب تنفيذ عملية مجمعة إلى الخادم
   * @param operationData بيانات العملية المجمعة
   * @returns Observable<BatchOperationResponseDto>
   */
  processBatchOperation(operationData: BatchOperationDto): Observable<BatchOperationResponseDto> {
    return this.http.post<BatchOperationResponseDto>(this.apiUrl, operationData);
  }

  // محاكاة لجلب قائمة المنتجات المتاحة للاختيار
  getAvailableItems(): Observable<any[]> {
    // في التطبيق الحقيقي، سيتم استدعاء API لجلب قائمة المنتجات
    const mockItems = [
      { id: 'item-1', name: 'منتج أ', status: 'متاح', location: 'المخزن أ' },
      { id: 'item-2', name: 'منتج ب', status: 'متاح', location: 'المخزن أ' },
      { id: 'item-3', name: 'منتج ج', status: 'غير متاح', location: 'المخزن ب' },
      { id: 'item-4', name: 'منتج د', status: 'متاح', location: 'المخزن ج' },
    ];
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(mockItems);
        observer.complete();
      }, 500);
    });
  }
}
