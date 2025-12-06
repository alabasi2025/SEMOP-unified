import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * NotificationBadgeComponent
 * 
 * @description
 * Component for displaying notification count badge.
 * Shows unread notification count with optional max limit.
 * Provides click event for opening notifications panel.
 */
@Component({
  selector: 'app-notification-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-badge.component.html',
  styleUrls: ['./notification-badge.component.css']
})
export class NotificationBadgeComponent {
  @Input() count: number = 0;
  @Input() maxCount: number = 99;
  @Output() onClick = new EventEmitter<void>();

  /**
   * Get display count (e.g., "99+" if count > maxCount)
   */
  get displayCount(): string {
    if (this.count === 0) return '0';
    if (this.count > this.maxCount) return `${this.maxCount}+`;
    return this.count.toString();
  }

  /**
   * Check if there are unread notifications
   */
  get hasUnread(): boolean {
    return this.count > 0;
  }

  /**
   * Handle badge click
   */
  handleClick(): void {
    this.onClick.emit();
  }
}
