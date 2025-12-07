import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      [disabled]="disabled" 
      [class]="'btn ' + variant"
      (click)="handleClick($event)">
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .primary {
      background-color: #4CAF50;
      color: white;
    }
    .secondary {
      background-color: #ccc;
      color: black;
    }
  `]
})
export class ButtonComponent {
  @Input() disabled: boolean = false;
  @Input() variant: string = 'primary';
  @Output() click = new EventEmitter<Event>();

  handleClick(event: Event) {
    if (!this.disabled) {
      this.click.emit(event);
    }
  }
}
