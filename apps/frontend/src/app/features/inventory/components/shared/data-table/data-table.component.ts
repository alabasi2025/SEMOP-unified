import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

export interface Column {
  field: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  type?: 'text' | 'number' | 'date' | 'boolean';
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule
  ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent {
  @Input() data: any[] = [];
  @Input() columns: Column[] = [];
  @Input() loading: boolean = false;
  @Input() paginator: boolean = true;
  @Input() rows: number = 10;
  
  @Output() onRowSelect = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();

  onRowClick(rowData: any) {
    this.onRowSelect.emit(rowData);
  }

  editRow(rowData: any) {
    this.onEdit.emit(rowData);
  }

  deleteRow(rowData: any) {
    this.onDelete.emit(rowData);
  }
}
