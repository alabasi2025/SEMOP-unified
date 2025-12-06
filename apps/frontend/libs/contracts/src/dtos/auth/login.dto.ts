/**
 * SEMOP - Login DTO
 * كائن نقل البيانات لتسجيل الدخول
 * 
 * @module LoginDto
 * @version 0.2.0
 * @date 2025-11-20
 */

import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Email or username is required' })
  @IsString({ message: 'Email or username must be a string' })
  emailOrUsername: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}

export class LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    holdingId?: string;
    unitId?: string;
    projectId?: string;
  };
}

export class RefreshTokenDto {
  @IsNotEmpty({ message: 'Refresh token is required' })
  @IsString({ message: 'Refresh token must be a string' })
  refreshToken: string;
}

export class RefreshTokenResponseDto {
  accessToken: string;
}
