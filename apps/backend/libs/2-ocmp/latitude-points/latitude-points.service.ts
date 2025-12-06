// PHASE: DTO_QUALITY_FIX
// PHASE-14: تحسين جودة DTOs - إضافة تعليقات PHASE للتوثيق
/**
 * PHASE-11: Complete Backend Fixes
 * COMPONENT: Latitude Points Service
 * IMPACT: Critical
 * 
 * Changes:
 * - Updated imports to use @semop/contracts
 * - Removed local DTOs
 * - Fixed PrismaService import path
 * 
 * Date: 2025-12-03
 * Author: Development Team
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../1-core-services/prisma/prisma.service';
import { CreateLatitudePointDto, UpdateLatitudePointDto } from '@semop/contracts';

@Injectable()
export class LatitudePointsService {
  constructor(private prisma: PrismaService) {}

  async create(createLatitudePointDto: CreateLatitudePointDto) {
    try {
      return await this.prisma.latitudePoint.create({
        data: createLatitudePointDto as any,
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.latitudePoint.findMany();
  }

  async findOne(id: number) {
    const point = await this.prisma.latitudePoint.findUnique({
      where: { id },
    });

    if (!point) {
      throw new NotFoundException(`Latitude Point with ID ${id} not found`);
    }
    return point;
  }

  async update(id: number, updateLatitudePointDto: UpdateLatitudePointDto) {
    try {
      return await this.prisma.latitudePoint.update({
        where: { id },
        data: updateLatitudePointDto as any,
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.latitudePoint.delete({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }
}
