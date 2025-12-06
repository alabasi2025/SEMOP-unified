#!/bin/bash
# PHASE-0.3.6: Generate daily integration report

set -e

REPORT_FILE="../docs/planning/DAILY_REPORT_$(date +%Y-%m-%d).md"

cat > "$REPORT_FILE" << EOF
# تقرير التكامل اليومي - $(date +%Y-%m-%d)

**التاريخ:** $(date +"%Y-%m-%d %H:%M:%S")

## الفحوصات

### 1. إصدار العقود المشتركة
\`\`\`
$(./check-contracts-version.sh 2>&1 || echo "FAILED")
\`\`\`

### 2. DTOs المحلية
\`\`\`
$(./verify-no-local-dtos.sh 2>&1 || echo "FAILED")
\`\`\`

### 3. البنية الطبقية
\`\`\`
$(./verify-layer-architecture.sh 2>&1 || echo "FAILED")
\`\`\`

### 4. PHASE Comments
\`\`\`
$(./check-phase-comments.sh 2>&1 || echo "FAILED")
\`\`\`

---
**تم الإنشاء تلقائياً**
EOF

echo "✅ Report generated: $REPORT_FILE"
