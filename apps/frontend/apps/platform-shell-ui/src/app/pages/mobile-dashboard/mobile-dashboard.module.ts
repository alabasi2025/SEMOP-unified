import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobileDashboardComponent } from './mobile-dashboard.component';
import { HttpClientModule } from '@angular/common/http';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ListboxModule } from 'primeng/listbox';
import { TagModule } from 'primeng/tag';

@NgModule({
  declarations: [
    MobileDashboardComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    // PrimeNG
    CardModule,
    ButtonModule,
    ToastModule,
    ListboxModule,
    TagModule
  ],
  exports: [
    MobileDashboardComponent
  ]
})
export class MobileDashboardModule { }
