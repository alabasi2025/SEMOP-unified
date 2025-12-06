import { ApiProperty } from '@nestjs/swagger';

export class ItemCategoryDto {
  @ApiProperty({ description: 'معرف الصنف', example: 1 })
  id: number;

  @ApiProperty({ description: 'اسم الصنف', example: 'أدوات كهربائية' })
  name: string;

  @ApiProperty({ description: 'وصف الصنف', example: 'يحتوي على جميع الأدوات والمعدات الكهربائية' })
  description: string;

  @ApiProperty({ description: 'حالة النشاط', example: true })
  isActive: boolean;

  @ApiProperty({ description: 'تاريخ الإنشاء', example: '2023-10-27T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'تاريخ التحديث', example: '2023-10-27T10:00:00.000Z' })
  updatedAt: Date;
}
