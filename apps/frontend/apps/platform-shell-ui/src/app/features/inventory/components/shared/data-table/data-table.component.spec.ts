import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataTableComponent, ColumnConfig, RowAction } from './data-table.component';

describe('DataTableComponent', () => {
  let component: DataTableComponent;
  let fixture: ComponentFixture<DataTableComponent>;

  const mockColumns: ColumnConfig[] = [
    { field: 'id', header: 'الرقم', sortable: true },
    { field: 'name', header: 'الاسم', sortable: true },
    { field: 'status', header: 'الحالة', sortable: false }
  ];

  const mockData = [
    { id: 1, name: 'صنف 1', status: 'نشط' },
    { id: 2, name: 'صنف 2', status: 'غير نشط' },
    { id: 3, name: 'صنف 3', status: 'نشط' }
  ];

  const mockActions: RowAction[] = [
    { icon: '✏️', label: 'تعديل', color: 'primary' },
    { icon: '🗑️', label: 'حذف', color: 'danger' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display columns correctly', () => {
    component.columns = mockColumns;
    component.data = mockData;
    fixture.detectChanges();

    const headers = fixture.nativeElement.querySelectorAll('thead th');
    expect(headers.length).toBeGreaterThan(0);
  });

  it('should display data rows', () => {
    component.columns = mockColumns;
    component.data = mockData;
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tbody tr.data-row');
    expect(rows.length).toBe(mockData.length);
  });

  it('should emit rowClick event', () => {
    spyOn(component.rowClick, 'emit');
    component.columns = mockColumns;
    component.data = mockData;
    fixture.detectChanges();

    component.onRowClick(mockData[0]);
    expect(component.rowClick.emit).toHaveBeenCalledWith(mockData[0]);
  });

  it('should handle sorting', () => {
    spyOn(component.sortChange, 'emit');
    const column = mockColumns[0];

    component.onSort(column);
    expect(component.sortField).toBe(column.field);
    expect(component.sortDirection).toBe('asc');
    expect(component.sortChange.emit).toHaveBeenCalled();

    component.onSort(column);
    expect(component.sortDirection).toBe('desc');

    component.onSort(column);
    expect(component.sortDirection).toBeNull();
  });

  it('should handle pagination', () => {
    spyOn(component.pageChange, 'emit');
    component.pageSize = 10;
    component.totalItems = 50;

    component.onPageChange(2);
    expect(component.currentPage).toBe(2);
    expect(component.pageChange.emit).toHaveBeenCalledWith(2);
  });

  it('should display empty state when no data', () => {
    component.columns = mockColumns;
    component.data = [];
    fixture.detectChanges();

    const emptyState = fixture.nativeElement.querySelector('.empty-state');
    expect(emptyState).toBeTruthy();
  });

  it('should display loading state', () => {
    component.loading = true;
    fixture.detectChanges();

    const loadingOverlay = fixture.nativeElement.querySelector('.loading-overlay');
    expect(loadingOverlay).toBeTruthy();
  });

  it('should handle row selection', () => {
    spyOn(component.selectionChange, 'emit');
    component.selectable = true;
    component.multiSelect = true;
    component.data = mockData;

    const event = new Event('change');
    component.onRowSelect(mockData[0], event);

    expect(component.selectedRows.length).toBe(1);
    expect(component.selectionChange.emit).toHaveBeenCalled();
  });

  it('should handle select all', () => {
    spyOn(component.selectionChange, 'emit');
    component.selectable = true;
    component.multiSelect = true;
    component.data = mockData;

    const event = { target: { checked: true } } as any;
    component.onSelectAll(event);

    expect(component.selectedRows.length).toBe(mockData.length);
    expect(component.selectionChange.emit).toHaveBeenCalled();
  });

  it('should emit action click', () => {
    spyOn(component.actionClick, 'emit');
    const action = mockActions[0];
    const row = mockData[0];
    const event = new Event('click');

    component.onActionClick(action, row, event);
    expect(component.actionClick.emit).toHaveBeenCalledWith({ action, row });
  });

  it('should calculate total pages correctly', () => {
    component.pageSize = 10;
    component.totalItems = 25;
    expect(component.totalPages).toBe(3);
  });

  it('should get cell value correctly', () => {
    const column: ColumnConfig = { field: 'name', header: 'الاسم' };
    const row = mockData[0];
    const value = component.getCellValue(row, column);
    expect(value).toBe('صنف 1');
  });

  it('should format date values', () => {
    const column: ColumnConfig = { field: 'date', header: 'التاريخ', type: 'date' };
    const row = { date: '2024-01-01' };
    const value = component.getCellValue(row, column);
    expect(value).toBeTruthy();
  });

  it('should format boolean values', () => {
    const column: ColumnConfig = { field: 'active', header: 'نشط', type: 'boolean' };
    const row = { active: true };
    const value = component.getCellValue(row, column);
    expect(value).toBe('نعم');
  });
});
