import { NgModule } from '@angular/core';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';

import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

const PRIMENG_MODULES = [
  ButtonModule,
  InputTextModule,
  SelectModule,
  DatePickerModule,
  TableModule,
  CardModule,
  
  MessageModule,
  ToastModule,
  DialogModule,
  ConfirmDialogModule
];

@NgModule({
  imports: PRIMENG_MODULES,
  exports: PRIMENG_MODULES
})
export class PrimeNGModule { }
