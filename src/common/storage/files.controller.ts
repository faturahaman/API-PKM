import { Controller, Get, Param, Res, NotFoundException, ForbiddenException, Request } from '@nestjs/common';
import type { Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { StorageService, EXTERNAL_STORAGE_PATH } from './storage.service';

/**
 * Secure File Access Controller
 * 
 * Do NOT expose storage as static files.
 * All file access goes through this controller with tenant validation.
 * 
 * Endpoint: GET /files/:tenant/:module/:filename
 */
@Controller('files')
export class FilesController {
    constructor(private readonly storageService: StorageService) { }

    /**
     * Get file with tenant validation
     * 
     * This ensures:
     * 1. File exists in tenant's storage
     * 2. Tenant has access to this file (tenant isolation enforced)
     * 3. No path traversal attacks
     */
    @Get(':tenant/:module/:filename')
    async getFile(
        @Param('tenant') tenant: string,
        @Param('module') module: string,
        @Param('filename') filename: string,
        @Res() res: Response,
        @Request() req: any,
    ) {
        // Get tenant context from request (set by TenantInterceptor)
        const user = req.user;
        const userTenantId = req.tenantId;
        const userRole = user?.role;

        // Validate tenant access
        // SUPER_ADMIN can access any tenant
        // OPERATOR can only access their own tenant
        if (userRole !== 'SUPER_ADMIN' && userTenantId && userTenantId !== tenant) {
            throw new ForbiddenException('Anda tidak berhak mengakses file dari tenant ini.');
        }

        // Validate module is allowed
        const allowedModules = ['gallery', 'video', 'banner', 'document', 'pages', 'static-pages', 'web-info', 'profile'];
        if (!allowedModules.includes(module)) {
            throw new NotFoundException('Module tidak ditemukan');
        }

        // Validate filename - prevent path traversal
        if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
            throw new ForbiddenException('Nama file tidak valid');
        }

        // Build full path
        const filePath = join(EXTERNAL_STORAGE_PATH, tenant, module, filename);

        // Check if file exists
        if (!existsSync(filePath)) {
            throw new NotFoundException('File tidak ditemukan');
        }

        // Determine content type
        const contentType = this.getContentType(filename);

        // Stream file to response
        res.set({
            'Content-Type': contentType,
            'Content-Disposition': `inline; filename="${filename}"`,
        });

        const fileStream = createReadStream(filePath);
        fileStream.pipe(res as any);
    }

    /**
     * Get content type from filename extension
     */
    private getContentType(filename: string): string {
        const ext = filename.toLowerCase().split('.').pop();

        const contentTypes: Record<string, string> = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'webp': 'image/webp',
            'pdf': 'application/pdf',
            'mp4': 'video/mp4',
            'webm': 'video/webm',
            'ogg': 'video/ogg',
            'mov': 'video/quicktime',
            'avi': 'video/x-msvideo',
        };

        return contentTypes[ext || ''] || 'application/octet-stream';
    }
}
