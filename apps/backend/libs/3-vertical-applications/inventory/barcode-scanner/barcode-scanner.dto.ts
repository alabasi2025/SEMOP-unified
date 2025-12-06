import { IsNotEmpty, IsString } from 'class-validator';

/**
 * كائن نقل البيانات (DTO) لاستقبال الباركود المراد مسحه.
 */
export class BarcodeScanDto {
  @IsString({ message: 'يجب أن يكون الباركود نصًا' })
  @IsNotEmpty({ message: 'يجب إدخال قيمة للباركود' })
  barcode: string;
}

/**
 * كائن نقل البيانات (DTO) لتفاصيل المنتج الذي تم العثور عليه.
 */
export class ItemDetailsDto {
  id: number;
  name: string; // اسم المنتج
  sku: string; // رمز المنتج
  barcode: string; // الباركود
  unitPrice: number; // سعر الوحدة
  quantityInStock: number; // الكمية المتوفرة في المخزون
}
