import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
    StorageModuleType,
    MODULE_STORAGE_CONFIG,
    PUBLIC_STORAGE_ROOT,
} from './storage/storage.config';

// Re-export for backward compatibility
export type UploadType = StorageModuleType;

/**
 * Factory function untuk membuat multer options berdasarkan tipe upload.
 * Semua konfigurasi diambil dari MODULE_STORAGE_CONFIG (single source of truth).
 */
export function createMulterOptions(uploadType: UploadType) {
    const config = MODULE_STORAGE_CONFIG[uploadType];

    return {
        limits: {
            fileSize: config.maxSize,
        },

        storage: diskStorage({
            destination: (req: any, file, cb) => {
                // Resolve tenant ID:
                // Priority 1: req.tenantId (set oleh TenantInterceptor)
                // Priority 2: from JWT user claims
                // Fallback: 'shared'
                let tenantId = req.tenantId;

                if (!tenantId && req.user) {
                    tenantId = req.user.role === 'SUPER_ADMIN'
                        ? req.user.active_tenant
                        : req.user.puskesmas_id;
                }

                tenantId = tenantId || 'shared';

                // NEW: Simpan ke public/{tenantId}/{uploadType} untuk akses langsung
                const uploadPath = join(PUBLIC_STORAGE_ROOT, tenantId, uploadType);

                if (!existsSync(uploadPath)) {
                    mkdirSync(uploadPath, { recursive: true });
                }

                cb(null, uploadPath);
            },

            filename: (req, file, cb) => {
                const ext = extname(file.originalname).toLowerCase();
                // UUID-based filename: aman dari collision dan path enumeration
                const filename = `${uuidv4()}${ext}`;
                cb(null, filename);
            },
        }),

        fileFilter: (req: any, file: Express.Multer.File, cb: any) => {
            const ext = extname(file.originalname).toLowerCase();

            // Validasi 1: MIME type
            if (!config.allowedMimeTypes.test(file.mimetype)) {
                return cb(new BadRequestException(config.errorMessage), false);
            }

            // Validasi 2: File extension (double-check)
            if (!config.allowedExtensions.includes(ext)) {
                return cb(new BadRequestException(config.errorMessage), false);
            }

            cb(null, true);
        },
    };
}

/**
 * Helper: Buat public URL path untuk file yang sudah diupload.
 * Format baru: /{slug}/{uploadType}/{filename}
 * 
 * Ini将使文件可以直接从 public folder 访问，无需通过 /files endpoint。
 *
 * @param uploadType - Tipe modul
 * @param filename   - Nama file hasil UUID dari multer
 * @param slug       - Tenant slug (puskesmas slug), default 'shared'
 */
export function getPublicPath(
    uploadType: UploadType,
    filename: string,
    slug: string = 'shared',
): string {
    return `/${slug}/${uploadType}/${filename}`;
}

/**
 * Helper: Ekstrak nama file dari stored path URL.
 * Format baru: /{slug}/{module}/{filename}
 * Output: {filename}
 */
export function extractFilenameFromPath(filePath: string): string | null {
    if (!filePath) return null;
    const parts = filePath.split('/');
    return parts[parts.length - 1] || null;
}

/**
 * Helper: Ekstrak slug dari stored path URL.
 * Input:  /{slug}/{module}/{filename}
 * Output: {slug}
 */
export function extractSlugFromPath(filePath: string): string | null {
    if (!filePath) return null;
    // Format: /{slug}/{module}/{filename}
    const parts = filePath.split('/');
    // parts[0]='', parts[1]={slug}
    return parts[1] || null;
}

/**
 * Helper: Ekstrak module dari stored path URL.
 * Input:  /{slug}/{module}/{filename}
 * Output: {module}
 */
export function extractModuleFromPath(filePath: string): string | null {
    if (!filePath) return null;
    const parts = filePath.split('/');
    return parts[2] || null;
}

/**
 * Helper: Buat absolute filesystem path dari stored URL path.
 * Input:  /{slug}/{module}/{filename}
 * Output: {PUBLIC_STORAGE_ROOT}/{slug}/{module}/{filename}
 */
export function resolveAbsolutePath(urlPath: string): string | null {
    const slug = extractSlugFromPath(urlPath);
    const module = extractModuleFromPath(urlPath);
    const filename = extractFilenameFromPath(urlPath);

    if (!slug || !module || !filename) return null;

    return join(PUBLIC_STORAGE_ROOT, slug, module, filename);
}
