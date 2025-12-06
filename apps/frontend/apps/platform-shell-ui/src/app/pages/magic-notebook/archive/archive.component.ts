import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MagicNotebookService } from '../../../services/magic-notebook.service';

interface ArchivedItem {
  id: string;
  type: 'page' | 'section' | 'idea' | 'task' | 'note';
  title: string;
  description: string;
  archivedAt: string;
  archivedBy: string;
  icon: string;
}

@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})
export class ArchiveComponent implements OnInit {
  notebookId: string = '';
  items: ArchivedItem[] = [];
  filteredItems: ArchivedItem[] = [];
  filterType: string = 'all';
  searchQuery: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notebookService: MagicNotebookService
  ) {}

  ngOnInit() {
    this.notebookId = this.route.snapshot.paramMap.get('id') || '';
    this.loadArchive();
  }

  loadArchive() {
    this.notebookService.getArchive().subscribe({
      next: (archiveItems) => {
        this.items = archiveItems.map(item => ({
          id: item.id,
          type: item.itemType.toLowerCase() as any,
          title: item.itemData.title || 'عنصر مؤرشف',
          description: item.itemData.description || item.itemData.content || 'لا يوجد وصف',
          archivedAt: item.archivedAt,
          archivedBy: item.archivedBy,
          icon: this.getTypeIcon(item.itemType)
        }));
        this.applyFilter();
      },
      error: (error) => console.error('Error loading archive:', error)
    });
  }

  getTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'PAGE': '📄',
      'SECTION': '📂',
      'IDEA': '💡',
      'TASK': '✅',
      'NOTE': '📌'
    };
    return icons[type] || '📦';
  }

  applyFilter() {
    let filtered = [...this.items];

    // Filter by type
    if (this.filterType !== 'all') {
      filtered = filtered.filter(item => item.type === this.filterType);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }

    this.filteredItems = filtered;
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

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days < 1) return 'اليوم';
    if (days < 7) return `منذ ${days} يوم`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `منذ ${weeks} أسبوع`;
    const months = Math.floor(days / 30);
    return `منذ ${months} شهر`;
  }

  restoreItem(item: ArchivedItem) {
    if (confirm(`هل تريد استرجاع "${item.title}"؟`)) {
      // TODO: Implement restore logic
      console.log('Restoring item:', item);
      this.items = this.items.filter(i => i.id !== item.id);
      this.applyFilter();
    }
  }

  deleteItem(item: ArchivedItem) {
    if (confirm(`هل تريد حذف "${item.title}" نهائياً؟ هذا الإجراء لا يمكن التراجع عنه.`)) {
      // TODO: Implement delete logic
      console.log('Deleting item:', item);
      this.items = this.items.filter(i => i.id !== item.id);
      this.applyFilter();
    }
  }

  goBack() {
    this.router.navigate(['/magic-notebook', this.notebookId]);
  }
}
