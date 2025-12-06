import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

// ============ Interfaces & Types ============

export interface StockMovement {
  id: string;
  warehouseId: string;
  warehouseName: string;
  itemId: string;
  itemName: string;
  movementType: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT';
  quantity: number;
  notes: string;
  createdAt: string;
  createdBy: string;
}

export interface CreateStockMovementDto {
  warehouseId: string;
  itemId: string;
  movementType: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT';
  quantity: number;
  notes: string;
}

export interface StockMovementResponse {
  id: string;
  warehouseId: string;
  warehouseName: string;
  itemId: string;
  itemName: string;
  movementType: string;
  quantity: number;
  notes: string;
  createdAt: string;
  createdBy: string;
}

export interface StockMovementStatistics {
  totalInbound: number;
  totalOutbound: number;
  totalMovementsToday: number;
  lastMovementTime: string | null;
}

export interface FilterOptions {
  warehouseId?: string;
  itemId?: string;
  movementType?: string;
  startDate?: Date;
  endDate?: Date;
  skip?: number;
  take?: number;
}

// ============ Service ============

@Injectable({
  providedIn: 'root'
})
export class StockMovementsService {
  private apiUrl: string = '/api/stock-movements';
  private movementsSubject: BehaviorSubject<StockMovement[]> = new BehaviorSubject<StockMovement[]>([]);
  public movements$: Observable<StockMovement[]> = this.movementsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadMovements();
  }

  // ============ Get All Movements ============
  getAll(filters?: FilterOptions): Observable<StockMovementResponse[]> {
    let params: HttpParams = new HttpParams();

    if (filters) {
      if (filters.warehouseId) {
        params = params.set('warehouseId', filters.warehouseId);
      }
      if (filters.itemId) {
        params = params.set('itemId', filters.itemId);
      }
      if (filters.movementType) {
        params = params.set('movementType', filters.movementType);
      }
      if (filters.startDate) {
        params = params.set('startDate', filters.startDate.toISOString());
      }
      if (filters.endDate) {
        params = params.set('endDate', filters.endDate.toISOString());
      }
      if (filters.skip !== undefined) {
        params = params.set('skip', filters.skip.toString());
      }
      if (filters.take !== undefined) {
        params = params.set('take', filters.take.toString());
      }
    }

    return this.http.get<StockMovementResponse[]>(this.apiUrl, { params });
  }

  // ============ Get One Movement ============
  getOne(id: string): Observable<StockMovementResponse> {
    return this.http.get<StockMovementResponse>(`${this.apiUrl}/${id}`);
  }

  // ============ Create Movement ============
  create(dto: CreateStockMovementDto): Observable<StockMovementResponse> {
    return this.http.post<StockMovementResponse>(this.apiUrl, dto);
  }

  // ============ Update Movement ============
  update(id: string, dto: CreateStockMovementDto): Observable<StockMovementResponse> {
    return this.http.patch<StockMovementResponse>(`${this.apiUrl}/${id}`, dto);
  }

  // ============ Delete Movement ============
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ============ Get By Warehouse ============
  getByWarehouse(warehouseId: string): Observable<StockMovementResponse[]> {
    const params: HttpParams = new HttpParams().set('warehouseId', warehouseId);
    return this.http.get<StockMovementResponse[]>(this.apiUrl, { params });
  }

  // ============ Get By Item ============
  getByItem(itemId: string): Observable<StockMovementResponse[]> {
    const params: HttpParams = new HttpParams().set('itemId', itemId);
    return this.http.get<StockMovementResponse[]>(this.apiUrl, { params });
  }

  // ============ Get Statistics ============
  getStatistics(): Observable<StockMovementStatistics> {
    return this.http.get<StockMovementStatistics>(`${this.apiUrl}/statistics/summary`);
  }

  // ============ Get Warehouse Statistics ============
  getWarehouseStatistics(warehouseId: string): Observable<StockMovementStatistics> {
    return this.http.get<StockMovementStatistics>(`${this.apiUrl}/statistics/warehouse/${warehouseId}`);
  }

  // ============ Get Item Statistics ============
  getItemStatistics(itemId: string): Observable<StockMovementStatistics> {
    return this.http.get<StockMovementStatistics>(`${this.apiUrl}/statistics/item/${itemId}`);
  }

  // ============ Private Methods ============
  private loadMovements(): void {
    this.getAll().subscribe({
      next: (data: StockMovementResponse[]) => {
        const movements: StockMovement[] = data.map((item: StockMovementResponse) => ({
          id: item.id,
          warehouseId: item.warehouseId,
          warehouseName: item.warehouseName,
          itemId: item.itemId,
          itemName: item.itemName,
          movementType: item.movementType as 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT',
          quantity: item.quantity,
          notes: item.notes,
          createdAt: item.createdAt,
          createdBy: item.createdBy
        }));
        this.movementsSubject.next(movements);
      },
      error: (error: any) => {
        console.error('Error loading movements:', error);
      }
    });
  }
}
