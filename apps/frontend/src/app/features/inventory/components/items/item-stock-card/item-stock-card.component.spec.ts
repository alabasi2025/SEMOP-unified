import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemStockCardComponent } from './item-stock-card.component';

describe('ItemStockCardComponent', () => {
  let component: ItemStockCardComponent;
  let fixture: ComponentFixture<ItemStockCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemStockCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemStockCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Stock Status', () => {
    it('should return "low" when quantity is less than minQuantity', () => {
      component.quantity = 5;
      component.minQuantity = 10;
      component.maxQuantity = 100;
      expect(component.stockStatus).toBe('low');
    });

    it('should return "high" when quantity is greater than maxQuantity', () => {
      component.quantity = 150;
      component.minQuantity = 10;
      component.maxQuantity = 100;
      expect(component.stockStatus).toBe('high');
    });

    it('should return "normal" when quantity is between min and max', () => {
      component.quantity = 50;
      component.minQuantity = 10;
      component.maxQuantity = 100;
      expect(component.stockStatus).toBe('normal');
    });

    it('should return "normal" when maxQuantity is 0', () => {
      component.quantity = 50;
      component.minQuantity = 10;
      component.maxQuantity = 0;
      expect(component.stockStatus).toBe('normal');
    });
  });

  describe('Stock Status Text', () => {
    it('should return correct text for low status', () => {
      component.quantity = 5;
      component.minQuantity = 10;
      expect(component.stockStatusText).toBe('ناقص');
    });

    it('should return correct text for high status', () => {
      component.quantity = 150;
      component.minQuantity = 10;
      component.maxQuantity = 100;
      expect(component.stockStatusText).toBe('زائد');
    });

    it('should return correct text for normal status', () => {
      component.quantity = 50;
      component.minQuantity = 10;
      component.maxQuantity = 100;
      expect(component.stockStatusText).toBe('عادي');
    });
  });

  describe('Stock Percentage', () => {
    it('should calculate correct percentage', () => {
      component.quantity = 50;
      component.maxQuantity = 100;
      expect(component.stockPercentage).toBe(50);
    });

    it('should return 0 when maxQuantity is 0', () => {
      component.quantity = 50;
      component.maxQuantity = 0;
      expect(component.stockPercentage).toBe(0);
    });

    it('should cap at 100% when quantity exceeds maxQuantity', () => {
      component.quantity = 150;
      component.maxQuantity = 100;
      expect(component.stockPercentage).toBe(100);
    });
  });

  describe('Formatted Values', () => {
    beforeEach(() => {
      component.unit = 'كجم';
    });

    it('should format quantity correctly', () => {
      component.quantity = 1000;
      expect(component.formattedQuantity).toContain('كجم');
    });

    it('should format min quantity correctly', () => {
      component.minQuantity = 100;
      expect(component.formattedMinQuantity).toContain('كجم');
    });

    it('should return "غير محدد" when maxQuantity is 0', () => {
      component.maxQuantity = 0;
      expect(component.formattedMaxQuantity).toBe('غير محدد');
    });

    it('should format max quantity correctly when set', () => {
      component.maxQuantity = 500;
      expect(component.formattedMaxQuantity).toContain('كجم');
    });
  });

  describe('Card Click', () => {
    it('should emit cardClick when clickable and not loading', () => {
      component.clickable = true;
      component.loading = false;
      spyOn(component.cardClick, 'emit');

      component.onCardClick();

      expect(component.cardClick.emit).toHaveBeenCalled();
    });

    it('should not emit when not clickable', () => {
      component.clickable = false;
      component.loading = false;
      spyOn(component.cardClick, 'emit');

      component.onCardClick();

      expect(component.cardClick.emit).not.toHaveBeenCalled();
    });

    it('should not emit when loading', () => {
      component.clickable = true;
      component.loading = true;
      spyOn(component.cardClick, 'emit');

      component.onCardClick();

      expect(component.cardClick.emit).not.toHaveBeenCalled();
    });
  });

  describe('Template Rendering', () => {
    it('should show skeleton loader when loading', () => {
      component.loading = true;
      fixture.detectChanges();

      const skeleton = fixture.nativeElement.querySelector('.skeleton-loader');
      expect(skeleton).toBeTruthy();
    });

    it('should show content when not loading', () => {
      component.loading = false;
      fixture.detectChanges();

      const content = fixture.nativeElement.querySelector('.card-content');
      expect(content).toBeTruthy();
    });

    it('should show warehouse info when showWarehouse is true', () => {
      component.showWarehouse = true;
      component.loading = false;
      component.warehouseName = 'المستودع الرئيسي';
      fixture.detectChanges();

      const warehouseInfo = fixture.nativeElement.querySelector('.warehouse-info');
      expect(warehouseInfo).toBeTruthy();
      expect(warehouseInfo.textContent).toContain('المستودع الرئيسي');
    });

    it('should hide warehouse info when showWarehouse is false', () => {
      component.showWarehouse = false;
      component.loading = false;
      fixture.detectChanges();

      const warehouseInfo = fixture.nativeElement.querySelector('.warehouse-info');
      expect(warehouseInfo).toBeFalsy();
    });

    it('should show progress bar when maxQuantity > 0', () => {
      component.maxQuantity = 100;
      component.loading = false;
      fixture.detectChanges();

      const progressBar = fixture.nativeElement.querySelector('.progress-container');
      expect(progressBar).toBeTruthy();
    });

    it('should show min-max info when maxQuantity = 0', () => {
      component.maxQuantity = 0;
      component.loading = false;
      fixture.detectChanges();

      const minMaxInfo = fixture.nativeElement.querySelector('.min-max-info');
      expect(minMaxInfo).toBeTruthy();
    });
  });
});
