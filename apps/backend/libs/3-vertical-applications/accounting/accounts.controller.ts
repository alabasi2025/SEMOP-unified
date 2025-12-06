import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  UsePipes,
  ValidationPipe,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

// *******************************************************************************************************************
// ملاحظة: في بيئة NestJS حقيقية، سيتم استيراد هذه العناصر من حزم أخرى (مثل @semop/contracts و AccountsService)
// يتم تعريفها هنا كـ "Placeholders" لضمان صحة البنية البرمجية والالتزام بالمتطلبات.
// *******************************************************************************************************************

// Placeholder DTOs (افتراض أنها من @semop/contracts)
class AccountDto {
  id: string;
  name: string;
  code: string;
  type: string;
  balance: number;
}

class CreateAccountDto {
  name: string;
  code: string;
  type: string;
  initialBalance: number;
}

class UpdateAccountDto {
  name?: string;
  type?: string;
}

class FindAccountsQueryDto {
  type?: string;
  isActive?: boolean;
  limit?: number;
  offset?: number;
}

// Placeholder Service
class AccountsService {
  async findAll(query: FindAccountsQueryDto): Promise<AccountDto[]> {
    // منطق وهمي
    return [{ id: '1', name: 'Cash', code: '101', type: 'Asset', balance: 1000 }];
  }
  async findOne(id: string): Promise<AccountDto | null> {
    // منطق وهمي
    return id === '1' ? { id: '1', name: 'Cash', code: '101', type: 'Asset', balance: 1000 } : null;
  }
  async create(data: CreateAccountDto): Promise<AccountDto> {
    // منطق وهمي
    return { id: '2', ...data, balance: data.initialBalance };
  }
  async update(id: string, data: UpdateAccountDto): Promise<AccountDto | null> {
    // منطق وهمي
    return id === '1' ? { id: '1', name: data.name || 'Cash', code: '101', type: data.type || 'Asset', balance: 1000 } : null;
  }
  async remove(id: string): Promise<boolean> {
    // منطق وهمي
    return id === '1';
  }
  async getAccountTree(): Promise<any> {
    // منطق وهمي
    return [{ name: 'Assets', children: [] }];
  }
  async searchAccounts(query: FindAccountsQueryDto): Promise<AccountDto[]> {
    // منطق وهمي
    return [{ id: '3', name: 'Bank', code: '102', type: 'Asset', balance: 5000 }];
  }
}

// *******************************************************************************************************************
// Controller Implementation
// *******************************************************************************************************************

@Controller('accounting/accounts') // المسار المطلوب: accounting/accounts
@ApiTags('Accounting') // توثيق Swagger
@UsePipes(new ValidationPipe({ transform: true, whitelist: true })) // تطبيق ValidationPipe على مستوى Controller
export class AccountsController {
  // حقن الخدمة المطلوبة في constructor
  constructor(private readonly accountsService: AccountsService) {}

  /**
   * @Get() - جلب قائمة بجميع الحسابات
   */
  @Get()
  @ApiOperation({ summary: 'جلب قائمة بجميع الحسابات', description: 'يسترجع قائمة بجميع الحسابات مع إمكانية التصفية والتقسيم.' })
  @ApiQuery({ name: 'type', required: false, description: 'نوع الحساب للتصفية (مثل Asset, Liability)' })
  @ApiQuery({ name: 'isActive', required: false, description: 'حالة الحساب (نشط/غير نشط)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'نجاح العملية. قائمة الحسابات.', type: [AccountDto] })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'خطأ داخلي في الخادم.' })
  async findAll(@Query() query: FindAccountsQueryDto): Promise<AccountDto[]> {
    try {
      // استدعاء الخدمة لجلب البيانات
      const accounts = await this.accountsService.findAll(query);
      return accounts;
    } catch (error) {
      // معالجة الأخطاء العامة
      throw new InternalServerErrorException('حدث خطأ أثناء جلب قائمة الحسابات. يرجى المحاولة لاحقاً.');
    }
  }

  /**
   * @Get(':id') - جلب تفاصيل حساب معين بواسطة المعرف (ID)
   */
  @Get(':id')
  @ApiOperation({ summary: 'جلب تفاصيل حساب معين', description: 'يسترجع تفاصيل حساب محدد باستخدام المعرف الفريد.' })
  @ApiParam({ name: 'id', description: 'المعرف الفريد للحساب', type: 'string' })
  @ApiResponse({ status: HttpStatus.OK, description: 'نجاح العملية. تفاصيل الحساب.', type: AccountDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'الحساب غير موجود.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'معرف الحساب غير صالح.' })
  async findOne(@Param('id') id: string): Promise<AccountDto> {
    try {
      // التحقق من صحة المعرف (افتراض أن ValidationPipe يقوم بالتحقق الأساسي)
      if (!id) {
        throw new BadRequestException('معرف الحساب غير صالح.');
      }

      const account = await this.accountsService.findOne(id);

      if (!account) {
        // رمي استثناء NotFoundException إذا لم يتم العثور على الحساب
        throw new NotFoundException(`الحساب بالمعرف ${id} غير موجود.`);
      }

      return account;
    } catch (error) {
      // إعادة رمي الاستثناءات المعروفة أو رمي خطأ داخلي
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(`حدث خطأ أثناء جلب تفاصيل الحساب ${id}. يرجى المحاولة لاحقاً.`);
    }
  }

  /**
   * @Post() - إنشاء حساب جديد
   */
  @Post()
  @ApiOperation({ summary: 'إنشاء حساب جديد', description: 'يضيف حساباً جديداً إلى نظام المحاسبة.' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'تم إنشاء الحساب بنجاح.', type: AccountDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'بيانات الإدخال غير صالحة.' })
  async create(@Body() createAccountDto: CreateAccountDto): Promise<AccountDto> {
    try {
      // استدعاء الخدمة لإنشاء الحساب
      const newAccount = await this.accountsService.create(createAccountDto);
      return newAccount;
    } catch (error) {
      // معالجة الأخطاء المتعلقة ببيانات الإدخال (مثل تكرار كود الحساب)
      if (error.message.includes('duplicate')) {
        throw new BadRequestException('فشل إنشاء الحساب: كود الحساب موجود بالفعل.');
      }
      throw new InternalServerErrorException('حدث خطأ أثناء إنشاء الحساب. يرجى التحقق من البيانات والمحاولة لاحقاً.');
    }
  }

  /**
   * @Put(':id') - تحديث تفاصيل حساب معين
   */
  @Put(':id')
  @ApiOperation({ summary: 'تحديث تفاصيل حساب معين', description: 'يحدث تفاصيل حساب محدد باستخدام المعرف الفريد.' })
  @ApiParam({ name: 'id', description: 'المعرف الفريد للحساب المراد تحديثه', type: 'string' })
  @ApiResponse({ status: HttpStatus.OK, description: 'تم تحديث الحساب بنجاح.', type: AccountDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'الحساب غير موجود.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'بيانات التحديث غير صالحة.' })
  async update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto): Promise<AccountDto> {
    try {
      const updatedAccount = await this.accountsService.update(id, updateAccountDto);

      if (!updatedAccount) {
        // رمي استثناء NotFoundException إذا لم يتم العثور على الحساب
        throw new NotFoundException(`الحساب بالمعرف ${id} غير موجود لتحديثه.`);
      }

      return updatedAccount;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      // معالجة الأخطاء المتعلقة ببيانات التحديث
      throw new InternalServerErrorException(`حدث خطأ أثناء تحديث الحساب ${id}. يرجى المحاولة لاحقاً.`);
    }
  }

  /**
   * @Delete(':id') - حذف حساب معين
   */
  @Delete(':id')
  @ApiOperation({ summary: 'حذف حساب معين', description: 'يحذف حساباً محدداً باستخدام المعرف الفريد.' })
  @ApiParam({ name: 'id', description: 'المعرف الفريد للحساب المراد حذفه', type: 'string' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'تم حذف الحساب بنجاح.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'الحساب غير موجود.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'لا يمكن حذف الحساب (قد يكون مرتبطاً بحركات).' })
  async remove(@Param('id') id: string): Promise<void> {
    try {
      const isRemoved = await this.accountsService.remove(id);

      if (!isRemoved) {
        // يمكن أن يكون الحساب غير موجود أو لا يمكن حذفه بسبب قيود
        const accountExists = await this.accountsService.findOne(id);
        if (!accountExists) {
          throw new NotFoundException(`الحساب بالمعرف ${id} غير موجود للحذف.`);
        } else {
          throw new BadRequestException(`لا يمكن حذف الحساب ${id}. قد يكون مرتبطاً بحركات مالية.`);
        }
      }
      // لا يوجد محتوى للإرجاع بعد الحذف الناجح (204 No Content)
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(`حدث خطأ أثناء حذف الحساب ${id}. يرجى المحاولة لاحقاً.`);
    }
  }

  /**
   * @Get('tree') - جلب شجرة الحسابات
   */
  @Get('tree')
  @ApiOperation({ summary: 'جلب شجرة الحسابات', description: 'يسترجع هيكل شجرة الحسابات لتسهيل العرض الهرمي.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'نجاح العملية. هيكل شجرة الحسابات.', type: 'object' })
  async getAccountTree(): Promise<any> {
    try {
      const tree = await this.accountsService.getAccountTree();
      return tree;
    } catch (error) {
      throw new InternalServerErrorException('حدث خطأ أثناء جلب شجرة الحسابات. يرجى المحاولة لاحقاً.');
    }
  }

  /**
   * @Get('search') - البحث عن حسابات
   */
  @Get('search')
  @ApiOperation({ summary: 'البحث عن حسابات', description: 'يسمح بالبحث عن حسابات بناءً على معايير متعددة.' })
  @ApiQuery({ name: 'type', required: false, description: 'نوع الحساب للبحث' })
  @ApiQuery({ name: 'isActive', required: false, description: 'حالة الحساب' })
  @ApiResponse({ status: HttpStatus.OK, description: 'نجاح العملية. قائمة نتائج البحث.', type: [AccountDto] })
  async searchAccounts(@Query() query: FindAccountsQueryDto): Promise<AccountDto[]> {
    try {
      // إعادة استخدام نفس منطق findAll ولكن بمسار مختلف لأغراض RESTful Search
      const results = await this.accountsService.searchAccounts(query);
      return results;
    } catch (error) {
      throw new InternalServerErrorException('حدث خطأ أثناء البحث عن الحسابات. يرجى المحاولة لاحقاً.');
    }
  }
}
