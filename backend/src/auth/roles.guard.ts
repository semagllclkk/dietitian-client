import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('RolesGuard - Required roles:', requiredRoles);

    if (!requiredRoles) {
      console.log('RolesGuard - No required roles, allowing access');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('RolesGuard - User object:', user);
    console.log('RolesGuard - User role:', user?.role, 'Type:', typeof user?.role);

    if (!user || !user.role) {
      console.log('RolesGuard - DENIED: No user or no role');
      return false;
    }

    const hasRole = requiredRoles.includes(user.role);
    console.log('RolesGuard - Has required role:', hasRole);
    return hasRole;
  }
}
