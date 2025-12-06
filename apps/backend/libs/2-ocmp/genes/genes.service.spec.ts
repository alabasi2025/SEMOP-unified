import { GenesService } from './genes.service';
import { CreateGeneDto, GeneDto } from '../../../../shared-contracts-repo/src/genes.dto';

/**
 * @description ملف اختبار الوحدة لخدمة GenesService.
 * يهدف إلى ضمان عمل جميع وظائف الخدمة بشكل صحيح، بما في ذلك التعامل مع الأخطاء.
 * @file genes.service.spec.ts
 */
describe('GenesService', () => {
  let service: GenesService;

  // تهيئة الخدمة قبل كل اختبار
  beforeEach(() => {
    service = new GenesService();
  });

  // اختبار دالة findAll
  describe('findAll', () => {
    it('يجب أن يعيد قائمة الجينات الأولية عند التهيئة', () => {
      // 1. الالتزام بأعلى معايير الجودة (استخدام expect.toBeDefined() و expect.toBeInstanceOf())
      expect(service).toBeDefined();
      const genes = service.findAll();
      expect(genes.length).toBeGreaterThan(0);
      // 3. تحسين type safety (التحقق من النوع)
      expect(genes[0]).toBeInstanceOf(GeneDto);
    });

    it('يجب أن يعيد قائمة الجينات بما في ذلك الجينات المضافة حديثًا', () => {
      const initialCount = service.findAll().length;
      const newGeneData: CreateGeneDto = { name: 'GeneB', sequence: 'GCTA' };
      service.create(newGeneData);
      const genes = service.findAll();
      expect(genes.length).toBe(initialCount + 1);
      expect(genes.some(g => g.name === 'GeneB')).toBe(true);
    });
  });

  // اختبار دالة findOne
  describe('findOne', () => {
    it('يجب أن يعيد الجين الصحيح عند إدخال معرف صالح', () => {
      const gene = service.findOne(1);
      // 3. تحسين type safety (التحقق من النوع)
      expect(gene).toBeDefined();
      expect(gene!.id).toBe(1);
      expect(gene!.name).toBe('GeneA');
    });

    it('يجب أن يعيد undefined عند إدخال معرف غير موجود', () => {
      const gene = service.findOne(999);
      expect(gene).toBeUndefined();
    });

    it('يجب أن يرمي خطأ عند إدخال معرف غير صالح (أقل من أو يساوي صفر)', () => {
      // 4. إضافة error handling محسّن (اختبار حالة الخطأ)
      expect(() => service.findOne(0)).toThrow('Invalid Gene ID: ID must be a positive number.');
      expect(() => service.findOne(-1)).toThrow('Invalid Gene ID: ID must be a positive number.');
    });
  });

  // اختبار دالة create
  describe('create', () => {
    it('يجب أن ينشئ جينًا جديدًا بنجاح ويعيده', () => {
      const newGeneData: CreateGeneDto = { name: 'GeneC', sequence: 'TAGC' };
      const createdGene = service.create(newGeneData);
      
      // 1. الالتزام بأعلى معايير الجودة (التحقق من الخصائص)
      expect(createdGene).toBeDefined();
      expect(createdGene.name).toBe('GeneC');
      expect(createdGene.sequence).toBe('TAGC');
      expect(createdGene.is_active).toBe(true);
      
      // التحقق من إضافته إلى القائمة
      expect(service.findAll().length).toBe(2);
    });

    it('يجب أن يرمي خطأ إذا كان حقل الاسم مفقودًا', () => {
      // 4. إضافة error handling محسّن (اختبار حالة الخطأ)
      const invalidData: CreateGeneDto = { name: '', sequence: 'TAGC' };
      expect(() => service.create(invalidData)).toThrow('Name and sequence are required for gene creation.');
    });

    it('يجب أن يرمي خطأ إذا كان حقل التسلسل مفقودًا', () => {
      // 4. إضافة error handling محسّن (اختبار حالة الخطأ)
      const invalidData: CreateGeneDto = { name: 'GeneD', sequence: '' };
      expect(() => service.create(invalidData)).toThrow('Name and sequence are required for gene creation.');
    });
  });
});
