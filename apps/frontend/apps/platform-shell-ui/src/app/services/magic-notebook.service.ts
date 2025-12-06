import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Notebook {
  id: string;
  title: string;
  description?: string;
  icon: string;
  color: string;
  userId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  user?: { username: string };
}

export interface Page {
  id: string;
  title: string;
  content: string;
  notebookId: string;
  sectionId?: string;
  order: number;
  wordCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  notebookId: string;
  parentId?: string;
  order: number;
  color?: string;
  createdAt: string;
  updatedAt?: string;
  children?: Section[];
}

export interface Idea {
  id: string;
  title: string;
  description?: string;
  notebookId: string;
  status: 'pending' | 'in-progress' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high';
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  notebookId: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
  createdAt: string;
}

export interface StickyNote {
  id: string;
  content: string;
  notebookId: string;
  color: string;
  position?: { x: number; y: number };
  createdAt: string;
}

export interface TimelineEntry {
  id: string;
  title: string;
  description: string;
  notebookId: string;
  entryType: string;
  icon: string;
  timestamp: string;
  user: string;
}

export interface ArchiveItem {
  id: string;
  itemType: string;
  itemId: string;
  itemData: any;
  reason?: string;
  archivedBy: string;
  archivedAt: string;
}

export interface Attachment {
  id: string;
  pageId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedBy?: string;
  uploadedAt: string;
}

export interface Reminder {
  id: string;
  pageId: string;
  title: string;
  description?: string;
  reminderDate: string;
  isCompleted: boolean;
  createdBy?: string;
  createdAt: string;
}

export interface VersionHistory {
  id: string;
  pageId: string;
  versionNumber: number;
  content: string;
  changeDescription?: string;
  createdBy?: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class MagicNotebookService {
  private apiUrl = 'http://72.61.111.217:3000/api/magic-notebook';
  private useMockData = false; // Toggle for development - Now using real API

  constructor(private http: HttpClient) {}

  // ==================== NOTEBOOKS ====================
  
  getNotebooks(): Observable<Notebook[]> {
    if (this.useMockData) {
      return of(this.getMockNotebooks());
    }
    return this.http.get<Notebook[]>(`${this.apiUrl}/notebooks`)
      .pipe(catchError(this.handleError));
  }

  getNotebook(id: string): Observable<Notebook> {
    if (this.useMockData) {
      const notebook = this.getMockNotebooks().find(n => n.id === id);
      return of(notebook!);
    }
    return this.http.get<Notebook>(`${this.apiUrl}/notebooks/${id}`)
      .pipe(catchError(this.handleError));
  }

  createNotebook(data: Partial<Notebook>): Observable<Notebook> {
    if (this.useMockData) {
      const newNotebook: Notebook = {
        id: Date.now().toString(),
        title: data.title || '',
        description: data.description,
        icon: '📔',
        color: '#3b82f6',
        userId: '1',
        createdBy: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: { username: 'admin' }
      };
      return of(newNotebook);
    }
    return this.http.post<Notebook>(`${this.apiUrl}/notebooks`, data)
      .pipe(catchError(this.handleError));
  }

  updateNotebook(id: string, data: Partial<Notebook>): Observable<Notebook> {
    if (this.useMockData) {
      return of({ ...this.getMockNotebooks()[0], ...data, id } as Notebook);
    }
    return this.http.patch<Notebook>(`${this.apiUrl}/notebooks/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  deleteNotebook(id: string): Observable<void> {
    if (this.useMockData) {
      return of(void 0);
    }
    return this.http.delete<void>(`${this.apiUrl}/notebooks/${id}`)
      .pipe(catchError(this.handleError));
  }

  // ==================== PAGES ====================
  
  getPages(notebookId?: string): Observable<Page[]> {
    if (this.useMockData) {
      return of(this.getMockPages(notebookId));
    }
    const url = notebookId 
      ? `${this.apiUrl}/pages?notebookId=${notebookId}`
      : `${this.apiUrl}/pages`;
    return this.http.get<Page[]>(url)
      .pipe(catchError(this.handleError));
  }

  getPage(id: string): Observable<Page> {
    if (this.useMockData) {
      const page = this.getMockPages().find(p => p.id === id);
      return of(page!);
    }
    return this.http.get<Page>(`${this.apiUrl}/pages/${id}`)
      .pipe(catchError(this.handleError));
  }

  createPage(data: Partial<Page>): Observable<Page> {
    if (this.useMockData) {
      const newPage: Page = {
        id: Date.now().toString(),
        title: data.title || '',
        content: data.content || '',
        notebookId: data.notebookId || '1',
        order: data.order || 0,
        wordCount: (data.content || '').split(' ').length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return of(newPage);
    }
    return this.http.post<Page>(`${this.apiUrl}/pages`, data)
      .pipe(catchError(this.handleError));
  }

  updatePage(id: string, data: Partial<Page>): Observable<Page> {
    if (this.useMockData) {
      return of({ ...this.getMockPages()[0], ...data, id } as Page);
    }
    return this.http.patch<Page>(`${this.apiUrl}/pages/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  deletePage(id: string): Observable<void> {
    if (this.useMockData) {
      return of(void 0);
    }
    return this.http.delete<void>(`${this.apiUrl}/pages/${id}`)
      .pipe(catchError(this.handleError));
  }

  // ==================== SECTIONS ====================
  
  getSections(notebookId?: string): Observable<Section[]> {
    if (this.useMockData) {
      return of(this.getMockSections(notebookId));
    }
    const url = notebookId 
      ? `${this.apiUrl}/sections?notebookId=${notebookId}`
      : `${this.apiUrl}/sections`;
    return this.http.get<Section[]>(url)
      .pipe(catchError(this.handleError));
  }

  getSection(id: string): Observable<Section> {
    if (this.useMockData) {
      const section = this.getMockSections().find(s => s.id === id);
      return of(section!);
    }
    return this.http.get<Section>(`${this.apiUrl}/sections/${id}`)
      .pipe(catchError(this.handleError));
  }

  createSection(data: Partial<Section>): Observable<Section> {
    if (this.useMockData) {
      const newSection: Section = {
        id: Date.now().toString(),
        title: data.title || '',
        notebookId: data.notebookId || '1',
        parentId: data.parentId,
        order: data.order || 0,
        createdAt: new Date().toISOString()
      };
      return of(newSection);
    }
    return this.http.post<Section>(`${this.apiUrl}/sections`, data)
      .pipe(catchError(this.handleError));
  }

  updateSection(id: string, data: Partial<Section>): Observable<Section> {
    if (this.useMockData) {
      return of({ ...this.getMockSections()[0], ...data, id } as Section);
    }
    return this.http.patch<Section>(`${this.apiUrl}/sections/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  deleteSection(id: string): Observable<void> {
    if (this.useMockData) {
      return of(void 0);
    }
    return this.http.delete<void>(`${this.apiUrl}/sections/${id}`)
      .pipe(catchError(this.handleError));
  }

  // ==================== IDEAS ====================
  
  getIdeas(notebookId?: string): Observable<Idea[]> {
    if (this.useMockData) {
      return of(this.getMockIdeas(notebookId));
    }
    const url = notebookId 
      ? `${this.apiUrl}/ideas?notebookId=${notebookId}`
      : `${this.apiUrl}/ideas`;
    return this.http.get<Idea[]>(url)
      .pipe(catchError(this.handleError));
  }

  getIdea(id: string): Observable<Idea> {
    if (this.useMockData) {
      const idea = this.getMockIdeas().find(i => i.id === id);
      return of(idea!);
    }
    return this.http.get<Idea>(`${this.apiUrl}/ideas/${id}`)
      .pipe(catchError(this.handleError));
  }

  createIdea(data: Partial<Idea>): Observable<Idea> {
    if (this.useMockData) {
      const newIdea: Idea = {
        id: Date.now().toString(),
        title: data.title || '',
        description: data.description || '',
        notebookId: data.notebookId || '1',
        status: data.status || 'pending',
        priority: data.priority || 'medium',
        tags: data.tags || [],
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      return of(newIdea);
    }
    return this.http.post<Idea>(`${this.apiUrl}/ideas`, data)
      .pipe(catchError(this.handleError));
  }

  updateIdea(id: string, data: Partial<Idea>): Observable<Idea> {
    if (this.useMockData) {
      return of({ ...this.getMockIdeas()[0], ...data, id } as Idea);
    }
    return this.http.patch<Idea>(`${this.apiUrl}/ideas/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  deleteIdea(id: string): Observable<void> {
    if (this.useMockData) {
      return of(void 0);
    }
    return this.http.delete<void>(`${this.apiUrl}/ideas/${id}`)
      .pipe(catchError(this.handleError));
  }

  // ==================== TASKS ====================
  
  getTasks(notebookId?: string): Observable<Task[]> {
    if (this.useMockData) {
      return of(this.getMockTasks(notebookId));
    }
    const url = notebookId 
      ? `${this.apiUrl}/tasks?notebookId=${notebookId}`
      : `${this.apiUrl}/tasks`;
    return this.http.get<Task[]>(url)
      .pipe(catchError(this.handleError));
  }

  getTask(id: string): Observable<Task> {
    if (this.useMockData) {
      const task = this.getMockTasks().find(t => t.id === id);
      return of(task!);
    }
    return this.http.get<Task>(`${this.apiUrl}/tasks/${id}`)
      .pipe(catchError(this.handleError));
  }

  createTask(data: Partial<Task>): Observable<Task> {
    if (this.useMockData) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: data.title || '',
        description: data.description,
        notebookId: data.notebookId || '1',
        status: data.status || 'TODO',
        priority: data.priority || 'MEDIUM',
        dueDate: data.dueDate,
        createdAt: new Date().toISOString()
      };
      return of(newTask);
    }
    return this.http.post<Task>(`${this.apiUrl}/tasks`, data)
      .pipe(catchError(this.handleError));
  }

  updateTask(id: string, data: Partial<Task>): Observable<Task> {
    if (this.useMockData) {
      return of({ ...this.getMockTasks()[0], ...data, id } as Task);
    }
    return this.http.patch<Task>(`${this.apiUrl}/tasks/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  deleteTask(id: string): Observable<void> {
    if (this.useMockData) {
      return of(void 0);
    }
    return this.http.delete<void>(`${this.apiUrl}/tasks/${id}`)
      .pipe(catchError(this.handleError));
  }

  // ==================== STICKY NOTES ====================
  
  getStickyNotes(notebookId?: string): Observable<StickyNote[]> {
    if (this.useMockData) {
      return of(this.getMockStickyNotes(notebookId));
    }
    const url = notebookId 
      ? `${this.apiUrl}/sticky-notes?notebookId=${notebookId}`
      : `${this.apiUrl}/sticky-notes`;
    return this.http.get<StickyNote[]>(url)
      .pipe(catchError(this.handleError));
  }

  getStickyNote(id: string): Observable<StickyNote> {
    if (this.useMockData) {
      const note = this.getMockStickyNotes().find(n => n.id === id);
      return of(note!);
    }
    return this.http.get<StickyNote>(`${this.apiUrl}/sticky-notes/${id}`)
      .pipe(catchError(this.handleError));
  }

  createStickyNote(data: Partial<StickyNote>): Observable<StickyNote> {
    if (this.useMockData) {
      const newNote: StickyNote = {
        id: Date.now().toString(),
        content: data.content || '',
        notebookId: data.notebookId || '1',
        color: data.color || '#fef08a',
        position: data.position,
        createdAt: new Date().toISOString()
      };
      return of(newNote);
    }
    return this.http.post<StickyNote>(`${this.apiUrl}/sticky-notes`, data)
      .pipe(catchError(this.handleError));
  }

  updateStickyNote(id: string, data: Partial<StickyNote>): Observable<StickyNote> {
    if (this.useMockData) {
      return of({ ...this.getMockStickyNotes()[0], ...data, id } as StickyNote);
    }
    return this.http.patch<StickyNote>(`${this.apiUrl}/sticky-notes/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  deleteStickyNote(id: string): Observable<void> {
    if (this.useMockData) {
      return of(void 0);
    }
    return this.http.delete<void>(`${this.apiUrl}/sticky-notes/${id}`)
      .pipe(catchError(this.handleError));
  }

  // ==================== TIMELINE ====================
  
  getTimeline(notebookId?: string): Observable<TimelineEntry[]> {
    if (this.useMockData) {
      return of(this.getMockTimeline(notebookId));
    }
    const url = notebookId 
      ? `${this.apiUrl}/timeline?notebookId=${notebookId}`
      : `${this.apiUrl}/timeline`;
    return this.http.get<TimelineEntry[]>(url)
      .pipe(catchError(this.handleError));
  }

  getTimelineEntry(id: string): Observable<TimelineEntry> {
    if (this.useMockData) {
      const entry = this.getMockTimeline().find(t => t.id === id);
      return of(entry!);
    }
    return this.http.get<TimelineEntry>(`${this.apiUrl}/timeline/${id}`)
      .pipe(catchError(this.handleError));
  }

  // ==================== ARCHIVE ====================
  
  getArchive(): Observable<ArchiveItem[]> {
    if (this.useMockData) {
      return of(this.getMockArchive());
    }
    return this.http.get<ArchiveItem[]>(`${this.apiUrl}/archive`)
      .pipe(catchError(this.handleError));
  }

  getArchiveItem(id: string): Observable<ArchiveItem> {
    if (this.useMockData) {
      const item = this.getMockArchive().find(a => a.id === id);
      return of(item!);
    }
    return this.http.get<ArchiveItem>(`${this.apiUrl}/archive/${id}`)
      .pipe(catchError(this.handleError));
  }

  restoreArchiveItem(id: string): Observable<void> {
    if (this.useMockData) {
      return of(void 0);
    }
    return this.http.post<void>(`${this.apiUrl}/archive/${id}/restore`, {})
      .pipe(catchError(this.handleError));
  }

  deleteArchiveItem(id: string): Observable<void> {
    if (this.useMockData) {
      return of(void 0);
    }
    return this.http.delete<void>(`${this.apiUrl}/archive/${id}`)
      .pipe(catchError(this.handleError));
  }

  // ==================== SEARCH ====================
  
  searchNotebooks(query: string): Observable<Notebook[]> {
    if (this.useMockData) {
      return of(this.getMockNotebooks().filter(n => 
        n.title.includes(query) || n.description?.includes(query)
      ));
    }
    return this.http.get<Notebook[]>(`${this.apiUrl}/search/notebooks?q=${query}`)
      .pipe(catchError(this.handleError));
  }

  searchPages(query: string): Observable<Page[]> {
    if (this.useMockData) {
      return of(this.getMockPages().filter(p => 
        p.title.includes(query) || p.content.includes(query)
      ));
    }
    return this.http.get<Page[]>(`${this.apiUrl}/search/pages?q=${query}`)
      .pipe(catchError(this.handleError));
  }

  searchAll(query: string): Observable<any> {
    if (this.useMockData) {
      return of({
        notebooks: this.getMockNotebooks().filter(n => n.title.includes(query)),
        pages: this.getMockPages().filter(p => p.title.includes(query)),
        ideas: this.getMockIdeas().filter(i => i.title.includes(query)),
        tasks: this.getMockTasks().filter(t => t.title.includes(query))
      });
    }
    return this.http.get<any>(`${this.apiUrl}/search?q=${query}`)
      .pipe(catchError(this.handleError));
  }

  // ==================== ATTACHMENTS ====================
  
  getAttachments(pageId?: string): Observable<Attachment[]> {
    const url = pageId 
      ? `${this.apiUrl}/attachments?pageId=${pageId}`
      : `${this.apiUrl}/attachments`;
    return this.http.get<Attachment[]>(url)
      .pipe(catchError(this.handleError));
  }

  getAttachment(id: string): Observable<Attachment> {
    return this.http.get<Attachment>(`${this.apiUrl}/attachments/${id}`)
      .pipe(catchError(this.handleError));
  }

  createAttachment(data: Partial<Attachment>): Observable<Attachment> {
    return this.http.post<Attachment>(`${this.apiUrl}/attachments`, data)
      .pipe(catchError(this.handleError));
  }

  deleteAttachment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/attachments/${id}`)
      .pipe(catchError(this.handleError));
  }

  // ==================== REMINDERS ====================
  
  getReminders(pageId?: string): Observable<Reminder[]> {
    const url = pageId 
      ? `${this.apiUrl}/reminders?pageId=${pageId}`
      : `${this.apiUrl}/reminders`;
    return this.http.get<Reminder[]>(url)
      .pipe(catchError(this.handleError));
  }

  getUpcomingReminders(): Observable<Reminder[]> {
    return this.http.get<Reminder[]>(`${this.apiUrl}/reminders/upcoming`)
      .pipe(catchError(this.handleError));
  }

  getReminder(id: string): Observable<Reminder> {
    return this.http.get<Reminder>(`${this.apiUrl}/reminders/${id}`)
      .pipe(catchError(this.handleError));
  }

  createReminder(data: Partial<Reminder>): Observable<Reminder> {
    return this.http.post<Reminder>(`${this.apiUrl}/reminders`, data)
      .pipe(catchError(this.handleError));
  }

  updateReminder(id: string, data: Partial<Reminder>): Observable<Reminder> {
    return this.http.patch<Reminder>(`${this.apiUrl}/reminders/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  markReminderAsCompleted(id: string): Observable<Reminder> {
    return this.http.patch<Reminder>(`${this.apiUrl}/reminders/${id}/complete`, {})
      .pipe(catchError(this.handleError));
  }

  deleteReminder(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reminders/${id}`)
      .pipe(catchError(this.handleError));
  }

  // ==================== VERSION HISTORY ====================
  
  getVersionHistory(pageId?: string): Observable<VersionHistory[]> {
    const url = pageId 
      ? `${this.apiUrl}/version-history?pageId=${pageId}`
      : `${this.apiUrl}/version-history`;
    return this.http.get<VersionHistory[]>(url)
      .pipe(catchError(this.handleError));
  }

  getLatestVersion(pageId: string): Observable<VersionHistory> {
    return this.http.get<VersionHistory>(`${this.apiUrl}/version-history/latest/${pageId}`)
      .pipe(catchError(this.handleError));
  }

  getVersion(id: string): Observable<VersionHistory> {
    return this.http.get<VersionHistory>(`${this.apiUrl}/version-history/${id}`)
      .pipe(catchError(this.handleError));
  }

  createVersion(data: Partial<VersionHistory>): Observable<VersionHistory> {
    return this.http.post<VersionHistory>(`${this.apiUrl}/version-history`, data)
      .pipe(catchError(this.handleError));
  }

  deleteVersion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/version-history/${id}`)
      .pipe(catchError(this.handleError));
  }

  // ==================== ERROR HANDLING ====================
  
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'حدث خطأ غير متوقع';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `خطأ: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 404:
          errorMessage = 'العنصر غير موجود';
          break;
        case 500:
          errorMessage = 'خطأ في الخادم';
          break;
        case 401:
          errorMessage = 'غير مصرح لك بالوصول';
          break;
        default:
          errorMessage = error.message || 'حدث خطأ';
      }
    }
    
    console.error('API Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }

  // ==================== MOCK DATA ====================
  
  private getMockNotebooks(): Notebook[] {
    return [
      {
        id: '1',
        title: 'دفتر المشاريع',
        description: 'أفكار ومهام المشاريع الجديدة',
        icon: '📔',
        color: '#3b82f6',
        userId: '1',
        createdBy: 'admin',
        createdAt: '2025-11-20T10:00:00Z',
        updatedAt: '2025-11-28T10:00:00Z',
        user: { username: 'admin' }
      },
      {
        id: '2',
        title: 'دفتر التعلم',
        description: 'ملاحظات الدورات والكتب',
        icon: '📚',
        color: '#10b981',
        userId: '1',
        createdBy: 'admin',
        createdAt: '2025-11-15T10:00:00Z',
        updatedAt: '2025-11-25T10:00:00Z',
        user: { username: 'admin' }
      },
      {
        id: '3',
        title: 'دفتر الأفكار',
        description: 'أفكار عشوائية وإبداعية',
        icon: '💡',
        color: '#f59e0b',
        userId: '1',
        createdBy: 'admin',
        createdAt: '2025-11-10T10:00:00Z',
        updatedAt: '2025-11-27T10:00:00Z',
        user: { username: 'admin' }
      }
    ];
  }

  private getMockPages(notebookId?: string): Page[] {
    const pages = [
      {
        id: '1',
        title: 'مقدمة المشروع',
        content: 'هذا المشروع يهدف إلى تطوير نظام ERP متكامل...',
        notebookId: '1',
        order: 0,
        wordCount: 150,
        createdAt: '2025-11-20T10:00:00Z',
        updatedAt: '2025-11-28T10:00:00Z'
      },
      {
        id: '2',
        title: 'المتطلبات الفنية',
        content: 'المتطلبات الفنية للمشروع تشمل...',
        notebookId: '1',
        order: 1,
        wordCount: 200,
        createdAt: '2025-11-21T10:00:00Z',
        updatedAt: '2025-11-27T10:00:00Z'
      },
      {
        id: '3',
        title: 'ملاحظات JavaScript',
        content: 'JavaScript هي لغة برمجة...',
        notebookId: '2',
        order: 0,
        wordCount: 300,
        createdAt: '2025-11-15T10:00:00Z',
        updatedAt: '2025-11-25T10:00:00Z'
      }
    ];
    return notebookId ? pages.filter(p => p.notebookId === notebookId) : pages;
  }

  private getMockSections(notebookId?: string): Section[] {
    const sections = [
      {
        id: '1',
        title: 'التخطيط',
        notebookId: '1',
        order: 0,
        createdAt: '2025-11-20T10:00:00Z'
      },
      {
        id: '2',
        title: 'التطوير',
        notebookId: '1',
        order: 1,
        createdAt: '2025-11-21T10:00:00Z'
      },
      {
        id: '3',
        title: 'الاختبار',
        notebookId: '1',
        order: 2,
        createdAt: '2025-11-22T10:00:00Z'
      }
    ];
    return notebookId ? sections.filter(s => s.notebookId === notebookId) : sections;
  }

  private getMockIdeas(notebookId?: string): Idea[] {
    const ideas = [
      {
        id: '1',
        title: 'تحسين الأداء',
        description: 'تحسين أداء التطبيق',
        notebookId: '1',
        status: 'pending' as const,
        priority: 'high' as const,
        tags: ['تطوير', 'أداء'],
        createdAt: '2025-11-25T10:00:00Z',
        updatedAt: '2025-11-25T10:00:00Z'
      },
      {
        id: '2',
        title: 'إضافة ميزة البحث',
        description: 'إضافة بحث متقدم',
        notebookId: '1',
        status: 'in-progress' as const,
        priority: 'medium' as const,
        tags: ['ميزة', 'بحث'],
        createdAt: '2025-11-24T10:00:00Z',
        updatedAt: '2025-11-24T10:00:00Z'
      },
      {
        id: '3',
        title: 'إضافة Dark Mode',
        description: 'إضافة وضع الظلام للتطبيق',
        notebookId: '1',
        status: 'completed' as const,
        priority: 'low' as const,
        tags: ['UI', 'تصميم'],
        createdAt: '2025-11-22T10:00:00Z',
        updatedAt: '2025-11-23T10:00:00Z'
      }
    ];
    return notebookId ? ideas.filter(i => i.notebookId === notebookId) : ideas;
  }

  private getMockTasks(notebookId?: string): Task[] {
    const tasks = [
      {
        id: '1',
        title: 'تصميم قاعدة البيانات',
        description: 'تصميم schema لقاعدة البيانات',
        notebookId: '1',
        status: 'TODO' as const,
        priority: 'HIGH' as const,
        dueDate: '2025-12-01T00:00:00Z',
        createdAt: '2025-11-20T10:00:00Z'
      },
      {
        id: '2',
        title: 'تطوير API',
        description: 'تطوير REST APIs للنظام',
        notebookId: '1',
        status: 'IN_PROGRESS' as const,
        priority: 'HIGH' as const,
        dueDate: '2025-12-05T00:00:00Z',
        createdAt: '2025-11-21T10:00:00Z'
      },
      {
        id: '3',
        title: 'اختبار الوحدات',
        description: 'كتابة اختبارات الوحدات',
        notebookId: '1',
        status: 'DONE' as const,
        priority: 'MEDIUM' as const,
        createdAt: '2025-11-22T10:00:00Z'
      }
    ];
    return notebookId ? tasks.filter(t => t.notebookId === notebookId) : tasks;
  }

  private getMockStickyNotes(notebookId?: string): StickyNote[] {
    const notes = [
      {
        id: '1',
        content: 'لا تنسى مراجعة الكود قبل الـ commit',
        notebookId: '1',
        color: '#fef08a',
        createdAt: '2025-11-20T10:00:00Z'
      },
      {
        id: '2',
        content: 'اجتماع الفريق يوم الأحد الساعة 10 صباحاً',
        notebookId: '1',
        color: '#bfdbfe',
        createdAt: '2025-11-21T10:00:00Z'
      },
      {
        id: '3',
        content: 'فكرة: إضافة ميزة البحث الصوتي',
        notebookId: '1',
        color: '#fecaca',
        createdAt: '2025-11-22T10:00:00Z'
      }
    ];
    return notebookId ? notes.filter(n => n.notebookId === notebookId) : notes;
  }

  private getMockTimeline(notebookId?: string): TimelineEntry[] {
    const timeline = [
      {
        id: '1',
        title: 'إنشاء دفتر جديد',
        description: 'تم إنشاء دفتر المشاريع',
        notebookId: '1',
        entryType: 'NOTEBOOK_CREATED',
        icon: '📔',
        timestamp: '2025-11-20T10:00:00Z',
        user: 'admin'
      },
      {
        id: '2',
        title: 'إضافة صفحة جديدة',
        description: 'تم إضافة صفحة "مقدمة المشروع"',
        notebookId: '1',
        entryType: 'PAGE_CREATED',
        icon: '📄',
        timestamp: '2025-11-20T11:00:00Z',
        user: 'admin'
      },
      {
        id: '3',
        title: 'إضافة فكرة جديدة',
        description: 'تم إضافة فكرة "نظام الإشعارات"',
        notebookId: '1',
        entryType: 'IDEA_ADDED',
        icon: '💡',
        timestamp: '2025-11-20T12:00:00Z',
        user: 'admin'
      },
      {
        id: '4',
        title: 'إكمال مهمة',
        description: 'تم إكمال مهمة "اختبار الوحدات"',
        notebookId: '1',
        entryType: 'TASK_COMPLETED',
        icon: '✅',
        timestamp: '2025-11-22T10:00:00Z',
        user: 'admin'
      }
    ];
    return notebookId ? timeline.filter(t => t.notebookId === notebookId) : timeline;
  }

  private getMockArchive(): ArchiveItem[] {
    return [
      {
        id: '1',
        itemType: 'PAGE',
        itemId: '10',
        itemData: {
          title: 'صفحة قديمة',
          content: 'محتوى قديم...'
        },
        reason: 'لم تعد مطلوبة',
        archivedBy: 'admin',
        archivedAt: '2025-11-15T10:00:00Z'
      },
      {
        id: '2',
        itemType: 'IDEA',
        itemId: '20',
        itemData: {
          title: 'فكرة قديمة',
          description: 'وصف الفكرة...'
        },
        reason: 'تم تنفيذها',
        archivedBy: 'admin',
        archivedAt: '2025-11-18T10:00:00Z'
      }
    ];
  }
}
