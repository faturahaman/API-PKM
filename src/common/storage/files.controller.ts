import {
    Controller,
    Get,
    Param,
    Res,
    NotFoundException,
    ForbiddenException,
    UnauthorizedException,
    Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import type { Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import { StorageService } from './storage.service';
import { isPublicModule, StorageModuleType } from './storage.config';

/**
 * Secure File Access Controller
 *
 * Endpoint: GET /files/:tenant/:module/:filename
 *
 * Access Rules:
 * - PUBLIC modules (gallery, banner) → accessible without auth token
 * - PRIVATE modules → require JWT + matching tenant ID
 * - SUPER_ADMIN → can access all private modules across tenants
 */
@ApiTags('Storage & Files')
@Controller('files')
export class FilesController {
    constructor(private readonly storageService: StorageService) { }

    @Get(':tenant/:module/:filename')
    @ApiOperation({
        summary: 'Get File',
        description: 'Retrieve a file from storage. Public modules (gallery, banner) are accessible without auth. Private modules require JWT with matching tenant ID.'
    })
    @ApiParam({ name: 'tenant', description: 'Tenant ID or "shared" for global files' })
    @ApiParam({ name: 'module', description: 'Module type: gallery, banner, video, document, pages, static-pages, web-info, profile' })
    @ApiParam({ name: 'filename', description: 'File name to retrieve' })
    @ApiResponse({ status: 200, description: 'File stream' })
    @ApiResponse({ status: 403, description: 'Forbidden - invalid parameters or access denied' })
    @ApiResponse({ status: 404, description: 'File not found' })
    async getFile(
        @Param('tenant') tenant: string,
        @Param('module') module: string,
        @Param('filename') filename: string,
        @Res() res: Response,
        @Request() req: any,
    ) {
        // ── Security: Path Traversal ─────────────────────────────────────────
        if (
            tenant.includes('..') || tenant.includes('/') || tenant.includes('\\') ||
            module.includes('..') || module.includes('/') || module.includes('\\') ||
            filename.includes('..') || filename.includes('/') || filename.includes('\\')
        ) {
            throw new ForbiddenException('Nama parameter mengandung karakter terlarang.');
        }

        // ── Security: Allowed Modules Whitelist ──────────────────────────────
        const allowedModules: StorageModuleType[] = [
            'gallery', 'banner', 'video', 'document',
            'pages', 'static-pages', 'web-info', 'profile',
        ];
        if (!allowedModules.includes(module as StorageModuleType)) {
            throw new NotFoundException('Modul tidak valid.');
        }

        // ── Access Control: Public vs Private ────────────────────────────────
        if (!isPublicModule(module)) {
            // Private module: wajib ada token
            const user = req.user;

            if (!user) {
                throw new UnauthorizedException('Akses file privat memerlukan autentikasi.');
            }

            // SUPER_ADMIN bisa akses semua tenant
            if (user.role !== 'SUPER_ADMIN') {
                const userTenantId = user.puskesmas_id;
                if (userTenantId !== tenant) {
                    throw new ForbiddenException(
                        'Akses ditolak: Anda tidak memiliki izin untuk mengakses file dari tenant ini.',
                    );
                }
            }
        }
        // Public module (gallery, banner) → skip auth, lanjut langsung

        // ── File Resolution ──────────────────────────────────────────────────
        const filePath = this.storageService.getFilePath(tenant, module as any, filename);

        if (!existsSync(filePath)) {
            throw new NotFoundException('Berkas tidak ditemukan di sistem penyimpanan.');
        }

        // ── Response ─────────────────────────────────────────────────────────
        const contentType = this.resolveContentType(filename);

        res.set({
            'Content-Type': contentType,
            'Content-Disposition': `inline; filename="${filename}"`,
            // Public files: cache 1 tahun. Private: no-cache agar tidak bocor ke browser lain.
            'Cache-Control': isPublicModule(module)
                ? 'public, max-age=31536000'
                : 'private, no-cache, no-store',
        });

        const fileStream = createReadStream(filePath);
        fileStream.on('error', (err) => {
            console.error(`[FilesController] Stream error: ${err.message}`);
            if (!res.headersSent) {
                res.status(500).json({ message: 'Gagal memproses pengiriman berkas.' });
            }
        });

        fileStream.pipe(res);
    }

    private resolveContentType(filename: string): string {
        const ext = filename.toLowerCase().split('.').pop();

        const contentTypes: Record<string, string> = {
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            gif: 'image/gif',
            webp: 'image/webp',
            pdf: 'application/pdf',
            mp4: 'video/mp4',
            webm: 'video/webm',
            ogg: 'video/ogg',
            mov: 'video/quicktime',
            avi: 'video/x-msvideo',
        };

        return contentTypes[ext || ''] || 'application/octet-stream';
    }
}
