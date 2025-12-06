import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

// افتراض علاقات مع جداول أخرى (يجب أن تكون موجودة في نظام ERP حقيقي)
// Users (للموظف الذي أنشأ الطلب)
// Vendors (للمورد)
// PurchaseOrderItems (لبنود الطلب)

// تعريف حالة طلب الشراء
export enum PurchaseOrderStatus {
  DRAFT = 'Draft',
  PENDING_APPROVAL = 'Pending Approval',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  RECEIVED = 'Received',
  CANCELLED = 'Cancelled',
}

@Entity('purchase_orders')
export class PurchaseOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  order_number: string; // رقم الطلب الفريد (يتم توليده عادةً)

  @Column({ type: 'date' })
  order_date: Date; // تاريخ الطلب

  @Column({ type: 'date', nullable: true })
  required_date: Date | null; // تاريخ الاستلام المطلوب

  @Column({
    type: 'enum',
    enum: PurchaseOrderStatus,
    default: PurchaseOrderStatus.DRAFT,
  })
  status: PurchaseOrderStatus; // حالة الطلب

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  total_amount: number; // إجمالي المبلغ (يتم حسابه من البنود)

  @Column({ type: 'text', nullable: true })
  notes: string | null; // ملاحظات إضافية

  // =================================================================
  // علاقات افتراضية (يجب أن تكون موجودة في نظام ERP)
  // =================================================================

  // علاقة Many-to-One مع جدول الموردين (Vendors)
  // نفترض وجود جدول Vendors
  @Column({ type: 'uuid' })
  vendor_id: string;

  // @ManyToOne(() => Vendor, vendor => vendor.purchaseOrders)
  // @JoinColumn({ name: 'vendor_id' })
  // vendor: Vendor;

  // علاقة Many-to-One مع جدول المستخدمين (Users) - منشئ الطلب
  // نفترض وجود جدول Users
  @Column({ type: 'uuid' })
  created_by_user_id: string;

  // @ManyToOne(() => User, user => user.createdPurchaseOrders)
  // @JoinColumn({ name: 'created_by_user_id' })
  // createdBy: User;

  // علاقة One-to-Many مع بنود طلب الشراء (PurchaseOrderItems)
  // نفترض وجود جدول PurchaseOrderItems
  // @OneToMany(() => PurchaseOrderItem, item => item.purchaseOrder)
  // items: PurchaseOrderItem[];

  // =================================================================
  // حقول التتبع القياسية (SEMOP ERP Standard)
  // =================================================================

  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'uuid', nullable: true })
  last_modified_by_user_id: string | null; // آخر من عدل الطلب
}
