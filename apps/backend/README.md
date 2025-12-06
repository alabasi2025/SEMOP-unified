# SEMOP Backend - Unified Monorepo

نظام **SEMOP** (Smart Enterprise Management & Operations Platform) هو منصة متكاملة لإدارة المؤسسات تجمع بين إدارة الموارد البشرية، المحاسبة، المبيعات، المشتريات، والمخزون في نظام موحد.

---

## البنية المعمارية

يتبع المشروع بنية **Monorepo** باستخدام **Nx** مع تنظيم متعدد الطبقات:

### الطبقات الثلاث

```
libs/
├── 1-core-services/        # الخدمات الأساسية
│   ├── auth/
│   ├── users/
│   ├── roles/
│   ├── permissions/
│   └── ...
├── 2-ocmp/                 # منصة إدارة المؤسسة
│   ├── genes/
│   ├── holdings/
│   └── projects/
└── 3-vertical-applications/ # التطبيقات العمودية
    ├── accounting/
    ├── sales/
    ├── purchasing/
    └── hr/
```

---

## الوثائق

تم تنظيم الوثائق في مجلد `docs/`:

- **[CLOUD_DEPLOYMENT_GUIDE.md](docs/CLOUD_DEPLOYMENT_GUIDE.md)** - دليل النشر السحابي
- **[VERIFICATION_SCRIPTS.md](docs/VERIFICATION_SCRIPTS.md)** - توثيق سكريبتات التحقق
- **[planning/](docs/planning/)** - خطط المشروع والتتبع
- **[rules/](docs/rules/)** - قواعد التكامل والالتزام
- **[enhancements/](docs/enhancements/)** - التحسينات المقترحة
- **[stored_procedures/](docs/stored_procedures/)** - الإجراءات المخزنة

---

## سكريبتات التحقق

تتوفر سكريبتات للتحقق من جودة الكود في `scripts/verification/`:

```bash
# فحص إصدار العقود
./scripts/verification/check-contracts-version.sh

# فحص تعليقات PHASE
./scripts/verification/check-phase-comments.sh

# التحقق من بنية الطبقات
./scripts/verification/verify-layer-architecture.sh

# التحقق من عدم وجود DTOs محلية
./scripts/verification/verify-no-local-dtos.sh

# إنشاء تقرير التكامل
./scripts/verification/generate-integration-report.sh
```

---

## تشغيل المشروع

### Development

```sh
npx nx serve api-gateway
```

### Production Build

```sh
npx nx build api-gateway
```

### عرض المشاريع المتاحة

```sh
npx nx show project api-gateway
```

---

## إضافة مشاريع جديدة

### إنشاء تطبيق جديد

```sh
npx nx g @nx/nest:app demo
```

### إنشاء مكتبة جديدة

```sh
npx nx g @nx/node:lib mylib
```

---

## التقنيات المستخدمة

- **Framework:** NestJS
- **Build Tool:** Nx
- **Database:** PostgreSQL with Prisma ORM
- **Language:** TypeScript
- **Authentication:** JWT

---

## الإصدار الحالي

**v3.4.0** - تم تحديثه في 2025-12-05

راجع [CHANGELOG.md](CHANGELOG.md) للتفاصيل الكاملة.

---

## المساهمة

يرجى مراجعة قواعد التكامل في [docs/rules/](docs/rules/) قبل المساهمة في المشروع.

---

**تم إنشاؤه بواسطة:** فريق SEMOP  
**الترخيص:** Private
