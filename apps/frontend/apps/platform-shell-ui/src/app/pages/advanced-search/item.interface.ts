// /root/task_outputs/Task2_Advanced_Search_Filters/frontend/item.interface.ts
// واجهة لتمثيل بيانات الصنف
export interface Item {
  id: number;
  nameAr: string;
  code: string;
  category: string;
  currentQuantity: number;
  unitPrice: number;
  status: string;
  lastUpdated: Date;
}

// واجهة لتمثيل معايير البحث المتقدم
export interface AdvancedSearchFilter {
  searchTerm?: string;
  category?: string[];
  status?: string[];
  minQuantity?: number;
  maxQuantity?: number;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
