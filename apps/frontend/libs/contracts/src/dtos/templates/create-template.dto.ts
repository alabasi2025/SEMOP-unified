import { IsNotEmpty, IsString, MaxLength, IsOptional, IsObject } from 'class-validator';

/**
 * DTO لإنشاء قالب جديد.
 * يستخدم لتمثيل البيانات المطلوبة لإنشاء أي نوع من القوالب في النظام.
 */
export class CreateTemplateDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsNotEmpty()
  @IsString()
  // يمثل نوع القالب (مثل: 'JournalEntry', 'Report', 'Document')
  type: string;

  @IsNotEmpty()
  @IsObject()
  // يمثل محتوى القالب الفعلي، ويكون هيكله مرنًا حسب نوع القالب
  content: any;
}
