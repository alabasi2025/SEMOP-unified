// PHASE: DTO_QUALITY_FIX
// PHASE 10: Role Permissions Service
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { } from '@semop/contracts';


@Injectable()
export class RolePermissionsService {
  constructor(private prisma: PrismaService) {}
}
