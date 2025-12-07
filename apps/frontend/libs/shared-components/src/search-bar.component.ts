import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-bar">
      <input 
        type="text" 
        [(ngModel)]="searchTerm"
        (ngModelChange)="onSearch()"
        placeholder="بحث..."
        class="search-input"
      />
    </div>
  `,
  styles: [`
    .search-bar {
      width: 100%;
      margin-bottom: 16px;
    }
    .search-input {
      width: 100%;
      padding: 10px 16px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }
    .search-input:focus {
      outline: none;
      border-color: #4CAF50;
    }
  `]
})
export class SearchBarComponent {
  searchTerm: string = '';
  @Output() search = new EventEmitter<string>();

  onSearch() {
    this.search.emit(this.searchTerm);
  }
}
