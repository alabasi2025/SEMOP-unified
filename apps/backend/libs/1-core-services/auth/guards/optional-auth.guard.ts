// PHASE-14: تحسين جودة DTOs - إضافة تعليقات PHASE للتوثيق
import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

/**
 * Optional Auth Guard - يسمح بالوصول حتى بدون token
 * لكن إذا كان token موجود، يتم التحقق منه وإضافة user إلى request
 */
@Injectable()
export class OptionalAuthGuard implements CanActivate {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'SEMOP_SECRET_KEY';

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      // لا يوجد token - السماح بالوصول بدون user
      request.user = null;
      return true;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      request.user = null;
      return true;
    }

    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as any;
      request.user = {
        id: decoded.sub,
        username: decoded.username,
      };
    } catch (error) {
      // Token غير صحيح - السماح بالوصول بدون user
      request.user = null;
    }

    return true;
  }
}
