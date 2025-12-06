// PHASE-11

import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from './accounts.service';
import { NotFoundException } from '@nestjs/common';

// بما أن الخدمة تستخدم بيانات وهمية حاليًا ولا تستورد PrismaService،
// سنقوم بتعريف MockPrismaService كرمز (token) لتمثيل الخدمة المطلوبة في المستقبل
// وفقًا لمتطلبات المستخدم، حتى لو لم يتم استخدامها حاليًا في AccountsService.
// في بيئة NestJS حقيقية، سيتم استيراد PrismaService من مسارها الفعلي.
class MockPrismaService {}

describe('AccountsService', () => {
  let service: AccountsService;
  let prismaService: MockPrismaService; // للحفاظ على المتطلب رقم 2

  // بيانات وهمية للاختبار
  const initialAccounts = [
    { id: '1', code: '1', nameAr: 'الأصول', nameEn: 'Assets', accountType: 'ASSET', accountNature: 'DEBIT', level: 1, isParent: true, isActive: true },
    { id: '2', code: '11', nameAr: 'الأصول المتداولة', nameEn: 'Current Assets', accountType: 'ASSET', accountNature: 'DEBIT', level: 2, isParent: true, parentId: '1', isActive: true },
    { id: '3', code: '1101', nameAr: 'النقدية', nameEn: 'Cash', accountType: 'ASSET', accountNature: 'DEBIT', level: 3, isParent: false, parentId: '2', isActive: true },
    { id: '4', code: '1102', nameAr: 'البنك', nameEn: 'Bank', accountType: 'ASSET', accountNature: 'DEBIT', level: 3, isParent: false, parentId: '2', isActive: true },
    { id: '5', code: '2', nameAr: 'الخصوم', nameEn: 'Liabilities', accountType: 'LIABILITY', accountNature: 'CREDIT', level: 1, isParent: true, isActive: true },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        // Mocking PrismaService as requested, even though it's not injected in the current service implementation
        {
          provide: MockPrismaService, // استخدام الرمز (Token)
          useValue: {
            account: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
    prismaService = module.get<MockPrismaService>(MockPrismaService);
    
    // إعادة تهيئة البيانات الوهمية في الخدمة قبل كل اختبار لضمان الاستقلالية
    (service as any).accounts = JSON.parse(JSON.stringify(initialAccounts));
    (service as any).nextId = 6;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // -------------------------------------------------------------------
  // Test findAll
  // -------------------------------------------------------------------
  describe('findAll', () => {
    it('يجب أن يعيد جميع الحسابات بدون فلاتر', () => {
      const result = service.findAll();
      expect(result.length).toBe(5);
      expect(result).toEqual(initialAccounts);
    });

    it('يجب أن يقوم بالتصفية حسب accountType', () => {
      const result = service.findAll({ accountType: 'ASSET' });
      expect(result.length).toBe(4);
      expect(result.every(a => a.accountType === 'ASSET')).toBe(true);
    });

    it('يجب أن يقوم بالتصفية حسب isActive', () => {
      // تعديل حساب لجعله غير نشط لاختبار التصفية
      (service as any).accounts[0].isActive = false;
      const result = service.findAll({ isActive: true });
      expect(result.length).toBe(4);
      expect(result.every(a => a.isActive === true)).toBe(true);
    });

    it('يجب أن يقوم بالتصفية حسب isParent', () => {
      const result = service.findAll({ isParent: false });
      expect(result.length).toBe(2); // النقدية والبنك
      expect(result.every(a => a.isParent === false)).toBe(true);
    });
    
    it('يجب أن يقوم بالتصفية حسب فلاتر متعددة (accountType و isParent)', () => {
      const result = service.findAll({ accountType: 'ASSET', isParent: true });
      expect(result.length).toBe(2); // الأصول والأصول المتداولة
      expect(result.every(a => a.accountType === 'ASSET' && a.isParent === true)).toBe(true);
    });
  });

  // -------------------------------------------------------------------
  // Test findOne
  // -------------------------------------------------------------------
  describe('findOne', () => {
    it('يجب أن يعيد الحساب المطلوب بنجاح', () => {
      const account = service.findOne('1');
      expect(account.id).toBe('1');
      expect(account.nameAr).toBe('الأصول');
    });

    it('يجب أن يرمي NotFoundException إذا لم يتم العثور على الحساب', () => {
      expect(() => service.findOne('999')).toThrow(NotFoundException);
      expect(() => service.findOne('999')).toThrow('Account with ID 999 not found');
    });
  });

  // -------------------------------------------------------------------
  // Test create
  // -------------------------------------------------------------------
  describe('create', () => {
    it('يجب أن ينشئ حسابًا جديدًا ويعيده', () => {
      const newAccountData = {
        code: '3',
        nameAr: 'الإيرادات',
        nameEn: 'Revenues',
        accountType: 'REVENUE',
        accountNature: 'CREDIT',
        level: 1,
        parentId: null,
      };
      const newAccount = service.create(newAccountData);
      
      expect(newAccount).toBeDefined();
      expect(newAccount.id).toBe('6'); // nextId = 6
      expect(newAccount.nameAr).toBe('الإيرادات');
      expect(newAccount.isActive).toBe(true);
      expect(service.findAll().length).toBe(6);
    });
    
    it('يجب أن يعين القيم الافتراضية بشكل صحيح', () => {
      const newAccountData = {
        code: '3',
        nameAr: 'الإيرادات',
        nameEn: 'Revenues',
        accountType: 'REVENUE',
        accountNature: 'CREDIT',
        level: 1,
      };
      const newAccount = service.create(newAccountData);
      
      expect(newAccount.isParent).toBe(false); // القيمة الافتراضية
      expect(newAccount.allowManualEntry).toBe(true); // القيمة الافتراضية
    });
  });

  // -------------------------------------------------------------------
  // Test update
  // -------------------------------------------------------------------
  describe('update', () => {
    it('يجب أن يقوم بتحديث الحساب بنجاح', () => {
      const updateData = { nameAr: 'الأصول الثابتة', level: 2 };
      const updatedAccount = service.update('1', updateData);
      
      expect(updatedAccount.nameAr).toBe('الأصول الثابتة');
      expect(updatedAccount.level).toBe(2);
      expect(updatedAccount.accountType).toBe('ASSET'); // يجب أن يبقى كما هو
    });

    it('يجب أن يرمي NotFoundException إذا لم يتم العثور على الحساب', () => {
      expect(() => service.update('999', { nameAr: 'خطأ' })).toThrow(NotFoundException);
      expect(() => service.update('999', { nameAr: 'خطأ' })).toThrow('Account with ID 999 not found');
    });
  });

  // -------------------------------------------------------------------
  // Test remove (Soft Delete)
  // -------------------------------------------------------------------
  describe('remove', () => {
    it('يجب أن يقوم بالحذف الناعم (Soft Delete) للحساب بنجاح', () => {
      const removedAccount = service.remove('1');
      
      expect(removedAccount.isActive).toBe(false);
      
      // التأكد من أن الحساب لا يزال موجودًا في القائمة ولكنه غير نشط
      const allAccounts = (service as any).accounts;
      const accountInList = allAccounts.find(a => a.id === '1');
      expect(accountInList.isActive).toBe(false);
      
      // التأكد من أن findAll بدون فلاتر لا يزال يعيده
      expect(service.findAll().length).toBe(5);
      
      // التأكد من أن findAll بفلتر isActive: true لا يعيده
      expect(service.findAll({ isActive: true }).length).toBe(4);
    });

    it('يجب أن يرمي NotFoundException إذا لم يتم العثور على الحساب', () => {
      expect(() => service.remove('999')).toThrow(NotFoundException);
      expect(() => service.remove('999')).toThrow('Account with ID 999 not found');
    });
  });
});
