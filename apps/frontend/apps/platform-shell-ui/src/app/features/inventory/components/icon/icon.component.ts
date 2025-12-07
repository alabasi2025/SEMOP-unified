import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <i [class]="'pi pi-' + name" [style.fontSize]="size"></i>
  `,
  styles: []
})
export class IconComponent {
  @Input() name: string = '';
  @Input() size: string = '1rem';
}
