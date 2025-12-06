import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateMultiWarehouseTransferDto, UpdateMultiWarehouseTransferDto, MultiWarehouseTransferResponseDto } from './dto/multi-warehouse-transfer.dto';

// محاكاة لقاعدة بيانات
interface WarehouseTransfer {
  id: number;
  sourceWarehouseId: number;
  destinationWarehouseId: number;
  transferDate: Date;
  notes: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
  items: { itemId: number; quantity: number; notes?: string }[];
}

@Injectable()
export class MultiWarehouseTransferService {
  private transfers: WarehouseTransfer[] = [];
  private nextId = 1;

  /**
   * إنشاء طلب نقل جديد بين المخازن
   * @param createDto بيانات طلب النقل
   * @returns طلب النقل المنشأ
   */
  create(createDto: CreateMultiWarehouseTransferDto): MultiWarehouseTransferResponseDto {
    if (createDto.sourceWarehouseId === createDto.destinationWarehouseId) {
      throw new BadRequestException('لا يمكن النقل من وإلى نفس المخزن');
    }

    // هنا يجب أن تكون هناك عملية تحقق من توفر الكميات في المخزن المصدر
    // ... (منطق التحقق من المخزون)

    const newTransfer: WarehouseTransfer = {
      id: this.nextId++,
      ...createDto,
      transferDate: new Date(createDto.transferDate),
      status: 'Pending', // يبدأ كطلب معلق
    };

    this.transfers.push(newTransfer);
    return this.mapToResponseDto(newTransfer);
  }

  /**
   * الحصول على جميع طلبات النقل
   * @returns قائمة بطلبات النقل
   */
  findAll(): MultiWarehouseTransferResponseDto[] {
    return this.transfers.map(this.mapToResponseDto);
  }

  /**
   * الحصول على طلب نقل محدد
   * @param id معرف طلب النقل
   * @returns طلب النقل
   */
  findOne(id: number): MultiWarehouseTransferResponseDto {
    const transfer = this.transfers.find(t => t.id === id);
    if (!transfer) {
      throw new NotFoundException(`لم يتم العثور على طلب النقل بالمعرف ${id}`);
    }
    return this.mapToResponseDto(transfer);
  }

  /**
   * تحديث طلب نقل موجود
   * @param id معرف طلب النقل
   * @param updateDto بيانات التحديث
   * @returns طلب النقل المحدث
   */
  update(id: number, updateDto: UpdateMultiWarehouseTransferDto): MultiWarehouseTransferResponseDto {
    const index = this.transfers.findIndex(t => t.id === id);
    if (index === -1) {
      throw new NotFoundException(`لم يتم العثور على طلب النقل بالمعرف ${id}`);
    }

    if (this.transfers[index].status !== 'Pending') {
      throw new BadRequestException('لا يمكن تعديل طلب نقل ليس في حالة "معلق"');
    }

    if (updateDto.sourceWarehouseId === updateDto.destinationWarehouseId) {
      throw new BadRequestException('لا يمكن النقل من وإلى نفس المخزن');
    }

    this.transfers[index] = {
      ...this.transfers[index],
      ...updateDto,
      transferDate: new Date(updateDto.transferDate),
    };

    return this.mapToResponseDto(this.transfers[index]);
  }

  /**
   * حذف طلب نقل
   * @param id معرف طلب النقل
   */
  remove(id: number): void {
    const initialLength = this.transfers.length;
    this.transfers = this.transfers.filter(t => t.id !== id);
    if (this.transfers.length === initialLength) {
      throw new NotFoundException(`لم يتم العثور على طلب النقل بالمعرف ${id}`);
    }
  }

  /**
   * اعتماد طلب النقل (تأثير مالي ومخزني)
   * @param id معرف طلب النقل
   * @returns طلب النقل المعتمد
   */
  completeTransfer(id: number): MultiWarehouseTransferResponseDto {
    const transfer = this.transfers.find(t => t.id === id);
    if (!transfer) {
      throw new NotFoundException(`لم يتم العثور على طلب النقل بالمعرف ${id}`);
    }

    if (transfer.status !== 'Pending') {
      throw new BadRequestException(`لا يمكن اعتماد طلب نقل حالته هي: ${transfer.status}`);
    }

    // هنا يتم تطبيق منطق النقل الفعلي:
    // 1. خصم الكميات من المخزن المصدر
    // 2. إضافة الكميات إلى المخزن الوجهة
    // 3. إنشاء قيد محاسبي (إذا كان هناك تأثير مالي)
    // ... (منطق تطبيق النقل)

    transfer.status = 'Completed';
    return this.mapToResponseDto(transfer);
  }

  /**
   * إلغاء طلب النقل
   * @param id معرف طلب النقل
   * @returns طلب النقل الملغى
   */
  cancelTransfer(id: number): MultiWarehouseTransferResponseDto {
    const transfer = this.transfers.find(t => t.id === id);
    if (!transfer) {
      throw new NotFoundException(`لم يتم العثور على طلب النقل بالمعرف ${id}`);
    }

    if (transfer.status !== 'Pending') {
      throw new BadRequestException(`لا يمكن إلغاء طلب نقل حالته هي: ${transfer.status}`);
    }

    transfer.status = 'Cancelled';
    return this.mapToResponseDto(transfer);
  }

  /**
   * تحويل كائن النقل الداخلي إلى كائن استجابة DTO
   * @param transfer كائن النقل الداخلي
   * @returns كائن الاستجابة DTO
   */
  private mapToResponseDto(transfer: WarehouseTransfer): MultiWarehouseTransferResponseDto {
    return {
      id: transfer.id,
      sourceWarehouseId: transfer.sourceWarehouseId,
      destinationWarehouseId: transfer.destinationWarehouseId,
      transferDate: transfer.transferDate,
      notes: transfer.notes,
      status: transfer.status,
      items: transfer.items,
    };
  }
}
