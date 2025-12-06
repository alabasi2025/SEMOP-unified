// PHASE: DTO_QUALITY_FIX
// PHASE-14: إصلاح انتهاكات DTOs واستخدام @semop/contracts
<!--
    ملف: billing.component.html
    الوصف: قالب HTML لمكون إدارة الفواتير (BillingComponent) في تطبيق Angular.
    التقنيات المستخدمة: Angular 20+, PrimeNG 20+
    الهدف: عرض قائمة الفواتير بشكل جدول تفاعلي مع إمكانية البحث، التصفية، وعرض التفاصيل.
-->

<!-- حاوية رئيسية للمكون مع تباعد داخلي (padding) -->
<div class="p-4">
    <!-- عنوان الصفحة -->
    <div class="flex justify-content-between align-items-center mb-4">
        <!-- عنوان رئيسي -->
        <h2 class="text-2xl font-bold text-900">
            <i class="pi pi-file-invoice mr-2"></i>
            إدارة الفواتير
        </h2>
        <!-- زر إضافة فاتورة جديدة (افتراضي، يتطلب منطق في TypeScript) -->
        <p-button
            label="إضافة فاتورة جديدة"
            icon="pi pi-plus"
            styleClass="p-button-success"
            (onClick)="addNewInvoice()"
        ></p-button>
    </div>

    <!--
        بطاقة PrimeNG لتضمين محتوى الجدول
        يستخدم p-card لتوفير تصميم موحد وجميل
    -->
    <p-card header="قائمة الفواتير">
        <!--
            جدول البيانات (DataTable) من PrimeNG
            [value]: مصدر البيانات (يجب أن يكون مصفوفة في ملف TS)
            [paginator]: تفعيل خاصية تقسيم الصفحات
            [rows]: عدد الصفوف المعروضة في كل صفحة
            [showCurrentPageReport]: عرض تقرير الصفحة الحالية
            currentPageReportTemplate: قالب عرض التقرير
            [rowHover]: تفعيل تأثير التمرير على الصفوف
            dataKey: المفتاح الفريد لكل صف (عادةً هو ID)
            [filterDelay]: تأخير تطبيق الفلترة بالمللي ثانية
            [globalFilterFields]: الحقول التي سيتم البحث فيها عند استخدام البحث العام
        -->
        <p-table
            #dt
            [value]="invoices"
            [paginator]="true"
            [rows]="10"
            [showCurrentPageReport]="true"
            currentPageReportTemplate="عرض {first} إلى {last} من أصل {totalRecords} فاتورة"
            [rowHover]="true"
            dataKey="id"
            [filterDelay]="0"
            [globalFilterFields]="['invoiceNumber', 'customerName', 'status', 'totalAmount']"
            styleClass="p-datatable-gridlines"
        >
            <!--
                رأس الجدول (Header)
                يحتوي على شريط الأدوات (Toolbar) وخيارات البحث والتصفية
            -->
            <ng-template pTemplate="caption">
                <div class="flex align-items-center justify-content-between">
                    <!-- حقل البحث العام (Global Filter) -->
                    <span class="p-input-icon-left">
                        <i class="pi pi-search"></i>
                        <!--
                            p-inputtext: حقل إدخال من PrimeNG
                            (input): حدث الإدخال لتطبيق الفلترة
                            dt.filterGlobal($event.target.value, 'contains'): دالة PrimeNG للبحث العام
                        -->
                        <input
                            pInputText
                            type="text"
                            (input)="dt.filterGlobal($event.target.value, 'contains')"
                            placeholder="بحث عام..."
                            class="p-inputtext-sm"
                        />
                    </span>
                    <!-- زر إعادة تحميل البيانات (Refresh) -->
                    <p-button
                        icon="pi pi-refresh"
                        styleClass="p-button-outlined p-button-sm"
                        (onClick)="loadInvoices()"
                        pTooltip="تحديث قائمة الفواتير"
                        tooltipPosition="top"
                    ></p-button>
                </div>
            </ng-template>

            <!--
                رأس الأعمدة (Column Headers)
                يتم تحديد كل عمود باستخدام p-column
            -->
            <ng-template pTemplate="header">
                <tr>
                    <!-- عمود رقم الفاتورة -->
                    <th pSortableColumn="invoiceNumber" style="width: 15%">
                        رقم الفاتورة
                        <p-sortIcon field="invoiceNumber"></p-sortIcon>
                    </th>
                    <!-- عمود اسم العميل -->
                    <th pSortableColumn="customerName" style="width: 25%">
                        اسم العميل
                        <p-sortIcon field="customerName"></p-sortIcon>
                    </th>
                    <!-- عمود تاريخ الإصدار -->
                    <th pSortableColumn="issueDate" style="width: 15%">
                        تاريخ الإصدار
                        <p-sortIcon field="issueDate"></p-sortIcon>
                    </th>
                    <!-- عمود المبلغ الإجمالي -->
                    <th pSortableColumn="totalAmount" style="width: 15%">
                        المبلغ الإجمالي
                        <p-sortIcon field="totalAmount"></p-sortIcon>
                    </th>
                    <!-- عمود حالة الدفع (مع تصفية) -->
                    <th style="width: 15%">
                        الحالة
                        <!--
                            p-columnFilter: لتفعيل تصفية العمود
                            type="text": نوع الفلتر (يمكن أن يكون 'date', 'numeric', 'boolean')
                            field="status": الحقل المراد تصفيته
                        -->
                        <p-columnFilter type="text" field="status"></p-columnFilter>
                    </th>
                    <!-- عمود الإجراءات -->
                    <th style="width: 15%">الإجراءات</th>
                </tr>
            </ng-template>

            <!--
                جسم الجدول (Body)
                يتم تكرار الصفوف باستخدام *ngFor
            -->
            <ng-template pTemplate="body" let-invoice>
                <tr>
                    <!-- رقم الفاتورة -->
                    <td>{{ invoice.invoiceNumber }}</td>
                    <!-- اسم العميل -->
                    <td>{{ invoice.customerName }}</td>
                    <!-- تاريخ الإصدار (تنسيق التاريخ باستخدام pipe) -->
                    <td>{{ invoice.issueDate | date: 'shortDate' }}</td>
                    <!-- المبلغ الإجمالي (تنسيق العملة باستخدام pipe) -->
                    <td>{{ invoice.totalAmount | currency: 'SAR' }}</td>
                    <!-- حالة الدفع (عرض الحالة باستخدام p-tag لتلوينها) -->
                    <td>
                        <p-tag
                            [value]="invoice.status"
                            [severity]="getSeverity(invoice.status)"
                        ></p-tag>
                    </td>
                    <!-- الإجراءات (أزرار لعرض، تعديل، وحذف) -->
                    <td>
                        <!-- زر عرض التفاصيل -->
                        <p-button
                            icon="pi pi-eye"
                            styleClass="p-button-rounded p-button-text p-button-sm"
                            (onClick)="viewInvoiceDetails(invoice.id)"
                            pTooltip="عرض التفاصيل"
                            tooltipPosition="top"
                        ></p-button>
                        <!-- زر التعديل -->
                        <p-button
                            icon="pi pi-pencil"
                            styleClass="p-button-rounded p-button-text p-button-warning p-button-sm"
                            (onClick)="editInvoice(invoice.id)"
                            pTooltip="تعديل الفاتورة"
                            tooltipPosition="top"
                        ></p-button>
                        <!-- زر الحذف -->
                        <p-button
                            icon="pi pi-trash"
                            styleClass="p-button-rounded p-button-text p-button-danger p-button-sm"
                            (onClick)="deleteInvoice(invoice.id)"
                            pTooltip="حذف الفاتورة"
                            tooltipPosition="top"
                        ></p-button>
                    </td>
                </tr>
            </ng-template>

            <!--
                قالب في حالة عدم وجود بيانات
            -->
            <ng-template pTemplate="emptymessage">
                <tr>
                    <td colspan="6" class="text-center">
                        لا توجد فواتير لعرضها.
                    </td>
                </tr>
            </ng-template>
        </p-table>
    </p-card>

    <!--
        حوار (Dialog) من PrimeNG لعرض تفاصيل الفاتورة
        [header]: عنوان الحوار
        [(visible)]: متغير للتحكم في ظهور الحوار (يجب تعريفه في TS)
        [modal]: تفعيل وضع المودال (يمنع التفاعل مع الخلفية)
        [style]: تنسيق CSS للحوار
    -->
    <p-dialog
        header="تفاصيل الفاتورة"
        [(visible)]="displayDetailsDialog"
        [modal]="true"
        [style]="{ width: '50vw' }"
        [draggable]="false"
        [resizable]="false"
    >
        <!--
            عرض تفاصيل الفاتورة المحددة (selectedInvoice)
            يجب أن يتم تعيين قيمة selectedInvoice في ملف TS عند النقر على زر "عرض التفاصيل"
        -->
        <div *ngIf="selectedInvoice">
            <div class="field grid">
                <label class="col-fixed" style="width: 150px">رقم الفاتورة:</label>
                <div class="col">{{ selectedInvoice.invoiceNumber }}</div>
            </div>
            <div class="field grid">
                <label class="col-fixed" style="width: 150px">العميل:</label>
                <div class="col">{{ selectedInvoice.customerName }}</div>
            </div>
            <div class="field grid">
                <label class="col-fixed" style="width: 150px">تاريخ الإصدار:</label>
                <div class="col">{{ selectedInvoice.issueDate | date: 'mediumDate' }}</div>
            </div>
            <div class="field grid">
                <label class="col-fixed" style="width: 150px">المبلغ الإجمالي:</label>
                <div class="col">{{ selectedInvoice.totalAmount | currency: 'SAR' }}</div>
            </div>
            <div class="field grid">
                <label class="col-fixed" style="width: 150px">الحالة:</label>
                <div class="col">
                    <p-tag
                        [value]="selectedInvoice.status"
                        [severity]="getSeverity(selectedInvoice.status)"
                    ></p-tag>
                </div>
            </div>
            <!-- يمكن إضافة المزيد من التفاصيل هنا مثل قائمة الأصناف -->
        </div>

        <!-- أزرار الإجراءات داخل الحوار -->
        <ng-template pTemplate="footer">
            <p-button
                label="إغلاق"
                icon="pi pi-times"
                (onClick)="displayDetailsDialog = false"
                styleClass="p-button-text"
            ></p-button>
        </ng-template>
    </p-dialog>
</div>
