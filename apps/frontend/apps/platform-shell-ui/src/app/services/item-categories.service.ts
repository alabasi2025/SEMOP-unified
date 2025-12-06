import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ItemCategory {
  id: string;
  code: string;
  nameAr: string;
  nameEn?: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ItemCategoriesService {
  private apiUrl = '/api/item-categories';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ItemCategory[]> {
    return this.http.get<ItemCategory[]>(this.apiUrl);
  }

  getOne(id: string): Observable<ItemCategory> {
    return this.http.get<ItemCategory>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<ItemCategory>): Observable<ItemCategory> {
    return this.http.post<ItemCategory>(this.apiUrl, data);
  }

  update(id: string, data: Partial<ItemCategory>): Observable<ItemCategory> {
    return this.http.patch<ItemCategory>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
