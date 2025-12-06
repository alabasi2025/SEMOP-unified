import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Customer } from './customer.entity'; // افتراض وجود جدول العملاء

@Entity('customer_contacts')
export class CustomerContact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'customer_id' })
  customerId: string;

  @ManyToOne(() => Customer, (customer) => customer.contacts)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ length: 100, name: 'full_name' })
  fullName: string;

  @Column({ length: 100, unique: true, nullable: true })
  email: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ length: 20, nullable: true, name: 'contact_type' }) // مثال: 'Primary', 'Billing', 'Technical'
  contactType: string;

  @Column({ default: true })
  isPrimary: boolean;

  // حقول التدقيق (Audit Fields) وفقاً لمعايير ERP
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deletedAt: Date;

  @Column({ type: 'uuid', nullable: true, name: 'created_by' })
  createdBy: string;

  @Column({ type: 'uuid', nullable: true, name: 'updated_by' })
  updatedBy: string;
}

// ملاحظة: يجب إنشاء ملف customer.entity.ts في مشروع NestJS الفعلي.
// لغرض هذه المهمة، سنفترض وجوده.
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  // ... حقول أخرى
  contacts: CustomerContact[];
}
