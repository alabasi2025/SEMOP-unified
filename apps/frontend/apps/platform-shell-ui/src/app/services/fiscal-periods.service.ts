import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FiscalPeriod {
  id: string;
  fiscalYearId: string;
  code: string;
  nameAr: string;
  nameEn?: string;
  startDate: string;
  endDate: string;
  isClosed: boolean;
  closedBy?: string | null;
  closedAt?: string | null;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FiscalPeriodsService {
  private apiUrl = '/api/fiscal-periods';

  constructor(private http: HttpClient) {}

  getAll(): Observable<FiscalPeriod[]> {
    return this.http.get<FiscalPeriod[]>(this.apiUrl);
  }

  getById(id: string): Observable<FiscalPeriod> {
    return this.http.get<FiscalPeriod>(`${this.apiUrl}/${id}`);
  }

  create(fiscalPeriod: Partial<FiscalPeriod>): Observable<FiscalPeriod> {
    return this.http.post<FiscalPeriod>(this.apiUrl, fiscalPeriod);
  }

  update(id: string, fiscalPeriod: Partial<FiscalPeriod>): Observable<FiscalPeriod> {
    return this.http.patch<FiscalPeriod>(`${this.apiUrl}/${id}`, fiscalPeriod);
  }

  delete(id: string): Observable<FiscalPeriod> {
    return this.http.delete<FiscalPeriod>(`${this.apiUrl}/${id}`);
  }

  close(id: string, closedBy: string): Observable<FiscalPeriod> {
    return this.http.post<FiscalPeriod>(`${this.apiUrl}/${id}/close`, { closedBy });
  }
}
