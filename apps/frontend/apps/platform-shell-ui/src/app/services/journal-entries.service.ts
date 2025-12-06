import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface JournalEntryLine {
  accountId: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: string;
  entryNumber: string;
  date: string;
  description: string;
  status: string;
  totalDebit: number;
  totalCredit: number;
  lines: JournalEntryLine[];
}

@Injectable({
  providedIn: 'root'
})
export class JournalEntriesService {
  private apiUrl = '/api/journal-entries';

  constructor(private http: HttpClient) {}

  getAll(filters?: any): Observable<JournalEntry[]> {
    return this.http.get<JournalEntry[]>(this.apiUrl, { params: filters });
  }

  getById(id: string): Observable<JournalEntry> {
    return this.http.get<JournalEntry>(`${this.apiUrl}/${id}`);
  }

  create(entry: Partial<JournalEntry>): Observable<JournalEntry> {
    return this.http.post<JournalEntry>(this.apiUrl, entry);
  }

  update(id: string, entry: Partial<JournalEntry>): Observable<JournalEntry> {
    return this.http.patch<JournalEntry>(`${this.apiUrl}/${id}`, entry);
  }

  delete(id: string): Observable<JournalEntry> {
    return this.http.delete<JournalEntry>(`${this.apiUrl}/${id}`);
  }

  post(id: string): Observable<JournalEntry> {
    return this.http.post<JournalEntry>(`${this.apiUrl}/${id}/post`, {});
  }
}
