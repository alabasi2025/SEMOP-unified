import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AuditLog {
  id: number;
  action: string;
  entity: string;
  userId: number;
  userName: string;
  changes: string;
  ipAddress: string;
  createdAt: Date;
}

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">📋 سجلات التدقيق</h2>
        <div class="flex gap-2">
          <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            تصدير Excel
          </button>
          <button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            تصدير PDF
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="mb-4 grid grid-cols-4 gap-4">
        <select class="border rounded px-3 py-2">
          <option value="all">جميع الإجراءات</option>
          <option value="create">إنشاء</option>
          <option value="update">تعديل</option>
          <option value="delete">حذف</option>
          <option value="login">تسجيل دخول</option>
        </select>
        <select class="border rounded px-3 py-2">
          <option value="all">جميع الكيانات</option>
          <option value="user">مستخدم</option>
          <option value="customer">عميل</option>
          <option value="invoice">فاتورة</option>
          <option value="product">منتج</option>
        </select>
        <input type="date" class="border rounded px-3 py-2">
        <input type="text" placeholder="بحث..." class="border rounded px-3 py-2">
      </div>

      <!-- Statistics -->
      <div class="grid grid-cols-4 gap-4 mb-6">
        <div class="bg-blue-50 p-4 rounded-lg">
          <p class="text-sm text-gray-600">إجمالي السجلات</p>
          <p class="text-2xl font-bold text-blue-600">1,234</p>
        </div>
        <div class="bg-green-50 p-4 rounded-lg">
          <p class="text-sm text-gray-600">اليوم</p>
          <p class="text-2xl font-bold text-green-600">45</p>
        </div>
        <div class="bg-yellow-50 p-4 rounded-lg">
          <p class="text-sm text-gray-600">هذا الأسبوع</p>
          <p class="text-2xl font-bold text-yellow-600">312</p>
        </div>
        <div class="bg-purple-50 p-4 rounded-lg">
          <p class="text-sm text-gray-600">هذا الشهر</p>
          <p class="text-2xl font-bold text-purple-600">876</p>
        </div>
      </div>

      <!-- Logs Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجراء</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الكيان</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المستخدم</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التغييرات</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">IP</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التاريخ</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تفاصيل</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let log of auditLogs" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <span [class]="'px-2 py-1 text-xs rounded ' + getActionClass(log.action)">
                  {{ log.action }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ log.entity }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ log.userName }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ log.changes }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ log.ipAddress }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(log.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-blue-600 hover:text-blue-900">عرض</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="mt-6 flex justify-center gap-2">
        <button class="px-3 py-1 border rounded hover:bg-gray-100">السابق</button>
        <button class="px-3 py-1 bg-blue-500 text-white rounded">1</button>
        <button class="px-3 py-1 border rounded hover:bg-gray-100">2</button>
        <button class="px-3 py-1 border rounded hover:bg-gray-100">3</button>
        <button class="px-3 py-1 border rounded hover:bg-gray-100">التالي</button>
      </div>
    </div>
  `,
  styles: []
})
export class AuditLogsComponent implements OnInit {
  auditLogs: AuditLog[] = [
    {
      id: 1,
      action: 'إنشاء',
      entity: 'فاتورة',
      userId: 1,
      userName: 'أحمد محمد',
      changes: 'إنشاء فاتورة جديدة #1234',
      ipAddress: '192.168.1.100',
      createdAt: new Date()
    },
    {
      id: 2,
      action: 'تعديل',
      entity: 'عميل',
      userId: 2,
      userName: 'فاطمة علي',
      changes: 'تحديث بيانات العميل: الاسم، العنوان',
      ipAddress: '192.168.1.101',
      createdAt: new Date(Date.now() - 3600000)
    },
    {
      id: 3,
      action: 'حذف',
      entity: 'منتج',
      userId: 3,
      userName: 'محمد خالد',
      changes: 'حذف منتج: كود 5678',
      ipAddress: '192.168.1.102',
      createdAt: new Date(Date.now() - 7200000)
    },
    {
      id: 4,
      action: 'تسجيل دخول',
      entity: 'مستخدم',
      userId: 1,
      userName: 'أحمد محمد',
      changes: 'تسجيل دخول ناجح',
      ipAddress: '192.168.1.100',
      createdAt: new Date(Date.now() - 10800000)
    }
  ];

  ngOnInit(): void {}

  getActionClass(action: string): string {
    const classes: {[key: string]: string} = {
      'إنشاء': 'bg-green-100 text-green-800',
      'تعديل': 'bg-blue-100 text-blue-800',
      'حذف': 'bg-red-100 text-red-800',
      'تسجيل دخول': 'bg-purple-100 text-purple-800'
    };
    return classes[action] || 'bg-gray-100 text-gray-800';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
