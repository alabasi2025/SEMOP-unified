# دليل إعداد بيئة الاختبارات - SEMOP Unified

## نظرة عامة

هذا الدليل يوضح كيفية إعداد وتشغيل اختبارات الوحدة والتكامل للمشروع.

---

## المتطلبات الأساسية

- Node.js >= 18.x
- PostgreSQL >= 14.x (للاختبارات التي تتطلب قاعدة بيانات)
- pnpm >= 8.x

---

## إعداد بيئة الاختبارات للخلفية (Backend)

### 1. إعداد قاعدة البيانات للاختبار

```bash
# إنشاء قاعدة بيانات للاختبار
createdb semop_test

# أو باستخدام psql
psql -U postgres
CREATE DATABASE semop_test;
\q
```

### 2. إعداد متغيرات البيئة

تم إنشاء ملف `.env.test` في مجلد `apps/backend/` يحتوي على:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/semop_test?schema=public"
JWT_SECRET="test-secret-key-for-integration-tests-only"
NODE_ENV="test"
PORT=3001
```

**ملاحظة:** قم بتحديث `DATABASE_URL` بمعلومات الاتصال الصحيحة لقاعدة البيانات الخاصة بك.

### 3. تشغيل migrations للاختبار

```bash
cd apps/backend
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/semop_test?schema=public" npx prisma migrate deploy
```

### 4. تشغيل الاختبارات

```bash
# تشغيل جميع الاختبارات
cd apps/backend
npm run test

# تشغيل اختبارات E2E
npx nx e2e api-gateway-e2e

# تشغيل اختبارات مشروع معين
npx nx test api-gateway
```

---

## إعداد بيئة الاختبارات للواجهة الأمامية (Frontend)

### 1. التحقق من إعداد Jest

تم إضافة إعداد Jest في:
- `apps/frontend/apps/platform-shell-ui/jest.config.ts`
- `apps/frontend/apps/platform-shell-ui/project.json` (تم إضافة target للاختبارات)

### 2. تشغيل الاختبارات

```bash
cd apps/frontend

# تشغيل جميع الاختبارات
npx nx test my-angular-app

# تشغيل الاختبارات مع التغطية
npx nx test my-angular-app --coverage

# تشغيل الاختبارات في وضع المراقبة
npx nx test my-angular-app --watch
```

### 3. ملفات الاختبار المُنشأة

تم إنشاء ملفات اختبار نموذجية للمكونات الجديدة:

- `stats-card.component.spec.ts` - اختبارات لمكون بطاقة الإحصائيات
- `filter-panel.component.spec.ts` - اختبارات لمكون لوحة الفلاتر
- `inventory.service.spec.ts` - اختبارات لخدمة المخزون

---

## المشاكل الشائعة والحلول

### 1. خطأ: Environment variable not found: DATABASE_URL

**الحل:**
- تأكد من وجود ملف `.env.test` في `apps/backend/`
- تحقق من صحة `DATABASE_URL`
- قم بتشغيل الاختبارات مع تحميل متغيرات البيئة:
  ```bash
  cd apps/backend
  export $(cat .env.test | xargs) && npm run test
  ```

### 2. خطأ: jasmine is not defined

**الحل:**
- هذا يحدث عندما تستخدم ملفات الاختبار القديمة Jasmine بدلاً من Jest
- تأكد من استخدام `jest.mock()` و `jest.fn()` بدلاً من `jasmine.createSpyObj()`
- مثال:
  ```typescript
  // ❌ خطأ
  const mockService = jasmine.createSpyObj('Service', ['method']);
  
  // ✅ صحيح
  const mockService = {
    method: jest.fn()
  };
  ```

### 3. خطأ: Cannot find module

**الحل:**
```bash
# إعادة تثبيت الحزم
cd apps/frontend  # أو apps/backend
rm -rf node_modules
pnpm install
```

---

## أفضل الممارسات

### 1. كتابة الاختبارات

- **اختبارات الوحدة (Unit Tests):** اختبر كل مكون/خدمة بشكل منفصل
- **اختبارات التكامل (Integration Tests):** اختبر التفاعل بين المكونات
- **اختبارات E2E:** اختبر سيناريوهات المستخدم الكاملة

### 2. تنظيم الاختبارات

```
src/
├── app/
│   ├── features/
│   │   ├── inventory/
│   │   │   ├── components/
│   │   │   │   ├── stats-card/
│   │   │   │   │   ├── stats-card.component.ts
│   │   │   │   │   └── stats-card.component.spec.ts
│   │   │   ├── services/
│   │   │   │   ├── inventory.service.ts
│   │   │   │   └── inventory.service.spec.ts
```

### 3. تغطية الاختبارات

استهدف تغطية لا تقل عن:
- 80% للكود الحرج (Critical Code)
- 60% للكود العام

```bash
# عرض تقرير التغطية
npx nx test my-angular-app --coverage
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: semop_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install
      - run: cd apps/backend && npm run test

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install
      - run: cd apps/frontend && npx nx test my-angular-app
```

---

## الموارد الإضافية

- [Jest Documentation](https://jestjs.io/)
- [Angular Testing Guide](https://angular.io/guide/testing)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Nx Testing](https://nx.dev/recipes/jest/jest)

---

## الدعم

إذا واجهت أي مشاكل:
1. تحقق من هذا الدليل أولاً
2. راجع سجلات الأخطاء بعناية
3. تأكد من تحديث جميع الحزم
4. اتصل بفريق التطوير للمساعدة

---

**آخر تحديث:** 2025-01-XX  
**الإصدار:** 1.0
