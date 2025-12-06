import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';

export interface SearchFilter {
  label: string;
  field: string;
  options: { label: string; value: any }[];
}

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    DropdownModule
  ],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  @Input() placeholder: string = 'بحث...';
  @Input() filters: SearchFilter[] = [];
  
  @Output() onSearch = new EventEmitter<string>();
  @Output() onFilterChange = new EventEmitter<any>();

  searchTerm: string = '';
  selectedFilters: any = {};

  search() {
    this.onSearch.emit(this.searchTerm);
  }

  filterChanged(filter: SearchFilter, value: any) {
    this.selectedFilters[filter.field] = value;
    this.onFilterChange.emit(this.selectedFilters);
  }

  clearSearch() {
    this.searchTerm = '';
    this.search();
  }
}
