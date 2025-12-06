## توثيق الواجهة الأمامية (unified-frontend-monorepo)

**المهمة:** إنشاء قوالب افتراضية للإيرادات.

**التغييرات المفاهيمية:**
1.  **تحديث العقود:** تم تحديث حزمة `@semop/contracts` لتشمل واجهات `RevenueTemplateDto` و `CreateRevenueTemplateDto` و `UpdateRevenueTemplateDto`.
2.  **الخدمة (Service):** يجب إنشاء خدمة `RevenueTemplatesService` في الواجهة الأمامية (Angular) للتفاعل مع نقاط النهاية التالية في الواجهة الخلفية:
    *   `POST /revenue-templates` لإنشاء قالب جديد.
    *   `GET /revenue-templates` لاسترداد جميع القوالب.
    *   `GET /revenue-templates/:id` لاسترداد قالب محدد.
    *   `PATCH /revenue-templates/:id` لتحديث قالب.
    *   `DELETE /revenue-templates/:id` لتعطيل قالب.
3.  **المكونات (Components):**
    *   إنشاء مكون `RevenueTemplateListComponent` لعرض قائمة القوالب.
    *   إنشاء مكون `RevenueTemplateFormComponent` لإنشاء/تعديل قالب.
4.  **التوجيه (Routing):** إضافة مسارات جديدة في وحدة المبيعات (Sales Module) لإدارة القوالب، مثل `/sales/revenue-templates`.

**ملاحظة:** نظرًا لأن المهمة تتطلب التنفيذ المفاهيمي للواجهة الأمامية، فقد تم توثيق الخطوات المطلوبة دون تنفيذ فعلي للكود (Angular Components and HTML/CSS).
