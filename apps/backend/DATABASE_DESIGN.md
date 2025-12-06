# تصميم نموذج البيانات - SEMOP

**التاريخ:** 2025-11-20  
**الإصدار:** v0.2.0  
**المرحلة:** 2 - بناء خدمات النواة الأساسية

---

## 📋 نظرة عامة

هذا المستند يحتوي على التصميم الكامل لنموذج البيانات للأنظمة الأساسية في SEMOP:

1. **نظام الكيانات المتعددة** (Multi-Entity System)
2. **نظام الهوية والصلاحيات** (Identity & Access Management)
3. **نظام التكوين** (Configuration System)

---

## 🏢 1. نظام الكيانات المتعددة (Multi-Entity System)

### المفهوم الأساسي

الهيكل الهرمي الثلاثي المستويات:
```
Holding (شركة قابضة)
  └── Unit (وحدة)
      └── Project (مشروع)
```

### الجداول

#### 1.1 Holding (الشركة القابضة)

```prisma
model Holding {
  id          String   @id @default(cuid())
  code        String   @unique // كود فريد للشركة
  nameAr      String   // الاسم بالعربية
  nameEn      String   // الاسم بالإنجليزية
  description String?  // وصف
  logo        String?  // شعار الشركة
  isActive    Boolean  @default(true)
  
  // العلاقات
  units       Unit[]
  users       User[]
  
  // التدقيق
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  createdBy   String?
  updatedBy   String?
  
  @@map("holdings")
}
```

**الخصائص:**
- كل Holding لها كود فريد (مثل: "HOLD001")
- دعم متعدد اللغات (عربي/إنجليزي)
- يمكن تعطيل الشركة بدون حذفها
- تتبع من أنشأ وعدّل السجل

#### 1.2 Unit (الوحدة)

```prisma
model Unit {
  id          String   @id @default(cuid())
  code        String   @unique // كود فريد للوحدة
  nameAr      String   // الاسم بالعربية
  nameEn      String   // الاسم بالإنجليزية
  description String?  // وصف
  type        UnitType // نوع الوحدة
  isActive    Boolean  @default(true)
  
  // العلاقات الهرمية
  holdingId   String
  holding     Holding  @relation(fields: [holdingId], references: [id], onDelete: Cascade)
  
  // العلاقات
  projects    Project[]
  users       User[]
  
  // التدقيق
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  createdBy   String?
  updatedBy   String?
  
  @@map("units")
  @@index([holdingId])
}

enum UnitType {
  BRANCH        // فرع
  DEPARTMENT    // قسم
  DIVISION      // شعبة
  SUBSIDIARY    // شركة تابعة
  OTHER         // أخرى
}
```

**الخصائص:**
- كل Unit تنتمي لـ Holding واحدة فقط
- Cascade Delete: حذف Holding يحذف جميع Units التابعة
- أنواع متعددة للوحدات (فرع، قسم، شعبة، إلخ)
- Index على holdingId لتسريع الاستعلامات

#### 1.3 Project (المشروع)

```prisma
model Project {
  id          String        @id @default(cuid())
  code        String        @unique // كود فريد للمشروع
  nameAr      String        // الاسم بالعربية
  nameEn      String        // الاسم بالإنجليزية
  description String?       // وصف
  status      ProjectStatus // حالة المشروع
  startDate   DateTime?     // تاريخ البدء
  endDate     DateTime?     // تاريخ الانتهاء
  budget      Decimal?      @db.Decimal(15, 2) // الميزانية
  isActive    Boolean       @default(true)
  
  // العلاقات الهرمية
  unitId      String
  unit        Unit          @relation(fields: [unitId], references: [id], onDelete: Cascade)
  
  // العلاقات
  users       User[]
  
  // التدقيق
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  createdBy   String?
  updatedBy   String?
  
  @@map("projects")
  @@index([unitId])
  @@index([status])
}

enum ProjectStatus {
  PLANNING      // تخطيط
  IN_PROGRESS   // قيد التنفيذ
  ON_HOLD       // معلق
  COMPLETED     // مكتمل
  CANCELLED     // ملغي
}
```

**الخصائص:**
- كل Project ينتمي لـ Unit واحدة فقط
- Cascade Delete: حذف Unit يحذف جميع Projects التابعة
- تتبع حالة المشروع (تخطيط، تنفيذ، معلق، مكتمل، ملغي)
- دعم الميزانية والتواريخ
- Indexes على unitId و status

---

## 🔐 2. نظام الهوية والصلاحيات (Identity & Access Management)

### المفهوم الأساسي

نظام RBAC (Role-Based Access Control) مع دعم الكيانات المتعددة:
- كل مستخدم ينتمي لكيان واحد أو أكثر (Holding/Unit/Project)
- الصلاحيات تُدار عبر الأدوار (Roles)
- كل دور يحتوي على مجموعة من الصلاحيات (Permissions)

### الجداول

#### 2.1 User (المستخدم)

```prisma
model User {
  id              String    @id @default(cuid())
  username        String    @unique // اسم المستخدم
  email           String    @unique // البريد الإلكتروني
  passwordHash    String    // كلمة المرور المشفرة
  firstName       String    // الاسم الأول
  lastName        String    // الاسم الأخير
  phone           String?   // رقم الهاتف
  avatar          String?   // صورة المستخدم
  isActive        Boolean   @default(true)
  isEmailVerified Boolean   @default(false)
  lastLoginAt     DateTime?
  
  // العلاقات مع الكيانات (Multi-Entity Support)
  holdingId       String?
  holding         Holding?  @relation(fields: [holdingId], references: [id], onDelete: SetNull)
  
  unitId          String?
  unit            Unit?     @relation(fields: [unitId], references: [id], onDelete: SetNull)
  
  projectId       String?
  project         Project?  @relation(fields: [projectId], references: [id], onDelete: SetNull)
  
  // العلاقات مع الأدوار
  userRoles       UserRole[]
  
  // التدقيق
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  createdBy       String?
  updatedBy       String?
  
  @@map("users")
  @@index([email])
  @@index([username])
  @@index([holdingId])
  @@index([unitId])
  @@index([projectId])
}
```

**الخصائص:**
- كل مستخدم يمكن أن ينتمي لـ Holding أو Unit أو Project
- دعم التحقق من البريد الإلكتروني
- تتبع آخر تسجيل دخول
- Indexes متعددة لتسريع الاستعلامات

#### 2.2 Role (الدور)

```prisma
model Role {
  id          String   @id @default(cuid())
  code        String   @unique // كود الدور (مثل: SUPER_ADMIN)
  nameAr      String   // الاسم بالعربية
  nameEn      String   // الاسم بالإنجليزية
  description String?  // وصف
  isSystem    Boolean  @default(false) // هل هو دور نظام (لا يمكن حذفه)
  isActive    Boolean  @default(true)
  
  // العلاقات
  userRoles       UserRole[]
  rolePermissions RolePermission[]
  
  // التدقيق
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("roles")
}
```

**الأدوار الأساسية (System Roles):**
1. **SUPER_ADMIN** - مدير النظام الكامل
2. **HOLDING_ADMIN** - مدير الشركة القابضة
3. **UNIT_ADMIN** - مدير الوحدة
4. **PROJECT_ADMIN** - مدير المشروع
5. **ACCOUNTANT** - محاسب
6. **WAREHOUSE_KEEPER** - أمين مستودع
7. **EMPLOYEE** - موظف
8. **VIEWER** - مشاهد فقط

#### 2.3 Permission (الصلاحية)

```prisma
model Permission {
  id          String   @id @default(cuid())
  code        String   @unique // كود الصلاحية (مثل: USER_CREATE)
  nameAr      String   // الاسم بالعربية
  nameEn      String   // الاسم بالإنجليزية
  description String?  // وصف
  module      String   // اسم الوحدة (مثل: users, inventory)
  action      String   // الإجراء (create, read, update, delete)
  
  // العلاقات
  rolePermissions RolePermission[]
  
  // التدقيق
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("permissions")
  @@unique([module, action])
}
```

**أمثلة على الصلاحيات:**
- `USER_CREATE` - إنشاء مستخدم
- `USER_READ` - قراءة بيانات المستخدمين
- `USER_UPDATE` - تعديل مستخدم
- `USER_DELETE` - حذف مستخدم
- `INVENTORY_CREATE` - إنشاء مادة في المخزون
- `ACCOUNTING_READ` - قراءة البيانات المحاسبية

#### 2.4 UserRole (ربط المستخدم بالدور)

```prisma
model UserRole {
  id        String   @id @default(cuid())
  
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  roleId    String
  role      Role     @relation(fields: [roleId], references: [id], onDelete: Cascade)
  
  // التدقيق
  assignedAt DateTime @default(now())
  assignedBy String?
  
  @@map("user_roles")
  @@unique([userId, roleId])
  @@index([userId])
  @@index([roleId])
}
```

**الخصائص:**
- Many-to-Many relationship بين User و Role
- كل مستخدم يمكن أن يكون له أدوار متعددة
- Unique constraint لمنع تكرار نفس الدور للمستخدم

#### 2.5 RolePermission (ربط الدور بالصلاحية)

```prisma
model RolePermission {
  id           String     @id @default(cuid())
  
  roleId       String
  role         Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  
  permissionId String
  permission   Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)
  
  // التدقيق
  assignedAt   DateTime   @default(now())
  assignedBy   String?
  
  @@map("role_permissions")
  @@unique([roleId, permissionId])
  @@index([roleId])
  @@index([permissionId])
}
```

**الخصائص:**
- Many-to-Many relationship بين Role و Permission
- كل دور يمكن أن يكون له صلاحيات متعددة
- Unique constraint لمنع تكرار نفس الصلاحية للدور

---

## ⚙️ 3. نظام التكوين (Configuration System)

### المفهوم الأساسي

نظام مرن لحفظ التكوينات والإعدادات على مستوى:
- النظام الكامل (System-wide)
- الشركة القابضة (Holding-level)
- الوحدة (Unit-level)
- المشروع (Project-level)

### الجداول

#### 3.1 Configuration (التكوين)

```prisma
model Configuration {
  id          String          @id @default(cuid())
  key         String          // مفتاح التكوين (مثل: currency, timezone)
  value       String          // القيمة (JSON string)
  dataType    ConfigDataType  // نوع البيانات
  scope       ConfigScope     // نطاق التكوين
  
  // العلاقات مع الكيانات (اختياري حسب scope)
  holdingId   String?
  unitId      String?
  projectId   String?
  
  // الوصف
  nameAr      String
  nameEn      String
  description String?
  
  // التدقيق
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
  createdBy   String?
  updatedBy   String?
  
  @@map("configurations")
  @@unique([key, scope, holdingId, unitId, projectId])
  @@index([key])
  @@index([scope])
}

enum ConfigDataType {
  STRING
  NUMBER
  BOOLEAN
  JSON
  DATE
}

enum ConfigScope {
  SYSTEM      // على مستوى النظام
  HOLDING     // على مستوى الشركة القابضة
  UNIT        // على مستوى الوحدة
  PROJECT     // على مستوى المشروع
}
```

**أمثلة على التكوينات:**
- `currency` - العملة الافتراضية (SAR, USD, EGP)
- `timezone` - المنطقة الزمنية
- `dateFormat` - صيغة التاريخ
- `fiscalYearStart` - بداية السنة المالية
- `language` - اللغة الافتراضية

---

## 🔒 Row-Level Security (RLS)

### المفهوم

كل مستخدم يرى فقط البيانات التابعة لكيانه:
- مستخدم Holding يرى جميع Units و Projects التابعة
- مستخدم Unit يرى فقط Projects التابعة لوحدته
- مستخدم Project يرى فقط بيانات مشروعه

### التطبيق

سيتم تطبيق RLS عبر:
1. **Prisma Middleware** - فلترة تلقائية للاستعلامات
2. **GraphQL Context** - تمرير معلومات المستخدم الحالي
3. **Service Layer** - التحقق من الصلاحيات قبل العمليات

---

## 📊 العلاقات بين الجداول

```
Holding (1) ──────< (N) Unit (1) ──────< (N) Project
   │                      │                      │
   │                      │                      │
   └──────< (N) User (N) ─┤                      │
                           └──────< (N) User (N) ┘

User (N) ──────< (N) UserRole (N) ──────> (N) Role
                                              │
                                              │
                                              └──────< (N) RolePermission (N) ──────> (N) Permission
```

---

## 🎯 الخطوات التالية

1. ✅ تصميم نموذج البيانات (هذا المستند)
2. ⏳ بناء Prisma Schema الكامل
3. ⏳ إنشاء أول Migration
4. ⏳ بناء Services في NestJS
5. ⏳ إضافة DTOs في shared-contracts-repo
6. ⏳ كتابة الاختبارات

---

**تم إعداده بواسطة:** فريق تطوير SEMOP  
**التاريخ:** 2025-11-20  
**الإصدار:** v0.2.0
