import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesOrdersService {
  private apiUrl = `${environment.apiUrl}/sales-orders`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  update(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  approve(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/approve`, {});
  }

  cancel(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/cancel`, {});
  }

  getStats() {
    return this.http.get(`${this.apiUrl}/stats`);
  }

  getStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }
}
