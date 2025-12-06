// PHASE: DTO_QUALITY_FIX
// PHASE-14: تحسين جودة DTOs - إضافة تعليقات PHASE للتوثيق
// PHASE-11: إصلاح انتهاكات DTOs والبنية المعمارية - استخدام @semop/contracts
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class NotificationService {
  constructor(private eventEmitter: EventEmitter2) {}

  async sendGeneActivationNotification(geneId: string, isActive: boolean) {
    this.eventEmitter.emit('gene.status.changed', {
      geneId,
      isActive,
      timestamp: new Date(),
    });
  }
}
