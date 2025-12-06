import { PartialType } from '@nestjs/swagger';
import { CreateWarehouseDto } from './create-warehouse.dto';

/**
 * DTO لتحديث مستودع موجود
 * 
 * يرث من CreateWarehouseDto ويجعل جميع الحقول اختيارية
 * يمكن تحديث أي حقل أو مجموعة من الحقول دون الحاجة لإرسال جميع البيانات
 */
export class UpdateWarehouseDto extends PartialType(CreateWarehouseDto) {}
