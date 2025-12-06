// PHASE: DTO_QUALITY_FIX
// PHASE-14: تحسين جودة DTOs - إضافة تعليقات PHASE للتوثيق
// PHASE-11: إصلاح انتهاكات DTOs والبنية المعمارية - استخدام @semop/contracts
import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PricingService } from './pricing.service';

@Controller('pricing')
@ApiTags('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Get('calculate')
  @ApiOperation({ summary: 'حساب السعر بناءً على عدد الجينات النشطة' })
  @ApiQuery({ name: 'count', description: 'عدد الجينات النشطة', example: 10 })
  @ApiResponse({ status: 200, description: 'تفاصيل التسعير' })
  calculatePrice(@Query('count', ParseIntPipe) count: number) {
    return this.pricingService.calculatePrice(count);
  }

  @Get('table')
  @ApiOperation({ summary: 'الحصول على جدول الأسعار الكامل' })
  @ApiResponse({ status: 200, description: 'جدول الأسعار لجميع الجينات' })
  getPricingTable() {
    return this.pricingService.getPricingTable();
  }

  @Get('customer')
  @ApiOperation({ summary: 'حساب السعر لعميل معين' })
  @ApiQuery({ name: 'customerId', description: 'معرف العميل' })
  @ApiResponse({ status: 200, description: 'تفاصيل تسعير العميل' })
  calculatePriceForCustomer(@Query('customerId') customerId: string) {
    return this.pricingService.calculatePriceForCustomer(customerId);
  }
}
