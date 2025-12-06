import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Institution } from './institution.entity'; // افتراض وجود كيان المؤسسة
import { AccountType } from './account-type.entity'; // افتراض وجود كيان نوع الحساب

@Entity('account_hierarchy')
export class AccountHierarchy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // حقل ربط المؤسسة (Institution)
  @Column({ type: 'uuid', name: 'institution_id' })
  institutionId: string;

  @ManyToOne(() => Institution, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'institution_id' })
  institution: Institution;

  // حقل ربط الحساب الأب (Parent Account)
  @Column({ type: 'uuid', name: 'parent_id', nullable: true })
  parentId: string | null;

  @ManyToOne(() => AccountHierarchy, hierarchy => hierarchy.children, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_id' })
  parent: AccountHierarchy | null;

  @OneToMany(() => AccountHierarchy, hierarchy => hierarchy.parent)
  children: AccountHierarchy[];

  // حقل نوع الحساب (Account Type)
  @Column({ type: 'uuid', name: 'account_type_id' })
  accountTypeId: string;

  @ManyToOne(() => AccountType)
  @JoinColumn({ name: 'account_type_id' })
  accountType: AccountType;

  // رمز الحساب (Code) - يجب أن يكون فريداً ضمن المؤسسة
  @Column({ type: 'varchar', length: 50, unique: false })
  code: string;

  // اسم الحساب (Name)
  @Column({ type: 'varchar', length: 255 })
  name: string;

  // المستوى الهرمي (Level) - 1, 2, 3, ...
  @Column({ type: 'int' })
  level: number;

  // هل هو حساب تجميعي (Group/Header Account) أم حساب فرعي (Sub/Detail Account)
  @Column({ type: 'boolean', default: true, name: 'is_group' })
  isGroup: boolean;

  // الحالة (Active/Inactive)
  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  // حقول التدقيق (Audit Fields)
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
  updatedAt: Date;
}
