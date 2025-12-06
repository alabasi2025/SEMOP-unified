// PHASE: DTO_QUALITY_FIX
/**
 * PHASE-11: Complete Backend Fixes
 * COMPONENT: Role Permissions Controller
 * IMPACT: Medium
 * 
 * Changes:
 * - Updated imports to use @semop/contracts
 * - Removed local DTO imports
 * 
 * Date: 2025-12-03
 * Author: Development Team
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { RolePermissionsService } from './role_permissions.service';
import { CreateRolePermissionDto, UpdateRolePermissionDto } from '@semop/contracts';

@Controller('role-permissions')
export class RolePermissionsController {
  constructor(private readonly rolePermissionsService: RolePermissionsService) {}

  @Post()
  create(@Body() createRolePermissionDto: CreateRolePermissionDto) {
    return this.rolePermissionsService.create(createRolePermissionDto);
  }

  @Get()
  findAll() {
    return this.rolePermissionsService.findAll();
  }

  @Get(':roleId/:permissionId')
  findOne(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Param('permissionId', ParseIntPipe) permissionId: number,
  ) {
    return this.rolePermissionsService.findOne(roleId, permissionId);
  }

  @Patch(':roleId/:permissionId')
  update(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Param('permissionId', ParseIntPipe) permissionId: number,
    @Body() updateRolePermissionDto: UpdateRolePermissionDto,
  ) {
    return this.rolePermissionsService.update(
      roleId,
      permissionId,
      updateRolePermissionDto,
    );
  }

  @Delete(':roleId/:permissionId')
  remove(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Param('permissionId', ParseIntPipe) permissionId: number,
  ) {
    return this.rolePermissionsService.remove(roleId, permissionId);
  }
}
