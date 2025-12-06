import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * نموذج بيانات المنتج (يجب أن يتطابق مع ItemDetailsDto في Backend)
 */
export interface ItemDetails {
  id: number;
  name: string;
  sku: string;
  barcode: string;
  unitPrice: number;
  quantityInStock: number;
}

/**
 * نموذج بيانات طلب المسح (يجب أن يتطابق مع BarcodeScanDto في Backend)
 */
export interface BarcodeScanRequest {
  barcode: string;
}

@Injectable({
  providedIn: 'root',
})
export class BarcodeScannerService {
  private apiUrl = '/api/barcode-scanner'; // يجب تعديل المسار حسب إعدادات البيئة

  constructor(private http: HttpClient) {}

  /**
   * إرسال الباركود إلى الخادم للبحث عن تفاصيل المنتج.
   * @param barcode الباركود المراد مسحه.
   * @returns Observable يحتوي على تفاصيل المنتج.
   */
  scanBarcode(barcode: string): Observable<ItemDetails> {
    const requestBody: BarcodeScanRequest = { barcode };
    return this.http.post<ItemDetails>(`${this.apiUrl}/scan`, requestBody);
  }
}
