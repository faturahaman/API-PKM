import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { TenantContextService } from './tenant-context.service';
import { AdminRole } from '../../admins/entity/admin.entity';
/**
 * Tenant Guard - Fail-Safe Protection
 * 
 * This guard ensures that tenant context is present for protected endpoints.
 * It throws an error immediately if tenantId is missing for endpoints
 * that require tenant context.
 * 
 * Usage:
 * - Apply to controllers or routes that require tenant isolation
 * - Super Admin endpoints can bypass this by setting requireTenant: false
 */

@Injectable()
export class TenantGuard implements CanActivate {
    constructor(private readonly tenantContextService: TenantContextService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // If no user, let AuthGuard handle it
        if (!user) {
            return true;
        }

        // Get tenant ID from context
        const tenantId = this.tenantContextService.getTenantId();

        // Get role from user
        const role = user.role;

        // Super Admin can access without tenant context (they can view all)
        // But we still set the context for consistency
        if (role === AdminRole.SUPER_ADMIN) {
            return true;
        }

        // For OPERATOR, tenantId is required
        if (!tenantId) {
            throw new ForbiddenException(
                'Akses ditolak: Tenant context diperlukan. Silakan login ulang atau hubungi administrator.',
            );
        }

        return true;
    }
}
