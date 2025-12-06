import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Item {
  id?: string;
  code: string;
  nameAr: string;
  nameEn?: string;
  description?: string;
  categoryId?: string;
  categoryName?: string;
  unitId?: string;
  unitName?: string;
  barcode?: string;
  sku?: string;
  minStock?: number;
  maxStock?: number;
  reorderPoint?: number;
  costPrice?: number;
  sellingPrice?: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private apiUrl = '/api/items';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Item[]> {
    return this.http.get<Item[]>(this.apiUrl);
  }

  getById(id: string): Observable<Item> {
    return this.http.get<Item>(`${this.apiUrl}/${id}`);
  }

  getLowStock(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/low-stock`);
  }

  getItemStock(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/stock`);
  }

  create(item: Item): Observable<Item> {
    return this.http.post<Item>(this.apiUrl, item);
  }

  update(id: string, item: Partial<Item>): Observable<Item> {
    return this.http.patch<Item>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: string): Observable<Item> {
    return this.http.delete<Item>(`${this.apiUrl}/${id}`);
  }
}
