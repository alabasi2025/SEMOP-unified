import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Item,
  Warehouse,
  StockMovement,
  StockBalance,
  ItemCategory,
  Unit,
  InventoryCount,
  PaginatedResponse,
  SearchFilters,
} from '../models/inventory.models';
import { StockCount, StockCountFilter, StockCountStats } from '../models';
import { of } from 'rxjs';

/**
 * خدمة نظام المخازن
 */
@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private apiUrl = '/api/inventory';

  constructor(private http: HttpClient) {}

  // ============================================
  // الأصناف (Items)
  // ============================================

  /**
   * جلب جميع الأصناف
   */
  getItems(filters?: SearchFilters): Observable<PaginatedResponse<Item>> {
    let params = new HttpParams();
    if (filters) {
      if (filters.search) params = params.set('search', filters.search);
      if (filters.categoryId) params = params.set('categoryId', filters.categoryId);
      if (filters.isActive !== undefined) params = params.set('isActive', filters.isActive.toString());
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
    }
    return this.http.get<PaginatedResponse<Item>>(`${this.apiUrl}/items`, { params });
  }

  /**
   * جلب صنف واحد
   */
  getItem(id: string): Observable<Item> {
    return this.http.get<Item>(`${this.apiUrl}/items/${id}`);
  }

  /**
   * إنشاء صنف جديد
   */
  createItem(item: Partial<Item>): Observable<Item> {
    return this.http.post<Item>(`${this.apiUrl}/items`, item);
  }

  /**
   * تحديث صنف
   */
  updateItem(id: string, item: Partial<Item>): Observable<Item> {
    return this.http.put<Item>(`${this.apiUrl}/items/${id}`, item);
  }

  /**
   * حذف صنف
   */
  deleteItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/items/${id}`);
  }

  /**
   * البحث في الأصناف
   */
  searchItems(query: string): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/items/search/${query}`);
  }

  /**
   * جلب رصيد صنف
   */
  getItemStock(itemId: string): Observable<StockBalance[]> {
    return this.http.get<StockBalance[]>(`${this.apiUrl}/items/${itemId}/stock`);
  }

  // ============================================
  // المستودعات (Warehouses)
  // ============================================

  /**
   * جلب جميع المستودعات
   */
  getWarehouses(filters?: SearchFilters): Observable<PaginatedResponse<Warehouse>> {
    let params = new HttpParams();
    if (filters) {
      if (filters.search) params = params.set('search', filters.search);
      if (filters.isActive !== undefined) params = params.set('isActive', filters.isActive.toString());
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
    }
    return this.http.get<PaginatedResponse<Warehouse>>(`${this.apiUrl}/warehouses`, { params });
  }

  /**
   * جلب مستودع واحد
   */
  getWarehouse(id: string): Observable<Warehouse> {
    return this.http.get<Warehouse>(`${this.apiUrl}/warehouses/${id}`);
  }

  /**
   * إنشاء مستودع جديد
   */
  createWarehouse(warehouse: Partial<Warehouse>): Observable<Warehouse> {
    return this.http.post<Warehouse>(`${this.apiUrl}/warehouses`, warehouse);
  }

  /**
   * تحديث مستودع
   */
  updateWarehouse(id: string, warehouse: Partial<Warehouse>): Observable<Warehouse> {
    return this.http.put<Warehouse>(`${this.apiUrl}/warehouses/${id}`, warehouse);
  }

  /**
   * حذف مستودع
   */
  deleteWarehouse(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/warehouses/${id}`);
  }

  /**
   * جلب رصيد المستودع
   */
  getWarehouseStock(warehouseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/warehouses/${warehouseId}/stock`);
  }

  // ============================================
  // حركات المخزون (Stock Movements)
  // ============================================

  /**
   * جلب جميع الحركات
   */
  getMovements(filters?: SearchFilters): Observable<PaginatedResponse<StockMovement>> {
    let params = new HttpParams();
    if (filters) {
      if (filters.warehouseId) params = params.set('warehouseId', filters.warehouseId);
      if (filters.startDate) params = params.set('startDate', filters.startDate.toISOString());
      if (filters.endDate) params = params.set('endDate', filters.endDate.toISOString());
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
    }
    return this.http.get<PaginatedResponse<StockMovement>>(`${this.apiUrl}/movements`, { params });
  }

  /**
   * إنشاء حركة إدخال
   */
  createInMovement(movement: any): Observable<StockMovement> {
    return this.http.post<StockMovement>(`${this.apiUrl}/movements/in`, movement);
  }

  /**
   * إنشاء حركة إخراج
   */
  createOutMovement(movement: any): Observable<StockMovement> {
    return this.http.post<StockMovement>(`${this.apiUrl}/movements/out`, movement);
  }

  /**
   * إنشاء تسوية
   */
  createAdjustment(movement: any): Observable<StockMovement> {
    return this.http.post<StockMovement>(`${this.apiUrl}/movements/adjustment`, movement);
  }

  // ============================================
  // الفئات (Categories)
  // ============================================

  /**
   * جلب جميع الفئات
   */
  getCategories(): Observable<PaginatedResponse<ItemCategory>> {
    return this.http.get<PaginatedResponse<ItemCategory>>(`${this.apiUrl}/categories`);
  }

  /**
   * جلب الهيكل الهرمي للفئات
   */
  getCategoriesHierarchy(): Observable<ItemCategory[]> {
    return this.http.get<ItemCategory[]>(`${this.apiUrl}/categories/hierarchy`);
  }

  /**
   * إنشاء فئة جديدة
   */
  createCategory(category: Partial<ItemCategory>): Observable<ItemCategory> {
    return this.http.post<ItemCategory>(`${this.apiUrl}/categories`, category);
  }

  /**
   * تحديث فئة
   */
  updateCategory(id: string, category: Partial<ItemCategory>): Observable<ItemCategory> {
    return this.http.put<ItemCategory>(`${this.apiUrl}/categories/${id}`, category);
  }

  /**
   * حذف فئة
   */
  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categories/${id}`);
  }

  // ============================================
  // الوحدات (Units)
  // ============================================

  /**
   * جلب جميع الوحدات
   */
  getUnits(): Observable<PaginatedResponse<Unit>> {
    return this.http.get<PaginatedResponse<Unit>>(`${this.apiUrl}/units`);
  }

  /**
   * إنشاء وحدة جديدة
   */
  createUnit(unit: Partial<Unit>): Observable<Unit> {
    return this.http.post<Unit>(`${this.apiUrl}/units`, unit);
  }

  /**
   * تحديث وحدة
   */
  updateUnit(id: string, unit: Partial<Unit>): Observable<Unit> {
    return this.http.put<Unit>(`${this.apiUrl}/units/${id}`, unit);
  }

  /**
   * حذف وحدة
   */
  deleteUnit(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/units/${id}`);
  }

  // ============================================
  // الجرد (Stock Count)
  // ============================================

  /**
   * إنشاء عملية جرد
   */
  createCount(count: any): Observable<InventoryCount> {
    return this.http.post<InventoryCount>(`${this.apiUrl}/stock-count`, count);
  }

  /**
   * إضافة سجلات الجرد
   */
  addCountRecords(countId: string, records: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/stock-count/${countId}/records`, records);
  }

  /**
   * إتمام الجرد
   */
  completeCount(countId: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/stock-count/${countId}/complete`, data);
  }

  /**
   * جلب تقرير الجرد
   */
  getCountReport(countId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/stock-count/${countId}/report`);
  }

  /**
   * جلب قائمة الجرد
   */
  getStockCounts(filter?: StockCountFilter): Observable<StockCount[]> {
    // TODO: Implement API call
    return of([]);
  }

  /**
   * جلب إحصائيات الجرد
   */
  getStockCountStats(): Observable<StockCountStats> {
    // TODO: Implement API call
    return of({
      totalCounts: 0,
      inProgress: 0,
      completed: 0,
      totalDifferenceValue: 0
    });
  }

  // ============================================
  // التقارير (Reports)
  // ============================================

  /**
   * تقرير الأصناف الناقصة
   */
  getLowStockReport(warehouseId?: string): Observable<any> {
    let params = new HttpParams();
    if (warehouseId) params = params.set('warehouseId', warehouseId);
    return this.http.get(`${this.apiUrl}/reports/low-stock`, { params });
  }

  /**
   * تقرير قيمة المخزون
   */
  getStockValueReport(warehouseId?: string): Observable<any> {
    let params = new HttpParams();
    if (warehouseId) params = params.set('warehouseId', warehouseId);
    return this.http.get(`${this.apiUrl}/reports/stock-value`, { params });
  }

  /**
   * تقرير الرصيد الحالي
   */
  getStockBalanceReport(warehouseId?: string): Observable<any> {
    let params = new HttpParams();
    if (warehouseId) params = params.set('warehouseId', warehouseId);
    return this.http.get(`${this.apiUrl}/reports/stock-balance`, { params });
  }
}
