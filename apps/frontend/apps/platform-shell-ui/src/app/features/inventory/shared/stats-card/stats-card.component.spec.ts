import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatsCardComponent } from './stats-card.component';

describe('StatsCardComponent', () => {
  let component: StatsCardComponent;
  let fixture: ComponentFixture<StatsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatsCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title', () => {
    component.title = 'Test Title';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Title');
  });

  it('should display value', () => {
    component.value = '100';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('100');
  });

  it('should display icon when provided', () => {
    component.icon = 'pi-chart-bar';
    component.title = 'Test';
    component.value = '50';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const iconElement = compiled.querySelector('i');
    expect(iconElement).toBeTruthy();
    expect(iconElement?.classList.contains('pi-chart-bar')).toBeTruthy();
  });

  it('should apply correct color class', () => {
    component.color = 'primary';
    component.title = 'Test';
    component.value = '50';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const cardElement = compiled.querySelector('.stats-card');
    expect(cardElement?.classList.contains('stats-card-primary')).toBeTruthy();
  });
});
