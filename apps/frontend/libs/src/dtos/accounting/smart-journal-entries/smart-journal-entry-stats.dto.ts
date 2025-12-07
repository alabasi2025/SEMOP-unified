import { IsInt, IsNumber, IsString, IsDateString } from 'class-validator';

export class SmartJournalEntryStatsDto {
  @IsInt()
  totalTemplates: number;

  @IsInt()
  totalAutomatedEntries: number;

  @IsInt()
  totalManualOverrides: number;

  @IsNumber()
  learningSuccessRate: number; // 0.0 to 100.0

  @IsDateString()
  lastLearningUpdate: Date;
}
