import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dialog-overlay" *ngIf="visible" (click)="handleClose()">
      <div class="dialog-content" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h3>{{ header }}</h3>
          <button (click)="handleClose()">×</button>
        </div>
        <div class="dialog-body">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .dialog-content {
      background: white;
      border-radius: 8px;
      min-width: 400px;
      max-width: 90%;
    }
    .dialog-header {
      display: flex;
      justify-content: space-between;
      padding: 16px;
      border-bottom: 1px solid #ddd;
    }
    .dialog-body {
      padding: 16px;
    }
  `]
})
export class DialogComponent {
  @Input() visible: boolean = false;
  @Input() header: string = '';
  @Output() visibleChange = new EventEmitter<boolean>();

  handleClose() {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
