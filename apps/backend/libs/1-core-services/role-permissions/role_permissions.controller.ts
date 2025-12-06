// PHASE: DTO_QUALITY_FIX
// PHASE 10: Role Permissions Controller
import { Controller } from '@nestjs/common';
import { RolePermissionsService } from './role_permissions.service';


@Controller('role-permissions')
export class RolePermissionsController {
  constructor(private readonly service: RolePermissionsService) {}
}
