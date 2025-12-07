import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="data-table">
      <table>
        <thead>
          <tr>
            <th *ngFor="let column of columns">{{ column.header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of data">
            <td *ngFor="let column of columns">{{ row[column.field] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .data-table {
      width: 100%;
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 8px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
  `]
})
export class DataTableComponent {
  @Input() data: any[] = [];
  @Input() columns: { field: string; header: string }[] = [];
}
