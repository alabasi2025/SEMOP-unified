import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { TemplatesListComponent } from './templates-list.component';
import { CreateSmartEntryComponent } from './create-smart-entry.component';

export const SMART_JOURNAL_ENTRIES_ROUTES: Route[] = [
  { path: '', component: DashboardComponent },
  { path: 'templates', component: TemplatesListComponent },
  { path: 'create', component: CreateSmartEntryComponent },
];
