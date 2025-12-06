import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Workflow {
  id: number;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'archived';
  tasksCount: number;
  createdAt: Date;
}

@Component({
  selector: 'app-workflows-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  template: `
    <div class="workflows-container">
      <div class="workflows-header">
        <h1>📋 المهام وسير العمل</h1>
        <button class="btn-primary" (click)="createWorkflow()">
          ➕ سير عمل جديد
        </button>
      </div>
      <div class="tab-navigation">
        <button class="tab-button" (click)="navigateToTasks()">قائمة المهام</button>
        <button class="tab-button active">سير العمل</button>
      </div>

      <div class="filters">
        <div class="filter-group">
          <label>الحالة:</label>
          <select [(ngModel)]="filterStatus" (change)="applyFilters()">
            <option value="">الكل</option>
            <option value="draft">مسودة</option>
            <option value="active">نشط</option>
            <option value="archived">مؤرشف</option>
          </select>
        </div>

        <div class="filter-group">
          <label>البحث:</label>
          <input 
            type="text" 
            [(ngModel)]="searchTerm" 
            (input)="applyFilters()"
            placeholder="ابحث عن سير عمل..."
          />
        </div>
      </div>

      <div class="workflows-grid">
        <div 
          *ngFor="let workflow of filteredWorkflows" 
          class="workflow-card"
          [class.status-draft]="workflow.status === 'draft'"
          [class.status-active]="workflow.status === 'active'"
          [class.status-archived]="workflow.status === 'archived'"
        >
          <div class="workflow-header">
            <h3>{{ workflow.name }}</h3>
            <span class="status-badge" [class]="'status-' + workflow.status">
              {{ getStatusLabel(workflow.status) }}
            </span>
          </div>

          <p class="workflow-description">{{ workflow.description }}</p>

          <div class="workflow-meta">
            <div class="meta-item">
              <span class="icon">📝</span>
              <span>عدد المهام: {{ workflow.tasksCount }}</span>
            </div>
            <div class="meta-item">
              <span class="icon">📅</span>
              <span>تاريخ الإنشاء: {{ workflow.createdAt | date: 'dd/MM/yyyy' }}</span>
            </div>
          </div>

          <div class="workflow-actions">
            <button class="btn-view" (click)="viewWorkflow(workflow)">عرض المهام</button>
            <button class="btn-edit" (click)="editWorkflow(workflow)">✏️ تعديل</button>
            <button class="btn-delete" (click)="deleteWorkflow(workflow)">🗑️ حذف</button>
          </div>
        </div>
      </div>

      <div *ngIf="filteredWorkflows.length === 0" class="empty-state">
        <p>📭 لا توجد سير عمل</p>
      </div>
    </div>
  `,
  styles: [`
    .workflows-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .workflows-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .workflows-header h1 {
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
    }

    .btn-primary {
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

    .workflows-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .workflow-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.2s, box-shadow 0.2s;
      border-left: 4px solid #ccc;
    }

    .workflow-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.15);
    }

    .workflow-card.status-active {
      border-left-color: #2ecc71; /* Green */
    }

    .workflow-card.status-draft {
      border-left-color: #f39c12; /* Yellow */
    }

    .workflow-card.status-archived {
      border-left-color: #95a5a6; /* Gray */
    }

    .workflow-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 1rem;
    }

    .workflow-header h3 {
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

    .status-draft {
      background: #fef9e7;
      color: #f39c12;
    }

    .status-active {
      background: #e8f8f5;
      color: #2ecc71;
    }

    .status-archived {
      background: #f2f4f4;
      color: #95a5a6;
    }

    .workflow-description {
      color: #666;
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .workflow-meta {
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

    .workflow-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .btn-view,
    .btn-edit,
    .btn-delete {
      padding: 0.5rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: opacity 0.2s;
    }

    .btn-view {
      flex: 2;
      background: #3498db;
      color: white;
    }

    .btn-edit {
      flex: 1;
      background: #f39c12;
      color: white;
    }

    .btn-delete {
      flex: 1;
      background: #e74c3c;
      color: white;
    }

    .btn-view:hover,
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
export class WorkflowsListComponent implements OnInit {
  workflows: Workflow[] = [];
  filteredWorkflows: Workflow[] = [];
  filterStatus = '';
  searchTerm = '';

  constructor(private router: Router) {}

  navigateToTasks() {
    this.router.navigate(['/tasks/list']);
  }

  ngOnInit() {
    this.loadWorkflows();
  }

  loadWorkflows() {
    // بيانات تجريبية
    this.workflows = [
      {
        id: 1,
        name: 'سير عمل سحب وتركيب العدادات',
        description: 'سير عمل متكامل لعمليات سحب وتركيب العدادات والقواطع، يتضمن 5 مراحل.',
        status: 'active',
        tasksCount: 15,
        createdAt: new Date('2025-11-01')
      },
      {
        id: 2,
        name: 'سير عمل فحص المخزون الدوري',
        description: 'سير عمل شهري لفحص وتدقيق المخزون في جميع المستودعات.',
        status: 'draft',
        tasksCount: 8,
        createdAt: new Date('2025-11-10')
      },
      {
        id: 3,
        name: 'سير عمل إغلاق الفترة المالية',
        description: 'سير عمل ربع سنوي لإغلاق الدفاتر وإعداد التقارير المالية.',
        status: 'archived',
        tasksCount: 20,
        createdAt: new Date('2025-10-01')
      }
    ];

    this.applyFilters();
  }

  applyFilters() {
    this.filteredWorkflows = this.workflows.filter(workflow => {
      const matchesStatus = !this.filterStatus || workflow.status === this.filterStatus;
      const matchesSearch = !this.searchTerm || 
        workflow.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        workflow.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'draft': 'مسودة',
      'active': 'نشط',
      'archived': 'مؤرشف'
    };
    return labels[status] || status;
  }

  createWorkflow() {
    alert('سيتم فتح نموذج إنشاء سير عمل جديد');
  }

  viewWorkflow(workflow: Workflow) {
    alert(`عرض مهام سير العمل: ${workflow.name}`);
    // يمكن استخدام this.router.navigate هنا للانتقال إلى صفحة تفاصيل سير العمل
  }

  editWorkflow(workflow: Workflow) {
    alert(`تعديل سير العمل: ${workflow.name}`);
  }

  deleteWorkflow(workflow: Workflow) {
    if (confirm(`هل تريد حذف سير العمل: ${workflow.name}؟`)) {
      this.workflows = this.workflows.filter(w => w.id !== workflow.id);
      this.applyFilters();
    }
  }
}
