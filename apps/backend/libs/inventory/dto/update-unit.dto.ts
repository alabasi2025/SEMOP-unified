import { PartialType } from '@nestjs/swagger';
import { CreateUnitDto } from './create-unit.dto';

/**
 * DTO لتحديث وحدة قياس موجودة
 * 
 * يرث من CreateUnitDto ويجعل جميع الحقول اختيارية
 */
export class UpdateUnitDto extends PartialType(CreateUnitDto) {}
