import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// تعريف واجهة لـ DTO (يجب أن تتطابق مع Backend DTO)
export interface GetReportDto {
  startDate?: string;
  endDate?: string;
  itemId?: string;
  warehouseId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private apiUrl = '/api/reports'; // يجب تعديل المسار حسب إعدادات الـ Proxy

  constructor(private http: HttpClient) {}

  private buildParams(dto: GetReportDto): HttpParams {
    let params = new HttpParams();
    if (dto.startDate) {
      params = params.set('startDate', dto.startDate);
    }
    if (dto.endDate) {
      params = params.set('endDate', dto.endDate);
    }
    if (dto.itemId) {
      params = params.set('itemId', dto.itemId);
    }
    if (dto.warehouseId) {
      params = params.set('warehouseId', dto.warehouseId);
    }
    return params;
  }

  getInventorySummary(dto: GetReportDto): Observable<any> {
    const params = this.buildParams(dto);
    return this.http.get(`${this.apiUrl}/inventory-summary`, { params });
  }

  getSalesByItem(dto: GetReportDto): Observable<any> {
    const params = this.buildParams(dto);
    return this.http.get(`${this.apiUrl}/sales-by-item`, { params });
  }

  getStockMovement(dto: GetReportDto): Observable<any> {
    const params = this.buildParams(dto);
    return this.http.get(`${this.apiUrl}/stock-movement`, { params });
  }
}
