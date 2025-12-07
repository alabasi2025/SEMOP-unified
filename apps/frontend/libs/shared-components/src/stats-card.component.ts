import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-card">
      <div class="stats-card-header">
        <h3>{{ title }}</h3>
      </div>
      <div class="stats-card-body">
        <div class="stats-value">{{ value }}</div>
        <div class="stats-label">{{ label }}</div>
      </div>
    </div>
  `,
  styles: [`
    .stats-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 16px;
      background: white;
    }
    .stats-card-header h3 {
      margin: 0 0 12px 0;
      font-size: 14px;
      color: #666;
    }
    .stats-value {
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 4px;
    }
    .stats-label {
      font-size: 12px;
      color: #999;
    }
  `]
})
export class StatsCardComponent {
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() label: string = '';
}
