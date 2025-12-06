import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface Warehouse {
  id?: string;
  code: string;
  nameAr: string;
  nameEn?: string;
  location?: string;
  managerId?: string;
  managerName?: string;
  capacity?: number;
  currentStock?: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WarehousesService {
  private apiUrl = '/api/warehouses';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(this.apiUrl);
  }

  getById(id: string): Observable<Warehouse> {
    return this.http.get<Warehouse>(`${this.apiUrl}/${id}`);
  }

  create(warehouse: Warehouse): Observable<Warehouse> {
    return this.http.post<Warehouse>(this.apiUrl, warehouse);
  }

  update(id: string, warehouse: Partial<Warehouse>): Observable<Warehouse> {
    return this.http.patch<Warehouse>(`${this.apiUrl}/${id}`, warehouse);
  }

  delete(id: string): Observable<Warehouse> {
    return this.http.delete<Warehouse>(`${this.apiUrl}/${id}`);
  }
}
