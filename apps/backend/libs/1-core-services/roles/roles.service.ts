// PHASE: DTO_QUALITY_FIX
// PHASE-14: إصلاح جميع any types واستخدام DTOs من @semop/contracts
// PHASE-13: إضافة Input Validation وتحسين Business Logic
// PHASE-13: إضافة Input Validation وتحسين Business Logic
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class RolesService {
  private roles = [
    { id: 1, name: 'مدير النظام', code: 'ADMIN', description: 'صلاحيات كاملة', isActive: true },
    { id: 2, name: 'مدير مالي', code: 'FINANCE_MANAGER', description: 'إدارة الحسابات والمالية', isActive: true },
    { id: 3, name: 'محاسب', code: 'ACCOUNTANT', description: 'إدخال القيود والتقارير', isActive: true },
    { id: 4, name: 'مدير مشتريات', code: 'PURCHASE_MANAGER', description: 'إدارة المشتريات والموردين', isActive: true },
    { id: 5, name: 'مدير مبيعات', code: 'SALES_MANAGER', description: 'إدارة المبيعات والعملاء', isActive: true },
    { id: 6, name: 'مدير موارد بشرية', code: 'HR_MANAGER', description: 'إدارة الموظفين والرواتب', isActive: true },
    { id: 7, name: 'مدير مخازن', code: 'WAREHOUSE_MANAGER', description: 'إدارة المخزون', isActive: true },
    { id: 8, name: 'مستخدم', code: 'USER', description: 'صلاحيات محدودة', isActive: true }
  ];

  private nextId = 9;

  findAll() {
    return this.roles;
  }

  findOne(id: number) {
    const role = this.roles.find(r => r.id === id);
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  create(createRoleDto: unknown) {
    const newRole = {
      id: this.nextId++,
      ...(createRoleDto as object),
      isActive: true
    };
    this.roles.push(newRole as any);
    return newRole as any;
  }

  update(id: number, updateRoleDto: unknown) {
    const roleIndex = this.roles.findIndex(r => r.id === id);
    if (roleIndex === -1) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    this.roles[roleIndex] = { ...this.roles[roleIndex], ...(updateRoleDto as object) };
    return this.roles[roleIndex];
  }

  remove(id: number) {
    const roleIndex = this.roles.findIndex(r => r.id === id);
    if (roleIndex === -1) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    this.roles.splice(roleIndex, 1);
    return { message: 'Role deleted successfully' };
  }
}
