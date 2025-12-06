import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Attachment {
  id: number;
  fileName: string;
  fileSize: string;
  fileType: string;
  uploadedAt: Date;
  uploadedBy: string;
}

@Component({
  selector: 'app-attachments',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">📎 المرفقات</h2>
        <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          رفع ملف جديد
        </button>
      </div>

      <!-- Upload Area -->
      <div class="mb-6 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition">
        <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <p class="mt-2 text-sm text-gray-600">اسحب الملفات هنا أو انقر للاختيار</p>
        <p class="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (حتى 10MB)</p>
      </div>

      <!-- Filters -->
      <div class="mb-4 flex gap-4">
        <select class="border rounded px-3 py-2">
          <option value="all">جميع الأنواع</option>
          <option value="pdf">PDF</option>
          <option value="doc">Word</option>
          <option value="xls">Excel</option>
          <option value="img">صور</option>
        </select>
        <input type="text" placeholder="بحث..." class="border rounded px-3 py-2 flex-1">
      </div>

      <!-- Attachments Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">اسم الملف</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">النوع</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحجم</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">رفع بواسطة</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التاريخ</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">إجراءات</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let attachment of attachments" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span class="text-2xl mr-3">{{ getFileIcon(attachment.fileType) }}</span>
                  <span class="text-sm font-medium text-gray-900">{{ attachment.fileName }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ attachment.fileType.toUpperCase() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ attachment.fileSize }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ attachment.uploadedBy }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(attachment.uploadedAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-blue-600 hover:text-blue-900 ml-3">معاينة</button>
                <button class="text-green-600 hover:text-green-900 ml-3">تحميل</button>
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
export class AttachmentsComponent implements OnInit {
  attachments: Attachment[] = [
    {
      id: 1,
      fileName: 'تقرير_المبيعات_2024.pdf',
      fileSize: '2.5 MB',
      fileType: 'pdf',
      uploadedAt: new Date(),
      uploadedBy: 'أحمد محمد'
    },
    {
      id: 2,
      fileName: 'قائمة_العملاء.xlsx',
      fileSize: '1.2 MB',
      fileType: 'xlsx',
      uploadedAt: new Date(Date.now() - 86400000),
      uploadedBy: 'فاطمة علي'
    },
    {
      id: 3,
      fileName: 'عقد_توريد.docx',
      fileSize: '850 KB',
      fileType: 'docx',
      uploadedAt: new Date(Date.now() - 172800000),
      uploadedBy: 'محمد خالد'
    },
    {
      id: 4,
      fileName: 'شعار_الشركة.png',
      fileSize: '450 KB',
      fileType: 'png',
      uploadedAt: new Date(Date.now() - 259200000),
      uploadedBy: 'سارة أحمد'
    }
  ];

  ngOnInit(): void {}

  getFileIcon(type: string): string {
    const icons: {[key: string]: string} = {
      'pdf': '📄',
      'docx': '📝',
      'doc': '📝',
      'xlsx': '📊',
      'xls': '📊',
      'png': '🖼️',
      'jpg': '🖼️',
      'jpeg': '🖼️'
    };
    return icons[type.toLowerCase()] || '📎';
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
