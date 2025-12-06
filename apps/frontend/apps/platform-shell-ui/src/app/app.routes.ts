import { Route } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout.component';
export const appRoutes: Route[] = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'users', loadComponent: () => import('./pages/users/users.component').then(m => m.UsersComponent) },
      { path: 'roles', loadComponent: () => import('./pages/roles/roles.component').then(m => m.RolesComponent) },
      { path: 'permissions', loadComponent: () => import('./pages/permissions/permissions.component').then(m => m.PermissionsComponent) },
      { path: 'organizational-structure', loadComponent: () => import('./pages/organizational-structure/organizational-structure.component').then(m => m.OrganizationalStructureComponent) },
      { path: 'holdings', loadComponent: () => import('./pages/holdings/holdings.component').then(m => m.HoldingsComponent) },
      { path: 'units', loadComponent: () => import('./pages/units/units.component').then(m => m.UnitsComponent) },
      { path: 'projects', loadComponent: () => import('./pages/projects/projects.component').then(m => m.ProjectsComponent) },
      { path: 'customers', loadComponent: () => import('./pages/customers/customers.component').then(m => m.CustomersComponent) },
      { path: 'suppliers', loadComponent: () => import('./pages/suppliers/suppliers.component').then(m => m.SuppliersComponent) },
      { path: 'items', loadComponent: () => import('./pages/items/items.component').then(m => m.ItemsComponent) },
      { path: 'reports', loadComponent: () => import('./pages/reports/reports.component').then(m => m.ReportsComponent) },
      
      // Accounting Module Routes
      { path: 'accounts', loadComponent: () => import('./pages/accounting/accounts.component').then(m => m.AccountsComponent) },
      { path: 'accounting/journal-entries', loadComponent: () => import('./pages/accounting/journal-entries.component').then(m => m.JournalEntriesComponent) },
      { path: 'accounting/account-balances', loadComponent: () => import('./pages/accounting/account-balances.component').then(m => m.AccountBalancesComponent) },
      { path: 'accounting/account-hierarchy', loadComponent: () => import('./pages/accounting/account-hierarchy.component').then(m => m.AccountHierarchyComponent) },
      { path: 'accounting/fiscal-periods', loadComponent: () => import('./pages/accounting/fiscal-periods.component').then(m => m.FiscalPeriodsComponent) },
      { path: 'accounting/cost-centers', loadComponent: () => import('./pages/accounting/cost-centers.component').then(m => m.CostCentersComponent) },
      { path: 'accounting/fiscal-years', loadComponent: () => import('./pages/accounting/fiscal-years.component').then(m => m.FiscalYearsComponent) },
      {
        path: 'accounting/smart-journal-entries',
        loadChildren: () => import('./pages/accounting/smart-journal-entries/smart-journal-entries.routes').then(m => m.SMART_JOURNAL_ENTRIES_ROUTES)
      },
      
      // Inventory Module Routes
      { path: 'warehouses', loadComponent: () => import('./pages/warehouses/warehouses.component').then(m => m.WarehousesComponent) },
      { path: 'item-categories', loadComponent: () => import('./pages/item-categories/item-categories.component').then(m => m.ItemCategoriesComponent) },
      { path: 'units', loadComponent: () => import('./pages/units/units.component').then(m => m.UnitsComponent) },
      { path: 'stock-movements', loadComponent: () => import('./pages/stock-movements/stock-movements.component').then(m => m.StockMovementsComponent) },
      { path: 'inventory-counts', loadComponent: () => import('./pages/inventory-counts/inventory-counts.component').then(m => m.InventoryCountsComponent) },
      { path: 'sales-orders', loadComponent: () => import('./pages/sales-orders/sales-orders.component').then(m => m.SalesOrdersComponent) },
      
      // Genes System
      { path: 'genes', loadComponent: () => import('./pages/genes/genes.component').then(m => m.GenesComponent) },
      { path: 'genes/:id', loadComponent: () => import('./pages/gene-details/gene-details.component').then(m => m.GeneDetailsComponent) },
      
      // Tasks System
      { path: 'tasks', loadComponent: () => import('./pages/tasks/tasks-list.component').then(m => m.TasksListComponent) },
      { path: 'tasks/list', loadComponent: () => import('./pages/tasks/tasks-list.component').then(m => m.TasksListComponent) },
      { path: 'tasks/kanban', loadComponent: () => import('./pages/tasks/tasks-kanban.component').then(m => m.TasksKanbanComponent) },
      { path: 'tasks/workflows', loadComponent: () => import('./pages/tasks/workflows-list.component').then(m => m.WorkflowsListComponent) },
      
      // Maps System
      { path: 'maps', loadComponent: () => import('./features/maps/maps.component').then(m => m.MapsComponent) },
      
      // Templates Module Routes
      // { path: 'templates', loadChildren: () => import('../features/templates/templates.module').then(m => m.TemplatesModule) }, // Temporarily disabled

      // Cycle 5 New Routes - Task 81-85
      { path: 'notifications', loadComponent: () => import('./pages/notifications/notifications.component').then(m => m.NotificationsComponent) },
      { path: 'attachments', loadComponent: () => import('./pages/attachments/attachments.component').then(m => m.AttachmentsComponent) },
      { path: 'audit-logs', loadComponent: () => import('./pages/audit-logs/audit-logs.component').then(m => m.AuditLogsComponent) },
      { path: 'backups', loadComponent: () => import('./pages/backups/backups.component').then(m => m.BackupsComponent) },
      { path: 'settings', loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent) },
      
      // Magic Notebook Routes with Layout
      {
        path: 'magic-notebook',
        loadComponent: () => import('./pages/magic-notebook/magic-notebook-layout.component').then(m => m.MagicNotebookLayoutComponent),
        children: [
          { path: '', loadComponent: () => import('./pages/magic-notebook/magic-notebook.component').then(m => m.MagicNotebookComponent) },
          { path: ':id/overview', loadComponent: () => import('./pages/magic-notebook/notebook-detail/notebook-detail.component').then(m => m.NotebookDetailComponent) },
          { path: ':id/pages', loadComponent: () => import('./pages/magic-notebook/pages/pages.component').then(m => m.PagesComponent) },
          { path: ':id/sections', loadComponent: () => import('./pages/magic-notebook/sections/sections.component').then(m => m.SectionsComponent) },
          { path: ':id/ideas', loadComponent: () => import('./pages/magic-notebook/ideas/ideas.component').then(m => m.IdeasComponent) },
          { path: ':id/tasks', loadComponent: () => import('./pages/magic-notebook/tasks/tasks.component').then(m => m.TasksComponent) },
          { path: ':id/sticky-notes', loadComponent: () => import('./pages/magic-notebook/sticky-notes/sticky-notes.component').then(m => m.StickyNotesComponent) },
          { path: ':id/timeline', loadComponent: () => import('./pages/magic-notebook/timeline/timeline.component').then(m => m.TimelineComponent) },
          { path: ':id/archive', loadComponent: () => import('./pages/magic-notebook/archive/archive.component').then(m => m.ArchiveComponent) },
          { path: ':id/search', loadComponent: () => import('./pages/magic-notebook/search/search.component').then(m => m.SearchComponent) },
        ]
      },
      
      { path: 'developer', loadComponent: () => import('./pages/developer/developer-chat.component').then(m => m.DeveloperChatComponent) },
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
