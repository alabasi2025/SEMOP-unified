// PHASE: DTO_QUALITY_FIX
// PHASE-15: Smart Journal Entries System - Template Service
// This service handles journal entry templates CRUD operations

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../1-core-services/prisma/prisma.service';
import {
  JournalEntryTemplateDto,
  CreateJournalEntryTemplateDto,
  UpdateJournalEntryTemplateDto,
} from '@semop/contracts';

@Injectable()
export class JournalEntryTemplateService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new journal entry template
   */
  async create(dto: CreateJournalEntryTemplateDto): Promise<JournalEntryTemplateDto> {
    // Check if code already exists
    const existing = await this.prisma.journalEntryTemplate.findUnique({
      where: { code: dto.code },
    });

    if (existing) {
      throw new BadRequestException(`Template with code "${dto.code}" already exists`);
    }

    // Create template with lines
    const template = await this.prisma.journalEntryTemplate.create({
      data: {
        code: dto.code,
        nameAr: dto.nameAr,
        nameEn: dto.nameEn,
        operationType: dto.operationType,
        isActive: dto.isActive ?? true,
        lines: {
          create: dto.lines.map((line) => ({
            lineOrder: line.lineOrder,
            accountType: line.accountType,
            accountId: line.accountId,
            accountPlaceholder: line.accountPlaceholder,
            amountSource: line.amountSource,
            descriptionTemplate: line.descriptionTemplate,
          })),
        },
      },
      include: {
        lines: true,
      },
    });

    return this.mapToDto(template);
  }

  /**
   * Get all templates
   */
  async findAll(): Promise<JournalEntryTemplateDto[]> {
    const templates = await this.prisma.journalEntryTemplate.findMany({
      include: {
        lines: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return templates.map((t) => this.mapToDto(t));
  }

  /**
   * Get template by ID
   */
  async findOne(id: string): Promise<JournalEntryTemplateDto> {
    const template = await this.prisma.journalEntryTemplate.findUnique({
      where: { id },
      include: {
        lines: true,
      },
    });

    if (!template) {
      throw new NotFoundException(`Template with ID "${id}" not found`);
    }

    return this.mapToDto(template);
  }

  /**
   * Get template by operation type
   */
  async findByOperationType(operationType: string): Promise<JournalEntryTemplateDto | null> {
    const template = await this.prisma.journalEntryTemplate.findFirst({
      where: {
        operationType,
        isActive: true,
      },
      include: {
        lines: true,
      },
    });

    return template ? this.mapToDto(template) : null;
  }

  /**
   * Update template
   */
  async update(id: string, dto: UpdateJournalEntryTemplateDto): Promise<JournalEntryTemplateDto> {
    // Check if template exists
    await this.findOne(id);

    // If updating code, check uniqueness
    if (dto.code) {
      const existing = await this.prisma.journalEntryTemplate.findFirst({
        where: {
          code: dto.code,
          NOT: { id },
        },
      });

      if (existing) {
        throw new BadRequestException(`Template with code "${dto.code}" already exists`);
      }
    }

    // Update template
    const template = await this.prisma.journalEntryTemplate.update({
      where: { id },
      data: {
        code: dto.code,
        nameAr: dto.nameAr,
        nameEn: dto.nameEn,
        operationType: dto.operationType,
        isActive: dto.isActive,
      },
      include: {
        lines: true,
      },
    });

    return this.mapToDto(template);
  }

  /**
   * Delete template
   */
  async delete(id: string): Promise<void> {
    // Check if template exists
    await this.findOne(id);

    // Delete template (lines will be deleted automatically due to cascade)
    await this.prisma.journalEntryTemplate.delete({
      where: { id },
    });
  }

  /**
   * Clone template
   */
  async clone(id: string, newCode: string, newNameAr: string, newNameEn: string): Promise<JournalEntryTemplateDto> {
    const original = await this.findOne(id);

    const cloned = await this.prisma.journalEntryTemplate.create({
      data: {
        code: newCode,
        nameAr: newNameAr,
        nameEn: newNameEn,
        operationType: original.operationType,
        isActive: original.isActive,
        lines: {
          create: original.lines!.map((line) => ({
            lineOrder: line.lineOrder,
            accountType: line.accountType,
            accountId: line.accountId,
            accountPlaceholder: line.accountPlaceholder,
            amountSource: line.amountSource,
            descriptionTemplate: line.descriptionTemplate,
          })),
        },
      },
      include: {
        lines: true,
      },
    });

    return this.mapToDto(cloned);
  }

  /**
   * Map Prisma model to DTO
   */
  private mapToDto(template: any): JournalEntryTemplateDto {
    return {
      id: template.id,
      code: template.code,
      nameAr: template.nameAr,
      nameEn: template.nameEn,
      operationType: template.operationType,
      isActive: template.isActive,
      lines: template.lines?.map((line: any) => ({
        id: line.id,
        templateId: line.templateId,
        lineOrder: line.lineOrder,
        accountType: line.accountType,
        accountId: line.accountId,
        accountPlaceholder: line.accountPlaceholder,
        amountSource: line.amountSource,
        descriptionTemplate: line.descriptionTemplate,
        createdAt: line.createdAt,
      })),
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    };
  }
}
