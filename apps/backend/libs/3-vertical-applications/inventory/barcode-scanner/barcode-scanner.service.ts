import { Injectable, NotFoundException } from '@nestjs/common';
import { BarcodeScanDto, ItemDetailsDto } from './barcode-scanner.dto';

/**
 * خدمة معالجة عمليات ماسح الباركود والبحث عن المنتجات.
 */
@Injectable()
export class BarcodeScannerService {
  // بيانات وهمية للمنتجات - يجب استبدالها بالاتصال بقاعدة البيانات
  private readonly mockItems: ItemDetailsDto[] = [
    {
      id: 101,
      name: 'كمبيوتر محمول - طراز X',
      sku: 'LAP-X101',
      barcode: '123456789012',
      unitPrice: 3500.0,
      quantityInStock: 15,
    },
    {
      id: 102,
      name: 'شاشة عرض 27 بوصة',
      sku: 'MON-27',
      barcode: '987654321098',
      unitPrice: 1200.0,
      quantityInStock: 40,
    },
    {
      id: 103,
      name: 'طابعة ليزر متعددة الوظائف',
      sku: 'PRN-MLT',
      barcode: '112233445566',
      unitPrice: 850.0,
      quantityInStock: 22,
    },
  ];

  /**
   * البحث عن تفاصيل المنتج باستخدام الباركود.
   * @param barcodeScanDto كائن يحتوي على الباركود المراد البحث عنه.
   * @returns تفاصيل المنتج.
   */
  async scanBarcode(barcodeScanDto: BarcodeScanDto): Promise<ItemDetailsDto> {
    const { barcode } = barcodeScanDto;

    // محاكاة عملية البحث في قاعدة البيانات
    const item = this.mockItems.find((i) => i.barcode === barcode);

    if (!item) {
      throw new NotFoundException(
        `لم يتم العثور على منتج بالباركود: ${barcode}`,
      );
    }

    return item;
  }
}
