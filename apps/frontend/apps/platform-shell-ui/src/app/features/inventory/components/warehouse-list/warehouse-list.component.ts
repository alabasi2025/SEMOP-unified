import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-warehouse-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="warehouse-list">
      <div *ngFor="let warehouse of warehouses" class="warehouse-item" (click)="handleSelect(warehouse)">
        <h4>{{ warehouse.name }}</h4>
        <p>{{ warehouse.location }}</p>
      </div>
    </div>
  `,
  styles: [`
    .warehouse-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 16px;
    }
    .warehouse-item {
      padding: 16px;
      border: 1px solid #ddd;
      border-radius: 8px;
      cursor: pointer;
    }
    .warehouse-item:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
  `]
})
export class WarehouseListComponent {
  @Input() warehouses: any[] = [];
  @Output() warehouseSelect = new EventEmitter<any>();

  handleSelect(warehouse: any) {
    this.warehouseSelect.emit(warehouse);
  }
}
