import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../../types/jwt.interface';
import { AdminRole } from '../../admins/entity/admin.entity';
import { PuskesmasService } from '../../puskesmas/puskesmas.service';
import { PuskesmasStatus } from '../../puskesmas/entity/puskesmas.entity';

interface AuthenticatedRequest {
    user?: JwtPayload;
}

/**
 * Tenant Status Guard
 * 
 * Validates tenant (puskesmas) status before allowing access.
 * - Operators cannot log in if their assigned puskesmas is not ACTIVE
 * - All tenant endpoints return forbidden if tenant is suspended/inactive
 * 
 * Apply this guard after AuthGuard in the guard chain
 */
@Injectable()
export class TenantStatusGuard implements CanActivate {
    constructor(private readonly puskesmasService: PuskesmasService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
        const user = request.user as JwtPayload | undefined;

        // If no user, let AuthGuard handle it
        if (!user) {
            return true;
        }

        // Super Admin bypasses tenant status check
        if (user.role === AdminRole.SUPER_ADMIN) {
            return true;
        }

        // Get the tenant ID for this request
        // For OPERATOR, use their puskesmas_id
        // For SUPER_ADMIN with active_tenant, use active_tenant
        const tenantId = user.active_tenant || user.puskesmas_id;

        if (!tenantId) {
            // No tenant assigned - this should be caught by TenantGuard
            throw new UnauthorizedException('Akun tidak memiliki puskesmas yang ditugaskan.');
        }

        // Get puskesmas status
        const puskesmas = await this.puskesmasService.findOne(tenantId);

        if (!puskesmas) {
            throw new ForbiddenException('Puskesmas tidak ditemukan.');
        }

        if (puskesmas.status === PuskesmasStatus.SUSPENDED) {
            throw new ForbiddenException(
                `Akses ditolak: Puskesmas "${puskesmas.name}" telah ditangguhkan.`,
            );
        }

        if (puskesmas.status === PuskesmasStatus.INACTIVE) {
            throw new ForbiddenException(
                `Akses ditolak: Puskesmas "${puskesmas.name}" sedang tidak aktif.`,
            );
        }

        // Attach puskesmas to request for later use
        (request as any).puskesmas = puskesmas;

        return true;
    }
}
