import { IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO لربط الجين بالقطاع
 * يستخدم لتحديد القطاع المرتبط بجين معين
 */
export class LinkGeneSectorDto {
  @IsString()
  @IsNotEmpty()
  geneId: string;

  @IsString()
  @IsNotEmpty()
  sectorCode: string;
}
