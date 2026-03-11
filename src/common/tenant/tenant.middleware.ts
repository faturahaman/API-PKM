// src/common/tenant/tenant.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantContextService } from './tenant-context.service';

/**
 * Tenant Middleware - Initial Request Context Setup
 * 
 * NOTE: This middleware now creates the AsyncLocalStorage context only.
 * The actual tenant resolution happens in TenantInterceptor:
 * - Authenticated users: JWT puskesmas_id (Operator) or active_tenant (Super Admin)
 * - Public routes: x-tenant-id (UUID) or x-tenant-slug (resolved to UUID)
 * 
 * We don't set any tenant here to avoid conflicts - let the interceptor handle it.
 */

@Injectable()
export class TenantMiddleware implements NestMiddleware {
    constructor(
        private readonly tenantContextService: TenantContextService,
    ) { }

    use(req: Request, res: Response, next: NextFunction) {
        // Don't set tenant here - let the interceptor handle it
        // This avoids issues with slug vs UUID and ensures consistent behavior
        this.tenantContextService.runWithContext(() => {
            // Initial context is set in runWithContext
            next();
        });
    }
}
