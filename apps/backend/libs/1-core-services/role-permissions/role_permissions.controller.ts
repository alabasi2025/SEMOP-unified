// PHASE: DTO_QUALITY_FIX
// PHASE 10: Role Permissions Controller
import { Controller } from '@nestjs/common';
import { RolePermissionsService } from './role_permissions.service';
import { } from '@semop/contracts';


@Controller('role-permissions')
export class RolePermissionsController {
  constructor(private readonly service: RolePermissionsService) {}
}
