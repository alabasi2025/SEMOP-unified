// PHASE: DTO_QUALITY_FIX
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerContact } from './customer-contact.entity';
import { CreateCustomerContactDto, UpdateCustomerContactDto } from './customer-contact.dto';
import { } from '@semop/contracts';


@Injectable()
export class CustomerContactService {
  constructor(
    @InjectRepository(CustomerContact)
    private customerContactRepository: Repository<CustomerContact>,
  ) {}

  // 1. Create (إنشاء)
  async create(createDto: CreateCustomerContactDto): Promise<CustomerContact> {
    const newContact = this.customerContactRepository.create(createDto);
    // يمكن إضافة منطق للتحقق من وجود العميل (Customer) هنا
    return this.customerContactRepository.save(newContact);
  }

  // 2. Find All (قراءة الكل)
  async findAll(): Promise<CustomerContact[]> {
    return this.customerContactRepository.find();
  }

  // 3. Find One by ID (قراءة حسب المعرف)
  async findOne(id: string): Promise<CustomerContact> {
    const contact = await this.customerContactRepository.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`Customer Contact with ID "${id}" not found`);
    }
    return contact;
  }

  // 4. Find Contacts by Customer ID (قراءة جهات الاتصال لعميل معين)
  async findByCustomerId(customerId: string): Promise<CustomerContact[]> {
    return this.customerContactRepository.find({ where: { customerId } });
  }

  // 5. Update (تحديث)
  async update(id: string, updateDto: UpdateCustomerContactDto): Promise<CustomerContact> {
    const contact = await this.findOne(id); // التحقق من وجود جهة الاتصال
    
    // تطبيق التحديثات
    Object.assign(contact, updateDto);

    // يمكن إضافة منطق للتحقق من التحديثات هنا (مثل التحقق من تكرار البريد الإلكتروني)

    return this.customerContactRepository.save(contact);
  }

  // 6. Delete (حذف - Soft Delete)
  async remove(id: string): Promise<void> {
    const result = await this.customerContactRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Customer Contact with ID "${id}" not found`);
    }
  }
}
