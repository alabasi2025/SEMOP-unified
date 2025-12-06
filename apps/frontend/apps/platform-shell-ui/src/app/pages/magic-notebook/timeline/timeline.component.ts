import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MagicNotebookService, TimelineEntry } from '../../../services/magic-notebook.service';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  notebookId: string = '';
  entries: TimelineEntry[] = [];
  filteredEntries: TimelineEntry[] = [];
  filterType: string = 'all';
  filterPeriod: string = 'all';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notebookService: MagicNotebookService
  ) {}

  ngOnInit() {
    this.notebookId = this.route.snapshot.paramMap.get('id') || '';
    this.loadTimeline();
  }

  loadTimeline() {
    this.notebookService.getTimeline(this.notebookId).subscribe(entries => {
      this.entries = entries;
      this.applyFilter();
    });
  }

  applyFilter() {
    let filtered = [...this.entries];

    if (this.filterType !== 'all') {
      filtered = filtered.filter(e => e.entryType === this.filterType);
    }

    if (this.filterPeriod !== 'all') {
      const now = new Date();
      filtered = filtered.filter(e => {
        const entryDate = new Date(e.timestamp);
        if (this.filterPeriod === 'today') {
          return entryDate.toDateString() === now.toDateString();
        } else if (this.filterPeriod === 'week') {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return entryDate >= weekAgo;
        } else if (this.filterPeriod === 'month') {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return entryDate >= monthAgo;
        }
        return true;
      });
    }

    this.filteredEntries = filtered;
  }

  getTotalEntries(): number {
    return this.entries.length;
  }

  getTodayEntries(): number {
    const today = new Date().toDateString();
    return this.entries.filter(e => new Date(e.timestamp).toDateString() === today).length;
  }

  getWeekEntries(): number {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return this.entries.filter(e => new Date(e.timestamp) >= weekAgo).length;
  }

  getTypeColor(type: string): string {
    const colors: { [key: string]: string } = {
      'page': '#4facfe',
      'section': '#43e97b',
      'idea': '#fa709a',
      'task': '#a78bfa',
      'note': '#fbbf24'
    };
    return colors[type] || '#667eea';
  }

  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'page': 'صفحة',
      'section': 'قسم',
      'idea': 'فكرة',
      'task': 'مهمة',
      'note': 'ملاحظة'
    };
    return labels[type] || type;
  }

  formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'الآن';
    if (hours < 24) return `منذ ${hours} ساعة`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `منذ ${days} يوم`;
    const weeks = Math.floor(days / 7);
    return `منذ ${weeks} أسبوع`;
  }

  formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  goBack() {
    this.router.navigate(['/magic-notebook', this.notebookId]);
  }
}
