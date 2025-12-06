/*
  ملف: reports-page.component.spec.ts
  الوصف: ملف اختبارات الوحدة (Unit Tests) لمكون ReportsPageComponent.
  المتطلبات: اختبار إنشاء المكون، اختبار منطق RxJS، اختبار تفاعلات المستخدم.
*/

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportsPageComponent } from './reports-page.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { MockInventoryService } from './reports-page.component'; // استيراد الخدمة الوهمية

describe('ReportsPageComponent', () => {
  let component: ReportsPageComponent;
  let fixture: ComponentFixture<ReportsPageComponent>;
  let mockInventoryService: MockInventoryService;

  // إعداد بيئة الاختبار قبل كل اختبار
  beforeEach(async () => {
    // تهيئة خدمة وهمية للتجسس على الدوال
    mockInventoryService = jasmine.createSpyObj('MockInventoryService', ['getReportData']);
    // جعل الدالة ترجع Observable ببيانات وهمية افتراضياً
    (mockInventoryService.getReportData as jasmine.Spy).and.returnValue(of([{ id: 1, name: 'Test Item' }]));

    await TestBed.configureTestingModule({
      imports: [ReportsPageComponent, ReactiveFormsModule], // استيراد المكون المستقل
      providers: [
        FormBuilder,
        // توفير الخدمة الوهمية بدلاً من الخدمة الحقيقية
        { provide: MockInventoryService, useValue: mockInventoryService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportsPageComponent);
    component = fixture.componentInstance;
    // استرجاع الخدمة الوهمية التي تم توفيرها
    // @ts-ignore
    mockInventoryService = TestBed.inject(MockInventoryService);
    fixture.detectChanges(); // تشغيل ngOnInit
  });

  // -------------------------------------------------------------------
  // 1. اختبارات الإنشاء الأساسية
  // -------------------------------------------------------------------

  it('يجب أن يتم إنشاء المكون بنجاح', () => {
    expect(component).toBeTruthy();
  });

  it('يجب أن يتم تهيئة نموذج الفلترة (filterForm) عند الإنشاء', () => {
    expect(component.filterForm).toBeDefined();
    expect(component.filterForm.contains('startDate')).toBeTrue();
    expect(component.filterForm.contains('warehouseId')).toBeTrue();
  });

  it('يجب أن يكون التقرير الافتراضي هو "تقرير المخزون الحالي"', (done) => {
    component.selectedReport$.subscribe(report => {
      expect(report.id).toBe('inventory-stock');
      done();
    });
  });

  // -------------------------------------------------------------------
  // 2. اختبارات منطق RxJS وإدارة الحالة
  // -------------------------------------------------------------------

  it('يجب أن يتم جلب بيانات التقرير عند تهيئة المكون', () => {
    // تم استدعاء getReportData مرة واحدة عند ngOnInit
    expect(mockInventoryService.getReportData).toHaveBeenCalledTimes(1);
  });

  it('يجب أن يتم تحديث حالة التحميل (isLoading$) بشكل صحيح', (done) => {
    // تهيئة دالة getReportData لترجع بيانات بعد تأخير (للتأكد من حالة التحميل)
    (mockInventoryService.getReportData as jasmine.Spy).and.returnValue(of([{}]).pipe(
      // محاكاة تأخير بسيط
      // لا يمكن استخدام delay في اختبارات الوحدة بسهولة، لذا نعتمد على تزامن الـ Observable
      // في حالة النجاح المتزامن، يجب أن تكون حالة التحميل false في النهاية
      // في حالة النجاح المتزامن، يتم استدعاء tap(true) ثم tap(false) مباشرة
      // لذا، نختبر الحالة النهائية
      of([{}]).pipe()
    ));

    // إعادة تشغيل ngOnInit أو استدعاء applyFilters
    component.applyFilters();
    fixture.detectChanges();

    component.isLoading$.subscribe(isLoading => {
      // يجب أن تكون false بعد اكتمال الجلب
      expect(isLoading).toBeFalse();
      done();
    });
  });

  it('يجب أن يتم تحديث بيانات التقرير (reportData$) عند تغيير التقرير المحدد', (done) => {
    const newReport = component.availableReports.find(r => r.id === 'low-stock')!;
    component.selectReport(newReport);

    // يجب أن يتم استدعاء getReportData مرة أخرى
    expect(mockInventoryService.getReportData).toHaveBeenCalledTimes(2);

    // يجب أن يحتوي reportData$ على البيانات الوهمية
    component.reportData$?.subscribe(data => {
      expect(data.length).toBe(1);
      expect(data[0].name).toBe('Test Item');
      done();
    });
  });

  it('يجب أن يتم معالجة الأخطاء وتحديث حالة الخطأ (error$)', (done) => {
    // تهيئة دالة getReportData لترجع خطأ
    (mockInventoryService.getReportData as jasmine.Spy).and.returnValue(throwError(() => new Error('Test Error')));

    // تطبيق الفلاتر لتحفيز جلب البيانات
    component.applyFilters();
    fixture.detectChanges();

    // يجب أن يتم تحديث حالة الخطأ
    component.error$.subscribe(error => {
      expect(error).toContain('خطأ في جلب بيانات التقرير: Test Error');
      done();
    });

    // يجب أن تكون حالة التحميل false بعد الخطأ
    component.isLoading$.subscribe(isLoading => {
      expect(isLoading).toBeFalse();
    });
  });

  // -------------------------------------------------------------------
  // 3. اختبارات تفاعلات المستخدم
  // -------------------------------------------------------------------

  it('يجب أن تقوم دالة selectReport بتحديث التقرير المحدد', (done) => {
    const newReport = component.availableReports.find(r => r.id === 'low-stock')!;
    component.selectReport(newReport);

    component.selectedReport$.subscribe(report => {
      expect(report.id).toBe('low-stock');
      done();
    });
  });

  it('يجب أن تقوم دالة applyFilters بتحديث الفلاتر واستدعاء جلب البيانات', () => {
    // تهيئة قيمة في نموذج الفلترة
    component.filterForm.get('warehouseId')?.setValue(5);
    component.applyFilters();

    // يجب أن يتم استدعاء getReportData مرة أخرى (المرة الأولى كانت في ngOnInit)
    expect(mockInventoryService.getReportData).toHaveBeenCalledTimes(2);

    // يجب أن يتم استدعاء getReportData بالفلاتر الجديدة
    const expectedFilters = {
      dateRange: [null, null],
      warehouseId: 5,
      categoryId: null,
    };
    expect(mockInventoryService.getReportData).toHaveBeenCalledWith('inventory-stock', expectedFilters);
  });

  it('يجب أن تقوم دالة exportToPdf بطباعة رسالة في الكونسول (وهمياً)', () => {
    spyOn(console, 'log');
    component.exportToPdf();
    expect(console.log).toHaveBeenCalledWith('تصدير التقرير إلى PDF...');
  });

  it('يجب أن تقوم دالة getReportColumns بإرجاع الأعمدة الصحيحة لتقرير المخزون', () => {
    const columns = component.getReportColumns('inventory-stock');
    expect(columns).toEqual(['الصنف', 'الفئة', 'المستودع', 'الكمية الحالية', 'قيمة المخزون', 'آخر حركة']);
  });
});
