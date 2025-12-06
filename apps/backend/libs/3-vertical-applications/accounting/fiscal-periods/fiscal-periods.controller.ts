// PHASE: DTO_QUALITY_FIX
// PHASE-11: إصلاح انتهاكات DTOs والبنية المعمارية - استخدام @semop/contracts
import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { FiscalPeriodsService } from './fiscal-periods.service';

@Controller('fiscal-periods')
export class FiscalPeriodsController {
  constructor(private readonly fiscalPeriodsService: FiscalPeriodsService) {}

  @Get()
  findAll() {
    return this.fiscalPeriodsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fiscalPeriodsService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.fiscalPeriodsService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.fiscalPeriodsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fiscalPeriodsService.remove(id);
  }

  @Post(':id/close')
  close(@Param('id') id: string, @Body() data: { closedBy: string }) {
    return this.fiscalPeriodsService.close(id, data.closedBy);
  }
}
