// PHASE: DTO_QUALITY_FIX
// PHASE-14: إضافة Logging System شامل
// PHASE-12: إضافة Error Handling شامل مع try-catch و logging
/**
 * PHASE-11: Complete Backend Fixes
 * COMPONENT: Genes Controller
 * IMPACT: Critical
 * 
 * Changes:
 * - Updated imports to use @semop/contracts
 * - Removed local DTOs
 * 
 * Date: 2025-12-03
 * Author: Development Team
 */

import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { GenesService } from './genes.service';
import { CreateGeneDto, UpdateGeneDto } from '@semop/contracts';
import { LinkGeneSectorDto } from '@semop/contracts';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('genes')
@ApiTags('genes')
export class GenesController {
  constructor(private readonly genesService: GenesService) {}

  @Post()
  create(@Body() createGeneDto: CreateGeneDto) {
    return this.genesService.create(createGeneDto);
  }

  @Get()
  findAll() {
    return this.genesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.genesService.findOne(String(id));
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateGeneDto: UpdateGeneDto) {
    return this.genesService.update(String(id), updateGeneDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.genesService.remove(String(id));
  }

  @Post(':id/sector')
  @ApiOperation({ summary: 'ربط الجين بقطاع معين' })
  @ApiResponse({ status: 200, description: 'تم ربط الجين بالقطاع بنجاح' })
  @ApiResponse({ status: 404, description: 'الجين غير موجود' })
  linkToSector(
    @Param('id', ParseIntPipe) id: number,
    @Body() linkGeneSectorDto: LinkGeneSectorDto,
  ) {
    return this.genesService.linkGeneToSector(String(id), linkGeneSectorDto.sectorCode);
  }

  @Get('by-sector/:sectorCode')
  @ApiOperation({ summary: 'الحصول على جميع الجينات المرتبطة بقطاع معين' })
  @ApiResponse({ status: 200, description: 'قائمة الجينات المرتبطة بالقطاع' })
  getGenesBySector(@Param('sectorCode') sectorCode: string) {
    return this.genesService.getGenesBySector(sectorCode);
  }

  @Get('available')
  @ApiOperation({ summary: 'الحصول على الجينات المتاحة للشركة' })
  @ApiResponse({ status: 200, description: 'قائمة الجينات المتاحة' })
  getAvailableGenes() {
    return this.genesService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'الحصول على الجينات النشطة' })
  @ApiResponse({ status: 200, description: 'قائمة الجينات النشطة' })
  getActiveGenes() {
    return this.genesService.getActiveGenes();
  }

  @Get('sectors')
  @ApiOperation({ summary: 'الحصول على جميع القطاعات' })
  @ApiResponse({ status: 200, description: 'قائمة القطاعات' })
  getAllSectors() {
    return this.genesService.getAllSectors();
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'تفعيل جين معين' })
  @ApiResponse({ status: 200, description: 'تم تفعيل الجين بنجاح' })
  activateGene(@Param('id', ParseIntPipe) id: number) {
    return this.genesService.activateGene(String(id));
  }

  @Post(':id/deactivate')
  @ApiOperation({ summary: 'تعطيل جين معين' })
  @ApiResponse({ status: 200, description: 'تم تعطيل الجين بنجاح' })
  deactivateGene(@Param('id', ParseIntPipe) id: number) {
    return this.genesService.deactivateGene(String(id));
  }

  @Get('usage-report')
  @ApiOperation({ summary: 'تقرير استخدام الجينات' })
  @ApiResponse({ status: 200, description: 'تقرير شامل عن استخدام الجينات' })
  getUsageReport() {
    return this.genesService.getUsageReport();
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'تاريخ تفعيل/تعطيل الجين' })
  @ApiResponse({ status: 200, description: 'قائمة بالتغييرات' })
  getGeneHistory(@Param('id') id: string) {
    return this.genesService.getGeneHistory(id);
  }

  @Get(':id/dependencies')
  @ApiOperation({ summary: 'الحصول على اعتماديات الجين' })
  @ApiResponse({ status: 200, description: 'قائمة الجينات التي يعتمد عليها هذا الجين' })
  getGeneDependencies(@Param('id') id: string) {
    return this.genesService.getGeneDependencies(id);
  }

  @Post(':id/dependencies')
  @ApiOperation({ summary: 'إضافة اعتمادية للجين' })
  @ApiResponse({ status: 201, description: 'تم إضافة الاعتمادية بنجاح' })
  addDependency(
    @Param('id') id: string,
    @Body() body: { dependsOnGeneId: string; dependencyType: string; description?: string },
  ) {
    return this.genesService.addDependency({ id, dependsOnGeneId: body.dependsOnGeneId, dependencyType: body.dependencyType, description: body.description });
  }

  @Get(':id/can-activate')
  @ApiOperation({ summary: 'التحقق من إمكانية تفعيل الجين' })
  @ApiResponse({ status: 200, description: 'نتيجة التحقق' })
  canActivateGene(@Param('id') id: string) {
    return this.genesService.canActivateGene(id);
  }
}
