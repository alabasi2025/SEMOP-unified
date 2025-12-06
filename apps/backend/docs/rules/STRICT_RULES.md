# القواعد الصارمة لترابط مستودعات SEMOP

**الإصدار:** 1.0  
**تاريخ الإنشاء:** 3 ديسمبر 2025  
**الحالة:** إلزامي - لا استثناءات

---

## ⚖️ المبدأ الأساسي

**"الترابط الحقيقي غير قابل للتفاوض"**

هذه القواعد مصممة لضمان أن المستودعات الأربعة تعمل كوحدة واحدة متماسكة، ولمنع أي تفكك أو تعارض مستقبلاً.

---

## 🔴 القواعد الحرجة (Critical Rules)

### **القاعدة 1: العقود المشتركة هي القانون**

#### **الإلزام:**
- ✅ **يجب** استخدام `@semop/contracts` لجميع DTOs, Enums, Interfaces
- ❌ **يمنع** إنشاء DTOs محلية في أي مستودع
- ❌ **يمنع** نسخ الأنواع من العقود المشتركة

#### **التطبيق:**
```typescript
// ✅ صحيح
import { UserDto, CreateUserDto } from '@semop/contracts';

// ❌ خطأ - ممنوع
interface UserDto {
  id: string;
  email: string;
}
```

#### **الفحص الآلي:**
```bash
# يجب أن يمر هذا الفحص قبل كل commit
./scripts/verify-no-local-dtos.sh
```

#### **العقوبة:**
- رفض Pull Request تلقائياً
- إعادة كتابة الكود

---

### **القاعدة 2: نفس الإصدار دائماً**

#### **الإلزام:**
- ✅ جميع المستودعات تستخدم نفس إصدار `@semop/contracts`
- ✅ التحديث يجب أن يكون متزامن
- ❌ **يمنع** استخدام إصدارات مختلفة

#### **التطبيق:**
```json
// unified-backend-monorepo/package.json
{
  "dependencies": {
    "@semop/contracts": "1.2.3"  // نفس الإصدار بالضبط
  }
}

// unified-frontend-monorepo/package.json
{
  "dependencies": {
    "@semop/contracts": "1.2.3"  // نفس الإصدار بالضبط
  }
}
```

#### **الفحص الآلي:**
```bash
./scripts/check-contracts-version.sh
# يجب أن يعرض: ✅ All repos use version 1.2.3
```

#### **العقوبة:**
- منع النشر
- تنبيه فوري

---

### **القاعدة 3: البنية الطبقية إلزامية**

#### **الإلزام:**
- ✅ جميع المنطق التجاري في `libs`
- ✅ `apps` للتطبيقات فقط (thin layer)
- ❌ **يمنع** وضع منطق تجاري في `apps`

#### **التطبيق:**
```
unified-backend-monorepo/
├── apps/
│   └── api-gateway/          # فقط routing و configuration
│       └── src/
│           └── main.ts       # bootstrap فقط
└── libs/
    ├── 1-core-services/      # المنطق التجاري هنا
    ├── 2-operational-platform/
    ├── 3-vertical-applications/
    └── 4-sector-libraries/
```

#### **الفحص الآلي:**
```bash
# يجب ألا يوجد ملفات service في apps
find apps -name "*service.ts" | wc -l
# النتيجة المتوقعة: 0
```

#### **العقوبة:**
- رفض Pull Request
- إعادة هيكلة إلزامية

---

### **القاعدة 4: كومنت لكل تغيير**

#### **الإلزام:**
- ✅ كل ملف معدل يجب أن يحتوي على كومنت بالمرحلة
- ✅ الكومنت يجب أن يكون في أعلى الملف أو قبل التغيير
- ❌ **يمنع** التغيير بدون توثيق

#### **التطبيق:**
```typescript
/**
 * PHASE-2.3.1: Migrated to use @semop/contracts
 * Previous: Local UserDto interface
 * Current: Imported from @semop/contracts
 * Date: 2025-12-10
 * Author: Development Team
 */
import { UserDto } from '@semop/contracts';

export class UsersService {
  // PHASE-2.3.1: Updated method signature to use shared contract
  async findAll(): Promise<UserDto[]> {
    // ...
  }
}
```

#### **الفحص الآلي:**
```bash
# التحقق من وجود PHASE في الملفات المعدلة
git diff --name-only | xargs grep -L "PHASE-" && echo "❌ Missing PHASE comment"
```

#### **العقوبة:**
- رفض Commit
- طلب إعادة التوثيق

---

### **القاعدة 5: لا merge بدون فحص**

#### **الإلزام:**
- ✅ جميع الاختبارات يجب أن تمر
- ✅ Linting يجب أن ينجح
- ✅ Build يجب أن ينجح
- ✅ مراجعة كود من شخص آخر
- ❌ **يمنع** Merge مباشر إلى main

#### **التطبيق:**
```yaml
# .github/workflows/pr-checks.yml
name: PR Checks
on: pull_request
jobs:
  checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run test          # ✅ يجب أن ينجح
      - run: npm run lint          # ✅ يجب أن ينجح
      - run: npm run build         # ✅ يجب أن ينجح
      - run: ./scripts/verify-integration.sh  # ✅ يجب أن ينجح
```

#### **الفحص الآلي:**
- GitHub Actions تلقائياً
- Branch Protection Rules

#### **العقوبة:**
- منع Merge تلقائياً
- طلب إصلاح الأخطاء

---

## 🟡 القواعد المهمة (Important Rules)

### **القاعدة 6: التسمية الموحدة**

#### **الإلزام:**
- ✅ استخدام camelCase للمتغيرات والدوال
- ✅ استخدام PascalCase للكلاسات والواجهات
- ✅ استخدام kebab-case لأسماء الملفات
- ✅ استخدام UPPER_SNAKE_CASE للثوابت

#### **التطبيق:**
```typescript
// ✅ صحيح
const userName = 'John';
const MAX_RETRY_COUNT = 3;
class UserService {}
interface UserDto {}

// ❌ خطأ
const UserName = 'John';
const maxRetryCount = 3;
class userService {}
interface user_dto {}
```

#### **الفحص الآلي:**
```bash
npm run lint
```

---

### **القاعدة 7: التوثيق الإلزامي**

#### **الإلزام:**
- ✅ كل دالة عامة يجب أن تحتوي على JSDoc
- ✅ كل كلاس يجب أن يحتوي على وصف
- ✅ كل API endpoint يجب أن يحتوي على Swagger decorator

#### **التطبيق:**
```typescript
/**
 * Creates a new user in the system
 * @param createUserDto - User creation data
 * @returns Created user with generated ID
 * @throws BadRequestException if email already exists
 */
@ApiOperation({ summary: 'Create new user' })
@ApiResponse({ status: 201, description: 'User created successfully', type: UserDto })
@ApiResponse({ status: 400, description: 'Invalid input' })
async createUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
  // ...
}
```

---

### **القاعدة 8: الاختبارات إلزامية**

#### **الإلزام:**
- ✅ كل service يجب أن يحتوي على unit tests
- ✅ كل controller يجب أن يحتوي على integration tests
- ✅ Coverage لا يقل عن 80%

#### **التطبيق:**
```typescript
// users.service.spec.ts
describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();
    service = module.get<UsersService>(UsersService);
  });

  it('should create user', async () => {
    const dto: CreateUserDto = { email: 'test@example.com' };
    const result = await service.create(dto);
    expect(result).toBeDefined();
    expect(result.email).toBe(dto.email);
  });
});
```

#### **الفحص الآلي:**
```bash
npm run test:cov
# Coverage threshold: 80%
```

---

### **القاعدة 9: Git Workflow الصارم**

#### **الإلزام:**
- ✅ فرع `main` محمي - لا commits مباشرة
- ✅ جميع التغييرات عبر Pull Requests
- ✅ تسمية الفروع: `feature/`, `fix/`, `refactor/`
- ✅ Commit messages واضحة ومفصلة

#### **التطبيق:**
```bash
# ✅ صحيح
git checkout -b feature/add-billing-service
git commit -m "feat(billing): add invoice generation service

- Implemented InvoiceService with PDF generation
- Added unit tests with 95% coverage
- Updated API documentation
- PHASE-2.2.1"

# ❌ خطأ
git checkout -b my-changes
git commit -m "updates"
```

#### **الفحص الآلي:**
```yaml
# .github/workflows/commit-lint.yml
- uses: wagoid/commitlint-github-action@v5
```

---

### **القاعدة 10: المزامنة اليومية**

#### **الإلزام:**
- ✅ Push يومي على الأقل
- ✅ تحديث `PROGRESS_TRACKER.md` يومياً
- ✅ مزامنة مع main قبل البدء بالعمل

#### **التطبيق:**
```bash
# كل صباح
git checkout main
git pull origin main
git checkout feature/my-feature
git rebase main

# كل مساء
git add .
git commit -m "chore: daily progress update"
git push origin feature/my-feature

# تحديث PROGRESS_TRACKER.md
echo "## $(date +%Y-%m-%d)" >> PROGRESS_TRACKER.md
echo "- ✅ Completed task X" >> PROGRESS_TRACKER.md
```

---

## 🟢 القواعد الموصى بها (Recommended Rules)

### **القاعدة 11: الأداء والتحسين**

- استخدام Caching حيثما أمكن
- تحسين الاستعلامات (Query Optimization)
- Lazy Loading للبيانات الكبيرة
- Pagination للقوائم

---

### **القاعدة 12: الأمان**

- عدم تخزين Secrets في الكود
- استخدام Environment Variables
- Validation لجميع المدخلات
- Authentication & Authorization لجميع APIs

---

### **القاعدة 13: قابلية الصيانة**

- DRY (Don't Repeat Yourself)
- SOLID Principles
- Clean Code
- Refactoring مستمر

---

## 🔧 أدوات الفحص الآلي

### **1. Pre-commit Hooks**

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Check for PHASE comments
echo "🔍 Checking for PHASE comments..."
./scripts/check-phase-comments.sh || exit 1

# Run linting
echo "🔍 Running linter..."
npm run lint || exit 1

# Run tests
echo "🧪 Running tests..."
npm run test || exit 1

echo "✅ All checks passed!"
```

### **2. Pre-push Hooks**

```bash
# .husky/pre-push
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Check contracts version
echo "🔍 Checking contracts version..."
./scripts/check-contracts-version.sh || exit 1

# Verify integration
echo "🔍 Verifying integration..."
./scripts/verify-integration.sh || exit 1

echo "✅ Ready to push!"
```

### **3. GitHub Actions**

```yaml
# .github/workflows/strict-checks.yml
name: Strict Checks
on: [push, pull_request]
jobs:
  enforce-rules:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Check contracts version
        run: ./scripts/check-contracts-version.sh
      
      - name: Check for local DTOs
        run: ./scripts/verify-no-local-dtos.sh
      
      - name: Check layer architecture
        run: ./scripts/verify-layer-architecture.sh
      
      - name: Check PHASE comments
        run: ./scripts/check-phase-comments.sh
      
      - name: Run tests
        run: npm run test:cov
      
      - name: Check coverage
        run: |
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "❌ Coverage is below 80%: $COVERAGE%"
            exit 1
          fi
```

---

## 📊 مؤشرات الالتزام

### **يومي:**
- [ ] جميع Commits تحتوي على PHASE comments
- [ ] جميع Tests تمر
- [ ] Linting ينجح
- [ ] PROGRESS_TRACKER محدث

### **أسبوعي:**
- [ ] Coverage أعلى من 80%
- [ ] لا توجد DTOs محلية
- [ ] جميع المستودعات على نفس إصدار العقود
- [ ] البنية الطبقية مطبقة 100%

### **شهري:**
- [ ] Documentation كامل
- [ ] Performance Tests تمر
- [ ] Security Audit نظيف
- [ ] Refactoring Debt منخفض

---

## ⚠️ العقوبات

### **مخالفة القواعد الحرجة:**
1. رفض Pull Request تلقائياً
2. منع Merge
3. طلب إعادة كتابة الكود
4. تنبيه الفريق

### **مخالفة القواعد المهمة:**
1. تحذير في PR
2. طلب إصلاح
3. مراجعة إضافية

### **مخالفة القواعد الموصى بها:**
1. ملاحظة في PR
2. اقتراح تحسين

---

## 🎯 الالتزام

**بتوقيعي على هذا المستند، أتعهد بـ:**

1. ✅ الالتزام بجميع القواعد الحرجة بدون استثناء
2. ✅ بذل أقصى جهد للالتزام بالقواعد المهمة
3. ✅ مراعاة القواعد الموصى بها قدر الإمكان
4. ✅ المساهمة في تحسين هذه القواعد
5. ✅ الإبلاغ عن أي مخالفات

**التوقيع الرقمي:**
```
Repository: SEMOP
Date: 2025-12-03
Commit: [سيتم إضافته عند التطبيق]
```

---

## 📞 الإبلاغ عن المشاكل

إذا واجهت أي صعوبة في تطبيق هذه القواعد:

1. افتح Issue في مستودع SEMOP
2. استخدم Label: `strict-rules`
3. اشرح المشكلة بالتفصيل
4. اقترح حلاً إن أمكن

---

## 🔄 تحديث القواعد

هذه القواعد قابلة للتحديث بناءً على:
- التجربة العملية
- التحديات المواجهة
- أفضل الممارسات الجديدة

**عملية التحديث:**
1. اقتراح التعديل في Issue
2. مناقشة مع الفريق
3. موافقة جماعية
4. تحديث المستند
5. إشعار جميع المطورين

---

**آخر تحديث:** 3 ديسمبر 2025  
**الإصدار:** 1.0  
**الحالة:** نشط وإلزامي
