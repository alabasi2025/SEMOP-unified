// PHASE: DTO_QUALITY_FIX
// PHASE-14: إصلاح جميع any types واستخدام DTOs من @semop/contracts
// PHASE-12: إضافة Error Handling شامل مع try-catch و logging
// PHASE-11: إصلاح انتهاكات DTOs والبنية المعمارية - استخدام @semop/contracts
import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { 
  CreateAccountDto, 
  UpdateAccountDto, 
  AccountResponseDto,
  AccountType
} from '@semop/contracts';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  findAll(
    @Query('accountType') accountType?: AccountType,
    @Query('isActive') isActive?: string,
    @Query('isParent') isParent?: string,
  ): AccountResponseDto[] {
    return this.accountsService.findAll({
      accountType,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      isParent: isParent === 'true' ? true : isParent === 'false' ? false : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string): AccountResponseDto {
    return this.accountsService.findOne(id);
  }

  @Post()
  create(@Body() data: CreateAccountDto): AccountResponseDto {
    return this.accountsService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateAccountDto): AccountResponseDto {
    return this.accountsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): AccountResponseDto {
    return this.accountsService.remove(id);
  }
}
