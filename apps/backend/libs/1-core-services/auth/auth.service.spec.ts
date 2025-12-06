/**
 * PHASE-11: Complete Backend Tests
 * COMPONENT: Auth Service Tests
 * IMPACT: Critical
 * 
 * Date: 2025-12-03
 * Author: Development Team
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should throw UnauthorizedException for invalid token', () => {
      expect(() => service.validateUser('invalid-token')).toThrow(UnauthorizedException);
    });

    it('should return user for valid token', () => {
      const token = service.generateToken({ id: '1', username: 'test' });
      const user = service.validateUser(token);
      expect(user).toBeDefined();
      expect(user.id).toBe('1');
    });
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const payload = { id: '1', username: 'test' };
      const token = service.generateToken(payload);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });
  });
});
