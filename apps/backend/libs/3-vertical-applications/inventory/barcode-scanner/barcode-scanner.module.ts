import { Module } from '@nestjs/common';
import { BarcodeScannerController } from './barcode-scanner.controller';
import { BarcodeScannerService } from './barcode-scanner.service';

@Module({
  imports: [],
  controllers: [BarcodeScannerController],
  providers: [BarcodeScannerService],
  exports: [BarcodeScannerService],
})
export class BarcodeScannerModule {}
