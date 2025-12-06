import { IsString, IsNotEmpty } from 'class-validator';

export class GeneDependencyDto {
  @IsString()
  @IsNotEmpty()
  geneId: string;

  @IsString()
  @IsNotEmpty()
  dependsOnGeneId: string;
}
