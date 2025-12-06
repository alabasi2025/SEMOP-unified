import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { StockMovementsService } from '../services/stock-movements.service';
import { CreateMovementDto } from '../dto/create-movement.dto';
import { MovementType } from '../types/movement-type.enum';

/**
 * Controller إدارة حركات المخزون
 */
@ApiTags('Inventory - Stock Movements')
@Controller('inventory/movements')
export class StockMovementsController {
  constructor(private readonly movementsService: StockMovementsService) {}

  /**
   * جلب جميع الحركات
   */
  @Get()
  @ApiOperation({ summary: 'جلب جميع الحركات' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'warehouseId', required: false, type: String })
  @ApiQuery({ name: 'itemId', required: false, type: String })
  @ApiQuery({ name: 'movementType', required: false, enum: MovementType })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('warehouseId') warehouseId?: string,
    @Query('itemId') itemId?: string,
    @Query('movementType') movementType?: MovementType,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.movementsService.findAll(
      page ? +page : 1,
      limit ? +limit : 50,
      {
        warehouseId,
        itemId,
        movementType,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
    );
  }

  /**
   * جلب تفاصيل حركة واحدة
   */
  @Get(':id')
  @ApiOperation({ summary: 'جلب تفاصيل حركة واحدة' })
  async findOne(@Param('id') id: string) {
    return this.movementsService.findOne(id);
  }

  /**
   * جلب حركات صنف معين
   */
  @Get('item/:itemId')
  @ApiOperation({ summary: 'جلب حركات صنف معين' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  async getItemMovements(
    @Param('itemId') itemId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.movementsService.getItemMovements(
      itemId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  /**
   * جلب حركات مستودع معين
   */
  @Get('warehouse/:warehouseId')
  @ApiOperation({ summary: 'جلب حركات مستودع معين' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  async getWarehouseMovements(
    @Param('warehouseId') warehouseId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.movementsService.getWarehouseMovements(
      warehouseId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  /**
   * إنشاء حركة إدخال
   */
  @Post('in')
  @ApiOperation({ summary: 'إنشاء حركة إدخال' })
  @ApiResponse({ status: 201, description: 'تم إنشاء الحركة بنجاح' })
  async createInMovement(@Body() dto: CreateMovementDto) {
    return this.movementsService.createInMovement(dto);
  }

  /**
   * إنشاء حركة إخراج
   */
  @Post('out')
  @ApiOperation({ summary: 'إنشاء حركة إخراج' })
  @ApiResponse({ status: 201, description: 'تم إنشاء الحركة بنجاح' })
  @ApiResponse({ status: 400, description: 'الكمية المتاحة غير كافية' })
  async createOutMovement(@Body() dto: CreateMovementDto) {
    return this.movementsService.createOutMovement(dto);
  }

  /**
   * إنشاء تسوية
   */
  @Post('adjustment')
  @ApiOperation({ summary: 'إنشاء تسوية' })
  @ApiResponse({ status: 201, description: 'تم إنشاء التسوية بنجاح' })
  async createAdjustment(@Body() dto: CreateMovementDto) {
    return this.movementsService.createAdjustment(dto);
  }

  /**
   * إلغاء حركة
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'إلغاء حركة' })
  @ApiResponse({ status: 204, description: 'تم إلغاء الحركة بنجاح' })
  async cancelMovement(@Param('id') id: string) {
    await this.movementsService.cancelMovement(id);
  }
}
