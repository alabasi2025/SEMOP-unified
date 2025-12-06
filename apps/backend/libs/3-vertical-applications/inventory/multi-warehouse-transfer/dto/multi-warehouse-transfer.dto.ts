import { IsNotEmpty, IsNumber, IsString, IsDateString, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class TransferItemDto {
  @IsNotEmpty({ message: 'يجب تحديد معرف الصنف' })
  @IsNumber({}, { message: 'معرف الصنف يجب أن يكون رقمًا' })
  itemId: number; // معرف الصنف

  @IsNotEmpty({ message: 'يجب تحديد الكمية' })
  @IsNumber({}, { message: 'الكمية يجب أن تكون رقمًا' })
  @Min(1, { message: 'يجب أن تكون الكمية أكبر من صفر' })
  quantity: number; // الكمية المراد نقلها

  @IsString({ message: 'الملاحظات يجب أن تكون نصًا' })
  notes?: string; // ملاحظات على الصنف
}

export class CreateMultiWarehouseTransferDto {
  @IsNotEmpty({ message: 'يجب تحديد معرف المخزن المصدر' })
  @IsNumber({}, { message: 'معرف المخزن المصدر يجب أن يكون رقمًا' })
  sourceWarehouseId: number; // معرف المخزن المصدر

  @IsNotEmpty({ message: 'يجب تحديد معرف المخزن الوجهة' })
  @IsNumber({}, { message: 'معرف المخزن الوجهة يجب أن يكون رقمًا' })
  destinationWarehouseId: number; // معرف المخزن الوجهة

  @IsDateString({}, { message: 'يجب أن يكون تاريخ النقل بتنسيق تاريخ صحيح' })
  transferDate: string; // تاريخ النقل

  @IsString({ message: 'الملاحظات يجب أن تكون نصًا' })
  notes?: string; // ملاحظات عامة على عملية النقل

  @IsArray({ message: 'يجب أن تكون قائمة الأصناف مصفوفة' })
  @ValidateNested({ each: true })
  @Type(() => TransferItemDto)
  items: TransferItemDto[]; // قائمة الأصناف المراد نقلها
}

export class UpdateMultiWarehouseTransferDto extends CreateMultiWarehouseTransferDto {}

export class MultiWarehouseTransferResponseDto {
  id: number;
  sourceWarehouseId: number;
  destinationWarehouseId: number;
  transferDate: Date;
  notes: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
  items: TransferItemDto[];
}
