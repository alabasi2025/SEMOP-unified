import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateItemCategoryDto {
  @ApiProperty({ description: 'اسم الصنف', example: 'أدوات كهربائية' })
  @IsNotEmpty({ message: 'اسم الصنف مطلوب' })
  @IsString({ message: 'اسم الصنف يجب أن يكون نصاً' })
  name: string;

  @ApiProperty({ description: 'وصف الصنف', example: 'يحتوي على جميع الأدوات والمعدات الكهربائية', required: false })
  @IsOptional()
  @IsString({ message: 'وصف الصنف يجب أن يكون نصاً' })
  description: string;

  @ApiProperty({ description: 'حالة النشاط', example: true, required: false })
  @IsOptional()
  @IsBoolean({ message: 'حالة النشاط يجب أن تكون قيمة منطقية' })
  isActive?: boolean = true;
}
