// PHASE: DTO_QUALITY_FIX
// PHASE-11: إصلاح انتهاكات DTOs والبنية المعمارية - استخدام @semop/contracts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../1-core-services/prisma/prisma.service'; // افتراض وجود PrismaService في مسار '../../1-core-services/prisma/prisma.service'
import { CreateCustomerContactDto, UpdateCustomerContactDto } from './customer_contacts.dto';

@Injectable()
export class CustomerContactsService {
  constructor(private prisma: PrismaService) {}

  async create(createCustomerContactDto: CreateCustomerContactDto) {
    return this.prisma.customer_contacts.create({
      data: createCustomerContactDto,
    });
  }

  async findAll() {
    return this.prisma.customer_contacts.findMany();
  }

  async findOne(id: number) {
    const contact = await this.prisma.customer_contacts.findUnique({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException(`Customer contact with ID ${id} not found`);
    }

    return contact;
  }

  async update(id: number, updateCustomerContactDto: UpdateCustomerContactDto) {
    try {
      return await this.prisma.customer_contacts.update({
        where: { id },
        data: updateCustomerContactDto,
      });
    } catch (error) {
      // Handle case where ID is not found (P2025)
      if (error.code === 'P2025') {
        throw new NotFoundException(`Customer contact with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.customer_contacts.delete({
        where: { id },
      });
    } catch (error) {
      // Handle case where ID is not found (P2025)
      if (error.code === 'P2025') {
        throw new NotFoundException(`Customer contact with ID ${id} not found`);
      }
      throw error;
    }
  }
}
