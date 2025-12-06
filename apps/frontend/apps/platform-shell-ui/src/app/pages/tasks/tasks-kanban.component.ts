import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Task {
  id: number;
  title: string;
  description: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high';
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
}

@Component({
  selector: 'app-tasks-kanban',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="kanban-container">
      <div class="kanban-header">
        <h1>📊 لوحة كانبان للمهام</h1>
        <button class="btn-add" (click)="addTask()">➕ مهمة جديدة</button>
      </div>

      <div class="kanban-board">
        <div *ngFor="let column of columns" class="kanban-column" [style.border-top-color]="column.color">
          <div class="column-header">
            <h3>{{ column.title }}</h3>
            <span class="task-count">{{ column.tasks.length }}</span>
          </div>

          <div class="column-content">
            <div 
              *ngFor="let task of column.tasks" 
              class="task-card"
              [class.priority-high]="task.priority === 'high'"
              [class.priority-medium]="task.priority === 'medium'"
              [class.priority-low]="task.priority === 'low'"
            >
              <div class="task-priority">
                <span class="priority-badge" [class]="'priority-' + task.priority">
                  {{ getPriorityIcon(task.priority) }}
                </span>
              </div>
              <h4>{{ task.title }}</h4>
              <p>{{ task.description }}</p>
              <div class="task-footer">
                <span class="assignee">👤 {{ task.assignee }}</span>
              </div>
            </div>

            <div *ngIf="column.tasks.length === 0" class="empty-column">
              <p>لا توجد مهام</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .kanban-container {
      padding: 2rem;
      height: calc(100vh - 100px);
      overflow: hidden;
    }

    .kanban-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .kanban-header h1 {
      font-size: 2rem;
      color: #2c3e50;
      margin: 0;
    }

    .btn-add {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .btn-add:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .kanban-board {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      height: calc(100% - 80px);
    }

    .kanban-column {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 1rem;
      border-top: 4px solid;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .column-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid #e0e0e0;
    }

    .column-header h3 {
      margin: 0;
      color: #2c3e50;
      font-size: 1.2rem;
    }

    .task-count {
      background: #667eea;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .column-content {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .task-card {
      background: white;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      cursor: move;
      transition: transform 0.2s, box-shadow 0.2s;
      border-left: 3px solid #ccc;
    }

    .task-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
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

    .task-priority {
      margin-bottom: 0.5rem;
    }

    .priority-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .priority-badge.priority-high {
      background: #fee;
      color: #e74c3c;
    }

    .priority-badge.priority-medium {
      background: #fff3cd;
      color: #f39c12;
    }

    .priority-badge.priority-low {
      background: #e3f2fd;
      color: #3498db;
    }

    .task-card h4 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
      font-size: 1rem;
    }

    .task-card p {
      margin: 0 0 0.75rem 0;
      color: #666;
      font-size: 0.9rem;
      line-height: 1.4;
    }

    .task-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 0.5rem;
      border-top: 1px solid #eee;
    }

    .assignee {
      font-size: 0.85rem;
      color: #777;
    }

    .empty-column {
      text-align: center;
      padding: 2rem;
      color: #999;
    }

    /* Scrollbar styling */
    .column-content::-webkit-scrollbar {
      width: 6px;
    }

    .column-content::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }

    .column-content::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 10px;
    }

    .column-content::-webkit-scrollbar-thumb:hover {
      background: #555;
    }

    @media (max-width: 1024px) {
      .kanban-board {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TasksKanbanComponent implements OnInit {
  columns: Column[] = [];

  ngOnInit() {
    this.loadColumns();
  }

  loadColumns() {
    this.columns = [
      {
        id: 'todo',
        title: '📋 قيد الانتظار',
        color: '#95a5a6',
        tasks: [
          {
            id: 1,
            title: 'مراجعة التصميم',
            description: 'مراجعة تصميم الواجهة الجديدة',
            assignee: 'أحمد',
            priority: 'medium'
          },
          {
            id: 2,
            title: 'تحديث قاعدة البيانات',
            description: 'إضافة جداول جديدة للنظام',
            assignee: 'فاطمة',
            priority: 'high'
          }
        ]
      },
      {
        id: 'in-progress',
        title: '⚙️ قيد التنفيذ',
        color: '#f39c12',
        tasks: [
          {
            id: 3,
            title: 'تطوير API',
            description: 'تطوير واجهات برمجية جديدة',
            assignee: 'محمد',
            priority: 'high'
          }
        ]
      },
      {
        id: 'done',
        title: '✅ مكتملة',
        color: '#27ae60',
        tasks: [
          {
            id: 4,
            title: 'إعداد البيئة',
            description: 'تجهيز بيئة التطوير',
            assignee: 'سارة',
            priority: 'low'
          },
          {
            id: 5,
            title: 'كتابة الاختبارات',
            description: 'كتابة اختبارات الوحدة',
            assignee: 'علي',
            priority: 'medium'
          }
        ]
      }
    ];
  }

  getPriorityIcon(priority: string): string {
    const icons: { [key: string]: string } = {
      'low': '🔵 منخفضة',
      'medium': '🟡 متوسطة',
      'high': '🔴 عالية'
    };
    return icons[priority] || priority;
  }

  addTask() {
    alert('سيتم فتح نموذج إضافة مهمة جديدة');
  }
}
