# سكريبتات الفحص والتحقق الآلي

**الإصدار:** 1.0  
**تاريخ الإنشاء:** 3 ديسمبر 2025

---

## 📋 نظرة عامة

هذا المستند يحتوي على جميع سكريبتات الفحص والتحقق الآلي المطلوبة لضمان الترابط الحقيقي بين المستودعات الأربعة.

---

## 🔍 السكريبتات الأساسية

### **1. فحص إصدار العقود المشتركة**

```bash
#!/bin/bash
# scripts/check-contracts-version.sh
# PHASE-0.2.2: Verify all repos use same @semop/contracts version

set -e

echo "🔍 Checking @semop/contracts version across all repositories..."

# الألوان للإخراج
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# المسارات
BACKEND_DIR="../unified-backend-monorepo"
FRONTEND_DIR="../unified-frontend-monorepo"

# التحقق من وجود المستودعات
if [ ! -d "$BACKEND_DIR" ]; then
  echo -e "${RED}❌ Backend repository not found at $BACKEND_DIR${NC}"
  exit 1
fi

if [ ! -d "$FRONTEND_DIR" ]; then
  echo -e "${RED}❌ Frontend repository not found at $FRONTEND_DIR${NC}"
  exit 1
fi

# الحصول على الإصدارات
echo "📦 Extracting versions..."

BACKEND_VERSION=$(cd "$BACKEND_DIR" && npm list @semop/contracts --depth=0 2>/dev/null | grep @semop/contracts | awk '{print $2}' | tr -d '@')
FRONTEND_VERSION=$(cd "$FRONTEND_DIR" && npm list @semop/contracts --depth=0 2>/dev/null | grep @semop/contracts | awk '{print $2}' | tr -d '@')

echo "Backend version:  $BACKEND_VERSION"
echo "Frontend version: $FRONTEND_VERSION"

# المقارنة
if [ -z "$BACKEND_VERSION" ]; then
  echo -e "${RED}❌ @semop/contracts not installed in backend${NC}"
  exit 1
fi

if [ -z "$FRONTEND_VERSION" ]; then
  echo -e "${RED}❌ @semop/contracts not installed in frontend${NC}"
  exit 1
fi

if [ "$BACKEND_VERSION" != "$FRONTEND_VERSION" ]; then
  echo -e "${RED}❌ Version mismatch detected!${NC}"
  echo -e "${YELLOW}Backend:  $BACKEND_VERSION${NC}"
  echo -e "${YELLOW}Frontend: $FRONTEND_VERSION${NC}"
  echo ""
  echo "Please update to the same version:"
  echo "  cd $BACKEND_DIR && npm install @semop/contracts@latest"
  echo "  cd $FRONTEND_DIR && npm install @semop/contracts@latest"
  exit 1
fi

echo -e "${GREEN}✅ All repositories use version: $BACKEND_VERSION${NC}"
exit 0
```

**الاستخدام:**
```bash
chmod +x scripts/check-contracts-version.sh
./scripts/check-contracts-version.sh
```

---

### **2. فحص DTOs المحلية**

```bash
#!/bin/bash
# scripts/verify-no-local-dtos.sh
# PHASE-0.2.2: Ensure no local DTOs exist

set -e

echo "🔍 Checking for local DTOs..."

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

BACKEND_DIR="../unified-backend-monorepo"
FRONTEND_DIR="../unified-frontend-monorepo"

# البحث عن DTOs في الخلفية
echo "📦 Checking backend..."
BACKEND_DTOS=$(find "$BACKEND_DIR/apps" "$BACKEND_DIR/libs" -name "*.dto.ts" 2>/dev/null || true)

if [ ! -z "$BACKEND_DTOS" ]; then
  echo -e "${RED}❌ Local DTOs found in backend:${NC}"
  echo "$BACKEND_DTOS"
  echo ""
  echo -e "${YELLOW}Please use @semop/contracts instead${NC}"
  exit 1
fi

# البحث عن interfaces تحتوي على Dto
echo "📦 Checking for Dto interfaces..."
BACKEND_DTO_INTERFACES=$(grep -r "interface.*Dto" --include="*.ts" "$BACKEND_DIR/apps" "$BACKEND_DIR/libs" 2>/dev/null || true)

if [ ! -z "$BACKEND_DTO_INTERFACES" ]; then
  echo -e "${RED}❌ Local Dto interfaces found in backend:${NC}"
  echo "$BACKEND_DTO_INTERFACES"
  echo ""
  echo -e "${YELLOW}Please use @semop/contracts instead${NC}"
  exit 1
fi

# البحث عن enums محلية
echo "📦 Checking for local enums..."
BACKEND_ENUMS=$(grep -r "export enum" --include="*.ts" "$BACKEND_DIR/apps" "$BACKEND_DIR/libs" | grep -v "node_modules" | grep -v "@semop/contracts" || true)

if [ ! -z "$BACKEND_ENUMS" ]; then
  echo -e "${YELLOW}⚠️  Local enums found in backend:${NC}"
  echo "$BACKEND_ENUMS"
  echo ""
  echo -e "${YELLOW}Consider moving to @semop/contracts if shared${NC}"
fi

# البحث عن DTOs في الواجهة
echo "📦 Checking frontend..."
FRONTEND_DTOS=$(find "$FRONTEND_DIR/apps" -name "*.dto.ts" 2>/dev/null || true)

if [ ! -z "$FRONTEND_DTOS" ]; then
  echo -e "${RED}❌ Local DTOs found in frontend:${NC}"
  echo "$FRONTEND_DTOS"
  echo ""
  echo -e "${YELLOW}Please use @semop/contracts instead${NC}"
  exit 1
fi

# البحث عن interfaces في الواجهة
FRONTEND_DTO_INTERFACES=$(grep -r "interface.*Dto" --include="*.ts" "$FRONTEND_DIR/apps" 2>/dev/null || true)

if [ ! -z "$FRONTEND_DTO_INTERFACES" ]; then
  echo -e "${RED}❌ Local Dto interfaces found in frontend:${NC}"
  echo "$FRONTEND_DTO_INTERFACES"
  echo ""
  echo -e "${YELLOW}Please use @semop/contracts instead${NC}"
  exit 1
fi

echo -e "${GREEN}✅ No local DTOs found - all using @semop/contracts${NC}"
exit 0
```

**الاستخدام:**
```bash
chmod +x scripts/verify-no-local-dtos.sh
./scripts/verify-no-local-dtos.sh
```

---

### **3. فحص البنية الطبقية**

```bash
#!/bin/bash
# scripts/verify-layer-architecture.sh
# PHASE-0.2.2: Verify layer architecture compliance

set -e

echo "🔍 Checking layer architecture..."

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

BACKEND_DIR="../unified-backend-monorepo"

# التحقق من عدم وجود services في apps
echo "📦 Checking for services in apps..."
SERVICES_IN_APPS=$(find "$BACKEND_DIR/apps" -name "*service.ts" -not -path "*/node_modules/*" 2>/dev/null || true)

if [ ! -z "$SERVICES_IN_APPS" ]; then
  echo -e "${RED}❌ Services found in apps directory:${NC}"
  echo "$SERVICES_IN_APPS"
  echo ""
  echo -e "${YELLOW}Services should be in libs, not apps${NC}"
  echo -e "${YELLOW}Please move to appropriate lib:${NC}"
  echo "  libs/1-core-services/"
  echo "  libs/2-operational-platform/"
  echo "  libs/3-vertical-applications/"
  echo "  libs/4-sector-libraries/"
  exit 1
fi

# التحقق من عدم وجود repositories في apps
echo "📦 Checking for repositories in apps..."
REPOS_IN_APPS=$(find "$BACKEND_DIR/apps" -name "*repository.ts" -not -path "*/node_modules/*" 2>/dev/null || true)

if [ ! -z "$REPOS_IN_APPS" ]; then
  echo -e "${RED}❌ Repositories found in apps directory:${NC}"
  echo "$REPOS_IN_APPS"
  echo ""
  echo -e "${YELLOW}Repositories should be in libs, not apps${NC}"
  exit 1
fi

# التحقق من وجود الطبقات الأربعة
echo "📦 Checking for layer structure..."

LAYERS=(
  "1-core-services"
  "2-operational-platform"
  "3-vertical-applications"
  "4-sector-libraries"
)

MISSING_LAYERS=()

for LAYER in "${LAYERS[@]}"; do
  if [ ! -d "$BACKEND_DIR/libs/$LAYER" ]; then
    MISSING_LAYERS+=("$LAYER")
  fi
done

if [ ${#MISSING_LAYERS[@]} -gt 0 ]; then
  echo -e "${YELLOW}⚠️  Missing layers:${NC}"
  for LAYER in "${MISSING_LAYERS[@]}"; do
    echo "  - libs/$LAYER"
  done
  echo ""
  echo -e "${YELLOW}Please create missing layers${NC}"
fi

# التحقق من استخدام libs
echo "📦 Checking libs usage..."
LIBS_COUNT=$(find "$BACKEND_DIR/libs" -name "*.ts" -not -path "*/node_modules/*" 2>/dev/null | wc -l)

if [ $LIBS_COUNT -lt 10 ]; then
  echo -e "${YELLOW}⚠️  Only $LIBS_COUNT files in libs${NC}"
  echo -e "${YELLOW}Most business logic should be in libs${NC}"
fi

echo -e "${GREEN}✅ Layer architecture check complete${NC}"
exit 0
```

**الاستخدام:**
```bash
chmod +x scripts/verify-layer-architecture.sh
./scripts/verify-layer-architecture.sh
```

---

### **4. فحص كومنتات PHASE**

```bash
#!/bin/bash
# scripts/check-phase-comments.sh
# PHASE-0.2.2: Verify PHASE comments in modified files

set -e

echo "🔍 Checking for PHASE comments in modified files..."

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# الحصول على الملفات المعدلة
MODIFIED_FILES=$(git diff --name-only --cached --diff-filter=AM | grep -E '\.(ts|js|tsx|jsx)$' || true)

if [ -z "$MODIFIED_FILES" ]; then
  echo -e "${GREEN}✅ No modified files to check${NC}"
  exit 0
fi

echo "📝 Modified files:"
echo "$MODIFIED_FILES"
echo ""

MISSING_PHASE=()

for FILE in $MODIFIED_FILES; do
  if [ -f "$FILE" ]; then
    # البحث عن PHASE comment
    if ! grep -q "PHASE-" "$FILE"; then
      MISSING_PHASE+=("$FILE")
    fi
  fi
done

if [ ${#MISSING_PHASE[@]} -gt 0 ]; then
  echo -e "${RED}❌ Files missing PHASE comments:${NC}"
  for FILE in "${MISSING_PHASE[@]}"; do
    echo "  - $FILE"
  done
  echo ""
  echo -e "${YELLOW}Please add PHASE comments like:${NC}"
  echo "  // PHASE-X.Y.Z: Description of change"
  echo "  or"
  echo "  /**"
  echo "   * PHASE-X.Y.Z: Description of change"
  echo "   */"
  exit 1
fi

echo -e "${GREEN}✅ All modified files have PHASE comments${NC}"
exit 0
```

**الاستخدام:**
```bash
chmod +x scripts/check-phase-comments.sh
./scripts/check-phase-comments.sh
```

---

### **5. فحص التكامل الشامل**

```bash
#!/bin/bash
# scripts/verify-integration.sh
# PHASE-0.2.2: Complete integration verification

set -e

echo "🔍 Running complete integration verification..."

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

FAILED_CHECKS=()

# 1. فحص إصدار العقود
echo -e "${BLUE}[1/5] Checking contracts version...${NC}"
if ! ./scripts/check-contracts-version.sh; then
  FAILED_CHECKS+=("Contracts version mismatch")
fi

# 2. فحص DTOs المحلية
echo -e "${BLUE}[2/5] Checking for local DTOs...${NC}"
if ! ./scripts/verify-no-local-dtos.sh; then
  FAILED_CHECKS+=("Local DTOs found")
fi

# 3. فحص البنية الطبقية
echo -e "${BLUE}[3/5] Checking layer architecture...${NC}"
if ! ./scripts/verify-layer-architecture.sh; then
  FAILED_CHECKS+=("Layer architecture violated")
fi

# 4. تشغيل الاختبارات
echo -e "${BLUE}[4/5] Running tests...${NC}"
cd ../unified-backend-monorepo
if ! npm run test 2>/dev/null; then
  FAILED_CHECKS+=("Backend tests failed")
fi
cd -

cd ../unified-frontend-monorepo
if ! npm run test 2>/dev/null; then
  FAILED_CHECKS+=("Frontend tests failed")
fi
cd -

# 5. فحص البناء
echo -e "${BLUE}[5/5] Checking build...${NC}"
cd ../unified-backend-monorepo
if ! npm run build 2>/dev/null; then
  FAILED_CHECKS+=("Backend build failed")
fi
cd -

cd ../unified-frontend-monorepo
if ! npm run build 2>/dev/null; then
  FAILED_CHECKS+=("Frontend build failed")
fi
cd -

# النتيجة النهائية
echo ""
echo "================================"
echo "  Integration Verification"
echo "================================"

if [ ${#FAILED_CHECKS[@]} -eq 0 ]; then
  echo -e "${GREEN}✅ All checks passed!${NC}"
  echo ""
  echo "The repositories are properly integrated:"
  echo "  ✓ Same contracts version"
  echo "  ✓ No local DTOs"
  echo "  ✓ Layer architecture compliant"
  echo "  ✓ All tests passing"
  echo "  ✓ Build successful"
  exit 0
else
  echo -e "${RED}❌ Integration verification failed${NC}"
  echo ""
  echo "Failed checks:"
  for CHECK in "${FAILED_CHECKS[@]}"; do
    echo -e "  ${RED}✗${NC} $CHECK"
  done
  exit 1
fi
```

**الاستخدام:**
```bash
chmod +x scripts/verify-integration.sh
./scripts/verify-integration.sh
```

---

## 🤖 سكريبتات GitHub Actions

### **1. Workflow للفحص التلقائي**

```yaml
# .github/workflows/integration-checks.yml
name: Integration Checks

on:
  push:
    branches: ['**']
  pull_request:
    branches: [main, develop]

jobs:
  verify-integration:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout SEMOP
        uses: actions/checkout@v3
        with:
          path: SEMOP
      
      - name: Checkout shared-contracts-repo
        uses: actions/checkout@v3
        with:
          repository: alabasi2025/shared-contracts-repo
          path: shared-contracts-repo
          token: ${{ secrets.GH_PAT }}
      
      - name: Checkout unified-backend-monorepo
        uses: actions/checkout@v3
        with:
          repository: alabasi2025/unified-backend-monorepo
          path: unified-backend-monorepo
          token: ${{ secrets.GH_PAT }}
      
      - name: Checkout unified-frontend-monorepo
        uses: actions/checkout@v3
        with:
          repository: alabasi2025/unified-frontend-monorepo
          path: unified-frontend-monorepo
          token: ${{ secrets.GH_PAT }}
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22'
      
      - name: Install dependencies
        run: |
          cd unified-backend-monorepo && npm ci
          cd ../unified-frontend-monorepo && npm ci
      
      - name: Check contracts version
        run: |
          cd SEMOP
          ./scripts/check-contracts-version.sh
      
      - name: Check for local DTOs
        run: |
          cd SEMOP
          ./scripts/verify-no-local-dtos.sh
      
      - name: Check layer architecture
        run: |
          cd SEMOP
          ./scripts/verify-layer-architecture.sh
      
      - name: Run backend tests
        run: |
          cd unified-backend-monorepo
          npm run test
      
      - name: Run frontend tests
        run: |
          cd unified-frontend-monorepo
          npm run test
      
      - name: Build backend
        run: |
          cd unified-backend-monorepo
          npm run build
      
      - name: Build frontend
        run: |
          cd unified-frontend-monorepo
          npm run build
      
      - name: Generate integration report
        if: always()
        run: |
          cd SEMOP
          ./scripts/generate-integration-report.sh > integration-report.md
      
      - name: Upload report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: integration-report
          path: SEMOP/integration-report.md
```

---

### **2. Workflow للفحص اليومي**

```yaml
# .github/workflows/daily-audit.yml
name: Daily Integration Audit

on:
  schedule:
    - cron: '0 0 * * *'  # كل يوم منتصف الليل
  workflow_dispatch:  # يمكن تشغيله يدوياً

jobs:
  audit:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout all repos
        uses: actions/checkout@v3
        # ... نفس الخطوات السابقة
      
      - name: Full integration audit
        run: |
          cd SEMOP
          ./scripts/full-integration-audit.sh
      
      - name: Create issue if failed
        if: failure()
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: 'SEMOP',
              title: '⚠️ Daily Integration Audit Failed - ' + new Date().toISOString().split('T')[0],
              body: `## Integration Audit Failed
              
              The daily integration audit has detected issues.
              
              **Date:** ${new Date().toISOString()}
              
              **Action Required:**
              1. Review the workflow logs
              2. Run \`./scripts/verify-integration.sh\` locally
              3. Fix the issues
              4. Push the fixes
              
              **Priority:** High
              `,
              labels: ['critical', 'integration', 'automated']
            })
```

---

## 📊 سكريبت توليد التقرير

```bash
#!/bin/bash
# scripts/generate-integration-report.sh
# PHASE-0.2.2: Generate integration status report

set -e

echo "# Integration Status Report"
echo ""
echo "**Generated:** $(date)"
echo "**Repository:** SEMOP"
echo ""

echo "## Summary"
echo ""

# فحص إصدار العقود
echo "### Contracts Version"
if ./scripts/check-contracts-version.sh > /dev/null 2>&1; then
  echo "✅ **Status:** All repos use same version"
else
  echo "❌ **Status:** Version mismatch detected"
fi
echo ""

# فحص DTOs
echo "### Local DTOs"
if ./scripts/verify-no-local-dtos.sh > /dev/null 2>&1; then
  echo "✅ **Status:** No local DTOs found"
else
  echo "❌ **Status:** Local DTOs detected"
fi
echo ""

# فحص البنية
echo "### Layer Architecture"
if ./scripts/verify-layer-architecture.sh > /dev/null 2>&1; then
  echo "✅ **Status:** Architecture compliant"
else
  echo "❌ **Status:** Architecture violations found"
fi
echo ""

# الاختبارات
echo "### Tests"
cd ../unified-backend-monorepo
if npm run test > /dev/null 2>&1; then
  echo "✅ **Backend:** All tests passing"
else
  echo "❌ **Backend:** Tests failing"
fi
cd -

cd ../unified-frontend-monorepo
if npm run test > /dev/null 2>&1; then
  echo "✅ **Frontend:** All tests passing"
else
  echo "❌ **Frontend:** Tests failing"
fi
cd -

echo ""
echo "## Detailed Metrics"
echo ""

# إحصائيات
echo "### Code Statistics"
echo ""
echo "| Repository | Files | Lines of Code |"
echo "|------------|-------|---------------|"

BACKEND_FILES=$(find ../unified-backend-monorepo -name "*.ts" -not -path "*/node_modules/*" | wc -l)
BACKEND_LINES=$(find ../unified-backend-monorepo -name "*.ts" -not -path "*/node_modules/*" -exec wc -l {} + | tail -1 | awk '{print $1}')

FRONTEND_FILES=$(find ../unified-frontend-monorepo -name "*.ts" -not -path "*/node_modules/*" | wc -l)
FRONTEND_LINES=$(find ../unified-frontend-monorepo -name "*.ts" -not -path "*/node_modules/*" -exec wc -l {} + | tail -1 | awk '{print $1}')

echo "| Backend | $BACKEND_FILES | $BACKEND_LINES |"
echo "| Frontend | $FRONTEND_FILES | $FRONTEND_LINES |"

echo ""
echo "---"
echo ""
echo "*This report was generated automatically by the integration verification system.*"
```

**الاستخدام:**
```bash
chmod +x scripts/generate-integration-report.sh
./scripts/generate-integration-report.sh > integration-report.md
```

---

## 🔧 إعداد Husky Hooks

### **تثبيت Husky:**

```bash
# في كل مستودع
npm install --save-dev husky
npx husky install
```

### **Pre-commit Hook:**

```bash
#!/bin/sh
# .husky/pre-commit

echo "🔍 Running pre-commit checks..."

# PHASE comments
if ! ./scripts/check-phase-comments.sh; then
  echo "❌ Pre-commit failed: Missing PHASE comments"
  exit 1
fi

# Linting
if ! npm run lint; then
  echo "❌ Pre-commit failed: Linting errors"
  exit 1
fi

# Tests
if ! npm run test; then
  echo "❌ Pre-commit failed: Tests failing"
  exit 1
fi

echo "✅ Pre-commit checks passed!"
```

### **Pre-push Hook:**

```bash
#!/bin/sh
# .husky/pre-push

echo "🔍 Running pre-push checks..."

# Integration verification
if ! ../../SEMOP/scripts/verify-integration.sh; then
  echo "❌ Pre-push failed: Integration check failed"
  exit 1
fi

echo "✅ Pre-push checks passed!"
```

---

## 📝 ملخص السكريبتات

| السكريبت | الغرض | متى يُستخدم |
|----------|-------|-------------|
| `check-contracts-version.sh` | فحص توحيد إصدار العقود | قبل كل push |
| `verify-no-local-dtos.sh` | منع DTOs محلية | قبل كل commit |
| `verify-layer-architecture.sh` | فحص البنية الطبقية | قبل كل push |
| `check-phase-comments.sh` | التأكد من التوثيق | قبل كل commit |
| `verify-integration.sh` | فحص شامل | قبل كل merge |
| `generate-integration-report.sh` | توليد تقرير | يومياً |

---

**آخر تحديث:** 3 ديسمبر 2025  
**الإصدار:** 1.0
