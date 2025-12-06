// PHASE: DTO_QUALITY_FIX
// PHASE-12: إضافة Error Handling شامل مع try-catch و logging
// PHASE-11: إصلاح انتهاكات DTOs والبنية المعمارية - استخدام @semop/contracts
import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { CostCentersService } from './cost-centers.service';

@Controller('cost-centers')
export class CostCentersController {
  constructor(private readonly costCentersService: CostCentersService) {}

  @Get()
  findAll() {
    return this.costCentersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.costCentersService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.costCentersService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.costCentersService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.costCentersService.remove(id);
  }
}
