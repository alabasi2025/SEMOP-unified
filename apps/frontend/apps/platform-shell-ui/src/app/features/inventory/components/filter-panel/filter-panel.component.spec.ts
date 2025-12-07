import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterPanelComponent } from './filter-panel.component';

describe('FilterPanelComponent', () => {
  let component: FilterPanelComponent;
  let fixture: ComponentFixture<FilterPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit filterChange event when filter is applied', () => {
    const testFilter = { category: 'test' };
    let emittedFilter: any;
    
    component.filterChange.subscribe((filter: any) => {
      emittedFilter = filter;
    });

    component.applyFilter(testFilter);
    
    expect(emittedFilter).toEqual(testFilter);
  });

  it('should emit clear event when filter is cleared', () => {
    let clearEmitted = false;
    
    component.clear.subscribe(() => {
      clearEmitted = true;
    });

    component.clearFilter();
    
    expect(clearEmitted).toBeTruthy();
  });
});
