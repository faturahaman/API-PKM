import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TenantContextService } from './tenant-context.service';
import { AdminRole } from '../../admins/entity/admin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Puskesmas } from '../../puskesmas/entity/puskesmas.entity';

/**
 * Tenant Interceptor - Resolves and sets tenant context for each request
 * 
 * Priority for tenant resolution:
 * 1. Authenticated users: JWT puskesmas_id (Operator) or active_tenant (Super Admin)
 * 2. Public routes: x-tenant-id (UUID) or x-tenant-slug (resolved to UUID)
 */

@Injectable()
export class TenantInterceptor implements NestInterceptor {
    private readonly logger = new Logger(TenantInterceptor.name);

    constructor(
        private readonly tenantContextService: TenantContextService,
        @InjectRepository(Puskesmas)
        private readonly puskesmasRepo: Repository<Puskesmas>
    ) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest<any>();
        const user = req.user;
        const path = req.path || req.url || '';

        let tenantId: string | null = null;
        let isSuperAdmin = false;
        let role = 'public';
        let userId = 'public';

        if (user) {
            // For authenticated users, ALWAYS use the JWT's tenant (active_tenant for Super Admin, puskesmas_id for Operator)
            // The JWT is already validated by AuthGuard, so we trust it

            if (user.role === AdminRole.SUPER_ADMIN) {
                // Super Admin: use active_tenant from JWT (set by switch-tenant endpoint)
                // If no active_tenant, they can view all (null tenantId)
                tenantId = user.active_tenant || null;
            } else {
                // Operator: use puskesmas_id from JWT
                tenantId = user.puskesmas_id || null;
            }

            isSuperAdmin = user.role === AdminRole.SUPER_ADMIN;
            role = user.role;
            userId = user.sub;
        } else if (path.includes('/api')) {
            // For public routes without auth, resolve tenant from headers
            const headerTenantSlug = req.headers['x-tenant-slug'] as string;
            const headerTenantId = req.headers['x-tenant-id'] as string;

            // Priority: x-tenant-id (UUID) first, then resolve slug
            if (headerTenantId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(headerTenantId as string)) {
                // Valid UUID format
                tenantId = headerTenantId as string;
            } else if (headerTenantSlug && headerTenantSlug !== 'default') {
                // Resolve slug to UUID
                try {
                    const puskesmas = await this.puskesmasRepo.findOne({
                        where: { slug: headerTenantSlug },
                        select: ['id']
                    });
                    if (puskesmas) {
                        tenantId = puskesmas.id;
                    } else {
                        this.logger.warn(`[TenantInterceptor] Tenant slug "${headerTenantSlug}" not found`);
                    }
                } catch (e) {
                    this.logger.warn(`[TenantInterceptor] Failed to resolve slug: ${e.message}`);
                }
            }
        }

        // Update context
        this.tenantContextService.updateContext({
            tenantId, userId, role, isSuperAdmin
        });

        this.logger.log(`[TenantInterceptor] Tenant: ${tenantId} | Role: ${role} | UserId: ${userId} | Path: ${path}`);

        return next.handle();
    }
}
