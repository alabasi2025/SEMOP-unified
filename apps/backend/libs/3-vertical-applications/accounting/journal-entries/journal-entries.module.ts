// PHASE: DTO_QUALITY_FIX
import { Module } from '@nestjs/common';
import { JournalEntriesController } from './journal-entries.controller';
import { JournalEntriesService } from './journal-entries.service';
import { } from '@semop/contracts';


@Module({
  controllers: [JournalEntriesController],
  providers: [JournalEntriesService],
  exports: [JournalEntriesService]
})
export class JournalEntriesModule {}
