import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InventoryService } from './inventory.service';

describe('InventoryService', () => {
  let service: InventoryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InventoryService],
    });
    service = TestBed.inject(InventoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch items', (done) => {
    const mockItems = [
      { id: 1, name: 'Item 1', quantity: 10 },
      { id: 2, name: 'Item 2', quantity: 20 },
    ];

    service.getItems().subscribe((items) => {
      expect(items.length).toBe(2);
      expect(items).toEqual(mockItems);
      done();
    });

    const req = httpMock.expectOne((request) => request.url.includes('/items'));
    expect(req.request.method).toBe('GET');
    req.flush(mockItems);
  });

  it('should fetch warehouses', (done) => {
    const mockWarehouses = [
      { id: 1, name: 'Warehouse 1' },
      { id: 2, name: 'Warehouse 2' },
    ];

    service.getWarehouses().subscribe((warehouses) => {
      expect(warehouses.length).toBe(2);
      expect(warehouses).toEqual(mockWarehouses);
      done();
    });

    const req = httpMock.expectOne((request) => request.url.includes('/warehouses'));
    expect(req.request.method).toBe('GET');
    req.flush(mockWarehouses);
  });

  it('should handle errors gracefully', (done) => {
    service.getItems().subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error).toBeTruthy();
        done();
      },
    });

    const req = httpMock.expectOne((request) => request.url.includes('/items'));
    req.error(new ProgressEvent('error'));
  });
});
