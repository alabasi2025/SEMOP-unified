import { IsInt, IsString, IsUUID, Min, Max, IsOptional } from 'class-validator';

export class CreateSuggestionScoreDto {
  @IsUUID()
  suggestionId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  scoreValue: number; // مثلاً من 1 إلى 5

  @IsOptional()
  @IsString()
  comment?: string;
}
