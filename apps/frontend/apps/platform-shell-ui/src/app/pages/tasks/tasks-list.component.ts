import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: Date;
  createdAt: Date;
}

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="tasks-container">
      <div class="tasks-header">
        <h1>📋 المهام وسير العمل</h1>
        <button class="btn-primary" (click)="createTask()">
          ➕ مهمة جديدة
        </button>
      </div>
      <div class="tab-navigation">
        <button class="tab-button active">قائمة المهام</button>
        <button class="tab-button" (click)="navigateToWorkflows()">سير العمل</button>
      </div>

      <div class="filters">
        <div class="filter-group">
          <label>الحالة:</label>
          <select [(ngModel)]="filterStatus" (change)="applyFilters()">
            <option value="">الكل</option>
            <option value="todo">قيد الانتظار</option>
            <option value="in-progress">قيد التنفيذ</option>
            <option value="done">مكتملة</option>
          </select>
        </div>

        <div class="filter-group">
          <label>الأولوية:</label>
          <select [(ngModel)]="filterPriority" (change)="applyFilters()">
            <option value="">الكل</option>
            <option value="low">منخفضة</option>
            <option value="medium">متوسطة</option>
            <option value="high">عالية</option>
          </select>
        </div>

        <div class="filter-group">
          <label>البحث:</label>
          <input 
            type="text" 
            [(ngModel)]="searchTerm" 
            (input)="applyFilters()"
            placeholder="ابحث عن مهمة..."
          />
        </div>
      </div>

      <div class="tasks-grid">
        <div 
          *ngFor="let task of filteredTasks" 
          class="task-card"
          [class.priority-high]="task.priority === 'high'"
          [class.priority-medium]="task.priority === 'medium'"
          [class.priority-low]="task.priority === 'low'"
        >
          <div class="task-header">
            <h3>{{ task.title }}</h3>
            <span class="status-badge" [class]="'status-' + task.status">
              {{ getStatusLabel(task.status) }}
            </span>
          </div>

          <p class="task-description">{{ task.description }}</p>

          <div class="task-meta">
            <div class="meta-item">
              <span class="icon">👤</span>
              <span>{{ task.assignee }}</span>
            </div>
            <div class="meta-item">
              <span class="icon">📅</span>
              <span>{{ task.dueDate | date: 'dd/MM/yyyy' }}</span>
            </div>
            <div class="meta-item">
              <span class="icon">⚡</span>
              <span>{{ getPriorityLabel(task.priority) }}</span>
            </div>
          </div>

          <div class="task-actions">
            <button class="btn-edit" (click)="editTask(task)">✏️ تعديل</button>
            <button class="btn-delete" (click)="deleteTask(task)">🗑️ حذف</button>
          </div>
        </div>
      </div>

      <div *ngIf="filteredTasks.length === 0" class="empty-state">
        <p>📭 لا توجد مهام</p>
      </div>
    </div>
  `,
  styles: [`
    .tasks-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .tasks-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem; /* تقليل المسافة */
    }

    .tasks-header h1 {
      font-size: 2rem;
      color: #2c3e50;
      margin: 0;
    }

    .tab-navigation {
      display: flex;
      border-bottom: 2px solid #e0e0e0;
      margin-bottom: 2rem;
    }

    .tab-button {
      background: none;
      border: none;
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      cursor: pointer;
      color: #555;
      border-bottom: 3px solid transparent;
      transition: all 0.3s ease;
    }

    .tab-button:hover {
      color: #667eea;
    }

    .tab-button.active {
      color: #667eea;
      border-bottom: 3px solid #667eea;
      font-weight: 600;
    }ary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filter-group label {
      font-weight: 600;
      color: #555;
      font-size: 0.9rem;
    }

    .filter-group select,
    .filter-group input {
      padding: 0.5rem 1rem;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    .filter-group select:focus,
    .filter-group input:focus {
      outline: none;
      border-color: #667eea;
    }

    .tasks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .task-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.2s, box-shadow 0.2s;
      border-left: 4px solid #ccc;
    }

    .task-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.15);
    }

    .task-card.priority-high {
      border-left-color: #e74c3c;
    }

    .task-card.priority-medium {
      border-left-color: #f39c12;
    }

    .task-card.priority-low {
      border-left-color: #3498db;
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 1rem;
    }

    .task-header h3 {
      margin: 0;
      color: #2c3e50;
      font-size: 1.2rem;
      flex: 1;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .status-todo {
      background: #ecf0f1;
      color: #7f8c8d;
    }

    .status-in-progress {
      background: #fff3cd;
      color: #856404;
    }

    .status-done {
      background: #d4edda;
      color: #155724;
    }

    .task-description {
      color: #666;
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .task-meta {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
      font-size: 0.9rem;
    }

    .meta-item .icon {
      font-size: 1.1rem;
    }

    .task-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-edit,
    .btn-delete {
      flex: 1;
      padding: 0.5rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: opacity 0.2s;
    }

    .btn-edit {
      background: #3498db;
      color: white;
    }

    .btn-delete {
      background: #e74c3c;
      color: white;
    }

    .btn-edit:hover,
    .btn-delete:hover {
      opacity: 0.8;
    }

    .empty-state {
      text-align: center;
      padding: 4rem;
      color: #999;
      font-size: 1.2rem;
    }
  `]
})
export class TasksListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  filterStatus = '';
  filterPriority = '';
  searchTerm = '';

  constructor(private router: Router) {}

  navigateToWorkflows() {
    this.router.navigate(['/tasks/workflows']);
  }

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    // بيانات تجريبية
    this.tasks = [
      {
        id: 1,
        title: 'تطوير واجهة المستخدم',
        description: 'تصميم وتطوير واجهة المستخدم الرئيسية للنظام',
        status: 'in-progress',
        priority: 'high',
        assignee: 'أحمد محمد',
        dueDate: new Date('2025-12-01'),
        createdAt: new Date('2025-11-15')
      },
      {
        id: 2,
        title: 'اختبار النظام',
        description: 'إجراء اختبارات شاملة للتأكد من جودة النظام',
        status: 'todo',
        priority: 'medium',
        assignee: 'فاطمة علي',
        dueDate: new Date('2025-12-10'),
        createdAt: new Date('2025-11-16')
      },
      {
        id: 3,
        title: 'كتابة التوثيق',
        description: 'إعداد دليل المستخدم والتوثيق الفني',
        status: 'done',
        priority: 'low',
        assignee: 'محمد حسن',
        dueDate: new Date('2025-11-20'),
        createdAt: new Date('2025-11-10')
      }
    ];

    this.applyFilters();
  }

  applyFilters() {
    this.filteredTasks = this.tasks.filter(task => {
      const matchesStatus = !this.filterStatus || task.status === this.filterStatus;
      const matchesPriority = !this.filterPriority || task.priority === this.filterPriority;
      const matchesSearch = !this.searchTerm || 
        task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      return matchesStatus && matchesPriority && matchesSearch;
    });
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'todo': 'قيد الانتظار',
      'in-progress': 'قيد التنفيذ',
      'done': 'مكتملة'
    };
    return labels[status] || status;
  }

  getPriorityLabel(priority: string): string {
    const labels: { [key: string]: string } = {
      'low': 'منخفضة',
      'medium': 'متوسطة',
      'high': 'عالية'
    };
    return labels[priority] || priority;
  }

  createTask() {
    alert('سيتم فتح نموذج إنشاء مهمة جديدة');
  }

  editTask(task: Task) {
    alert(`تعديل المهمة: ${task.title}`);
  }

  deleteTask(task: Task) {
    if (confirm(`هل تريد حذف المهمة: ${task.title}؟`)) {
      this.tasks = this.tasks.filter(t => t.id !== task.id);
      this.applyFilters();
    }
  }
}
