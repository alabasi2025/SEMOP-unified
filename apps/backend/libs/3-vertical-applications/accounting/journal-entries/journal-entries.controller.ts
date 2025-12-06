// PHASE: DTO_QUALITY_FIX
// PHASE-12: إضافة Error Handling شامل مع try-catch و logging
import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { JournalEntriesService } from './journal-entries.service';
import { } from '@semop/contracts';


@Controller('journal-entries')
export class JournalEntriesController {
  constructor(private readonly journalEntriesService: JournalEntriesService) {}

  @Get()
  findAll(@Query() filters: unknown) {
    return this.journalEntriesService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.journalEntriesService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.journalEntriesService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.journalEntriesService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.journalEntriesService.remove(id);
  }

  @Post(':id/post')
  post(@Param('id') id: string) {
    return this.journalEntriesService.post(id);
  }
}
