/**
 * نموذج بيانات المستخدم (User Data Transfer Object)
 * يستخدم لنقل بيانات المستخدم بين الواجهة الأمامية والخلفية
 * 
 * @created 2025-01-20
 * @phase المرحلة 1: إعداد المستودعات الثلاثة والبنية التحتية الأساسية
 */

import { UserRole } from '../../enums/user-role.enum';

export interface UserDto {
  /** معرف المستخدم الفريد (UUID) */
  id: string;

  /** البريد الإلكتروني (يستخدم لتسجيل الدخول) */
  email: string;

  /** الاسم الأول */
  firstName: string;

  /** الاسم الأخير */
  lastName: string;

  /** دور المستخدم في النظام */
  role: UserRole;

  /** معرف الكيان الذي ينتمي إليه المستخدم (Holding/Unit/Project) */
  entityId: string;

  /** نوع الكيان (holding, unit, project) */
  entityType: 'holding' | 'unit' | 'project';

  /** هل الحساب نشط؟ */
  isActive: boolean;

  /** تاريخ إنشاء الحساب */
  createdAt: Date;

  /** تاريخ آخر تحديث */
  updatedAt: Date;
}
