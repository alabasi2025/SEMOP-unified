// PHASE: DTO_QUALITY_FIX
// PHASE-14: تحسين جودة DTOs - إضافة تعليقات PHASE للتوثيق
// PHASE-13: إضافة Input Validation وتحسين Business Logic
// PHASE-13: إضافة Input Validation وتحسين Business Logic
// PHASE-11: إصلاح انتهاكات DTOs والبنية المعمارية - استخدام @semop/contracts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { LoginDto } from '@semop/contracts';

@Injectable()
export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'SEMOP_SECRET_KEY';
  private readonly JWT_EXPIRES_IN = '24h';

  // Dummy users for testing - في الإنتاج يجب استخدام قاعدة البيانات
  private readonly users = [
    {
      id: 1,
      username: 'admin',
      password: 'admin123', // في الإنتاج يجب تشفير كلمة المرور
      email: 'admin@semop.com',
      firstName: 'مدير',
      lastName: 'النظام',
      isActive: true,
      roleId: 1
    }
  ];

  async login(loginDto: LoginDto) {
    const username = (loginDto as any).username; const password = (loginDto as any).password;

    // Find user
    const user = this.users.find(
      u => u.username === username && u.password === password
    );

    if (!user) {
      throw new UnauthorizedException('اسم المستخدم أو كلمة المرور غير صحيحة');
    }

    // Generate tokens
    const payload = { sub: user.id, username: user.username };
    const accessToken = jwt.sign(payload, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRES_IN });
    const refreshToken = jwt.sign(payload, this.JWT_SECRET, { expiresIn: '7d' });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return {
      accessToken,
      refreshToken,
      user: userWithoutPassword
    };
  }
}
