import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { BarcodeScannerService } from './barcode-scanner.service';
import { BarcodeScanDto, ItemDetailsDto } from './barcode-scanner.dto';

/**
 * وحدة التحكم (Controller) لمعالجة طلبات ماسح الباركود.
 */
@Controller('barcode-scanner')
export class BarcodeScannerController {
  constructor(
    private readonly barcodeScannerService: BarcodeScannerService,
  ) {}

  /**
   * نقطة نهاية (Endpoint) لمسح الباركود والبحث عن المنتج.
   * @param barcodeScanDto كائن يحتوي على الباركود.
   * @returns تفاصيل المنتج.
   */
  @Post('scan')
  @UsePipes(new ValidationPipe({ transform: true }))
  async scanBarcode(
    @Body() barcodeScanDto: BarcodeScanDto,
  ): Promise<ItemDetailsDto> {
    return this.barcodeScannerService.scanBarcode(barcodeScanDto);
  }
}
