import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CostCenter {
  id: string;
  code: string;
  nameAr: string;
  nameEn?: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CostCentersService {
  private apiUrl = '/api/cost-centers';

  constructor(private http: HttpClient) {}

  getAll(): Observable<CostCenter[]> {
    return this.http.get<CostCenter[]>(this.apiUrl);
  }

  getById(id: string): Observable<CostCenter> {
    return this.http.get<CostCenter>(`${this.apiUrl}/${id}`);
  }

  create(costCenter: Partial<CostCenter>): Observable<CostCenter> {
    return this.http.post<CostCenter>(this.apiUrl, costCenter);
  }

  update(id: string, costCenter: Partial<CostCenter>): Observable<CostCenter> {
    return this.http.patch<CostCenter>(`${this.apiUrl}/${id}`, costCenter);
  }

  delete(id: string): Observable<CostCenter> {
    return this.http.delete<CostCenter>(`${this.apiUrl}/${id}`);
  }
}
