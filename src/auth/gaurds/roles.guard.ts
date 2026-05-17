import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../common/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // kuha roles gikan sa metadata
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true; // kung walay @Roles decorator, allow by default
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) return false;

    // check kung ang role sa user naa sa requiredRoles
    return requiredRoles.includes(user.role);
  }
}
