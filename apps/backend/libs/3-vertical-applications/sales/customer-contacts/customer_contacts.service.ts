// PHASE: DTO_QUALITY_FIX
// PHASE 10: Customer Contacts Service
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../1-core-services/prisma/prisma.service';
import { } from '@semop/contracts';


@Injectable()
export class CustomerContactsService {
  constructor(private prisma: PrismaService) {}
}
