import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="item-list">
      <div *ngFor="let item of items" class="item" (click)="handleSelect(item)">
        {{ item.name || item.label || item }}
      </div>
    </div>
  `,
  styles: [`
    .item-list {
      border: 1px solid #ddd;
      border-radius: 4px;
      max-height: 300px;
      overflow-y: auto;
    }
    .item {
      padding: 8px 12px;
      cursor: pointer;
      border-bottom: 1px solid #eee;
    }
    .item:hover {
      background: #f5f5f5;
    }
  `]
})
export class ItemListComponent {
  @Input() items: any[] = [];
  @Output() itemSelect = new EventEmitter<any>();

  handleSelect(item: any) {
    this.itemSelect.emit(item);
  }
}
