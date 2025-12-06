import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MagicNotebookService, Task } from '../../../services/magic-notebook.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  loading = false;
  error: string | null = null;
  notebookId: string = '';
  
  // Filters
  filterStatus: 'all' | 'TODO' | 'IN_PROGRESS' | 'DONE' = 'all';
  filterPriority: 'all' | 'LOW' | 'MEDIUM' | 'HIGH' = 'all';
  sortBy: 'dueDate' | 'priority' | 'createdAt' = 'dueDate';
  viewMode: 'board' | 'list' = 'board';
  
  // Quick add
  quickAddText = '';
  
  // Edit mode
  editingTask: Task | null = null;
  editForm = {
    title: '',
    description: '',
    priority: 'MEDIUM' as Task['priority'],
    status: 'TODO' as Task['status'],
    dueDate: ''
  };
  
  // Statistics
  stats = {
    total: 0,
    todo: 0,
    inProgress: 0,
    done: 0,
    overdue: 0
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
        this.loadTasks();
      }
    });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  loadTasks(): void {
    this.loading = true;
    this.error = null;
    
    this.notebookService.getTasks(this.notebookId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.calculateStats();
          this.applyFilters();
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message || 'فشل تحميل المهام';
          this.loading = false;
        }
      });
  }
  
  calculateStats(): void {
    const now = new Date();
    this.stats = {
      total: this.tasks.length,
      todo: this.tasks.filter(t => t.status === 'TODO').length,
      inProgress: this.tasks.filter(t => t.status === 'IN_PROGRESS').length,
      done: this.tasks.filter(t => t.status === 'DONE').length,
      overdue: this.tasks.filter(t => 
        t.dueDate && new Date(t.dueDate) < now && t.status !== 'DONE'
      ).length
    };
  }
  
  applyFilters(): void {
    let filtered = [...this.tasks];
    
    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(t => t.status === this.filterStatus);
    }
    
    if (this.filterPriority !== 'all') {
      filtered = filtered.filter(t => t.priority === this.filterPriority);
    }
    
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority':
          const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });
    
    this.filteredTasks = filtered;
  }
  
  quickAdd(): void {
    if (!this.quickAddText.trim()) return;
    
    this.loading = true;
    this.notebookService.createTask({
      title: this.quickAddText,
      notebookId: this.notebookId,
      status: 'TODO',
      priority: 'MEDIUM'
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (task) => {
        this.tasks.unshift(task);
        this.quickAddText = '';
        this.calculateStats();
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        alert('فشل إضافة المهمة: ' + err.message);
        this.loading = false;
      }
    });
  }
  
  editTask(task: Task): void {
    this.editingTask = task;
    this.editForm = {
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate || ''
    };
  }
  
  cancelEdit(): void {
    this.editingTask = null;
  }
  
  saveTask(): void {
    if (!this.editingTask) return;
    
    this.loading = true;
    this.notebookService.updateTask(this.editingTask.id, this.editForm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => {
          const index = this.tasks.findIndex(t => t.id === updated.id);
          if (index !== -1) {
            this.tasks[index] = updated;
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
  
  deleteTask(task: Task, event: Event): void {
    event.stopPropagation();
    
    if (!confirm(`هل أنت متأكد من حذف مهمة "${task.title}"؟`)) return;
    
    this.loading = true;
    this.notebookService.deleteTask(task.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.tasks = this.tasks.filter(t => t.id !== task.id);
          this.calculateStats();
          this.applyFilters();
          this.loading = false;
        },
        error: (err) => {
          alert('فشل حذف المهمة: ' + err.message);
          this.loading = false;
        }
      });
  }
  
  updateStatus(task: Task, status: Task['status'], event: Event): void {
    event.stopPropagation();
    
    this.notebookService.updateTask(task.id, { status })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => {
          const index = this.tasks.findIndex(t => t.id === updated.id);
          if (index !== -1) {
            this.tasks[index] = updated;
            this.calculateStats();
            this.applyFilters();
          }
        },
        error: (err) => {
          alert('فشل تحديث الحالة: ' + err.message);
        }
      });
  }
  
  getTasksByStatus(status: Task['status']): Task[] {
    return this.filteredTasks.filter(t => t.status === status);
  }
  
  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'HIGH': return '#f56565';
      case 'MEDIUM': return '#ed8936';
      case 'LOW': return '#48bb78';
      default: return '#718096';
    }
  }
  
  isOverdue(task: Task): boolean {
    if (!task.dueDate || task.status === 'DONE') return false;
    return new Date(task.dueDate) < new Date();
  }
  
  getDaysUntilDue(dueDate: string): number {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
  
  goBack(): void {
    this.router.navigate(['/magic-notebook', this.notebookId]);
  }
}
