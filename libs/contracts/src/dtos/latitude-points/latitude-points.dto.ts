import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateLatitudePointDto {
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @IsString()
  @IsNotEmpty()
  point_name: string;
}

export class UpdateLatitudePointDto {
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsString()
  @IsOptional()
  point_name?: string;
}
