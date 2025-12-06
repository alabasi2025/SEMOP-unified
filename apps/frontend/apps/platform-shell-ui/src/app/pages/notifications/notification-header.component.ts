import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface NotificationStatistics {
  total: number;
  unread: number;
  today: number;
}

@Component({
  selector: 'app-notification-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notification-header.component.html',
  styleUrls: ['./notification-header.component.css']
})
export class NotificationHeaderComponent {
  @Input() statistics: NotificationStatistics = { total: 0, unread: 0, today: 0 };
  @Input() viewMode: 'list' | 'grid' = 'list';
  @Input() sortBy: 'date' | 'type' | 'priority' = 'date';
  
  @Output() searchChange = new EventEmitter<string>();
  @Output() viewModeChange = new EventEmitter<'list' | 'grid'>();
  @Output() sortChange = new EventEmitter<'date' | 'type' | 'priority'>();
  @Output() refresh = new EventEmitter<void>();
  @Output() openSettings = new EventEmitter<void>();

  searchQuery: string = '';

  // Sort options
  sortOptions = [
    { value: 'date', label: 'التاريخ', icon: '📅' },
    { value: 'type', label: 'النوع', icon: '🏷️' },
    { value: 'priority', label: 'الأولوية', icon: '⭐' }
  ];

  /**
   * Handle search input
   */
  onSearchInput(): void {
    this.searchChange.emit(this.searchQuery);
  }

  /**
   * Clear search
   */
  clearSearch(): void {
    this.searchQuery = '';
    this.searchChange.emit('');
  }

  /**
   * Toggle view mode
   */
  toggleViewMode(mode: 'list' | 'grid'): void {
    this.viewMode = mode;
    this.viewModeChange.emit(mode);
  }

  /**
   * Change sort
   */
  onSortChange(): void {
    this.sortChange.emit(this.sortBy);
  }

  /**
   * Refresh notifications
   */
  onRefresh(): void {
    this.refresh.emit();
  }

  /**
   * Open settings
   */
  onOpenSettings(): void {
    this.openSettings.emit();
  }
}
