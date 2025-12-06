import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface PaginationInfo {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

@Component({
  selector: 'app-notification-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notification-pagination.component.html',
  styleUrls: ['./notification-pagination.component.css']
})
export class NotificationPaginationComponent implements OnChanges {
  @Input() currentPage: number = 1;
  @Input() itemsPerPage: number = 10;
  @Input() totalItems: number = 0;
  
  @Output() pageChange = new EventEmitter<number>();
  @Output() itemsPerPageChange = new EventEmitter<number>();

  // Pagination state
  totalPages: number = 0;
  pages: (number | string)[] = [];
  
  // Items per page options
  itemsPerPageOptions = [10, 25, 50, 100];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalItems'] || changes['itemsPerPage']) {
      this.calculatePagination();
    }
  }

  /**
   * Calculate pagination
   */
  private calculatePagination(): void {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.pages = this.generatePageNumbers();
  }

  /**
   * Generate page numbers with ellipsis
   */
  private generatePageNumbers(): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (this.totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show with ellipsis
      if (this.currentPage <= 4) {
        // Near start
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(this.totalPages);
      } else if (this.currentPage >= this.totalPages - 3) {
        // Near end
        pages.push(1);
        pages.push('...');
        for (let i = this.totalPages - 4; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Middle
        pages.push(1);
        pages.push('...');
        for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(this.totalPages);
      }
    }

    return pages;
  }

  /**
   * Go to page
   */
  goToPage(page: number | string): void {
    if (typeof page === 'string') return;
    
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.calculatePagination();
      this.pageChange.emit(page);
    }
  }

  /**
   * Go to previous page
   */
  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  /**
   * Go to next page
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  /**
   * Change items per page
   */
  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.calculatePagination();
    this.itemsPerPageChange.emit(this.itemsPerPage);
    this.pageChange.emit(1);
  }

  /**
   * Get start item index
   */
  getStartItem(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  /**
   * Get end item index
   */
  getEndItem(): number {
    const end = this.currentPage * this.itemsPerPage;
    return end > this.totalItems ? this.totalItems : end;
  }

  /**
   * Check if has previous page
   */
  hasPreviousPage(): boolean {
    return this.currentPage > 1;
  }

  /**
   * Check if has next page
   */
  hasNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }
}
