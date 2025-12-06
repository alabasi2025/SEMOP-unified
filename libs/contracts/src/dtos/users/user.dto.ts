// user.dto.ts

import { IsInt, IsString, IsEmail, Min, Max, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * @description كائن نقل البيانات (DTO) لتمثيل معلومات المستخدم.
 * يستخدم للتحقق من صحة البيانات الواردة وضمان سلامة الأنواع.
 */
export class UserDto {
  /**
   * @description المعرف الفريد للمستخدم. يجب أن يكون عددًا صحيحًا موجبًا.
   * @example 1
   */
  @IsNotEmpty({ message: 'معرف المستخدم مطلوب.' })
  @IsInt({ message: 'معرف المستخدم يجب أن يكون عددًا صحيحًا.' })
  @IsPositive({ message: 'معرف المستخدم يجب أن يكون عددًا موجبًا.' })
  @Type(() => Number)
  id: number;

  /**
   * @description الاسم الأول للمستخدم. يجب أن يكون سلسلة نصية غير فارغة.
   * @example "أحمد"
   */
  @IsNotEmpty({ message: 'الاسم الأول مطلوب.' })
  @IsString({ message: 'الاسم الأول يجب أن يكون سلسلة نصية.' })
  firstName: string;

  /**
   * @description الاسم الأخير للمستخدم. يجب أن يكون سلسلة نصية غير فارغة.
   * @example "محمد"
   */
  @IsNotEmpty({ message: 'الاسم الأخير مطلوب.' })
  @IsString({ message: 'الاسم الأخير يجب أن يكون سلسلة نصية.' })
  lastName: string;

  /**
   * @description البريد الإلكتروني للمستخدم. يجب أن يكون بتنسيق بريد إلكتروني صالح.
   * @example "ahmed.mohamed@example.com"
   */
  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب.' })
  @IsEmail({}, { message: 'البريد الإلكتروني يجب أن يكون بتنسيق صالح.' })
  @IsString({ message: 'البريد الإلكتروني يجب أن يكون سلسلة نصية.' })
  email: string;

  /**
   * @description عمر المستخدم. يجب أن يكون عددًا صحيحًا بين 18 و 99.
   * @example 30
   */
  @IsOptional()
  @IsInt({ message: 'العمر يجب أن يكون عددًا صحيحًا.' })
  @Min(18, { message: 'يجب أن يكون عمر المستخدم 18 عامًا على الأقل.' })
  @Max(99, { message: 'يجب أن لا يتجاوز عمر المستخدم 99 عامًا.' })
  @Type(() => Number)
  age?: number;
}
