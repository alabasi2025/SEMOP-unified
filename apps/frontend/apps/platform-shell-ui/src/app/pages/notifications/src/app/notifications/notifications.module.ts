import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NotificationsListComponent } from './notifications-list/notifications-list.component';
import { NotificationTypePipe } from './pipes/notification-type.pipe';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [
    NotificationsListComponent,
    NotificationTypePipe
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    // PrimeNG Modules
    CardModule,
    ButtonModule,
    ListboxModule,
    BadgeModule,
    ToastModule,
    DividerModule,
    ProgressSpinnerModule,
    TagModule,
    TooltipModule
  ],
  exports: [
    NotificationsListComponent
  ]
})
export class NotificationsModule { }
