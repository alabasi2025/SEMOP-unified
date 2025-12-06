import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateMultiWarehouseTransferDto, UpdateMultiWarehouseTransferDto, MultiWarehouseTransferResponseDto } from './multi-warehouse-transfer.model';

@Injectable({
  providedIn: 'root'
})
export class MultiWarehouseTransferService {
  private apiUrl = '/api/multi-warehouse-transfer'; // يجب تعديل المسار حسب إعدادات الـ Proxy

  constructor(private http: HttpClient) { }

  /**
   * جلب جميع طلبات النقل بين المخازن
   * @returns Observable بقائمة طلبات النقل
   */
  getAllTransfers(): Observable<MultiWarehouseTransferResponseDto[]> {
    return this.http.get<MultiWarehouseTransferResponseDto[]>(this.apiUrl);
  }

  /**
   * جلب طلب نقل محدد
   * @param id معرف طلب النقل
   * @returns Observable بطلب النقل
   */
  getTransferById(id: number): Observable<MultiWarehouseTransferResponseDto> {
    return this.http.get<MultiWarehouseTransferResponseDto>(`${this.apiUrl}/${id}`);
  }

  /**
   * إنشاء طلب نقل جديد
   * @param transferData بيانات طلب النقل
   * @returns Observable بطلب النقل المنشأ
   */
  createTransfer(transferData: CreateMultiWarehouseTransferDto): Observable<MultiWarehouseTransferResponseDto> {
    return this.http.post<MultiWarehouseTransferResponseDto>(this.apiUrl, transferData);
  }

  /**
   * تحديث طلب نقل موجود
   * @param id معرف طلب النقل
   * @param transferData بيانات التحديث
   * @returns Observable بطلب النقل المحدث
   */
  updateTransfer(id: number, transferData: UpdateMultiWarehouseTransferDto): Observable<MultiWarehouseTransferResponseDto> {
    return this.http.patch<MultiWarehouseTransferResponseDto>(`${this.apiUrl}/${id}`, transferData);
  }

  /**
   * حذف طلب نقل
   * @param id معرف طلب النقل
   * @returns Observable بنتيجة الحذف
   */
  deleteTransfer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * اعتماد طلب النقل
   * @param id معرف طلب النقل
   * @returns Observable بطلب النقل المعتمد
   */
  completeTransfer(id: number): Observable<MultiWarehouseTransferResponseDto> {
    return this.http.patch<MultiWarehouseTransferResponseDto>(`${this.apiUrl}/${id}/complete`, {});
  }

  /**
   * إلغاء طلب النقل
   * @param id معرف طلب النقل
   * @returns Observable بطلب النقل الملغى
   */
  cancelTransfer(id: number): Observable<MultiWarehouseTransferResponseDto> {
    return this.http.patch<MultiWarehouseTransferResponseDto>(`${this.apiUrl}/${id}/cancel`, {});
  }
}
