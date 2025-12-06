// PHASE: DTO_QUALITY_FIX
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { AccountHierarchyService } from './account_hierarchy.service';
import { CreateAccountHierarchyDto, UpdateAccountHierarchyDto } from './account_hierarchy.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { } from '@semop/contracts';


@ApiTags('account-hierarchy')
@Controller('account-hierarchy')
export class AccountHierarchyController {
  constructor(private readonly accountHierarchyService: AccountHierarchyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'إنشاء هيكلية حسابات جديدة' })
  @ApiResponse({ status: 201, description: 'تم إنشاء الهيكلية بنجاح.' })
  create(@Body() createAccountHierarchyDto: CreateAccountHierarchyDto) {
    return this.accountHierarchyService.create(createAccountHierarchyDto);
  }

  @Get()
  @ApiOperation({ summary: 'الحصول على جميع هيكليات الحسابات' })
  @ApiResponse({ status: 200, description: 'قائمة بهيكليات الحسابات.' })
  findAll() {
    return this.accountHierarchyService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'الحصول على هيكلية حسابات بواسطة ID' })
  @ApiResponse({ status: 200, description: 'الهيكلية المطلوبة.' })
  @ApiResponse({ status: 404, description: 'لم يتم العثور على الهيكلية.' })
  findOne(@Param('id') id: string) {
    return this.accountHierarchyService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'تحديث هيكلية حسابات بواسطة ID' })
  @ApiResponse({ status: 200, description: 'تم تحديث الهيكلية بنجاح.' })
  @ApiResponse({ status: 404, description: 'لم يتم العثور على الهيكلية.' })
  update(@Param('id') id: string, @Body() updateAccountHierarchyDto: UpdateAccountHierarchyDto) {
    return this.accountHierarchyService.update(id, updateAccountHierarchyDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'حذف هيكلية حسابات بواسطة ID' })
  @ApiResponse({ status: 204, description: 'تم حذف الهيكلية بنجاح.' })
  @ApiResponse({ status: 404, description: 'لم يتم العثور على الهيكلية.' })
  remove(@Param('id') id: string) {
    return this.accountHierarchyService.remove(id);
  }
}
