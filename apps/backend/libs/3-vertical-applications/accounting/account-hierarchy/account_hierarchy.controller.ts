// PHASE: DTO_QUALITY_FIX
// PHASE 10: Account Hierarchy Controller
import { Controller } from '@nestjs/common';
import { AccountHierarchyService } from './account_hierarchy.service';
import { } from '@semop/contracts';


@Controller('account-hierarchy')
export class AccountHierarchyController {
  constructor(private readonly service: AccountHierarchyService) {}
}
