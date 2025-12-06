// PHASE: DTO_QUALITY_FIX
// PHASE-14: إصلاح انتهاكات DTOs واستخدام @semop/contracts
import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  getStats() {
    // في الإنتاج يجب جلب البيانات من قاعدة البيانات
    return {
      usersCount: 5,
      rolesCount: 8,
      customersCount: 125,
      suppliersCount: 87
    };
  }
}
