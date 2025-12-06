import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SmartJournalEntriesService } from './smart-journal-entries.service';

@Component({
  selector: 'app-smart-journal-entries-dashboard',
  standalone: true,
  imports: [CommonModule],
  providers: [SmartJournalEntriesService],
  template: `
    <div class="container mx-auto p-4">
      <div class="bg-white rounded-lg shadow p-6">
        <h1 class="text-3xl font-bold mb-6">القيود الذكية</h1>
        
        <div class="flex flex-col md:flex-row gap-4">
          <button
            class="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            (click)="navigateToCreate()"
          >
            إنشاء قيد ذكي جديد
          </button>
          
          <button
            class="w-full md:w-auto px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 md:mr-2"
            (click)="navigateToTemplates()"
          >
            إدارة القوالب
          </button>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  constructor(
    private router: Router,
    private smartEntryService: SmartJournalEntriesService
  ) {}

  ngOnInit(): void {
    // Stats functionality temporarily disabled
  }

  navigateToCreate(): void {
    this.router.navigate(['/accounting/smart-journal-entries/create']);
  }

  navigateToTemplates(): void {
    this.router.navigate(['/accounting/smart-journal-entries/templates']);
  }
}
