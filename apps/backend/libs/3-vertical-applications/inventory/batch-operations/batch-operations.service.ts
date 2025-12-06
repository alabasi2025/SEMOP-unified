import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { BatchOperationDto, BatchOperationResponseDto } from './dto/batch-operation.dto';

@Injectable()
export class BatchOperationsService {
  // محاكاة لقاعدة بيانات أو مستودع بيانات
  private items: any[] = [
    { id: 'item-1', name: 'منتج أ', status: 'متاح', location: 'المخزن أ' },
    { id: 'item-2', name: 'منتج ب', status: 'متاح', location: 'المخزن أ' },
    { id: 'item-3', name: 'منتج ج', status: 'غير متاح', location: 'المخزن ب' },
    { id: 'item-4', name: 'منتج د', status: 'متاح', location: 'المخزن ج' },
  ];

  async processBatchOperation(dto: BatchOperationDto): Promise<BatchOperationResponseDto> {
    const { itemIds, operationType, value } = dto;
    const errors: { itemId: string; reason: string }[] = [];
    let processedCount = 0;

    for (const itemId of itemIds) {
      const itemIndex = this.items.findIndex(item => item.id === itemId);

      if (itemIndex === -1) {
        errors.push({ itemId, reason: 'المنتج غير موجود' });
        continue;
      }

      try {
        switch (operationType) {
          case 'updateStatus':
            if (!value) {
              throw new BadRequestException('يجب تحديد الحالة الجديدة');
            }
            this.items[itemIndex].status = value;
            processedCount++;
            break;

          case 'updateLocation':
            if (!value) {
              throw new BadRequestException('يجب تحديد الموقع الجديد');
            }
            this.items[itemIndex].location = value;
            processedCount++;
            break;

          case 'delete':
            this.items.splice(itemIndex, 1);
            processedCount++;
            break;

          default:
            throw new BadRequestException(\`نوع العملية غير مدعوم: \${operationType}\`);
        }
      } catch (e) {
        errors.push({ itemId, reason: e.message || 'خطأ غير معروف أثناء المعالجة' });
      }
    }

    const success = errors.length === 0;
    const message = success
      ? \`تم تنفيذ العملية المجمعة بنجاح على \${processedCount} منتج.\`
      : \`تم تنفيذ العملية المجمعة مع \${errors.length} أخطاء.\`;

    return {
      success,
      processedCount,
      message,
      errors: errors.length > 0 ? errors : undefined,
    };
  }
}
