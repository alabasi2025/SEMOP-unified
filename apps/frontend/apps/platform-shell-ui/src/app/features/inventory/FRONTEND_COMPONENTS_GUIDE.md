# دليل مكونات Frontend - نظام المخازن

## نظرة عامة

هذا الدليل يوثق جميع مكونات Frontend المطلوبة لنظام المخازن في SEMOP ERP.

---

## الحالة الحالية

### ✅ تم إنجازه

| المكون | الحالة | الملفات |
|--------|--------|---------|
| Models | ✅ مكتمل | inventory.models.ts |
| Services | ✅ مكتمل | inventory.service.ts |
| DataTableComponent | ✅ مكتمل | 4 ملفات |
| بنية المجلدات | ✅ مكتمل | - |

### ⏳ المطلوب

| الفئة | العدد | الحالة |
|------|------|--------|
| المكونات المشتركة | 4 مكونات | ⏳ مطلوب |
| مكونات الأصناف | 5 مكونات | ⏳ مطلوب |
| مكونات المستودعات | 5 مكونات | ⏳ مطلوب |
| الصفحات | 6 صفحات | ⏳ مطلوب |

---

## بنية المجلدات

```
src/app/features/inventory/
├── components/
│   ├── shared/                    # المكونات المشتركة
│   │   ├── data-table/           # ✅ مكتمل
│   │   ├── stats-card/           # ⏳ مطلوب
│   │   ├── search-bar/           # ⏳ مطلوب
│   │   ├── filter-panel/         # ⏳ مطلوب
│   │   └── pagination/           # ⏳ مطلوب
│   ├── items/                     # مكونات الأصناف
│   │   ├── item-list/            # ⏳ مطلوب
│   │   ├── item-form/            # ⏳ مطلوب
│   │   ├── item-details/         # ⏳ مطلوب
│   │   ├── item-search/          # ⏳ مطلوب
│   │   └── item-stock-card/      # ⏳ مطلوب
│   └── warehouses/                # مكونات المستودعات
│       ├── warehouse-list/       # ⏳ مطلوب
│       ├── warehouse-form/       # ⏳ مطلوب
│       ├── warehouse-details/    # ⏳ مطلوب
│       ├── warehouse-stock/      # ⏳ مطلوب
│       └── warehouse-stats-card/ # ⏳ مطلوب
├── pages/
│   ├── items-page/               # ⏳ مطلوب
│   ├── warehouses-page/          # ⏳ مطلوب
│   ├── movements-page/           # ⏳ مطلوب
│   ├── stock-count-page/         # ⏳ مطلوب
│   ├── reports-page/             # ⏳ مطلوب
│   └── dashboard-page/           # ⏳ مطلوب
├── services/
│   └── inventory.service.ts       # ✅ مكتمل
└── models/
    └── inventory.models.ts         # ✅ مكتمل
```

---

## 1. المكونات المشتركة (Shared Components)

### 1.1 DataTableComponent ✅

**الحالة**: مكتمل

**الوظيفة**: جدول بيانات عام قابل لإعادة الاستخدام

**الميزات**:
- Generic مع Type Parameters
- Sorting (ascending/descending)
- Pagination مدمج
- Row Actions (edit/delete/custom)
- Loading State
- Empty State
- Row Selection (single/multiple)
- Responsive

**مثال الاستخدام**:

```typescript
import { DataTableComponent, ColumnConfig, RowAction } from '@features/inventory/components/shared/data-table/data-table.component';

@Component({
  selector: 'app-items-list',
  imports: [DataTableComponent],
  template: `
    <app-data-table
      [columns]="columns"
      [data]="items"
      [loading]="loading"
      [pageSize]="50"
      [actions]="actions"
      (rowClick)="onRowClick($event)"
      (actionClick)="onActionClick($event)"
      (sortChange)="onSortChange($event)"
    ></app-data-table>
  `
})
export class ItemsListComponent {
  columns: ColumnConfig[] = [
    { field: 'code', header: 'الكود', sortable: true },
    { field: 'nameAr', header: 'الاسم', sortable: true },
    { field: 'categoryName', header: 'الفئة', sortable: false },
    { field: 'unitName', header: 'الوحدة', sortable: false },
    { field: 'isActive', header: 'الحالة', sortable: true, type: 'boolean' }
  ];

  actions: RowAction[] = [
    { icon: '✏️', label: 'تعديل', color: 'primary' },
    { icon: '🗑️', label: 'حذف', color: 'danger' }
  ];

  items: any[] = [];
  loading: boolean = false;

  onRowClick(row: any) {
    console.log('Row clicked:', row);
  }

  onActionClick(event: { action: RowAction; row: any }) {
    console.log('Action clicked:', event);
  }

  onSortChange(event: SortEvent) {
    console.log('Sort changed:', event);
  }
}
```

---

### 1.2 StatsCardComponent ⏳

**الوظيفة**: بطاقة إحصائيات عامة قابلة لإعادة الاستخدام

**الميزات**:
- عنوان وقيمة
- أيقونة اختيارية
- ألوان مختلفة (primary/success/warning/danger)
- Trend indicator (up/down)
- Loading skeleton
- Clickable (اختياري)
- Animation on value change

**مثال الاستخدام المتوقع**:

```typescript
<app-stats-card
  title="إجمالي الأصناف"
  [value]="totalItems"
  icon="📦"
  color="primary"
  trend="up"
  [loading]="loading"
  (click)="navigateToItems()"
></app-stats-card>
```

**الملفات المطلوبة**:
1. stats-card.component.ts
2. stats-card.component.html
3. stats-card.component.scss
4. stats-card.component.spec.ts

---

### 1.3 SearchBarComponent ⏳

**الوظيفة**: شريط بحث عام قابل لإعادة الاستخدام

**الميزات**:
- Debounce (300ms)
- Clear button
- Placeholder مخصص
- Search icon
- Loading indicator
- Autocomplete support
- Min length validation
- Keyboard shortcuts (Ctrl+K)
- RTL support

**مثال الاستخدام المتوقع**:

```typescript
<app-search-bar
  placeholder="ابحث عن صنف..."
  [debounceTime]="300"
  [minLength]="2"
  [showClearButton]="true"
  (search)="onSearch($event)"
  (clear)="onClear()"
></app-search-bar>
```

**الملفات المطلوبة**:
1. search-bar.component.ts
2. search-bar.component.html
3. search-bar.component.scss
4. search-bar.component.spec.ts

---

### 1.4 FilterPanelComponent ⏳

**الوظيفة**: لوحة فلاتر عامة قابلة لإعادة الاستخدام

**الميزات**:
- Dynamic filters configuration
- Multiple filter types (text/select/date/range)
- Apply/Reset buttons
- Collapsible/Expandable
- Active filters count badge
- Save filter presets
- Form validation

**مثال الاستخدام المتوقع**:

```typescript
<app-filter-panel
  [filters]="filterConfig"
  [initialValues]="initialFilters"
  (filterApply)="onFilterApply($event)"
  (filterReset)="onFilterReset()"
></app-filter-panel>
```

**الملفات المطلوبة**:
1. filter-panel.component.ts
2. filter-panel.component.html
3. filter-panel.component.scss
4. filter-panel.component.spec.ts

---

### 1.5 PaginationComponent ⏳

**الوظيفة**: Pagination عام قابل لإعادة الاستخدام

**الميزات**:
- Previous/Next buttons
- Page numbers with ellipsis
- Jump to page
- Page size selector (10/25/50/100)
- Total items display
- First/Last buttons
- Keyboard navigation
- RTL support

**مثال الاستخدام المتوقع**:

```typescript
<app-pagination
  [totalItems]="1000"
  [pageSize]="50"
  [currentPage]="1"
  [pageSizeOptions]="[10, 25, 50, 100]"
  (pageChange)="onPageChange($event)"
  (pageSizeChange)="onPageSizeChange($event)"
></app-pagination>
```

**الملفات المطلوبة**:
1. pagination.component.ts
2. pagination.component.html
3. pagination.component.scss
4. pagination.component.spec.ts

---

## 2. مكونات الأصناف (Items Components)

### 2.1 ItemListComponent ⏳

**الوظيفة**: عرض قائمة الأصناف في جدول

**الميزات**:
- استخدام DataTableComponent
- بحث وفلترة
- أزرار إضافة/تعديل/حذف
- عرض الرصيد
- تصدير Excel

**المكونات المستخدمة**:
- DataTableComponent
- SearchBarComponent
- FilterPanelComponent

**الملفات المطلوبة**:
1. item-list.component.ts
2. item-list.component.html
3. item-list.component.scss
4. item-list.component.spec.ts

---

### 2.2 ItemFormComponent ⏳

**الوظيفة**: نموذج إضافة/تعديل صنف

**الميزات**:
- Reactive Form
- Validation شاملة
- اختيار الفئة والوحدة
- رفع صورة (اختياري)
- حقول الأسعار والحدود
- حفظ ومتابعة

**الملفات المطلوبة**:
1. item-form.component.ts
2. item-form.component.html
3. item-form.component.scss
4. item-form.component.spec.ts

---

### 2.3 ItemDetailsComponent ⏳

**الوظيفة**: عرض تفاصيل الصنف

**الميزات**:
- عرض جميع البيانات
- رصيد الصنف في المستودعات
- حركات الصنف الأخيرة
- إحصائيات الصنف
- أزرار تعديل/حذف

**المكونات المستخدمة**:
- DataTableComponent
- StatsCardComponent

**الملفات المطلوبة**:
1. item-details.component.ts
2. item-details.component.html
3. item-details.component.scss
4. item-details.component.spec.ts

---

### 2.4 ItemSearchComponent ⏳

**الوظيفة**: بحث متقدم في الأصناف

**الميزات**:
- بحث بالكود/الاسم/الباركود
- Autocomplete
- نتائج فورية
- اختيار من النتائج

**المكونات المستخدمة**:
- SearchBarComponent

**الملفات المطلوبة**:
1. item-search.component.ts
2. item-search.component.html
3. item-search.component.scss
4. item-search.component.spec.ts

---

### 2.5 ItemStockCardComponent ⏳

**الوظيفة**: بطاقة عرض رصيد صنف

**الميزات**:
- عرض الكمية
- حالة المخزون (ناقص/عادي/زائد)
- ألوان تحذيرية
- رسم بياني صغير

**الملفات المطلوبة**:
1. item-stock-card.component.ts
2. item-stock-card.component.html
3. item-stock-card.component.scss
4. item-stock-card.component.spec.ts

---

## 3. مكونات المستودعات (Warehouses Components)

### 3.1 WarehouseListComponent ⏳

**الوظيفة**: عرض قائمة المستودعات

**الميزات**:
- عرض كجدول أو كروت
- بحث وفلترة
- عرض الإحصائيات
- أزرار إضافة/تعديل/حذف

**المكونات المستخدمة**:
- DataTableComponent
- WarehouseStatsCardComponent

**الملفات المطلوبة**:
1. warehouse-list.component.ts
2. warehouse-list.component.html
3. warehouse-list.component.scss
4. warehouse-list.component.spec.ts

---

### 3.2 WarehouseFormComponent ⏳

**الوظيفة**: نموذج إضافة/تعديل مستودع

**الميزات**:
- Reactive Form
- Validation
- اختيار المدير
- تحديد السعة
- الموقع والعنوان

**الملفات المطلوبة**:
1. warehouse-form.component.ts
2. warehouse-form.component.html
3. warehouse-form.component.scss
4. warehouse-form.component.spec.ts

---

### 3.3 WarehouseDetailsComponent ⏳

**الوظيفة**: عرض تفاصيل المستودع

**الميزات**:
- البيانات الأساسية
- الإحصائيات
- رصيد الأصناف
- حركات المستودع
- نسبة الإشغال

**المكونات المستخدمة**:
- DataTableComponent
- StatsCardComponent
- WarehouseStatsCardComponent

**الملفات المطلوبة**:
1. warehouse-details.component.ts
2. warehouse-details.component.html
3. warehouse-details.component.scss
4. warehouse-details.component.spec.ts

---

### 3.4 WarehouseStockComponent ⏳

**الوظيفة**: عرض رصيد المستودع

**الميزات**:
- جدول الأصناف
- الكميات
- القيمة الإجمالية
- تصدير Excel

**المكونات المستخدمة**:
- DataTableComponent

**الملفات المطلوبة**:
1. warehouse-stock.component.ts
2. warehouse-stock.component.html
3. warehouse-stock.component.scss
4. warehouse-stock.component.spec.ts

---

### 3.5 WarehouseStatsCardComponent ⏳

**الوظيفة**: بطاقة إحصائيات المستودع

**الميزات**:
- عدد الأصناف
- القيمة الإجمالية
- نسبة الإشغال
- رسم بياني دائري

**الملفات المطلوبة**:
1. warehouse-stats-card.component.ts
2. warehouse-stats-card.component.html
3. warehouse-stats-card.component.scss
4. warehouse-stats-card.component.spec.ts

---

## 4. الصفحات (Pages)

### 4.1 ItemsPageComponent ⏳

**الوظيفة**: صفحة إدارة الأصناف

**المكونات المستخدمة**:
- ItemListComponent
- ItemSearchComponent
- ItemFormComponent (في Dialog)

**الملفات المطلوبة**:
1. items-page.component.ts
2. items-page.component.html
3. items-page.component.scss
4. items-page.component.spec.ts

---

### 4.2 WarehousesPageComponent ⏳

**الوظيفة**: صفحة إدارة المستودعات

**المكونات المستخدمة**:
- WarehouseListComponent
- WarehouseFormComponent (في Dialog)

**الملفات المطلوبة**:
1. warehouses-page.component.ts
2. warehouses-page.component.html
3. warehouses-page.component.scss
4. warehouses-page.component.spec.ts

---

### 4.3 MovementsPageComponent ⏳

**الوظيفة**: صفحة حركات المخزون

**المكونات المستخدمة**:
- DataTableComponent
- FilterPanelComponent

**الملفات المطلوبة**:
1. movements-page.component.ts
2. movements-page.component.html
3. movements-page.component.scss
4. movements-page.component.spec.ts

---

### 4.4 StockCountPageComponent ⏳

**الوظيفة**: صفحة الجرد

**المكونات المستخدمة**:
- DataTableComponent

**الملفات المطلوبة**:
1. stock-count-page.component.ts
2. stock-count-page.component.html
3. stock-count-page.component.scss
4. stock-count-page.component.spec.ts

---

### 4.5 ReportsPageComponent ⏳

**الوظيفة**: صفحة التقارير

**المكونات المستخدمة**:
- DataTableComponent
- FilterPanelComponent

**الملفات المطلوبة**:
1. reports-page.component.ts
2. reports-page.component.html
3. reports-page.component.scss
4. reports-page.component.spec.ts

---

### 4.6 DashboardPageComponent ⏳

**الوظيفة**: لوحة التحكم

**المكونات المستخدمة**:
- StatsCardComponent
- DataTableComponent
- Charts

**الملفات المطلوبة**:
1. dashboard-page.component.ts
2. dashboard-page.component.html
3. dashboard-page.component.scss
4. dashboard-page.component.spec.ts

---

## إجمالي المكونات المطلوبة

| الفئة | العدد | الملفات | الحالة |
|------|------|---------|--------|
| المكونات المشتركة | 5 | 20 ملف | 1/5 ✅ |
| مكونات الأصناف | 5 | 20 ملف | 0/5 ⏳ |
| مكونات المستودعات | 5 | 20 ملف | 0/5 ⏳ |
| الصفحات | 6 | 24 ملف | 0/6 ⏳ |
| **الإجمالي** | **21** | **84 ملف** | **1/21** |

---

## التقنيات المستخدمة

- **Angular**: 15+
- **TypeScript**: 4.8+
- **RxJS**: 7+
- **SCSS**: Styling
- **Jest**: Testing
- **Angular Material** أو **PrimeNG**: UI Library (يفضل تحديده)

---

## ملاحظات مهمة

1. **Standalone Components**: جميع المكونات يجب أن تكون standalone
2. **Reactive Forms**: استخدام Reactive Forms في جميع النماذج
3. **RxJS**: استخدام RxJS للبرمجة التفاعلية
4. **RTL Support**: دعم RTL للعربية
5. **Responsive**: جميع المكونات responsive
6. **Accessibility**: دعم Accessibility (a11y)
7. **Testing**: اختبارات شاملة لكل مكون

---

## الخطوات التالية

1. ✅ إنشاء بنية المجلدات
2. ✅ إنشاء DataTableComponent
3. ⏳ إنشاء باقي المكونات المشتركة (4 مكونات)
4. ⏳ إنشاء مكونات الأصناف (5 مكونات)
5. ⏳ إنشاء مكونات المستودعات (5 مكونات)
6. ⏳ إنشاء الصفحات (6 صفحات)
7. ⏳ إنشاء Routing Module
8. ⏳ اختبار شامل
9. ⏳ توثيق

---

**تم إنشاء هذا الدليل بواسطة**: Manus AI Agent  
**التاريخ**: 6 ديسمبر 2024  
**المشروع**: SEMOP ERP - نظام المخازن Frontend
