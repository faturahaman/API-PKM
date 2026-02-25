import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

/**
 * Upload types dengan konfigurasi masing-masing
 */
export type UploadType = 'profile' | 'gallery' | 'video' | 'banner' | 'document' | 'pages' | 'static-pages';

/**
 * Konfigurasi untuk setiap tipe upload
 */
interface UploadConfig {
    folder: string;
    maxSize: number; // dalam bytes
    allowedMimeTypes: RegExp;
    allowedExtensions: string[];
    errorMessage: string;
    filenamePrefix?: string;
}

const UPLOAD_CONFIGS: Record<UploadType, UploadConfig> = {
    profile: {
        folder: 'profiles',
        maxSize: 2 * 1024 * 1024, // 2MB
        allowedMimeTypes: /^image\/(jpg|jpeg|png)$/,
        allowedExtensions: ['.jpg', '.jpeg', '.png'],
        errorMessage: 'Format file tidak valid! Hanya jpg, jpeg, png yang diperbolehkan.',
        filenamePrefix: 'admin',
    },
    gallery: {
        folder: 'gallery',
        maxSize: 3 * 1024 * 1024, // 3MB
        allowedMimeTypes: /^image\/(jpg|jpeg|png)$/,
        allowedExtensions: ['.jpg', '.jpeg', '.png'],
        errorMessage: 'Format file tidak valid! Hanya jpg, jpeg, png yang diperbolehkan.',
    },
    video: {
        folder: 'video',
        maxSize: 15 * 1024 * 1024, // 15MB
        allowedMimeTypes: /^video\/(mp4|webm|ogg|quicktime|x-msvideo)$/,
        allowedExtensions: ['.mp4', '.webm', '.ogg', '.mov', '.avi'],
        errorMessage: 'Format file tidak valid! Hanya mp4, webm, ogg, mov, avi yang diperbolehkan.',
        filenamePrefix: 'VID',
    },
    banner: {
        folder: 'banner',
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedMimeTypes: /^image\/(jpg|jpeg|png|gif)$/,
        allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif'],
        errorMessage: 'Format file tidak valid! Hanya jpg, jpeg, png, gif yang diperbolehkan.',
    },
    document: {
        folder: 'documents',
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedMimeTypes: /^(application\/pdf|image\/(jpg|jpeg|png))$/,
        allowedExtensions: ['.pdf', '.jpg', '.jpeg', '.png'],
        errorMessage: 'Format file tidak valid! Hanya pdf, jpg, jpeg, png yang diperbolehkan.',
        filenamePrefix: 'DOC',
    },
    pages: {
        folder: 'pages',
        maxSize: 10 * 1024 * 1024, // Naikkan jadi 10MB untuk dokumen
        allowedMimeTypes: /^(image\/(jpg|jpeg|png|webp)|application\/pdf)$/,
        allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.pdf'],
        errorMessage: 'Format file tidak valid! Hanya gambar (jpg, png, webp) dan PDF yang diperbolehkan.',
        filenamePrefix: 'PAGE',
    },
    'static-pages': {
        folder: 'static-pages',
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedMimeTypes: /^(image\/(jpg|jpeg|png|webp)|application\/pdf)$/,
        allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.pdf'],
        errorMessage: 'Format file tidak valid! Hanya gambar (jpg, png, webp) dan PDF yang diperbolehkan.',
        filenamePrefix: 'STATIC',
    },
};

/**
 * Sanitize filename untuk mencegah path traversal attacks
 */
function sanitizeFilename(filename: string): string {
    // Remove path separators dan special characters
    return filename
        .replace(/[\/\\]/g, '')
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .substring(0, 100); // Limit panjang filename
}

/**
 * Factory function untuk membuat multer options berdasarkan tipe upload
 * 
 * Security features:
 * - MIME type validation (whitelist)
 * - File extension validation (double-check)
 * - Filename sanitization (prevent path traversal)
 * - UUID-based filenames (prevent collisions & predictable names)
 * - File size limits per type
 * - Automatic directory creation with proper permissions
 * 
 * @param uploadType - Tipe upload: 'profile', 'gallery', atau 'video'
 * @returns Multer options object
 */
export function createMulterOptions(uploadType: UploadType) {
    const config = UPLOAD_CONFIGS[uploadType];

    return {
        limits: {
            fileSize: config.maxSize,
        },

        storage: diskStorage({
            destination: (req, file, cb) => {
                const uploadPath = join(process.cwd(), 'public', 'uploads', config.folder);

                // Buat folder jika belum ada
                if (!existsSync(uploadPath)) {
                    mkdirSync(uploadPath, { recursive: true });
                }

                cb(null, uploadPath);
            },

            filename: (req, file, cb) => {
                // Sanitize original filename
                const sanitizedOriginal = sanitizeFilename(file.originalname);
                const ext = extname(sanitizedOriginal).toLowerCase();

                // Generate unique filename dengan UUID
                const uuid = uuidv4();
                const prefix = config.filenamePrefix ? `${config.filenamePrefix}-` : '';
                const filename = `${prefix}${uuid}${ext}`;

                cb(null, filename);
            },
        }),

        fileFilter: (req: any, file: Express.Multer.File, cb: any) => {
            const ext = extname(file.originalname).toLowerCase();

            // Validasi 1: Check MIME type
            if (!config.allowedMimeTypes.test(file.mimetype)) {
                return cb(
                    new BadRequestException(config.errorMessage),
                    false
                );
            }

            // Validasi 2: Double-check file extension
            if (!config.allowedExtensions.includes(ext)) {
                return cb(
                    new BadRequestException(config.errorMessage),
                    false
                );
            }

            cb(null, true);
        },
    };
}

/**
 * Helper function untuk mendapatkan public path dari uploaded file
 * 
 * @param uploadType - Tipe upload
 * @param filename - Nama file yang di-generate oleh multer
 * @returns Public path untuk disimpan di database
 */
export function getPublicPath(uploadType: UploadType, filename: string): string {
    const config = UPLOAD_CONFIGS[uploadType];
    return `/uploads/${config.folder}/${filename}`;
}
