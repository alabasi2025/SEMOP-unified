import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InventoryCountsService {
  private apiUrl = '/api/inventory-counts';
  constructor(private http: HttpClient) {}
  getAll(): Observable<any[]> { return this.http.get<any[]>(this.apiUrl); }
  getOne(id: number): Observable<any> { return this.http.get<any>(`${this.apiUrl}/${id}`); }
  create(data: any): Observable<any> { return this.http.post<any>(this.apiUrl, data); }
  update(id: number, data: any): Observable<any> { return this.http.patch<any>(`${this.apiUrl}/${id}`, data); }
  delete(id: number): Observable<any> { return this.http.delete<any>(`${this.apiUrl}/${id}`); }
}
