import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MagicNotebookService, Page } from '../../../services/magic-notebook.service';
import { RichTextEditorComponent } from '../rich-text-editor/rich-text-editor.component';

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [CommonModule, FormsModule, RichTextEditorComponent],
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit, OnDestroy {
  pages: Page[] = [];
  filteredPages: Page[] = [];
  loading = false;
  error: string | null = null;
  notebookId: string = '';
  
  // Search & Filter
  searchQuery = '';
  sortBy: 'title' | 'createdAt' | 'updatedAt' | 'wordCount' = 'updatedAt';
  sortOrder: 'asc' | 'desc' = 'desc';
  viewMode: 'grid' | 'list' = 'grid';
  
  // Edit mode
  editingPage: Page | null = null;
  editForm = {
    title: '',
    content: ''
  };
  
  // Statistics
  totalPages = 0;
  totalWords = 0;
  averageWords = 0;
  
  private destroy$ = new Subject<void>();
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notebookService: MagicNotebookService
  ) {}
  
  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.notebookId = params['id'];
      if (this.notebookId) {
        this.loadPages();
      }
    });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  loadPages(): void {
    this.loading = true;
    this.error = null;
    
    this.notebookService.getPages(this.notebookId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (pages) => {
          this.pages = pages;
          this.applyFilters();
          this.calculateStatistics();
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message || 'فشل تحميل الصفحات';
          this.loading = false;
        }
      });
  }
  
  applyFilters(): void {
    let filtered = [...this.pages];
    
    // Apply search
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(page => 
        page.title.toLowerCase().includes(query) ||
        page.content.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (this.sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title, 'ar');
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'wordCount':
          comparison = (a.wordCount || 0) - (b.wordCount || 0);
          break;
      }
      
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
    
    this.filteredPages = filtered;
  }
  
  calculateStatistics(): void {
    this.totalPages = this.pages.length;
    this.totalWords = this.pages.reduce((sum, page) => sum + (page.wordCount || 0), 0);
    this.averageWords = this.totalPages > 0 ? Math.round(this.totalWords / this.totalPages) : 0;
  }
  
  onSearchChange(): void {
    this.applyFilters();
  }
  
  onSortChange(): void {
    this.applyFilters();
  }
  
  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }
  
  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }
  
  createPage(): void {
    const title = prompt('عنوان الصفحة الجديدة:');
    if (!title) return;
    
    this.loading = true;
    this.notebookService.createPage({
      title,
      content: '',
      notebookId: this.notebookId,
      order: this.pages.length
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (page) => {
        this.pages.push(page);
        this.applyFilters();
        this.calculateStatistics();
        this.loading = false;
        this.router.navigate(['/magic-notebook', this.notebookId, 'page', page.id]);
      },
      error: (err) => {
        alert('فشل إنشاء الصفحة: ' + err.message);
        this.loading = false;
      }
    });
  }
  
  editPage(page: Page): void {
    this.editingPage = page;
    this.editForm = {
      title: page.title,
      content: page.content
    };
  }
  
  cancelEdit(): void {
    this.editingPage = null;
    this.editForm = { title: '', content: '' };
  }
  
  savePage(): void {
    if (!this.editingPage) return;
    
    this.loading = true;
    this.notebookService.updatePage(this.editingPage.id, this.editForm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => {
          const index = this.pages.findIndex(p => p.id === updated.id);
          if (index !== -1) {
            this.pages[index] = updated;
            this.applyFilters();
            this.calculateStatistics();
          }
          this.cancelEdit();
          this.loading = false;
        },
        error: (err) => {
          alert('فشل حفظ التعديلات: ' + err.message);
          this.loading = false;
        }
      });
  }
  
  deletePage(page: Page, event: Event): void {
    event.stopPropagation();
    
    if (!confirm(`هل أنت متأكد من حذف صفحة "${page.title}"؟`)) {
      return;
    }
    
    this.loading = true;
    this.notebookService.deletePage(page.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.pages = this.pages.filter(p => p.id !== page.id);
          this.applyFilters();
          this.calculateStatistics();
          this.loading = false;
        },
        error: (err) => {
          alert('فشل حذف الصفحة: ' + err.message);
          this.loading = false;
        }
      });
  }
  
  duplicatePage(page: Page, event: Event): void {
    event.stopPropagation();
    
    this.loading = true;
    this.notebookService.createPage({
      title: page.title + ' (نسخة)',
      content: page.content,
      notebookId: this.notebookId,
      order: this.pages.length
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (newPage) => {
        this.pages.push(newPage);
        this.applyFilters();
        this.calculateStatistics();
        this.loading = false;
      },
      error: (err) => {
        alert('فشل نسخ الصفحة: ' + err.message);
        this.loading = false;
      }
    });
  }
  
  goToPage(pageId: string): void {
    this.router.navigate(['/magic-notebook', this.notebookId, 'page', pageId]);
  }
  
  goBack(): void {
    this.router.navigate(['/magic-notebook', this.notebookId]);
  }
  
  getRelativeTime(date: Date | string): string {
    const now = new Date();
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const diff = now.getTime() - dateObj.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `منذ ${days} ${days === 1 ? 'يوم' : 'أيام'}`;
    if (hours > 0) return `منذ ${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`;
    if (minutes > 0) return `منذ ${minutes} ${minutes === 1 ? 'دقيقة' : 'دقائق'}`;
    return 'الآن';
  }
}
