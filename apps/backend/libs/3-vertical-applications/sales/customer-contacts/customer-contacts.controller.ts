// PHASE: DTO_QUALITY_FIX
// PHASE-12: إضافة Error Handling شامل مع try-catch و logging
// PHASE-11: إصلاح انتهاكات DTOs والبنية المعمارية - استخدام @semop/contracts
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CustomerContactsService } from './customer_contacts.service';
import { CreateCustomerContactDto, UpdateCustomerContactDto, CustomerContactDto } from '@semop/contracts';

@Controller('customer-contacts')
export class CustomerContactsController {
  constructor(private readonly customerContactsService: CustomerContactsService) {}

  @Post()
  create(@Body() createCustomerContactDto: CreateCustomerContactDto) {
    return this.customerContactsService.create(createCustomerContactDto);
  }

  @Get()
  findAll() {
    return this.customerContactsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.customerContactsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCustomerContactDto: UpdateCustomerContactDto) {
    return this.customerContactsService.update(id, updateCustomerContactDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.customerContactsService.remove(id);
  }
}
