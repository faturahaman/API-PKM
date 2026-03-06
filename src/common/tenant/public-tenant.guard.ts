import { Injectable, CanActivate, ExecutionContext, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { PuskesmasService } from '../../puskesmas/puskesmas.service';
import { PuskesmasStatus } from '../../puskesmas/entity/puskesmas.entity';

/**
 * Public Tenant Guard
 * 
 * Resolves tenant from URL path (subdomain or path prefix)
 * and validates tenant status before allowing access.
 * 
 * For path-based: puskesmas.go.id/pkm-sehat
 */
@Injectable()
export class PublicTenantGuard implements CanActivate {
    constructor(private readonly puskesmasService: PuskesmasService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const path = request.path;

        // Only apply to public routes (not /admin/*)
        if (path.startsWith('/admin') || path.startsWith('/api')) {
            return true;
        }

        // Extract tenant slug from path
        // Example: /pkm-sehat -> pkm-sehat
        // Example: /pkm-sehat/artikel -> pkm-sehat
        const segments = path.split('/').filter(Boolean);

        if (segments.length === 0) {
            // Root path - redirect to default or show tenant selector
            return true;
        }

        const potentialSlug = segments[0];

        // Skip if it looks like a static file or API call
        if (potentialSlug.includes('.') || potentialSlug.startsWith('api')) {
            return true;
        }

        // Try to find puskesmas by slug
        const puskesmas = await this.puskesmasService.findBySlug(potentialSlug);

        if (!puskesmas) {
            // Slug not found - might be a regular page
            // Let it pass through, controller will handle 404
            return true;
        }

        // Check if puskesmas is active
        if (puskesmas.status !== PuskesmasStatus.ACTIVE) {
            throw new ForbiddenException(
                `Website Puskesmas "${puskesmas.name}" sedang tidak aktif.`,
            );
        }

        // Attach puskesmas to request for later use
        (request as any).puskesmas = puskesmas;
        (request as any).tenantSlug = potentialSlug;

        return true;
    }
}
