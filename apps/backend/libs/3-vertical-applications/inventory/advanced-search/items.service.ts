// /root/task_outputs/Task2_Advanced_Search_Filters/backend/items.service.ts
import { Injectable } from '@nestjs/common';
import { ItemDto } from './item.dto';
import { AdvancedSearchFilterDto } from './advanced-search-filter.dto';

@Injectable()
export class ItemsService {
  // بيانات وهمية لمحاكاة قاعدة البيانات
  private items: ItemDto[] = [
    { id: 1, nameAr: 'هاتف ذكي', code: 'ELEC001', category: 'إلكترونيات', currentQuantity: 50, unitPrice: 1200, status: 'نشط', lastUpdated: new Date('2025-11-01') },
    { id: 2, nameAr: 'مفك براغي', code: 'TOOL015', category: 'أدوات', currentQuantity: 150, unitPrice: 50, status: 'نشط', lastUpdated: new Date('2025-11-05') },
    { id: 3, nameAr: 'دفتر ملاحظات', code: 'STAT003', category: 'قرطاسية', currentQuantity: 20, unitPrice: 15, status: 'نفد', lastUpdated: new Date('2025-11-10') },
    { id: 4, nameAr: 'شاشة حاسوب', code: 'ELEC005', category: 'إلكترونيات', currentQuantity: 80, unitPrice: 800, status: 'نشط', lastUpdated: new Date('2025-11-15') },
    { id: 5, nameAr: 'مطرقة', code: 'TOOL001', category: 'أدوات', currentQuantity: 5, unitPrice: 75, status: 'غير نشط', lastUpdated: new Date('2025-11-20') },
  ];

  /**
   * تطبيق فلاتر البحث المتقدم على قائمة الأصناف.
   * @param filterDto معايير البحث المتقدم.
   * @returns قائمة الأصناف المفلترة.
   */
  advancedSearch(filterDto: AdvancedSearchFilterDto): ItemDto[] {
    let filteredItems = this.items;

    // 1. فلترة حسب مصطلح البحث العام (الاسم أو الكود)
    if (filterDto.searchTerm) {
      const term = filterDto.searchTerm.toLowerCase();
      filteredItems = filteredItems.filter(item =>
        item.nameAr.toLowerCase().includes(term) ||
        item.code.toLowerCase().includes(term)
      );
    }

    // 2. فلترة حسب الفئة
    if (filterDto.category && filterDto.category.length > 0) {
      filteredItems = filteredItems.filter(item =>
        filterDto.category.includes(item.category)
      );
    }

    // 3. فلترة حسب الحالة
    if (filterDto.status && filterDto.status.length > 0) {
      filteredItems = filteredItems.filter(item =>
        filterDto.status.includes(item.status)
      );
    }

    // 4. فلترة حسب الكمية
    if (filterDto.minQuantity !== undefined) {
      filteredItems = filteredItems.filter(item => item.currentQuantity >= filterDto.minQuantity);
    }
    if (filterDto.maxQuantity !== undefined) {
      filteredItems = filteredItems.filter(item => item.currentQuantity <= filterDto.maxQuantity);
    }

    // 5. فلترة حسب السعر
    if (filterDto.minPrice !== undefined) {
      filteredItems = filteredItems.filter(item => item.unitPrice >= filterDto.minPrice);
    }
    if (filterDto.maxPrice !== undefined) {
      filteredItems = filteredItems.filter(item => item.unitPrice <= filterDto.maxPrice);
    }

    // 6. الترتيب
    filteredItems.sort((a, b) => {
      const aValue = a[filterDto.sortBy as keyof ItemDto];
      const bValue = b[filterDto.sortBy as keyof ItemDto];

      if (aValue < bValue) return filterDto.sortOrder === 'ASC' ? -1 : 1;
      if (aValue > bValue) return filterDto.sortOrder === 'ASC' ? 1 : -1;
      return 0;
    });

    // 7. التقسيم (Pagination)
    const start = (filterDto.page - 1) * filterDto.pageSize;
    const end = start + filterDto.pageSize;
    const paginatedItems = filteredItems.slice(start, end);

    return paginatedItems;
  }
}
