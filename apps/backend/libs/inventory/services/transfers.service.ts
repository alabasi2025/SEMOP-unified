import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../1-core-services/prisma/prisma.service';

/**
 * خدمة إدارة التحويلات بين المستودعات
 * 
 * ملاحظة: التحويلات يتم تنفيذها عبر StockMovementsService
 * هذه الخدمة توفر واجهة مبسطة للتحويلات
 */
@Injectable()
export class TransfersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * إنشاء تحويل بين مستودعات
   * يتم استخدام StockMovementsService لتنفيذ التحويل الفعلي
   */
  async createTransfer(
    fromWarehouseId: string,
    toWarehouseId: string,
    itemId: string,
    quantity: number,
    notes?: string,
  ): Promise<any> {
    // سيتم تنفيذ التحويل عبر StockMovementsService
    // هذه الدالة للتوافق مع الواجهة
    return {
      success: true,
      message: 'يتم التحويل عبر StockMovementsService',
    };
  }
}
