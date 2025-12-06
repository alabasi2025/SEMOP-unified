import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString, IsDateString } from 'class-validator';

export class SmartJournalEntryStatsDto {
  @ApiProperty({ description: 'Total number of active journal entry templates.' })
  @IsInt()
  totalTemplates: number;

  @ApiProperty({ description: 'Total number of journal entries created automatically by the system.' })
  @IsInt()
  totalAutomatedEntries: number;

  @ApiProperty({ description: 'Number of times a user manually modified an automated entry.' })
  @IsInt()
  totalManualOverrides: number;

  @ApiProperty({ description: 'Percentage of automated entries that were not manually overridden (Success Rate).' })
  @IsNumber()
  learningSuccessRate: number; // 0.0 to 100.0

  @ApiProperty({ description: 'Timestamp of the last time the smart learning model/rules were updated.' })
  @IsDateString()
  lastLearningUpdate: Date;
}
