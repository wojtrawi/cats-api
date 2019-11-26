import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const routePermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    if (!routePermissions) {
      return true;
    }

    const scopeClaim = context.getArgs()[0].user.scope;

    if (!scopeClaim) {
      return false;
    }

    const userPermissions = scopeClaim.split(' ');

    const hasPermission = () =>
      userPermissions.some(permission => routePermissions.includes(permission));

    return hasPermission();
  }
}
