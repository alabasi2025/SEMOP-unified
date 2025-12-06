import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';

/**
 * DTO لتحديث فئة أصناف موجودة
 * 
 * يرث من CreateCategoryDto ويجعل جميع الحقول اختيارية
 */
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
