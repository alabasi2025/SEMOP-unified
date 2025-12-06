import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class GeneHistoryDto {
  @IsString()
  geneId: string;

  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsString()
  reason?: string;
}
