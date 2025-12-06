import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Notebook {
  id: string;
  title: string;
  description?: string;
  icon: string;
  color: string;
  createdAt: string;
  user?: { username: string };
}

@Component({
  selector: 'app-magic-notebook',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="magic-notebook-container">
      <header class="page-header">
        <h1>📔 الدفتر السحري</h1>
        <button class="btn-primary" (click)="showCreateDialog = true">
          ➕ إنشاء دفتر جديد
        </button>
      </header>

      <!-- Create Dialog -->
      <div class="dialog-overlay" *ngIf="showCreateDialog" (click)="showCreateDialog = false">
        <div class="dialog" (click)="$event.stopPropagation()">
          <div class="dialog-header">
            <h2>إنشاء دفتر جديد</h2>
            <button class="close-btn" (click)="showCreateDialog = false">✕</button>
          </div>
          <div class="dialog-body">
            <div class="form-group">
              <label>عنوان الدفتر *</label>
              <input 
                type="text" 
                [(ngModel)]="newNotebook.title" 
                placeholder="أدخل عنوان الدفتر"
                class="form-input">
            </div>
            <div class="form-group">
              <label>الوصف</label>
              <textarea 
                [(ngModel)]="newNotebook.description" 
                placeholder="وصف مختصر للدفتر"
                class="form-textarea"
                rows="3"></textarea>
            </div>
          </div>
          <div class="dialog-footer">
            <button class="btn-secondary" (click)="showCreateDialog = false">إلغاء</button>
            <button class="btn-primary" (click)="createNotebook()" [disabled]="!newNotebook.title">
              إنشاء
            </button>
          </div>
        </div>
      </div>

      <!-- Notebooks Grid -->
      <div class="notebooks-grid" *ngIf="notebooks.length > 0">
        <div 
          *ngFor="let notebook of notebooks" 
          class="notebook-card"
          [style.border-color]="notebook.color"
          (click)="openNotebook(notebook.id)">
          <div class="notebook-icon" [style.background]="notebook.color">
            {{notebook.icon}}
          </div>
          <div class="notebook-info">
            <h3>{{notebook.title}}</h3>
            <p *ngIf="notebook.description">{{notebook.description}}</p>
            <div class="notebook-meta">
              <span class="meta-item">👤 {{notebook.user?.username || 'Unknown'}}</span>
              <span class="meta-item">📅 {{formatDate(notebook.createdAt)}}</span>
            </div>
          </div>
          <div class="notebook-actions">
            <button class="action-btn" (click)="editNotebook($event, notebook)">✏️</button>
            <button class="action-btn delete" (click)="deleteNotebook($event, notebook.id)">🗑️</button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="notebooks.length === 0 && !loading">
        <div class="empty-icon">📔</div>
        <h2>لا توجد دفاتر حالياً</h2>
        <p>ابدأ بإنشاء دفتر جديد!</p>
        <button class="btn-primary" (click)="showCreateDialog = true">
          ➕ إنشاء دفتر جديد
        </button>
      </div>

      <!-- Loading -->
      <div class="loading" *ngIf="loading">
        <div class="spinner"></div>
        <p>جاري التحميل...</p>
      </div>
    </div>
  `,
  styles: [`
    .magic-notebook-container {
      padding: 24px;
      min-height: 100vh;
      background: #0f172a;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .page-header h1 {
      font-size: 32px;
      font-weight: 700;
      color: #fff;
      margin: 0;
    }

    .btn-primary {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 12px 24px;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .dialog {
      background: #1e293b;
      border-radius: 16px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .dialog-header {
      padding: 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .dialog-header h2 {
      font-size: 20px;
      font-weight: 700;
      color: #fff;
      margin: 0;
    }

    .close-btn {
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.5);
      font-size: 24px;
      cursor: pointer;
      padding: 4px 8px;
      transition: all 0.2s ease;
    }

    .close-btn:hover {
      color: #fff;
    }

    .dialog-body {
      padding: 24px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 8px;
    }

    .form-input,
    .form-textarea {
      width: 100%;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 12px 16px;
      font-size: 15px;
      color: #fff;
      transition: all 0.2s ease;
    }

    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #3b82f6;
      background: rgba(255, 255, 255, 0.08);
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    }

    .form-textarea {
      resize: vertical;
      font-family: inherit;
    }

    .dialog-footer {
      padding: 16px 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .notebooks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }

    .notebook-card {
      background: linear-gradient(135deg, #2d3748 0%, #1e293b 100%);
      border-radius: 16px;
      padding: 24px;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;
      position: relative;
      overflow: hidden;
    }

    .notebook-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
    }

    .notebook-icon {
      width: 64px;
      height: 64px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      margin-bottom: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .notebook-info h3 {
      font-size: 20px;
      font-weight: 700;
      color: #fff;
      margin: 0 0 8px 0;
    }

    .notebook-info p {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      margin: 0 0 16px 0;
      line-height: 1.5;
    }

    .notebook-meta {
      display: flex;
      gap: 16px;
      font-size: 13px;
      color: rgba(255, 255, 255, 0.5);
    }

    .notebook-actions {
      position: absolute;
      top: 16px;
      left: 16px;
      display: flex;
      gap: 8px;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .notebook-card:hover .notebook-actions {
      opacity: 1;
    }

    .action-btn {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: #fff;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.2s ease;
    }

    .action-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.1);
    }

    .action-btn.delete:hover {
      background: rgba(239, 68, 68, 0.2);
    }

    .empty-state {
      text-align: center;
      padding: 80px 20px;
    }

    .empty-icon {
      font-size: 80px;
      margin-bottom: 24px;
      opacity: 0.5;
    }

    .empty-state h2 {
      font-size: 24px;
      font-weight: 700;
      color: #fff;
      margin: 0 0 12px 0;
    }

    .empty-state p {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.6);
      margin: 0 0 32px 0;
    }

    .loading {
      text-align: center;
      padding: 80px 20px;
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid rgba(255, 255, 255, 0.1);
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 16px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading p {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.6);
    }
  `]
})
export class MagicNotebookComponent implements OnInit {
  notebooks: Notebook[] = [];
  loading = false;
  showCreateDialog = false;
  newNotebook = {
    title: '',
    description: ''
  };

  private apiUrl = '/api/magic-notebook';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadNotebooks();
  }

  loadNotebooks() {
    this.loading = true;
    this.http.get<Notebook[]>(`${this.apiUrl}/notebooks`).subscribe({
      next: (data) => {
        this.notebooks = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading notebooks:', err);
        this.loading = false;
      }
    });
  }

  createNotebook() {
    if (!this.newNotebook.title) return;

    const data = {
      ...this.newNotebook,
      userId: '1',
      createdBy: 'admin'
    };

    this.http.post<Notebook>(`${this.apiUrl}/notebooks`, data).subscribe({
      next: (notebook) => {
        this.notebooks.unshift(notebook);
        this.showCreateDialog = false;
        this.newNotebook = { title: '', description: '' };
      },
      error: (err) => {
        console.error('Error creating notebook:', err);
        alert('فشل إنشاء الدفتر');
      }
    });
  }

  openNotebook(id: string) {
    this.router.navigate(['/magic-notebook', id]);
  }

  editNotebook(event: Event, notebook: Notebook) {
    event.stopPropagation();
    // TODO: Implement edit
    console.log('Edit:', notebook);
  }

  deleteNotebook(event: Event, id: string) {
    event.stopPropagation();
    if (!confirm('هل أنت متأكد من حذف هذا الدفتر؟')) return;

    this.http.delete(`${this.apiUrl}/notebooks/${id}`).subscribe({
      next: () => {
        this.notebooks = this.notebooks.filter(n => n.id !== id);
      },
      error: (err) => {
        console.error('Error deleting notebook:', err);
        alert('فشل حذف الدفتر');
      }
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
