// PHASE: DTO_QUALITY_FIX
// PHASE 10: Customer Contacts Controller
import { Controller } from '@nestjs/common';
import { CustomerContactsService } from './customer_contacts.service';
import { } from '@semop/contracts';


@Controller('customer-contacts')
export class CustomerContactsController {
  constructor(private readonly service: CustomerContactsService) {}
}
