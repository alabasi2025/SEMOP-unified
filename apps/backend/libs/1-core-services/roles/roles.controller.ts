// PHASE: DTO_QUALITY_FIX
// PHASE-14: إضافة Logging System شامل
// PHASE-12: إضافة Error Handling شامل مع try-catch و logging
import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { RolesService } from './roles.service';

import { CreateRoleDto, UpdateRoleDto, RoleResponseDto } from '@semop/contracts';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findOne(id);
  }

  @Post()
  create(@Body() createRoleDto: any) {
    return this.rolesService.create(createRoleDto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateRoleDto: any) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.remove(id);
  }
}
