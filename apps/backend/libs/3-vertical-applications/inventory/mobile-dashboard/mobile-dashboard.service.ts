import { Injectable } from '@nestjs/common';
import { MobileDashboardDto } from './mobile-dashboard.dto';

@Injectable()
export class MobileDashboardService {
  /**
   * يحاكي جلب بيانات لوحة التحكم الرئيسية للاستجابة للهواتف المحمولة.
   * @returns بيانات لوحة التحكم.
   */
  getDashboardData(): MobileDashboardDto {
    // في بيئة الإنتاج، سيتم جلب هذه البيانات من قاعدة البيانات أو خدمات أخرى.
    return {
      totalItems: 1500,
      totalWarehouses: 5,
      lowStockItems: 45,
      lastUpdate: new Date().toISOString(),
    };
  }

  /**
   * يحاكي جلب قائمة بأحدث الأنشطة.
   * @returns قائمة بالأنشطة.
   */
  getRecentActivities(): any[] {
    return [
      { id: 1, type: 'إدخال', description: 'تم إدخال 100 وحدة من صنف "هاتف ذكي X"', date: 'منذ 5 دقائق' },
      { id: 2, type: 'إخراج', description: 'تم إخراج 20 وحدة من صنف "كمبيوتر محمول Y"', date: 'منذ ساعة' },
      { id: 3, type: 'جرد', description: 'تم الانتهاء من جرد "المخزن الرئيسي"', date: 'منذ 3 ساعات' },
      { id: 4, type: 'إدخال', description: 'تم إدخال 50 وحدة من صنف "شاحن Z"', date: 'أمس' },
    ];
  }
}
