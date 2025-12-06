import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Backup {
  id: number;
  fileName: string;
  fileSize: string;
  backupType: string;
  status: string;
  createdAt: Date;
}

@Component({
  selector: 'app-backups',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">💾 النسخ الاحتياطية</h2>
        <div class="flex gap-2">
          <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            إنشاء نسخة احتياطية
          </button>
          <button class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
            جدولة تلقائية
          </button>
        </div>
      </div>

      <!-- Statistics -->
      <div class="grid grid-cols-4 gap-4 mb-6">
        <div class="bg-blue-50 p-4 rounded-lg">
          <p class="text-sm text-gray-600">إجمالي النسخ</p>
          <p class="text-2xl font-bold text-blue-600">24</p>
        </div>
        <div class="bg-green-50 p-4 rounded-lg">
          <p class="text-sm text-gray-600">آخر نسخة</p>
          <p class="text-2xl font-bold text-green-600">اليوم</p>
        </div>
        <div class="bg-yellow-50 p-4 rounded-lg">
          <p class="text-sm text-gray-600">الحجم الإجمالي</p>
          <p class="text-2xl font-bold text-yellow-600">15.8 GB</p>
        </div>
        <div class="bg-purple-50 p-4 rounded-lg">
          <p class="text-sm text-gray-600">الجدولة</p>
          <p class="text-2xl font-bold text-purple-600">يومياً</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="mb-4 flex gap-4">
        <select class="border rounded px-3 py-2">
          <option value="all">جميع الأنواع</option>
          <option value="full">كاملة</option>
          <option value="incremental">تزايدية</option>
          <option value="differential">تفاضلية</option>
        </select>
        <select class="border rounded px-3 py-2">
          <option value="all">جميع الحالات</option>
          <option value="completed">مكتملة</option>
          <option value="in_progress">قيد التنفيذ</option>
          <option value="failed">فاشلة</option>
        </select>
        <input type="date" class="border rounded px-3 py-2">
      </div>

      <!-- Backups Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">اسم الملف</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">النوع</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحجم</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التاريخ</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">إجراءات</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let backup of backups" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span class="text-2xl mr-3">💾</span>
                  <span class="text-sm font-medium text-gray-900">{{ backup.fileName }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                  {{ backup.backupType }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ backup.fileSize }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span [class]="'px-2 py-1 text-xs rounded ' + getStatusClass(backup.status)">
                  {{ backup.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(backup.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-green-600 hover:text-green-900 ml-3">استعادة</button>
                <button class="text-blue-600 hover:text-blue-900 ml-3">تحميل</button>
                <button class="text-red-600 hover:text-red-900">حذف</button>
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
        <button class="px-3 py-1 border rounded hover:bg-gray-100">التالي</button>
      </div>
    </div>
  `,
  styles: []
})
export class BackupsComponent implements OnInit {
  backups: Backup[] = [
    {
      id: 1,
      fileName: 'backup_full_2024_11_27.sql',
      fileSize: '2.8 GB',
      backupType: 'كاملة',
      status: 'مكتملة',
      createdAt: new Date()
    },
    {
      id: 2,
      fileName: 'backup_incremental_2024_11_26.sql',
      fileSize: '450 MB',
      backupType: 'تزايدية',
      status: 'مكتملة',
      createdAt: new Date(Date.now() - 86400000)
    },
    {
      id: 3,
      fileName: 'backup_full_2024_11_20.sql',
      fileSize: '2.5 GB',
      backupType: 'كاملة',
      status: 'مكتملة',
      createdAt: new Date(Date.now() - 604800000)
    },
    {
      id: 4,
      fileName: 'backup_differential_2024_11_15.sql',
      fileSize: '1.2 GB',
      backupType: 'تفاضلية',
      status: 'مكتملة',
      createdAt: new Date(Date.now() - 1036800000)
    }
  ];

  ngOnInit(): void {}

  getStatusClass(status: string): string {
    const classes: {[key: string]: string} = {
      'مكتملة': 'bg-green-100 text-green-800',
      'قيد التنفيذ': 'bg-yellow-100 text-yellow-800',
      'فاشلة': 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
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
