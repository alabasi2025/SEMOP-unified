import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MagicNotebookService, Notebook, Page, Section } from '../../../services/magic-notebook.service';
import { ExportImportService } from '../../../services/export-import.service';
import { VersionBadgeComponent } from '../../../shared/components/version-badge/version-badge.component';

@Component({
  selector: 'app-notebook-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, VersionBadgeComponent],
  templateUrl: './notebook-detail.component.html',
  styleUrls: ['./notebook-detail.component.css']
})
export class NotebookDetailComponent implements OnInit, OnDestroy {
  notebook: Notebook | null = null;
  pages: Page[] = [];
  sections: Section[] = [];
  loading = false;
  error: string | null = null;
  
  // Statistics
  totalPages = 0;
  totalWords = 0;
  lastUpdated: Date | null = null;
  
  // Edit mode
  editMode = false;
  editForm = {
    title: '',
    description: '',
    icon: '',
    color: ''
  };
  
  private destroy$ = new Subject<void>();
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notebookService: MagicNotebookService,
    private exportImportService: ExportImportService
  ) {}
  
  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadNotebook(id);
        this.loadPages(id);
        this.loadSections(id);
      }
    });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  loadNotebook(id: string): void {
    this.loading = true;
    this.error = null;
    
    this.notebookService.getNotebook(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (notebook) => {
          this.notebook = notebook;
          this.editForm = {
            title: notebook.title,
            description: notebook.description || '',
            icon: notebook.icon,
            color: notebook.color
          };
          this.lastUpdated = new Date(notebook.updatedAt);
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message || 'فشل تحميل الدفتر';
          this.loading = false;
        }
      });
  }
  
  loadPages(notebookId: string): void {
    this.notebookService.getPages(notebookId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (pages) => {
          this.pages = pages;
          this.totalPages = pages.length;
          this.totalWords = pages.reduce((sum, page) => sum + (page.wordCount || 0), 0);
        },
        error: (err) => {
          console.error('فشل تحميل الصفحات:', err);
        }
      });
  }
  
  loadSections(notebookId: string): void {
    this.notebookService.getSections(notebookId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (sections) => {
          this.sections = sections;
        },
        error: (err) => {
          console.error('فشل تحميل الأقسام:', err);
        }
      });
  }
  
  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode && this.notebook) {
      this.editForm = {
        title: this.notebook.title,
        description: this.notebook.description || '',
        icon: this.notebook.icon,
        color: this.notebook.color
      };
    }
  }
  
  saveNotebook(): void {
    if (!this.notebook) return;
    
    this.loading = true;
    this.error = null;
    
    this.notebookService.updateNotebook(this.notebook.id, this.editForm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => {
          this.notebook = updated;
          this.editMode = false;
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message || 'فشل حفظ التعديلات';
          this.loading = false;
        }
      });
  }
  
  deleteNotebook(): void {
    if (!this.notebook) return;
    
    if (!confirm(`هل أنت متأكد من حذف دفتر "${this.notebook.title}"؟`)) {
      return;
    }
    
    this.loading = true;
    this.error = null;
    
    this.notebookService.deleteNotebook(this.notebook.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(['/magic-notebook']);
        },
        error: (err) => {
          this.error = err.message || 'فشل حذف الدفتر';
          this.loading = false;
        }
      });
  }
  
  createPage(): void {
    if (!this.notebook) return;
    
    const title = prompt('عنوان الصفحة الجديدة:');
    if (!title) return;
    
    this.notebookService.createPage({
      title,
      content: '',
      notebookId: this.notebook.id,
      order: this.pages.length
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (page) => {
        this.pages.push(page);
        this.totalPages++;
        this.router.navigate(['/magic-notebook', this.notebook!.id, 'page', page.id]);
      },
      error: (err) => {
        alert('فشل إنشاء الصفحة: ' + err.message);
      }
    });
  }
  
  createSection(): void {
    if (!this.notebook) return;
    
    const title = prompt('عنوان القسم الجديد:');
    if (!title) return;
    
    this.notebookService.createSection({
      title,
      notebookId: this.notebook.id,
      order: this.sections.length
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (section) => {
        this.sections.push(section);
      },
      error: (err) => {
        alert('فشل إنشاء القسم: ' + err.message);
      }
    });
  }
  
  goToPage(pageId: string): void {
    if (!this.notebook) return;
    this.router.navigate(['/magic-notebook', this.notebook.id, 'page', pageId]);
  }
  
  deletePage(page: Page, event: Event): void {
    event.stopPropagation();
    
    if (!confirm(`هل أنت متأكد من حذف صفحة "${page.title}"؟`)) {
      return;
    }
    
    this.notebookService.deletePage(page.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.pages = this.pages.filter(p => p.id !== page.id);
          this.totalPages--;
          this.totalWords -= (page.wordCount || 0);
        },
        error: (err) => {
          alert('فشل حذف الصفحة: ' + err.message);
        }
      });
  }
  
  deleteSection(section: Section, event: Event): void {
    event.stopPropagation();
    
    if (!confirm(`هل أنت متأكد من حذف قسم "${section.title}"؟`)) {
      return;
    }
    
    this.notebookService.deleteSection(section.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.sections = this.sections.filter(s => s.id !== section.id);
        },
        error: (err) => {
          alert('فشل حذف القسم: ' + err.message);
        }
      });
  }
  
  // Export/Import Methods
  exportAsJSON(): void {
    if (!this.notebook) return;
    
    this.loading = true;
    this.exportImportService.exportNotebookAsJSON(this.notebook.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loading = false;
          alert('تم تصدير الدفتر بنجاح!');
        },
        error: (err) => {
          this.loading = false;
          alert('فشل تصدير الدفتر: ' + err.message);
        }
      });
  }
  
  async exportAsPDF(): Promise<void> {
    if (!this.notebook) return;
    
    this.loading = true;
    try {
      await this.exportImportService.exportNotebookAsPDF(this.notebook.id);
      this.loading = false;
      alert('تم تصدير الدفتر كـ PDF بنجاح!');
    } catch (err: any) {
      this.loading = false;
      alert('فشل تصدير PDF: ' + err.message);
    }
  }
  
  async importFromJSON(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) return;
    
    this.loading = true;
    this.error = null;
    
    try {
      const importData = await this.exportImportService.importNotebookFromJSON(file);
      const newNotebookId = await this.exportImportService.createNotebookFromImport(importData);
      
      this.loading = false;
      alert('تم استيراد الدفتر بنجاح!');
      this.router.navigate(['/magic-notebook', newNotebookId]);
    } catch (err: any) {
      this.loading = false;
      this.error = 'فشل استيراد الدفتر: ' + err.message;
      alert(this.error);
    }
    
    // Reset input
    input.value = '';
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
