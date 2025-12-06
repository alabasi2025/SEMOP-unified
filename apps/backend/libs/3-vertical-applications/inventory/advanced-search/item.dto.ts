// /root/task_outputs/Task2_Advanced_Search_Filters/backend/item.dto.ts
// DTO لتمثيل بيانات الصنف
export class ItemDto {
  id: number;
  nameAr: string;
  code: string;
  category: string;
  currentQuantity: number;
  unitPrice: number;
  status: string;
  lastUpdated: Date;
}
