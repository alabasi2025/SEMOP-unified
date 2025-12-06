import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TransfersService } from '../services/transfers.service';

/**
 * Controller إدارة التحويلات
 * 
 * ملاحظة: التحويلات يتم تنفيذها عبر StockMovementsController
 */
@ApiTags('Inventory - Transfers')
@Controller('inventory/transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}
}
