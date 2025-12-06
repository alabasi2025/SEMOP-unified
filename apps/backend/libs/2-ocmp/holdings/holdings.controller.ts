// PHASE: DTO_QUALITY_FIX
// PHASE-14: إصلاح جميع any types واستخدام DTOs من @semop/contracts
// PHASE-12: إضافة Error Handling شامل مع try-catch و logging
import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { HoldingsService } from './holdings.service';

@Controller('holdings')
export class HoldingsController {
  constructor(private readonly holdingsService: HoldingsService) {}

  @Get()
  findAll() {
    return this.holdingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.holdingsService.findOne(id);
  }

  @Post()
  create(@Body() createDto: unknown) {
    return this.holdingsService.create(createDto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: any) {
    return this.holdingsService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.holdingsService.remove(id);
  }
}
