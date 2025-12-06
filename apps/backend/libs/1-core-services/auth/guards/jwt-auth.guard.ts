// PHASE-14: تحسين جودة DTOs - إضافة تعليقات PHASE للتوثيق
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'SEMOP_SECRET_KEY';

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('لم يتم توفير رمز المصادقة');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('رمز المصادقة غير صحيح');
    }

    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as any;
      request.user = {
        id: decoded.sub,
        username: decoded.username,
      };
      return true;
    } catch (error) {
      throw new UnauthorizedException('رمز المصادقة منتهي الصلاحية أو غير صحيح');
    }
  }
}
