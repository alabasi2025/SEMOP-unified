# مستودع العقود المشترك (@semop/contracts)

## الوصف

هذا المستودع هو **مصدر الحقيقة الوحيد** لجميع العقود (DTOs, Enums, Validation Schemas) المشتركة بين الواجهة الأمامية (`unified-frontend-monorepo`) والخلفية (`unified-backend-monorepo`) في منصة SEMOP.

## الفلسفة

> **"العقود هي القانون"** - لا يتم تبادل أي بيانات بين الواجهة والخلفية إلا عبر العقود الموثقة في هذا المستودع.

هذا يضمن:
- ✅ عدم وجود أي تعارض في أنواع البيانات
- ✅ توافق تلقائي بين الواجهة والخلفية
- ✅ اكتشاف الأخطاء في مرحلة التطوير وليس الإنتاج

## البنية

```
src/
├── dtos/              # نماذج نقل البيانات (Data Transfer Objects)
│   ├── identity/      # DTOs خاصة بنظام الهوية
│   ├── accounting/    # DTOs خاصة بالنظام المحاسبي
│   ├── inventory/     # DTOs خاصة بنظام المخزون
│   ├── assets/        # DTOs خاصة بنظام الأصول
│   ├── crm/           # DTOs خاصة بنظام CRM
│   ├── tasks/         # DTOs خاصة بنظام المهام
│   └── ocmp/          # DTOs خاصة بمنصة التحكم التشغيلي
│
├── enums/             # القيم الثابتة (Enumerations)
│
└── validation/        # مخططات التحقق من صحة البيانات (Zod Schemas)
    ├── identity/
    ├── accounting/
    ├── inventory/
    └── assets/
```

## الاستخدام

### التثبيت

في مشروع الواجهة الأمامية أو الخلفية:

```bash
npm install @semop/contracts
```

### الاستيراد

```typescript
import { UserDto, UserRole, createUserSchema } from '@semop/contracts';

// استخدام DTO
const user: UserDto = {
  id: '123',
  email: 'admin@example.com',
  // ...
};

// استخدام Enum
if (user.role === UserRole.SUPER_ADMIN) {
  // ...
}

// استخدام Validation Schema
const result = createUserSchema.safeParse(formData);
if (result.success) {
  // البيانات صالحة
}
```

## سير العمل (Workflow)

1. **تطوير:** عند إضافة ميزة جديدة، يتم إنشاء DTOs و Schemas هنا أولاً.
2. **بناء:** `npm run build` لتحويل TypeScript إلى JavaScript.
3. **نشر:** عند الدمج في `main`، يتم نشر نسخة جديدة تلقائياً عبر GitHub Actions.
4. **استهلاك:** المستودعات الأخرى تقوم بتحديث الحزمة للحصول على أحدث العقود.

## الأوامر

- `npm run build` - بناء المشروع
- `npm run watch` - بناء المشروع مع المراقبة التلقائية للتغييرات
- `npm run clean` - حذف مجلد البناء

## الإصدارات (Versioning)

نتبع **Semantic Versioning**:
- `MAJOR`: تغييرات غير متوافقة مع الإصدارات السابقة
- `MINOR`: إضافة ميزات جديدة بشكل متوافق
- `PATCH`: إصلاحات وتحسينات صغيرة

---

**تم الإنشاء:** 2025-01-20  
**المرحلة:** المرحلة 1 - إعداد المستودعات الثلاثة والبنية التحتية الأساسية  
**الحالة:** ✅ جاهز للاستخدام
