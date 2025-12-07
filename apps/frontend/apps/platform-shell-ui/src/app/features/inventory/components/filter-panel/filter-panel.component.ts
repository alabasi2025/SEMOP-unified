import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="filter-panel">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .filter-panel {
      padding: 16px;
      background: #f5f5f5;
      border-radius: 4px;
      margin-bottom: 16px;
    }
  `]
})
export class FilterPanelComponent {
  @Input() isLoading: boolean = false;
  @Output() filterChange = new EventEmitter<any>();
}
