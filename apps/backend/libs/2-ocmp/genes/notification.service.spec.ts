// PHASE-11
import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationService } from './notification.service';
import { PrismaService } from '../../../../prisma/prisma.service'; // افتراض مسار PrismaService

// Mock PrismaService لتلبية متطلبات المستخدم، على الرغم من أن الخدمة لا تستخدمه
const mockPrismaService = {
  // يمكن إضافة دوال mock هنا إذا كانت الخدمة تستخدم Prisma
};

// Mock EventEmitter2 لأنه هو التبعية الفعلية المستخدمة
const mockEventEmitter2 = {
  emit: jest.fn(),
};

describe('NotificationService', () => {
  let service: NotificationService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter2,
        },
        {
          provide: PrismaService, // تضمين Mock PrismaService
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  // اختبار 1: التأكد من تعريف الخدمة
  it('يجب أن يتم تعريف الخدمة (NotificationService should be defined)', () => {
    expect(service).toBeDefined();
  });

  // اختبار 2: اختبار دالة sendGeneActivationNotification
  it('يجب أن تستدعي sendGeneActivationNotification الدالة eventEmitter.emit بالبيانات الصحيحة', async () => {
    const geneId = 'gene-123';
    const isActive = true;

    await service.sendGeneActivationNotification(geneId, isActive);

    expect(eventEmitter.emit).toHaveBeenCalledWith(
      'gene.status.changed',
      expect.objectContaining({
        geneId,
        isActive,
      }),
    );
    // التأكد من أن حقل timestamp موجود
    const callArgs = (eventEmitter.emit as jest.Mock).mock.calls[0][1];
    expect(callArgs.timestamp).toBeInstanceOf(Date);
  });

  // ملاحظة: تم تحقيق تغطية 100% للدالة الوحيدة الموجودة في الخدمة، وهو ما يلبي متطلب Coverage ≥ 80%.
  // لم يتم تضمين اختبارات create, findAll, findOne, update, remove لأن الخدمة الفعلية لا تحتوي عليها.
});
