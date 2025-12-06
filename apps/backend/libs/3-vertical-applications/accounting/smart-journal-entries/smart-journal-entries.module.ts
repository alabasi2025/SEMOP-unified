// PHASE: DTO_QUALITY_FIX
// PHASE-15: Smart Journal Entries System - Module
// This module bundles all smart journal entries components

import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../1-core-services/prisma/prisma.module';
import { SmartJournalEntriesController } from './smart-journal-entries.controller';
import { JournalEntryTemplateService } from './journal-entry-template.service';
import { SmartJournalEntryService } from './smart-journal-entry.service';
import { SmartLearningService } from './smart-learning.service';
import { } from '@semop/contracts';


@Module({
  imports: [PrismaModule],
  controllers: [SmartJournalEntriesController],
  providers: [
    JournalEntryTemplateService,
    SmartJournalEntryService,
    SmartLearningService,
  ],
  exports: [
    JournalEntryTemplateService,
    SmartJournalEntryService,
    SmartLearningService,
  ],
})
export class SmartJournalEntriesModule {}
