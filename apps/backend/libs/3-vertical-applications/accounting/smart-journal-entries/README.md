# نظام القيود الذكية (Smart Journal Entries System)

## نظرة عامة

نظام القيود الذكية هو نظام محاسبي متقدم يقوم بإنشاء القيود المحاسبية (Journal Entries) تلقائياً بناءً على العمليات التي تتم في النظام، مع القدرة على التعلم من العمليات السابقة واقتراح الحسابات المناسبة.

## المكونات

### 1. Services

- **JournalEntryTemplateService:** إدارة قوالب القيود
- **SmartJournalEntryService:** إنشاء القيود الذكية والتحقق منها
- **SmartLearningService:** التعلم الذكي واقتراح الحسابات

### 2. Controller

- **SmartJournalEntriesController:** REST API endpoints

### 3. Database Models

- **JournalEntryTemplate:** قوالب القيود
- **JournalEntryTemplateLine:** سطور قوالب القيود
- **SmartLearningLog:** سجل التعلم الذكي
- **AutomatedJournalEntry:** القيود التلقائية

## API Endpoints

### Templates

```
POST   /api/smart-journal-entries/templates
GET    /api/smart-journal-entries/templates
GET    /api/smart-journal-entries/templates/:id
GET    /api/smart-journal-entries/templates/by-operation/:operationType
PATCH  /api/smart-journal-entries/templates/:id
DELETE /api/smart-journal-entries/templates/:id
POST   /api/smart-journal-entries/templates/:id/clone
```

### Smart Entry Creation

```
POST   /api/smart-journal-entries/from-template
POST   /api/smart-journal-entries/from-operation
POST   /api/smart-journal-entries/validate
```

### Learning & Suggestions

```
POST   /api/smart-journal-entries/suggest-accounts
POST   /api/smart-journal-entries/record-usage
GET    /api/smart-journal-entries/usage-statistics/:accountId
DELETE /api/smart-journal-entries/learning-data/:operationType
DELETE /api/smart-journal-entries/learning-data
```

## أمثلة الاستخدام

### 1. إنشاء قالب قيد

```typescript
POST /api/smart-journal-entries/templates
{
  "code": "SALES_CASH",
  "nameAr": "مبيعات نقدية",
  "nameEn": "Cash Sales",
  "operationType": "sales_invoice",
  "lines": [
    {
      "lineOrder": 1,
      "accountType": "debit",
      "accountPlaceholder": "cash_account",
      "amountSource": "totalAmount",
      "descriptionTemplate": "مبيعات نقدية - {{customerName}}"
    },
    {
      "lineOrder": 2,
      "accountType": "credit",
      "accountId": "sales-account-id",
      "amountSource": "totalAmount",
      "descriptionTemplate": "مبيعات نقدية - {{customerName}}"
    }
  ]
}
```

### 2. إنشاء قيد من قالب

```typescript
POST /api/smart-journal-entries/from-template
{
  "templateId": "template-id",
  "sourceData": {
    "cashAccountId": "cash-account-id",
    "totalAmount": 1000,
    "customerName": "أحمد محمد",
    "sourceType": "sales_invoice",
    "sourceId": "invoice-id"
  },
  "entryDate": "2025-12-05",
  "description": "مبيعات نقدية"
}
```

### 3. إنشاء قيد من عملية (تلقائي)

```typescript
POST /api/smart-journal-entries/from-operation
{
  "operationType": "sales_invoice",
  "sourceType": "sales_invoice",
  "sourceId": "invoice-id",
  "sourceData": {
    "cashAccountId": "cash-account-id",
    "totalAmount": 1000,
    "customerName": "أحمد محمد"
  },
  "entryDate": "2025-12-05"
}
```

### 4. اقتراح حسابات ذكية

```typescript
POST /api/smart-journal-entries/suggest-accounts
{
  "operationType": "sales_invoice",
  "contextType": "cash_account",
  "contextId": "cash-account-id",
  "limit": 5
}

// Response:
[
  {
    "accountId": "account-1",
    "accountCode": "1010",
    "accountNameAr": "الصندوق",
    "accountNameEn": "Cash",
    "usageCount": 150,
    "lastUsedAt": "2025-12-05T10:00:00Z",
    "confidence": 100
  },
  ...
]
```

### 5. التحقق من قيد

```typescript
POST /api/smart-journal-entries/validate
{
  "lines": [
    {
      "accountId": "account-1",
      "debit": 1000,
      "credit": 0
    },
    {
      "accountId": "account-2",
      "debit": 0,
      "credit": 1000
    }
  ],
  "entryDate": "2025-12-05"
}

// Response:
{
  "isValid": true,
  "errors": [],
  "warnings": [],
  "totalDebit": 1000,
  "totalCredit": 1000,
  "isBalanced": true
}
```

## قوالب افتراضية

يتضمن النظام قوالب افتراضية للعمليات الشائعة:

1. **مبيعات نقدية** (SALES_CASH)
2. **مبيعات آجلة** (SALES_CREDIT)
3. **مشتريات نقدية** (PURCHASE_CASH)
4. **مشتريات آجلة** (PURCHASE_CREDIT)
5. **صرف رواتب** (PAYROLL_PAYMENT)
6. **صرف من مخزون** (INVENTORY_ISSUE)

## التكامل مع الأنظمة الأخرى

يمكن ربط نظام القيود الذكية مع:

- نظام المبيعات (Sales)
- نظام المشتريات (Purchases)
- نظام الرواتب (Payroll)
- نظام المخزون (Inventory)
- أي نظام آخر يحتاج لإنشاء قيود محاسبية

## الحالة

✅ Backend مكتمل
⏳ Frontend قيد التطوير
⏳ الاختبار قيد التنفيذ

---

**المطور:** Manus AI
**التاريخ:** 2025-12-05
**الإصدار:** 1.0.0
