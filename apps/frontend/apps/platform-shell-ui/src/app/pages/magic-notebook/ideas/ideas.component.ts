import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MagicNotebookService, Idea } from '../../../services/magic-notebook.service';

@Component({
  selector: 'app-ideas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ideas.component.html',
  styleUrls: ['./ideas.component.css']
})
export class IdeasComponent implements OnInit, OnDestroy {
  ideas: Idea[] = [];
  filteredIdeas: Idea[] = [];
  loading = false;
  error: string | null = null;
  notebookId: string = '';
  
  // Filter & Sort
  filterStatus: 'all' | 'pending' | 'in-progress' | 'completed' | 'archived' = 'all';
  filterPriority: 'all' | 'low' | 'medium' | 'high' = 'all';
  sortBy: 'createdAt' | 'updatedAt' | 'priority' = 'updatedAt';
  sortOrder: 'asc' | 'desc' = 'desc';
  searchQuery = '';
  
  // Quick add
  quickAddText = '';
  
  // Edit mode
  editingIdea: Idea | null = null;
  editForm = {
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: 'pending' as 'pending' | 'in-progress' | 'completed' | 'archived',
    tags: [] as string[]
  };
  
  // Tags
  availableTags: string[] = [];
  newTag = '';
  
  // Statistics
  stats = {
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    archived: 0
  };
  
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
        this.loadIdeas();
      }
    });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  loadIdeas(): void {
    this.loading = true;
    this.error = null;
    
    this.notebookService.getIdeas(this.notebookId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (ideas) => {
          this.ideas = ideas;
          this.extractTags();
          this.calculateStats();
          this.applyFilters();
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message || 'فشل تحميل الأفكار';
          this.loading = false;
        }
      });
  }
  
  extractTags(): void {
    const tagsSet = new Set<string>();
    this.ideas.forEach(idea => {
      idea.tags?.forEach(tag => tagsSet.add(tag));
    });
    this.availableTags = Array.from(tagsSet).sort();
  }
  
  calculateStats(): void {
    this.stats = {
      total: this.ideas.length,
      pending: this.ideas.filter(i => i.status === 'pending').length,
      inProgress: this.ideas.filter(i => i.status === 'in-progress').length,
      completed: this.ideas.filter(i => i.status === 'completed').length,
      archived: this.ideas.filter(i => i.status === 'archived').length
    };
  }
  
  applyFilters(): void {
    let filtered = [...this.ideas];
    
    // Filter by status
    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(idea => idea.status === this.filterStatus);
    }
    
    // Filter by priority
    if (this.filterPriority !== 'all') {
      filtered = filtered.filter(idea => idea.priority === this.filterPriority);
    }
    
    // Search
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(idea =>
        idea.title.toLowerCase().includes(query) ||
        idea.description?.toLowerCase().includes(query) ||
        idea.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (this.sortBy) {
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0);
          break;
      }
      
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
    
    this.filteredIdeas = filtered;
  }
  
  quickAdd(): void {
    if (!this.quickAddText.trim()) return;
    
    this.loading = true;
    this.notebookService.createIdea({
      title: this.quickAddText,
      notebookId: this.notebookId,
      status: 'pending',
      priority: 'medium'
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (idea) => {
        this.ideas.unshift(idea);
        this.quickAddText = '';
        this.calculateStats();
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        alert('فشل إضافة الفكرة: ' + err.message);
        this.loading = false;
      }
    });
  }
  
  editIdea(idea: Idea): void {
    this.editingIdea = idea;
    this.editForm = {
      title: idea.title,
      description: idea.description || '',
      priority: idea.priority,
      status: idea.status,
      tags: [...(idea.tags || [])]
    };
  }
  
  cancelEdit(): void {
    this.editingIdea = null;
    this.newTag = '';
  }
  
  saveIdea(): void {
    if (!this.editingIdea) return;
    
    this.loading = true;
    this.notebookService.updateIdea(this.editingIdea.id, this.editForm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => {
          const index = this.ideas.findIndex(i => i.id === updated.id);
          if (index !== -1) {
            this.ideas[index] = updated;
            this.extractTags();
            this.calculateStats();
            this.applyFilters();
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
  
  deleteIdea(idea: Idea, event: Event): void {
    event.stopPropagation();
    
    if (!confirm(`هل أنت متأكد من حذف فكرة "${idea.title}"؟`)) return;
    
    this.loading = true;
    this.notebookService.deleteIdea(idea.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.ideas = this.ideas.filter(i => i.id !== idea.id);
          this.extractTags();
          this.calculateStats();
          this.applyFilters();
          this.loading = false;
        },
        error: (err) => {
          alert('فشل حذف الفكرة: ' + err.message);
          this.loading = false;
        }
      });
  }
  
  updateStatus(idea: Idea, status: Idea['status'], event: Event): void {
    event.stopPropagation();
    
    this.notebookService.updateIdea(idea.id, { status })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => {
          const index = this.ideas.findIndex(i => i.id === updated.id);
          if (index !== -1) {
            this.ideas[index] = updated;
            this.calculateStats();
            this.applyFilters();
          }
        },
        error: (err) => {
          alert('فشل تحديث الحالة: ' + err.message);
        }
      });
  }
  
  addTag(): void {
    if (!this.newTag.trim() || this.editForm.tags.includes(this.newTag.trim())) return;
    
    this.editForm.tags.push(this.newTag.trim());
    this.newTag = '';
  }
  
  removeTag(tag: string): void {
    this.editForm.tags = this.editForm.tags.filter(t => t !== tag);
  }
  
  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return '#f56565';
      case 'medium': return '#ed8936';
      case 'low': return '#48bb78';
      default: return '#718096';
    }
  }
  
  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return '#a0aec0';
      case 'in-progress': return '#4299e1';
      case 'completed': return '#48bb78';
      case 'archived': return '#718096';
      default: return '#a0aec0';
    }
  }
  
  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending': return 'قيد الانتظار';
      case 'in-progress': return 'قيد التنفيذ';
      case 'completed': return 'مكتمل';
      case 'archived': return 'مؤرشف';
      default: return status;
    }
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
