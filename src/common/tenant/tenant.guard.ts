import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminRole } from '../../admins/entity/admin.entity';
import { Puskesmas, PuskesmasStatus } from '../../puskesmas/entity/puskesmas.entity';

/**
 * Tenant Guard - Status Enforcement
 * 
 * This guard checks tenant status and enforces access control:
 * - SUSPENDED: Block ALL access (public and admin)
 * - INACTIVE: Block admin/API, allow public
 * - MAINTENANCE: Block public, allow admin
 * - ACTIVE: Allow all
 * 
 * IMPORTANT: This guard resolves tenant itself since it runs BEFORE the Interceptor
 * in NestJS lifecycle. It checks:
 * 1. req.puskesmas (set by TenantInterceptor - for cases where Interceptor already ran)
 * 2. x-tenant-id or x-tenant-slug headers
 * 3. Hostname/subdomain
 * 
 * Flow:
 * Request → TenantMiddleware → TenantGuard (resolves + checks status)
 *                                 → TenantInterceptor (sets context)
 *                                 → AuthGuard
 *                                 → RolesGuard
 */

@Injectable()
export class TenantGuard implements CanActivate {
    private readonly logger = new Logger(TenantGuard.name);

    constructor(
        @InjectRepository(Puskesmas)
        private readonly puskesmasRepo: Repository<Puskesmas>
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<any>();
        const user = request.user;

        // Get puskesmas from request (set by TenantInterceptor)
        const puskesmas = request.puskesmas;

        // Debug log
        this.logger.log('[TenantGuard] Checking tenant status. Puskesma: ' + (puskesmas?.name || 'none') + ', Status: ' + (puskesmas?.status || 'none'));

        // No tenant resolved - allow (might be public route without tenant)
        if (!puskesmas) {
            return true;
        }

        // Super Admin can bypass tenant status check
        // They need to manage suspended tenants
        if (user?.role === AdminRole.SUPER_ADMIN) {
            return true;
        }

        // Determine if this is a public or admin route
        const path = request.path || '';
        const isPublicRoute = request.isPublicRoute ||
            (!path.startsWith('/api/admin') && !path.startsWith('/admin'));

        // EXEMPTION: Always allow status check endpoint
        if (path.includes('/puskesmas/status/')) {
            return true;
        }

        // Check status and enforce access control
        const status = puskesmas.status;

        // Debug: Log all the details
        this.logger.log('[TenantGuard] Status from DB: "' + status + '" | Type: ' + typeof status);
        this.logger.log('[TenantGuard] Comparing with MAINTENANCE: ' + (status === 'MAINTENANCE'));
        this.logger.log('[TenantGuard] Enum value: ' + (PuskesmasStatus.MAINTENANCE));
        this.logger.log('[TenantGuard] Is public route: ' + isPublicRoute);

        switch (status) {
            case PuskesmasStatus.SUSPENDED:
                // SUSPENDED: Block ALL access
                throw new ForbiddenException({
                    error: 'TENANT_SUSPENDED',
                    message: 'Website Puskesmas ini sedang dinonaktifkan sementara.',
                    tenantName: puskesmas.name,
                    reason: puskesmas.suspended_reason,
                    suspendedAt: puskesmas.suspended_at,
                });

            case PuskesmasStatus.INACTIVE:
                // INACTIVE: Block admin/API, allow public
                if (!isPublicRoute) {
                    throw new ForbiddenException({
                        error: 'TENANT_INACTIVE',
                        message: `Puskesmas "${puskesmas.name}" sedang tidak aktif.`,
                        tenantName: puskesmas.name,
                    });
                }
                // For public routes, allow but could attach a warning
                request.tenantInactive = true;
                break;

            case PuskesmasStatus.MAINTENANCE:
                // MAINTENANCE: Block public, allow admin
                if (isPublicRoute) {
                    throw new ForbiddenException({
                        error: 'TENANT_MAINTENANCE',
                        message: 'Website sedang dalam perbaikan. Coba lagi nanti.',
                        tenantName: puskesmas.name,
                        maintenanceMessage: puskesmas.maintenance_message,
                    });
                }
                // Admin can still access during maintenance
                break;

            case PuskesmasStatus.ACTIVE:
            default:
                // ACTIVE: Allow all
                break;
        }

        return true;
    }
}
