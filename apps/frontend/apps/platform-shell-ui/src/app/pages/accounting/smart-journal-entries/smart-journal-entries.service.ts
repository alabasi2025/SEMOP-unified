// PHASE-15: Smart Journal Entries Service
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { SmartJournalEntryStatsDto } from '@semop/contracts'; // Temporarily disabled

@Injectable({
  providedIn: 'root'
})
export class SmartJournalEntriesService {
  private apiUrl = '/api/smart-journal-entries';

  constructor(private http: HttpClient) {}

  getTemplates(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/templates`);
  }

  createFromOperation(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-from-operation`, payload);
  }

  deleteTemplate(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/templates/${id}`);
  }

  // getStats(): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/stats`);
  // }
}
