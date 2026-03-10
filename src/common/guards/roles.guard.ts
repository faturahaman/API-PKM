import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminRole } from '../../admins/entity/admin.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<AdminRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        if (!user) {
            throw new ForbiddenException('Akses ditolak. Anda belum terautentikasi.');
        }

        const hasRole = requiredRoles.includes(user.role as AdminRole);

        if (!hasRole) {
            throw new ForbiddenException(
                `Akses ditolak. Anda memerlukan role: ${requiredRoles.join(' atau ')}`
            );
        }

        return true;
    }
}
