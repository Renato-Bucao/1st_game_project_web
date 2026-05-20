import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user = request.user; // decoded JWT payload

    // ✅ If admin → always allow
    if (user.role === 'admin') {
      return true;
    }

    // ✅ If no roles required → allow
    if (!requiredRoles) {
      return true;
    }

    // ✅ Otherwise check if user role is in required roles
    return requiredRoles.includes(user.role);
  }
}
