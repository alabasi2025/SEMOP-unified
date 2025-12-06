import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Account {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  description?: string;
  accountType: string;
  accountNature: string;
  level: number;
  isParent: boolean;
  allowManualEntry?: boolean;
  parentId?: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  private apiUrl = '/api/accounts';

  constructor(private http: HttpClient) {}

  getAll(filters?: any): Observable<Account[]> {
    return this.http.get<Account[]>(this.apiUrl, { params: filters });
  }

  getById(id: string): Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}/${id}`);
  }

  create(account: Partial<Account>): Observable<Account> {
    return this.http.post<Account>(this.apiUrl, account);
  }

  update(id: string, account: Partial<Account>): Observable<Account> {
    return this.http.patch<Account>(`${this.apiUrl}/${id}`, account);
  }

  delete(id: string): Observable<Account> {
    return this.http.delete<Account>(`${this.apiUrl}/${id}`);
  }
}
