import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.scss']
})
export class StatsCardComponent {
  @Input() title: string = '';
  @Input() value: number | string = 0;
  @Input() icon: string = 'pi-chart-line';
  @Input() color: 'primary' | 'success' | 'warning' | 'danger' = 'primary';
  @Input() trend?: number;

  get colorClass(): string {
    return `stats-card-${this.color}`;
  }

  get trendIcon(): string {
    if (!this.trend) return '';
    return this.trend > 0 ? 'pi-arrow-up' : 'pi-arrow-down';
  }

  get trendClass(): string {
    if (!this.trend) return '';
    return this.trend > 0 ? 'trend-up' : 'trend-down';
  }
}
