import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { MessagesModule } from 'primeng/messages';
import { TableModule } from 'primeng/table';
import { FieldsetModule } from 'primeng/fieldset';

import { BatchOperationsComponent } from './batch-operations.component';
import { BatchOperationsService } from './batch-operations.service';

@NgModule({
  declarations: [
    BatchOperationsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    // PrimeNG Modules
    CardModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    ListboxModule,
    MessagesModule,
    TableModule,
    FieldsetModule
  ],
  providers: [
    BatchOperationsService
  ],
  exports: [
    BatchOperationsComponent
  ]
})
export class BatchOperationsModule { }
