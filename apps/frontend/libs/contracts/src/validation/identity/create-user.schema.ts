/**
 * مخطط التحقق من صحة البيانات لإنشاء مستخدم جديد
 * يستخدم Zod للتحقق من صحة البيانات قبل إرسالها إلى الخلفية
 * 
 * @created 2025-01-20
 * @phase المرحلة 1: إعداد المستودعات الثلاثة والبنية التحتية الأساسية
 */

import { z } from 'zod';
import { UserRole } from '../../enums/user-role.enum';

/**
 * مخطط Zod للتحقق من بيانات إنشاء مستخدم جديد
 */
export const createUserSchema = z.object({
  /** البريد الإلكتروني - يجب أن يكون صالحاً */
  email: z.string().email({ message: 'البريد الإلكتروني غير صالح' }),

  /** الاسم الأول - على الأقل حرفين */
  firstName: z.string().min(2, { message: 'الاسم الأول يجب أن يكون حرفين على الأقل' }),

  /** الاسم الأخير - على الأقل حرفين */
  lastName: z.string().min(2, { message: 'الاسم الأخير يجب أن يكون حرفين على الأقل' }),

  /** كلمة المرور - على الأقل 8 أحرف */
  password: z.string().min(8, { message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' }),

  /** دور المستخدم - يجب أن يكون من القيم المحددة في UserRole */
  role: z.nativeEnum(UserRole, { message: 'دور المستخدم غير صالح' }),

  /** معرف الكيان الذي سينتمي إليه المستخدم */
  entityId: z.string().uuid({ message: 'معرف الكيان غير صالح' }),

  /** نوع الكيان */
  entityType: z.enum(['holding', 'unit', 'project'], { message: 'نوع الكيان غير صالح' }),
});

/**
 * نوع TypeScript مستخرج من مخطط Zod
 * يستخدم في الواجهة الأمامية والخلفية لضمان التوافق
 */
export type CreateUserDto = z.infer<typeof createUserSchema>;
