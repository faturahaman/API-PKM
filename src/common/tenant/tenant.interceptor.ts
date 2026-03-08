import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TenantContextService } from './tenant-context.service';
import { AdminRole } from '../../admins/entity/admin.entity';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
    private readonly logger = new Logger(TenantInterceptor.name);

    constructor(private readonly tenantContextService: TenantContextService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest<any>();
        const user = req.user;
        const path = req.path || req.url || '';

        // Get existing tenantId from middleware (for public routes)
        const existingTenantId = this.tenantContextService.getTenantId();

        let tenantId: string | null = existingTenantId;
        let isSuperAdmin = false;
        let role = 'public';
        let userId = 'public';

        if (user) {
            // For authenticated users, ALWAYS use the JWT's tenant (active_tenant for Super Admin, puskesmas_id for Operator)
            // The JWT is already validated by AuthGuard, so we trust it

            if (user.role === AdminRole.SUPER_ADMIN) {
                // Super Admin: use active_tenant from JWT (set by switch-tenant endpoint)
                tenantId = user.active_tenant || null;
            } else {
                // Operator: use puskesmas_id from JWT
                tenantId = user.puskesmas_id || null;
            }

            isSuperAdmin = user.role === AdminRole.SUPER_ADMIN;
            role = user.role;
            userId = user.sub;
        } else if (!tenantId && path.includes('/api')) {
            // For public routes without auth, try x-tenant-slug header first
            const headerTenantSlug = req.headers['x-tenant-slug'] as string;
            const headerTenantId = req.headers['x-tenant-id'] as string;

            if (headerTenantSlug && headerTenantSlug !== 'default') {
                tenantId = headerTenantSlug;
            }
            // Also try x-tenant-id header (UUID format) - accept any valid UUID
            if (headerTenantId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(headerTenantId as string)) {
                tenantId = headerTenantId as string;
            }
        }

        // Update context
        this.tenantContextService.updateContext({
            tenantId, userId, role, isSuperAdmin
        });

        this.logger.debug(`Tenant: ${tenantId} | Role: ${role} | Path: ${path}`);

        return next.handle();
    }
}
