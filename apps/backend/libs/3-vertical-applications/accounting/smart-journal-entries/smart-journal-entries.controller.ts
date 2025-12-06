// PHASE: DTO_QUALITY_FIX
// PHASE-15: Smart Journal Entries System - Controller
// This controller exposes REST API endpoints for smart journal entries

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  CreateJournalEntryTemplateDto,
  UpdateJournalEntryTemplateDto,
  CreateJournalEntryFromTemplateDto,
  CreateJournalEntryFromOperationDto,
  ValidateJournalEntryDto,
  AccountSuggestionRequestDto,
  RecordUsageDto,
} from '@semop/contracts';
import { JournalEntryTemplateService } from './journal-entry-template.service';
import { SmartJournalEntryService } from './smart-journal-entry.service';
import { SmartLearningService } from './smart-learning.service';
// import { SmartJournalEntryStatsDto } from '@semop/contracts'; // Added DTO for swagger - removed temporarily

@Controller('smart-journal-entries')
export class SmartJournalEntriesController {
  constructor(
    private readonly templateService: JournalEntryTemplateService,
    private readonly smartEntryService: SmartJournalEntryService,
    private readonly learningService: SmartLearningService,
  ) {}

  // ============================================
  // Template Management
  // ============================================

  @Post('templates')
  @HttpCode(HttpStatus.CREATED)
  async createTemplate(@Body() dto: CreateJournalEntryTemplateDto) {
    return this.templateService.create(dto);
  }

  @Get('templates')
  async getAllTemplates() {
    return this.templateService.findAll();
  }

  @Get('templates/:id')
  async getTemplate(@Param('id') id: string) {
    return this.templateService.findOne(id);
  }

  @Get('templates/by-operation/:operationType')
  async getTemplateByOperationType(@Param('operationType') operationType: string) {
    return this.templateService.findByOperationType(operationType);
  }

  @Patch('templates/:id')
  async updateTemplate(
    @Param('id') id: string,
    @Body() dto: UpdateJournalEntryTemplateDto,
  ) {
    return this.templateService.update(id, dto);
  }

  @Delete('templates/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTemplate(@Param('id') id: string) {
    await this.templateService.delete(id);
  }

  @Post('templates/:id/clone')
  @HttpCode(HttpStatus.CREATED)
  async cloneTemplate(
    @Param('id') id: string,
    @Body() body: { code: string; nameAr: string; nameEn: string },
  ) {
    return this.templateService.clone(id, body.code, body.nameAr, body.nameEn);
  }

  // ============================================
  // Smart Journal Entry Creation
  // ============================================

  @Post('from-template')
  @HttpCode(HttpStatus.CREATED)
  async createFromTemplate(@Body() dto: CreateJournalEntryFromTemplateDto) {
    return this.smartEntryService.createFromTemplate(dto);
  }

  @Post('from-operation')
  @HttpCode(HttpStatus.CREATED)
  async createFromOperation(@Body() dto: CreateJournalEntryFromOperationDto) {
    return this.smartEntryService.createFromOperation(dto);
  }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  async validateJournalEntry(@Body() dto: ValidateJournalEntryDto) {
    return this.smartEntryService.validateJournalEntry(dto);
  }

  // ============================================
  // Smart Learning & Suggestions
  // ============================================

  @Post('suggest-accounts')
  @HttpCode(HttpStatus.OK)
  async suggestAccounts(@Body() dto: AccountSuggestionRequestDto) {
    return this.learningService.getSuggestedAccounts(dto);
  }

  @Post('record-usage')
  @HttpCode(HttpStatus.NO_CONTENT)
  async recordUsage(@Body() dto: RecordUsageDto) {
    await this.learningService.recordUsage(dto);
  }

  @Get('usage-statistics/:accountId')
  async getUsageStatistics(@Param('accountId') accountId: string) {
    return this.learningService.getUsageStatistics(accountId);
  }

  @Delete('learning-data/:operationType')
  @HttpCode(HttpStatus.NO_CONTENT)
  async clearLearningData(@Param('operationType') operationType: string) {
    await this.learningService.clearLearningData(operationType);
  }

  @Delete('learning-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  async clearAllLearningData() {
    await this.learningService.clearAllLearningData();
  }

  // ============================================
  // Statistics
  // ============================================

  @Get('stats')
  async getStats(): Promise<any> {
    return this.smartEntryService.getStats();
  }
}
