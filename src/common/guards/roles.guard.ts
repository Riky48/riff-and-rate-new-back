import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Obtener los roles requeridos definidos en @Roles(...)
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si la ruta no tiene decorador @Roles, se permite el acceso
    if (!requiredRoles) {
      return true;
    }

    // 2. Extraer el usuario adjuntado por el JwtAuthGuard
    const { user } = context.switchToHttp().getRequest();

    // 3. Verificar si el usuario tiene el rol necesario
    const hasRole = requiredRoles.includes(user?.rol);

    if (!hasRole) {
      throw new ForbiddenException('No tenés permisos suficientes para realizar esta acción');
    }

    return true;
  }
}