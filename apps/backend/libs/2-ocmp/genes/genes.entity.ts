// PHASE-14: تحسين جودة DTOs - إضافة تعليقات PHASE للتوثيق
// PHASE-11: إصلاح انتهاكات DTOs والبنية المعمارية - استخدام @semop/contracts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsDate } from 'class-validator';

// افتراض علاقة One-to-Many مع جدول 'gene_variants'
// يجب أن يكون هذا الجدول موجودًا في المشروع الفعلي
// import { GeneVariant } from './gene-variant.entity';

@Entity('genes')
export class Gene {
  /**
   * المعرف الأساسي للكيان
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * رمز الجين (مثال: BRCA1)
   */
  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  /**
   * الاسم الكامل للجين
   */
  @Column({ type: 'varchar', length: 255 })
  name: string;

  /**
   * وصف مختصر لوظيفة الجين
   */
  @Column({ type: 'text', nullable: true })
  description: string;

  /**
   * حالة تفعيل الجين (للسماح بإيقاف الجين مؤقتًا دون حذفه)
   */
  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  /**
   * تاريخ إنشاء السجل (معيار SEMOP ERP)
   */
  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  /**
   * تاريخ آخر تحديث للسجل (معيار SEMOP ERP)
   */
  @UpdateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  /**
   * تاريخ حذف السجل (Soft Delete - معيار SEMOP ERP)
   */
  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deleted_at: Date;

  // // مثال على علاقة One-to-Many
  // @OneToMany(() => GeneVariant, (variant) => variant.gene)
  // variants: GeneVariant[];
}
