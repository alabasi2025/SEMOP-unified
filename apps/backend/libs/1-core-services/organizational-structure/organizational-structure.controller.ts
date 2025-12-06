// PHASE: DTO_QUALITY_FIX
// PHASE-14: إصلاح جميع any types واستخدام DTOs من @semop/contracts
// PHASE-12: إضافة Error Handling شامل مع try-catch و logging
// PHASE-11: إصلاح انتهاكات DTOs والبنية المعمارية - استخدام @semop/contracts
/**
 * PHASE 10: Organizational Structure Development
 */
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { OrganizationalStructureService } from './organizational-structure.service';
import { CreateDepartmentDto, UpdateDepartmentDto, CreatePositionDto, UpdatePositionDto, CreateEmployeeDto, UpdateEmployeeDto } from '@semop/contracts';

@Controller('organizational-structure')
export class OrganizationalStructureController {
  constructor(private readonly service: OrganizationalStructureService) {}

  @Post('departments')
  createDepartment(@Body() dto: CreateDepartmentDto) {
    return this.service.createDepartment(dto);
  }

  @Get('departments')
  getAllDepartments() {
    return this.service.getAllDepartments();
  }

  @Get('departments/:id')
  getDepartmentById(@Param('id') id: string) {
    return this.service.getDepartmentById(id);
  }

  @Put('departments/:id')
  updateDepartment(@Param('id') id: string, @Body() dto: UpdateDepartmentDto) {
    return this.service.updateDepartment(id, dto);
  }

  @Delete('departments/:id')
  deleteDepartment(@Param('id') id: string) {
    return this.service.deleteDepartment(id);
  }

  @Get('departments/hierarchy/tree')
  getDepartmentHierarchy() {
    return this.service.getDepartmentHierarchy();
  }

  @Post('positions')
  createPosition(@Body() dto: CreatePositionDto) {
    return this.service.createPosition(dto);
  }

  @Get('positions')
  getAllPositions() {
    return this.service.getAllPositions();
  }

  @Get('positions/:id')
  getPositionById(@Param('id') id: string) {
    return this.service.getPositionById(id);
  }

  @Put('positions/:id')
  updatePosition(@Param('id') id: string, @Body() dto: UpdatePositionDto) {
    return this.service.updatePosition(id, dto);
  }

  @Delete('positions/:id')
  deletePosition(@Param('id') id: string) {
    return this.service.deletePosition(id);
  }

  @Post('employees')
  createEmployee(@Body() dto: CreateEmployeeDto) {
    return this.service.createEmployee(dto);
  }

  @Get('employees')
  getAllEmployees() {
    return this.service.getAllEmployees();
  }

  @Get('employees/:id')
  getEmployeeById(@Param('id') id: string) {
    return this.service.getEmployeeById(id);
  }

  @Put('employees/:id')
  updateEmployee(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    return this.service.updateEmployee(id, dto);
  }

  @Delete('employees/:id')
  deleteEmployee(@Param('id') id: string) {
    return this.service.deleteEmployee(id);
  }

  @Get('departments/:id/employees')
  getEmployeesByDepartment(@Param('id') id: string) {
    return this.service.getEmployeesByDepartment(id);
  }

  @Get('statistics')
  getStatistics() {
    return this.service.getStatistics();
  }
}
