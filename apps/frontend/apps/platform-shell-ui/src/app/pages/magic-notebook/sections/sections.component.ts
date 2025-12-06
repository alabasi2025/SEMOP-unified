import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MagicNotebookService, Section, Page } from '../../../services/magic-notebook.service';

@Component({
  selector: 'app-sections',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.css']
})
export class SectionsComponent implements OnInit, OnDestroy {
  sections: Section[] = [];
  pages: Page[] = [];
  loading = false;
  error: string | null = null;
  notebookId: string = '';
  
  // Edit mode
  editingSection: Section | null = null;
  editForm = {
    title: '',
    description: '',
    color: '#667eea'
  };
  
  // Create mode
  showCreateForm = false;
  createForm = {
    title: '',
    description: '',
    color: '#667eea'
  };
  
  // Drag & Drop
  draggedSection: Section | null = null;
  draggedPage: Page | null = null;
  dragOverSectionId: string | null = null;
  
  // Colors
  availableColors = [
    { name: 'بنفسجي', value: '#667eea' },
    { name: 'أزرق', value: '#4299e1' },
    { name: 'أخضر', value: '#48bb78' },
    { name: 'أصفر', value: '#ecc94b' },
    { name: 'برتقالي', value: '#ed8936' },
    { name: 'أحمر', value: '#f56565' },
    { name: 'وردي', value: '#ed64a6' },
    { name: 'رمادي', value: '#718096' }
  ];
  
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
        this.loadData();
      }
    });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  loadData(): void {
    this.loading = true;
    this.error = null;
    
    // Load sections and pages in parallel
    Promise.all([
      this.notebookService.getSections(this.notebookId).toPromise(),
      this.notebookService.getPages(this.notebookId).toPromise()
    ])
    .then(([sections, pages]) => {
      this.sections = sections || [];
      this.pages = pages || [];
      this.loading = false;
    })
    .catch(err => {
      this.error = err.message || 'فشل تحميل البيانات';
      this.loading = false;
    });
  }
  
  getPagesInSection(sectionId: string): Page[] {
    return this.pages.filter(page => page.sectionId === sectionId);
  }
  
  getPagesWithoutSection(): Page[] {
    return this.pages.filter(page => !page.sectionId);
  }
  
  showCreate(): void {
    this.showCreateForm = true;
    this.createForm = {
      title: '',
      description: '',
      color: '#667eea'
    };
  }
  
  cancelCreate(): void {
    this.showCreateForm = false;
  }
  
  createSection(): void {
    if (!this.createForm.title.trim()) {
      alert('الرجاء إدخال عنوان القسم');
      return;
    }
    
    this.loading = true;
    this.notebookService.createSection({
      ...this.createForm,
      notebookId: this.notebookId,
      order: this.sections.length
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (section) => {
        this.sections.push(section);
        this.cancelCreate();
        this.loading = false;
      },
      error: (err) => {
        alert('فشل إنشاء القسم: ' + err.message);
        this.loading = false;
      }
    });
  }
  
  editSection(section: Section): void {
    this.editingSection = section;
    this.editForm = {
      title: section.title,
      description: section.description || '',
      color: section.color || '#667eea'
    };
  }
  
  cancelEdit(): void {
    this.editingSection = null;
  }
  
  saveSection(): void {
    if (!this.editingSection) return;
    
    this.loading = true;
    this.notebookService.updateSection(this.editingSection.id, this.editForm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => {
          const index = this.sections.findIndex(s => s.id === updated.id);
          if (index !== -1) {
            this.sections[index] = updated;
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
  
  deleteSection(section: Section): void {
    const pagesCount = this.getPagesInSection(section.id).length;
    const message = pagesCount > 0
      ? `هذا القسم يحتوي على ${pagesCount} صفحة. هل تريد حذفه؟ (ستنتقل الصفحات إلى "بدون قسم")`
      : `هل أنت متأكد من حذف قسم "${section.title}"؟`;
    
    if (!confirm(message)) return;
    
    this.loading = true;
    this.notebookService.deleteSection(section.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.sections = this.sections.filter(s => s.id !== section.id);
          // Remove sectionId from pages
          this.pages = this.pages.map(page => 
            page.sectionId === section.id ? { ...page, sectionId: undefined } : page
          );
          this.loading = false;
        },
        error: (err) => {
          alert('فشل حذف القسم: ' + err.message);
          this.loading = false;
        }
      });
  }
  
  // Drag & Drop for Sections
  onSectionDragStart(section: Section): void {
    this.draggedSection = section;
  }
  
  onSectionDragEnd(): void {
    this.draggedSection = null;
  }
  
  onSectionDragOver(event: DragEvent, targetSection: Section): void {
    event.preventDefault();
    if (this.draggedSection && this.draggedSection.id !== targetSection.id) {
      // Allow drop
    }
  }
  
  onSectionDrop(event: DragEvent, targetSection: Section): void {
    event.preventDefault();
    
    if (!this.draggedSection || this.draggedSection.id === targetSection.id) return;
    
    const draggedIndex = this.sections.findIndex(s => s.id === this.draggedSection!.id);
    const targetIndex = this.sections.findIndex(s => s.id === targetSection.id);
    
    // Reorder sections
    const newSections = [...this.sections];
    newSections.splice(draggedIndex, 1);
    newSections.splice(targetIndex, 0, this.draggedSection);
    
    this.sections = newSections;
    this.draggedSection = null;
    
    // TODO: Update order on server
  }
  
  // Drag & Drop for Pages
  onPageDragStart(page: Page): void {
    this.draggedPage = page;
  }
  
  onPageDragEnd(): void {
    this.draggedPage = null;
    this.dragOverSectionId = null;
  }
  
  onSectionDropZoneOver(event: DragEvent, sectionId: string): void {
    event.preventDefault();
    this.dragOverSectionId = sectionId;
  }
  
  onSectionDropZoneLeave(): void {
    this.dragOverSectionId = null;
  }
  
  onPageDropToSection(event: DragEvent, sectionId: string): void {
    event.preventDefault();
    
    if (!this.draggedPage) return;
    
    this.loading = true;
    this.notebookService.updatePage(this.draggedPage.id, { sectionId })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => {
          const index = this.pages.findIndex(p => p.id === updated.id);
          if (index !== -1) {
            this.pages[index] = updated;
          }
          this.draggedPage = null;
          this.dragOverSectionId = null;
          this.loading = false;
        },
        error: (err) => {
          alert('فشل نقل الصفحة: ' + err.message);
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
}
