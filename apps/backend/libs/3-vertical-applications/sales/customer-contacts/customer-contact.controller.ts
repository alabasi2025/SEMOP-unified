// PHASE: DTO_QUALITY_FIX
/**
 * PHASE-11: Complete Backend Fixes
 * COMPONENT: Customer Contact Controller
 * IMPACT: Medium
 * 
 * Changes:
 * - Updated imports to use @semop/contracts
 * - Removed local DTO imports
 * 
 * Date: 2025-12-03
 * Author: Development Team
 */

import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CustomerContactService } from './customer-contact.service';
import { CreateCustomerContactDto, UpdateCustomerContactDto } from '@semop/contracts';
import { CustomerContact } from './customer-contact.entity';

@Controller('customer-contacts')
export class CustomerContactController {
  constructor(private readonly customerContactService: CustomerContactService) {}

  // POST /customer-contacts
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCustomerContactDto: CreateCustomerContactDto): Promise<CustomerContact> {
    return this.customerContactService.create(createCustomerContactDto);
  }

  // GET /customer-contacts
  @Get()
  findAll(): Promise<CustomerContact[]> {
    return this.customerContactService.findAll();
  }

  // GET /customer-contacts/:id
  @Get(':id')
  findOne(@Param('id') id: string): Promise<CustomerContact> {
    return this.customerContactService.findOne(id);
  }

  // PATCH /customer-contacts/:id
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerContactDto: UpdateCustomerContactDto): Promise<CustomerContact> {
    return this.customerContactService.update(id, updateCustomerContactDto);
  }

  // DELETE /customer-contacts/:id (Soft Delete)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.customerContactService.remove(id);
  }
}
