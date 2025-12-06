import { IsArray, IsBoolean } from 'class-validator';

export class BulkUpdateGenesDto {
  @IsArray()
  geneIds: string[];

  @IsBoolean()
  isActive: boolean;
}
