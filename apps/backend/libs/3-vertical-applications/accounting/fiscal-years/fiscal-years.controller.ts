// PHASE: DTO_QUALITY_FIX
// PHASE-11: إصلاح انتهاكات DTOs والبنية المعمارية - استخدام @semop/contracts
import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { FiscalYearsService } from './fiscal-years.service';

@Controller('fiscal-years')
export class FiscalYearsController {
  constructor(private readonly fiscalYearsService: FiscalYearsService) {}

  @Get()
  findAll() {
    return this.fiscalYearsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fiscalYearsService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.fiscalYearsService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.fiscalYearsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fiscalYearsService.remove(id);
  }

  @Post(':id/close')
  close(@Param('id') id: string) {
    return this.fiscalYearsService.close(id);
  }
}
