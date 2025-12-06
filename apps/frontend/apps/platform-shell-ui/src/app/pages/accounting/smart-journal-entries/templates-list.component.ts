// PHASE-15: Smart Journal Entries - Templates List Component
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SmartJournalEntriesService } from './smart-journal-entries.service';

@Component({
  selector: 'app-templates-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-2xl font-bold mb-6">قوالب القيود الذكية</h2>

        <div *ngIf="loading" class="text-center py-8">
          <p>جاري التحميل...</p>
        </div>

        <div *ngIf="!loading && templates.length === 0" class="text-center py-8">
          <p class="text-gray-500">لا توجد قوالب</p>
        </div>

        <div *ngIf="!loading && templates.length > 0" class="space-y-4">
          <div
            *ngFor="let template of templates"
            class="border rounded p-4 hover:bg-gray-50"
          >
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-semibold text-lg">{{ template.nameAr }}</h3>
                <p class="text-sm text-gray-600">{{ template.code }}</p>
              </div>
              <div class="flex items-center space-x-2">
                <span
                class="px-3 py-1 rounded text-sm"
                [ngClass]="{
                  'bg-green-100 text-green-800': template.isActive,
                  'bg-gray-100 text-gray-800': !template.isActive
                }"
              >
                {{ template.isActive ? 'نشط' : 'غير نشط' }}
              </span>
              <button
                (click)="onDelete(template.id, template.nameAr)"
                class="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition duration-150"
                title="حذف القالب"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TemplatesListComponent implements OnInit {
  templates: any[] = [];
  loading = false;

  constructor(
    private service: SmartJournalEntriesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTemplates();
  }

  loadTemplates() {
    this.loading = true;
    this.service.getTemplates().subscribe({
      next: (data) => {
        this.templates = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onDelete(id: string, name: string) {
    if (confirm(`هل أنت متأكد من حذف القالب "${name}"؟`)) {
      this.service.deleteTemplate(id).subscribe({
        next: () => {
          alert(`تم حذف القالب "${name}" بنجاح.`);
          this.loadTemplates(); // Refresh the list
        },
        error: (err) => {
          console.error('Delete error:', err);
          alert(`فشل حذف القالب "${name}".`);
        },
      });
    }
  }
}
