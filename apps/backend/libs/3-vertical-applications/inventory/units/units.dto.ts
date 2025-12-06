import { IsString, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateUnitDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  nameAr: string;

  @IsString()
  @IsOptional()
  nameEn?: string;

  @IsString()
  @IsOptional()
  symbol?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateUnitDto {
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  nameAr?: string;

  @IsString()
  @IsOptional()
  nameEn?: string;

  @IsString()
  @IsOptional()
  symbol?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UnitResponseDto {
  id: string;
  code: string;
  nameAr: string;
  nameEn?: string;
  symbol?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
