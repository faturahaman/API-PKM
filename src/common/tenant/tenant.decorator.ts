import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TenantContextService } from './tenant-context.service';

/**
 * Parameter decorator to get the current tenant ID
 * 
 * Usage:
 * ```
 * @Get()
 * findAll(@TenantId() tenantId: string) { ... }
 * ```
 */
export const TenantId = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): string | null => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            return null;
        }

        // For Super Admin, they might have active_tenant or null (all access)
        if (user.role === 'SUPER_ADMIN') {
            return user.active_tenant || null;
        }

        // For Operator, use their assigned puskesmas_id
        return user.puskesmas_id || null;
    },
);

/**
 * Parameter decorator to get the full tenant context
 * 
 * Usage:
 * ```
 * @Get()
 * findAll(@TenantContext() context: TenantContextData) { ... }
 * ```
 */
export const TenantContext = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const tenantContextService = ctx.switchToHttp().getRequest().tenantContextService;
        if (tenantContextService) {
            return tenantContextService.getTenantContext();
        }
        return null;
    },
);
