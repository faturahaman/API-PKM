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
 * 2. Subdomain: pkm-bogor-tengah.localhost -> slug = pkm-bogor-tengah
 * 3. Header: x-tenant-id (UUID) or x-tenant-slug
 */

@Injectable()
export class TenantInterceptor implements NestInterceptor {
    private readonly logger = new Logger(TenantInterceptor.name);

    constructor(
        private readonly tenantContextService: TenantContextService,
        @InjectRepository(Puskesmas)
        private readonly puskesmasRepo: Repository<Puskesmas>,
    ) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest<any>();
        const user = req.user;
        const path = req.path || req.url || '';

        let tenantId: string | null = null;
        let isSuperAdmin = false;
        let role = 'public';
        let userId = 'public';
        let puskesmas: Puskesmas | null = null;

        // PRIORITY 1: Authenticated users (JWT)
        if (user) {
            if (user.role === AdminRole.SUPER_ADMIN) {
                tenantId = user.active_tenant || null;
            } else {
                tenantId = user.puskesmas_id || null;
            }

            isSuperAdmin = user.role === AdminRole.SUPER_ADMIN;
            role = user.role;
            userId = user.sub;
        }
        // PRIORITY 2: Resolve from hostname/subdomain
        else {
            const host = req.headers.host || '';

            // Handle localhost development with custom hosts
            // Check for format: subdomain.localhost:3000 or subdomain.localhost
            const isLocalhostDev = host.includes('localhost') || host.includes('.local');
            const isIP = /^\d+\.\d+\.\d+\.\d+/.test(host.split(':')[0]);

            // For local development, still try to extract subdomain
            if (isLocalhostDev) {
                const hostname = host.split(':')[0];
                // Extract subdomain from patterns like: pkm-bogor-tengah.localhost
                const parts = hostname.split('.');

                // Check if it follows subdomain.localhost pattern
                if (parts.length >= 2 && parts[parts.length - 1] === 'localhost') {
                    const subdomain = parts[0];
                    if (subdomain && !['www', 'api', 'admin'].includes(subdomain)) {
                        this.logger.log('[TenantInterceptor] Resolving tenant from subdomain (localhost): ' + subdomain);
                        tenantId = await this.resolveSlugToId(subdomain);
                    }
                }
            }
            // For production/staging, use full subdomain resolution
            else if (!isIP) {
                const hostname = host.split(':')[0];
                const parts = hostname.split('.');

                if (parts.length > 2) {
                    const subdomain = parts[0];
                    if (subdomain && !['www', 'api', 'admin'].includes(subdomain)) {
                        this.logger.log('[TenantInterceptor] Resolving tenant from subdomain: ' + subdomain);
                        tenantId = await this.resolveSlugToId(subdomain);
                    }
                }
            }

            // PRIORITY 3: Fallback to headers
            if (!tenantId) {
                const headerTenantSlug = req.headers['x-tenant-slug'] as string;
                const headerTenantId = req.headers['x-tenant-id'] as string;

                if (headerTenantId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(headerTenantId)) {
                    tenantId = headerTenantId;
                } else if (headerTenantSlug && headerTenantSlug !== 'default') {
                    tenantId = await this.resolveSlugToId(headerTenantSlug);
                }
            }
        }

        // Fetch full puskesmas object and attach to request
        if (tenantId) {
            puskesmas = await this.puskesmasRepo.findOne({
                where: { id: tenantId }
            });

            if (puskesmas) {
                req.puskesmas = puskesmas;
                req.tenantId = tenantId;
                req.tenantSlug = puskesmas.slug;
                this.logger.log('[TenantInterceptor] Tenant resolved: ' + puskesmas.name + ' (' + puskesmas.status + ')');
            } else {
                this.logger.warn('[TenantInterceptor] Tenant with ID "' + tenantId + '" not found');
            }
        }

        // Determine if this is a public route
        const isPublicRoute = !path.startsWith('/api/admin') && !path.startsWith('/admin');
        req.isPublicRoute = isPublicRoute;

        // Update context
        this.tenantContextService.updateContext({
            tenantId, userId, role, isSuperAdmin
        });

        this.logger.log('[TenantInterceptor] Tenant: ' + (tenantId || 'none') + ' | Role: ' + role + ' | Public: ' + isPublicRoute + ' | Path: ' + path);

        return next.handle();
    }

    private async resolveSlugToId(slug: string): Promise<string | null> {
        try {
            const p = await this.puskesmasRepo.findOne({
                where: { slug },
                select: ['id']
            });
            return p?.id || null;
        } catch (e) {
            this.logger.warn('[TenantInterceptor] Failed to resolve slug "' + slug + '": ' + e.message);
            return null;
        }
    }
}
