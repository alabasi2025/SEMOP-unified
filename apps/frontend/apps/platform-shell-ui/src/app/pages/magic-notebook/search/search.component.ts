import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MagicNotebookService } from '../../../services/magic-notebook.service';

interface SearchResult {
  id: string;
  type: 'page' | 'section' | 'idea' | 'task' | 'note';
  title: string;
  description: string;
  content: string;
  matchedText: string;
  createdAt: string;
  icon: string;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  notebookId: string = '';
  searchQuery: string = '';
  results: SearchResult[] = [];
  filteredResults: SearchResult[] = [];
  filterType: string = 'all';
  isSearching: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notebookService: MagicNotebookService
  ) {}

  ngOnInit() {
    this.notebookId = this.route.snapshot.paramMap.get('id') || '';
  }

  performSearch() {
    if (!this.searchQuery.trim()) {
      this.results = [];
      this.filteredResults = [];
      return;
    }

    this.isSearching = true;

    // Search across all content types
    const query = this.searchQuery.toLowerCase();
    this.results = [];

    // Search Pages
    this.notebookService.getPages(this.notebookId).subscribe(pages => {
      pages.forEach(page => {
        if (page.title.toLowerCase().includes(query) || page.content.toLowerCase().includes(query)) {
          this.results.push({
            id: page.id,
            type: 'page',
            title: page.title,
            description: 'صفحة',
            content: page.content,
            matchedText: this.getMatchedText(page.content, query),
            createdAt: page.createdAt,
            icon: '📄'
          });
        }
      });
      this.checkSearchComplete();
    });

    // Search Ideas
    this.notebookService.getIdeas(this.notebookId).subscribe(ideas => {
      ideas.forEach(idea => {
        if (idea.title.toLowerCase().includes(query) || (idea.description && idea.description.toLowerCase().includes(query))) {
          this.results.push({
            id: idea.id,
            type: 'idea',
            title: idea.title,
            description: 'فكرة',
            content: idea.description || '',
            matchedText: this.getMatchedText(idea.description || idea.title, query),
            createdAt: idea.createdAt,
            icon: '💡'
          });
        }
      });
      this.checkSearchComplete();
    });

    // Search Tasks
    this.notebookService.getTasks(this.notebookId).subscribe(tasks => {
      tasks.forEach(task => {
        if (task.title.toLowerCase().includes(query) || (task.description && task.description.toLowerCase().includes(query))) {
          this.results.push({
            id: task.id,
            type: 'task',
            title: task.title,
            description: 'مهمة',
            content: task.description || '',
            matchedText: this.getMatchedText(task.description || task.title, query),
            createdAt: task.createdAt,
            icon: '✅'
          });
        }
      });
      this.checkSearchComplete();
    });
  }

  getMatchedText(content: string, query: string): string {
    const index = content.toLowerCase().indexOf(query);
    if (index === -1) return content.substring(0, 100) + '...';
    
    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + query.length + 50);
    return '...' + content.substring(start, end) + '...';
  }

  checkSearchComplete() {
    setTimeout(() => {
      this.isSearching = false;
      this.applyFilter();
    }, 100);
  }

  applyFilter() {
    if (this.filterType === 'all') {
      this.filteredResults = [...this.results];
    } else {
      this.filteredResults = this.results.filter(r => r.type === this.filterType);
    }
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

  highlightMatch(text: string): string {
    if (!this.searchQuery.trim()) return text;
    
    const regex = new RegExp(`(${this.searchQuery})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  openResult(result: SearchResult) {
    // Navigate to the result
    const routes: { [key: string]: string } = {
      'page': 'pages',
      'section': 'sections',
      'idea': 'ideas',
      'task': 'tasks',
      'note': 'sticky-notes'
    };
    
    const route = routes[result.type];
    if (route) {
      this.router.navigate(['/magic-notebook', this.notebookId, route]);
    }
  }

  goBack() {
    this.router.navigate(['/magic-notebook', this.notebookId]);
  }
}
