// role_permissions.dto.ts

import { IsInt, IsString, IsOptional } from 'class-validator';

// DTO لإنشاء علاقة جديدة بين الدور والصلاحية
export class CreateRolePermissionDto {
  @IsInt()
  roleId: number;

  @IsInt()
  permissionId: number;

  @IsString()
  assignedBy: string;
}

// DTO لتحديث علاقة الدور والصلاحية.
// بما أن المفتاح الأساسي مركب (roleId, permissionId)، فإن التحديث الفعلي للبيانات
// سيكون محدودًا على الحقول غير المفتاحية. في هذا النموذج، الحقل الوحيد القابل للتحديث
// هو 'assignedBy' (إذا لم يكن هناك حقول أخرى).
// يمكن استخدام هذا DTO لتحديث حقل 'assignedBy' أو لتضمين حقول أخرى إذا أضيفت لاحقًا.
export class UpdateRolePermissionDto {
  @IsOptional()
  @IsString()
  assignedBy?: string;
}
