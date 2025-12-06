# نظام المخازن - SEMOP ERP

## نظرة عامة

نظام مخازن احترافي ومتكامل لإدارة المخزون في نظام SEMOP ERP. يوفر النظام جميع الميزات المطلوبة لإدارة المخازن بشكل فعال واحترافي.

## الميزات الرئيسية

### 1. إدارة الأصناف (Items Management)
- ✅ إضافة وتعديل وحذف الأصناف
- ✅ تصنيف الأصناف حسب الفئات
- ✅ دعم الباركود و SKU
- ✅ تحديد الحد الأدنى والأقصى للمخزون
- ✅ إدارة الأسعار (تكلفة وبيع)
- ✅ البحث المتقدم في الأصناف

### 2. إدارة المستودعات (Warehouses Management)
- ✅ إضافة وتعديل وحذف المستودعات
- ✅ تحديد السعة التخزينية
- ✅ تعيين مدير المستودع
- ✅ تتبع الرصيد الحالي
- ✅ حساب نسبة الإشغال

### 3. حركات المخزون (Stock Movements)
- ✅ حركات الإدخال (IN)
- ✅ حركات الإخراج (OUT)
- ✅ التحويلات بين المستودعات (TRANSFER)
- ✅ التسويات (ADJUSTMENT)
- ✅ ربط الحركات بالمستندات المرجعية
- ✅ إلغاء الحركات

### 4. الجرد (Stock Count)
- ✅ إنشاء عمليات جرد
- ✅ تسجيل الكميات المعدودة
- ✅ حساب الفروقات تلقائياً
- ✅ إنشاء تسويات من الجرد
- ✅ تقارير الجرد

### 5. التقارير (Reports)
- ✅ تقرير حركة صنف
- ✅ تقرير حركة مستودع
- ✅ تقرير الأصناف الناقصة
- ✅ تقرير الأصناف الراكدة
- ✅ تقرير قيمة المخزون
- ✅ تقرير الرصيد الحالي

### 6. الفئات والوحدات
- ✅ إدارة فئات الأصناف (هرمية)
- ✅ إدارة وحدات القياس

## البنية التقنية

### Backend Structure

```
libs/inventory/
├── controllers/           # REST API Controllers
│   ├── items.controller.ts
│   ├── warehouses.controller.ts
│   ├── stock-movements.controller.ts
│   ├── stock-count.controller.ts
│   ├── categories.controller.ts
│   ├── units.controller.ts
│   ├── reports.controller.ts
│   └── transfers.controller.ts
├── services/             # Business Logic Services
│   ├── items.service.ts
│   ├── warehouses.service.ts
│   ├── stock-movements.service.ts
│   ├── stock-count.service.ts
│   ├── categories.service.ts
│   ├── units.service.ts
│   ├── reports.service.ts
│   ├── transfers.service.ts
│   └── __tests__/       # Unit Tests
├── dto/                 # Data Transfer Objects
│   ├── create-item.dto.ts
│   ├── update-item.dto.ts
│   ├── create-warehouse.dto.ts
│   ├── update-warehouse.dto.ts
│   ├── create-movement.dto.ts
│   ├── transfer.dto.ts
│   ├── create-count.dto.ts
│   ├── count-record.dto.ts
│   ├── create-category.dto.ts
│   ├── update-category.dto.ts
│   ├── create-unit.dto.ts
│   ├── update-unit.dto.ts
│   └── report-filters.dto.ts
├── interfaces/          # TypeScript Interfaces
│   ├── inventory.interface.ts
│   ├── stock-balance.interface.ts
│   └── report.interface.ts
├── types/              # Enums & Types
│   ├── movement-type.enum.ts
│   └── count-status.enum.ts
└── inventory.module.ts # Main Module
```

## قاعدة البيانات

### الجداول الرئيسية

1. **Items** - الأصناف
2. **Warehouses** - المستودعات
3. **WarehouseItem** - رصيد الأصناف في المستودعات
4. **StockMovement** - حركات المخزون
5. **InventoryCount** - عمليات الجرد
6. **InventoryRecord** - سجلات الجرد
7. **ItemCategory** - فئات الأصناف
8. **Unit** - وحدات القياس

## API Endpoints

### الأصناف (Items)

```
GET    /api/inventory/items                  # جلب جميع الأصناف
GET    /api/inventory/items/:id              # جلب صنف واحد
POST   /api/inventory/items                  # إنشاء صنف
PUT    /api/inventory/items/:id              # تحديث صنف
DELETE /api/inventory/items/:id              # حذف صنف
GET    /api/inventory/items/search/:query    # البحث
GET    /api/inventory/items/:id/stock        # جلب رصيد صنف
GET    /api/inventory/items/barcode/:barcode # البحث بالباركود
```

### المستودعات (Warehouses)

```
GET    /api/inventory/warehouses              # جلب جميع المستودعات
GET    /api/inventory/warehouses/:id          # جلب مستودع واحد
POST   /api/inventory/warehouses              # إنشاء مستودع
PUT    /api/inventory/warehouses/:id          # تحديث مستودع
DELETE /api/inventory/warehouses/:id          # حذف مستودع
GET    /api/inventory/warehouses/:id/stock    # جلب رصيد المستودع
GET    /api/inventory/warehouses/:id/value    # جلب قيمة المخزون
GET    /api/inventory/warehouses/:id/capacity # جلب نسبة الإشغال
GET    /api/inventory/warehouses/:id/stats    # جلب الإحصائيات
```

### حركات المخزون (Stock Movements)

```
GET    /api/inventory/movements               # جلب جميع الحركات
GET    /api/inventory/movements/:id           # جلب حركة واحدة
POST   /api/inventory/movements/in            # إنشاء حركة إدخال
POST   /api/inventory/movements/out           # إنشاء حركة إخراج
POST   /api/inventory/movements/adjustment    # إنشاء تسوية
DELETE /api/inventory/movements/:id           # إلغاء حركة
```

### الجرد (Stock Count)

```
POST   /api/inventory/stock-count                    # إنشاء جرد
POST   /api/inventory/stock-count/:id/records        # إضافة سجلات
GET    /api/inventory/stock-count/:id/differences    # حساب الفروقات
PUT    /api/inventory/stock-count/:id/complete       # إتمام الجرد
GET    /api/inventory/stock-count/:id/report         # تقرير الجرد
```

### التقارير (Reports)

```
GET    /api/inventory/reports/item-movement      # تقرير حركة صنف
GET    /api/inventory/reports/warehouse-movement # تقرير حركة مستودع
GET    /api/inventory/reports/low-stock          # الأصناف الناقصة
GET    /api/inventory/reports/inactive-items     # الأصناف الراكدة
GET    /api/inventory/reports/stock-value        # قيمة المخزون
GET    /api/inventory/reports/stock-balance      # الرصيد الحالي
```

### الفئات (Categories)

```
GET    /api/inventory/categories            # جلب جميع الفئات
GET    /api/inventory/categories/hierarchy  # الهيكل الهرمي
GET    /api/inventory/categories/:id        # جلب فئة واحدة
POST   /api/inventory/categories            # إنشاء فئة
PUT    /api/inventory/categories/:id        # تحديث فئة
DELETE /api/inventory/categories/:id        # حذف فئة
```

### الوحدات (Units)

```
GET    /api/inventory/units       # جلب جميع الوحدات
GET    /api/inventory/units/:id   # جلب وحدة واحدة
POST   /api/inventory/units       # إنشاء وحدة
PUT    /api/inventory/units/:id   # تحديث وحدة
DELETE /api/inventory/units/:id   # حذف وحدة
```

## الاختبارات

تم كتابة اختبارات شاملة لجميع Services:

```bash
# تشغيل الاختبارات
npm test

# تشغيل اختبارات محددة
npm test items.service.spec.ts

# تشغيل مع التغطية
npm test -- --coverage
```

### ملفات الاختبار

- ✅ items.service.spec.ts (19 KB)
- ✅ warehouses.service.spec.ts (15 KB)
- ✅ stock-movements.service.spec.ts (12 KB)
- ✅ stock-count.service.spec.ts (11 KB)
- ✅ categories.service.spec.ts (14 KB)
- ✅ units.service.spec.ts (12 KB)
- ✅ reports.service.spec.ts (17 KB)

## Frontend Integration

تم إنشاء Models و Services للـ Frontend:

```typescript
// استخدام الخدمة
import { InventoryService } from '@features/inventory/services/inventory.service';

// جلب الأصناف
this.inventoryService.getItems({ page: 1, limit: 50 }).subscribe(
  (response) => {
    console.log(response.data);
  }
);

// إنشاء صنف
this.inventoryService.createItem({
  code: 'ITEM001',
  nameAr: 'صنف جديد',
  categoryId: 'cat-1',
  unitId: 'unit-1',
}).subscribe(
  (item) => {
    console.log('تم الإنشاء', item);
  }
);
```

## التطوير المستقبلي

### المكونات المطلوبة للـ Frontend

1. **صفحات (Pages)**
   - قائمة الأصناف
   - تفاصيل الصنف
   - قائمة المستودعات
   - تفاصيل المستودع
   - حركات المخزون
   - الجرد
   - التقارير

2. **مكونات (Components)**
   - نموذج إضافة/تعديل صنف
   - نموذج إضافة/تعديل مستودع
   - نموذج حركة مخزون
   - نموذج الجرد
   - جداول البيانات
   - مخططات الإحصائيات

3. **الميزات الإضافية**
   - طباعة الباركود
   - استيراد/تصدير Excel
   - إشعارات الأصناف الناقصة
   - لوحة تحكم المخزون

## الإحصائيات

- **إجمالي الملفات:** 45 ملف
- **إجمالي الأسطر:** 7073+ سطر
- **Backend Services:** 8 خدمات
- **Controllers:** 8 controllers
- **DTOs:** 14 DTO
- **Interfaces:** 3 interfaces
- **Tests:** 7 ملفات اختبار
- **Frontend:** Models + Services

## المساهمون

تم تطوير النظام بواسطة فريق SEMOP Development Team

## الترخيص

جميع الحقوق محفوظة © 2024 SEMOP ERP
