import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FiscalYear {
  id: string;
  code: string;
  nameAr: string;
  nameEn?: string;
  startDate: string;
  endDate: string;
  isClosed: boolean;
  isActive: boolean;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FiscalYearsService {
  private apiUrl = '/api/fiscal-years';

  constructor(private http: HttpClient) {}

  getAll(): Observable<FiscalYear[]> {
    return this.http.get<FiscalYear[]>(this.apiUrl);
  }

  getById(id: string): Observable<FiscalYear> {
    return this.http.get<FiscalYear>(`${this.apiUrl}/${id}`);
  }

  create(fiscalYear: Partial<FiscalYear>): Observable<FiscalYear> {
    return this.http.post<FiscalYear>(this.apiUrl, fiscalYear);
  }

  update(id: string, fiscalYear: Partial<FiscalYear>): Observable<FiscalYear> {
    return this.http.patch<FiscalYear>(`${this.apiUrl}/${id}`, fiscalYear);
  }

  delete(id: string): Observable<FiscalYear> {
    return this.http.delete<FiscalYear>(`${this.apiUrl}/${id}`);
  }

  close(id: string): Observable<FiscalYear> {
    return this.http.post<FiscalYear>(`${this.apiUrl}/${id}/close`, {});
  }
}
