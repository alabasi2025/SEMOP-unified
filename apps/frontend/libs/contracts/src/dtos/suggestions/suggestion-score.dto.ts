import { IsInt, IsString, IsUUID, IsDateString, Min, Max, IsOptional } from 'class-validator';

export class SuggestionScoreDto {
  @IsUUID()
  id: string;

  @IsUUID()
  suggestionId: string;

  @IsUUID()
  userId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  scoreValue: number; // مثلاً من 1 إلى 5

  @IsOptional()
  @IsString()
  comment?: string;

  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;
}
