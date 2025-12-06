import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// هذا الكيان هو مثال لتمثيل نتيجة تقرير في قاعدة البيانات إذا لزم الأمر،
// ولكن في سياق التقارير، غالبًا ما تكون الكيانات هي كيانات المخزون والمبيعات الأصلية.
// سنستخدم هذا كنموذج لبيانات الخرج.

export class InventorySummaryReportEntity {
  itemName: string;
  totalQuantity: number;
  totalValue: number;
  lastUpdate: string;
}

export class SalesByItemReportEntity {
  itemName: string;
  salesQuantity: number;
  salesRevenue: number;
  period: string;
}

export class StockMovementReportEntity {
  date: string;
  itemName: string;
  movementType: 'إدخال' | 'إخراج';
  quantity: number;
  source?: string;
  destination?: string;
}
