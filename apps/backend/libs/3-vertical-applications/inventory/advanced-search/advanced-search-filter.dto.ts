// /root/task_outputs/Task2_Advanced_Search_Filters/backend/advanced-search-filter.dto.ts
// DTO لتمثيل معايير البحث المتقدم
import { IsOptional, IsArray, IsNumber, IsString, IsIn } from 'class-validator';

export class AdvancedSearchFilterDto {
  @IsOptional()
  @IsString()
  searchTerm?: string; // البحث العام في الاسم والكود

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  category?: string[]; // فلاتر الفئة (اختيار متعدد)

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  status?: string[]; // فلاتر الحالة (اختيار متعدد)

  @IsOptional()
  @IsNumber()
  minQuantity?: number; // الحد الأدنى للكمية

  @IsOptional()
  @IsNumber()
  maxQuantity?: number; // الحد الأقصى للكمية

  @IsOptional()
  @IsNumber()
  minPrice?: number; // الحد الأدنى للسعر

  @IsOptional()
  @IsNumber()
  maxPrice?: number; // الحد الأقصى للسعر

  @IsOptional()
  @IsNumber()
  page?: number = 1; // رقم الصفحة

  @IsOptional()
  @IsNumber()
  pageSize?: number = 10; // حجم الصفحة

  @IsOptional()
  @IsString()
  sortBy?: string = 'id'; // حقل الترتيب

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'ASC'; // اتجاه الترتيب
}
