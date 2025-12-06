// PHASE-15: Smart Journal Entries - Routes
//
// الوصف:
// هذا الملف يحدد مسارات التوجيه (Routes) الخاصة بميزة القيود الذكية (Smart Journal Entries).
//
// المسارات:
// 1. المسار الأساسي ('') يوجه إلى لوحة التحكم (DashboardComponent).
// 2. مسار 'templates' يوجه إلى قائمة القوالب (TemplatesListComponent).
// 3. مسار 'create' يوجه إلى مكون إنشاء قيد ذكي (CreateSmartEntryComponent).
//
// الحالة:
// تم تطوير المسارات بشكل كامل في المرحلة السابقة (PHASE-15) وهي جاهزة للاستخدام.
//
// التغييرات في هذه المهمة:
// - لا توجد تغييرات وظيفية، فقط إضافة توثيق شامل للمسارات.
import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { TemplatesListComponent } from './templates-list.component';
import { CreateSmartEntryComponent } from './create-smart-entry.component';

export const SMART_JOURNAL_ENTRIES_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'templates',
    component: TemplatesListComponent,
  },
  {
    path: 'create',
    component: CreateSmartEntryComponent,
  },
];
