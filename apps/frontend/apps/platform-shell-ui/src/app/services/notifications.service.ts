import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Notification {
  id: string;
  type: 'task' | 'idea' | 'mention' | 'reminder' | 'system';
  title: string;
  message: string;
  entityId?: string;
  entityType?: string;
  isRead: boolean;
  createdAt: Date;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private apiUrl = `${environment.apiUrl}/notifications`;
  private notificationSubject = new Subject<Notification>();
  public notifications$ = this.notificationSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initWebSocket();
  }

  private initWebSocket() {
    // TODO: Implement WebSocket connection for real-time notifications
    // const ws = new WebSocket(`${environment.wsUrl}/notifications`);
    // ws.onmessage = (event) => {
    //   const notification = JSON.parse(event.data);
    //   this.notificationSubject.next(notification);
    // };
  }

  getNotifications(page = 1, limit = 20): Observable<{ data: Notification[], total: number, unreadCount: number }> {
    return this.http.get<{ data: Notification[], total: number, unreadCount: number }>(
      this.apiUrl,
      { params: { page: page.toString(), limit: limit.toString() } }
    );
  }

  markAsRead(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/read`, {});
  }

  markAllAsRead(): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/read-all`, {});
  }

  deleteNotification(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/unread-count`);
  }
}
