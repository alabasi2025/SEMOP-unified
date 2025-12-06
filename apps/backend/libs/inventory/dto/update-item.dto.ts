import { PartialType } from '@nestjs/swagger';
import { CreateItemDto } from './create-item.dto';

/**
 * DTO لتحديث صنف موجود
 * 
 * يرث من CreateItemDto ويجعل جميع الحقول اختيارية
 * يمكن تحديث أي حقل أو مجموعة من الحقول دون الحاجة لإرسال جميع البيانات
 */
export class UpdateItemDto extends PartialType(CreateItemDto) {}
