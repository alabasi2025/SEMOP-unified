// PHASE: DTO_QUALITY_FIX
// PHASE 10: Account Hierarchy Service
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../1-core-services/prisma/prisma.service';
import { } from '@semop/contracts';


@Injectable()
export class AccountHierarchyService {
  constructor(private prisma: PrismaService) {}
}
