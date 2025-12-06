# توثيق الإجراء المخزن: `post_journal_entry`

## الهدف
تم إنشاء هذا الإجراء المخزن (Function) في قاعدة بيانات PostgreSQL لمعالجة وإدراج قيد يومية (Journal Entry) كامل بشكل آلي وفعال، بما في ذلك التحقق من توازن القيد وتحديث أرصدة الحسابات العامة (GL Accounts) المرتبطة.

يهدف هذا الإجراء إلى:
1. **ضمان سلامة البيانات (Data Integrity):** من خلال التحقق من توازن إجمالي المدين والدائن قبل الإدراج.
2. **تحسين الأداء:** تنفيذ عملية معقدة (إدراج القيد الرئيسي، إدراج سطور القيد، تحديث الأرصدة) في عملية واحدة على مستوى قاعدة البيانات.
3. **تبسيط منطق التطبيق (Backend Logic):** نقل المنطق المعقد إلى قاعدة البيانات.

## تفاصيل الدالة (Function Details)

| الخاصية | القيمة |
| :--- | :--- |
| **الاسم** | `post_journal_entry` |
| **اللغة** | `PL/pgSQL` |
| **المدخلات** | `p_journal_entry_data jsonb` (كائن JSON يمثل بيانات قيد اليومية) |
| **المخرجات** | `TABLE (success BOOLEAN, message TEXT, journal_entry_id INT)` |

### هيكل مدخل JSON (`p_journal_entry_data`)

| الحقل | النوع | الوصف | مثال |
| :--- | :--- | :--- | :--- |
| `entry_date` | `DATE` (string) | تاريخ القيد | `"2025-12-05"` |
| `description` | `TEXT` (string) | وصف القيد | `"دفع إيجار شهري"` |
| `lines` | `JSONB[]` (array) | مصفوفة سطور القيد | `[...]` |

### هيكل سطر القيد (`lines` array element)

| الحقل | النوع | الوصف | مثال |
| :--- | :--- | :--- | :--- |
| `account_code` | `TEXT` (string) | رمز الحساب العام (يجب أن يكون موجوداً في جدول `gl_accounts`) | `"5000"` |
| `debit` | `NUMERIC` (number) | المبلغ المدين | `1000.00` |
| `credit` | `NUMERIC` (number) | المبلغ الدائن | `0.00` |

## منطق العمليات (Business Logic)

1. **التحقق من التوازن:** يتم حساب إجمالي المدين وإجمالي الدائن من مصفوفة السطور (`lines`). إذا لم يتساويا، يتم إرجاع `success: FALSE` مع رسالة خطأ.
2. **إدراج القيد الرئيسي:** يتم إدراج سجل جديد في جدول `journal_entries` وتعيين حالته إلى `Posted`.
3. **معالجة السطور:** يتم التكرار على كل سطر:
    أ. البحث عن `gl_account_id` باستخدام `account_code`. إذا لم يتم العثور عليه، يتم رفع استثناء.
    ب. إدراج سطر جديد في جدول `journal_entry_lines`.
    ج. تحديث حقل `current_balance` في جدول `gl_accounts` بإضافة المدين وطرح الدائن.
4. **النتيجة:** عند النجاح، يتم إرجاع `success: TRUE` ورسالة نجاح و `journal_entry_id` للقيد الجديد.

## مثال على الاستخدام (PostgreSQL)

\`\`\`sql
SELECT * FROM post_journal_entry('
{
    "entry_date": "2025-12-05",
    "description": "Monthly Rent Payment",
    "lines": [
        {"account_code": "5000", "debit": 1000.00, "credit": 0.00},
        {"account_code": "1010", "debit": 0.00, "credit": 1000.00}
    ]
}'::jsonb);
\`\`\`

## التكامل مع NestJS/Prisma

تم محاكاة دمج الدالة في ملف الخدمة التالي:
- \`src/modules/accounting/journal-entry/journal-entry.service.ts\`

يتم استخدام \`this.prisma.$queryRaw\` لاستدعاء الدالة وتمرير كائن JSON كمدخل، مع تحويله إلى نوع \`jsonb\` في استعلام SQL.

\`\`\`typescript
// مقتطف من JournalEntryService
const result: StoredProcedureResult[] = await this.prisma.$queryRaw<StoredProcedureResult[]>\`
  SELECT * FROM post_journal_entry(${jsonPayload}::jsonb);
\`;
\`\`\`
