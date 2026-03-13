import { Injectable, BadRequestException } from '@nestjs/common';
import { existsSync, mkdirSync, unlinkSync, readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import { join, extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * External storage path - outside project directory
 */
export const EXTERNAL_STORAGE_PATH = process.env.STORAGE_PATH || '/data/pkm-storage';

/**
 * Upload types
 */
export type StorageModule = 'gallery' | 'video' | 'banner' | 'document' | 'pages' | 'static-pages' | 'web-info' | 'profile';

/**
 * Konfigurasi storage per module
 */
const STORAGE_CONFIG: Record<StorageModule, { maxSize: number; allowedMimeTypes: RegExp; allowedExtensions: string[] }> = {
    profile: {
        maxSize: 2 * 1024 * 1024,
        allowedMimeTypes: /^image\/(jpg|jpeg|png)$/,
        allowedExtensions: ['.jpg', '.jpeg', '.png'],
    },
    gallery: {
        maxSize: 3 * 1024 * 1024,
        allowedMimeTypes: /^image\/(jpg|jpeg|png)$/,
        allowedExtensions: ['.jpg', '.jpeg', '.png'],
    },
    video: {
        maxSize: 15 * 1024 * 1024,
        allowedMimeTypes: /^video\/(mp4|webm|ogg|quicktime|x-msvideo)$/,
        allowedExtensions: ['.mp4', '.webm', '.ogg', '.mov', '.avi'],
    },
    banner: {
        maxSize: 5 * 1024 * 1024,
        allowedMimeTypes: /^image\/(jpg|jpeg|png|gif)$/,
        allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif'],
    },
    document: {
        maxSize: 10 * 1024 * 1024,
        allowedMimeTypes: /^(application\/pdf|image\/(jpg|jpeg|png))$/,
        allowedExtensions: ['.pdf', '.jpg', '.jpeg', '.png'],
    },
    pages: {
        maxSize: 10 * 1024 * 1024,
        allowedMimeTypes: /^(image\/(jpg|jpeg|png|webp)|application\/pdf)$/,
        allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.pdf'],
    },
    'static-pages': {
        maxSize: 10 * 1024 * 1024,
        allowedMimeTypes: /^(image\/(jpg|jpeg|png|webp)|application\/pdf)$/,
        allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.pdf'],
    },
    'web-info': {
        maxSize: 2 * 1024 * 1024,
        allowedMimeTypes: /^image\/(jpg|jpeg|png)$/,
        allowedExtensions: ['.jpg', '.jpeg', '.png'],
    },
};

@Injectable()
export class StorageService {
    constructor() {
        // Ensure external storage directory exists
        this.ensureStorageDirectory();
    }

    /**
     * Ensure base storage directory exists
     */
    private ensureStorageDirectory(): void {
        if (!existsSync(EXTERNAL_STORAGE_PATH)) {
            mkdirSync(EXTERNAL_STORAGE_PATH, { recursive: true });
            console.log(`✅ Created external storage directory: ${EXTERNAL_STORAGE_PATH}`);
        }
    }

    /**
     * Get tenant folder path
     * Format: /data/pkm-storage/{tenant-id}/
     */
    getTenantPath(tenantId: string): string {
        return join(EXTERNAL_STORAGE_PATH, tenantId);
    }

    /**
     * Get module folder path within tenant
     * Format: /data/pkm-storage/{tenant-id}/{module}/
     */
    getModulePath(tenantId: string, module: StorageModule): string {
        return join(EXTERNAL_STORAGE_PATH, tenantId, module);
    }

    /**
     * Ensure tenant directory exists
     */
    ensureTenantDirectory(tenantId: string): void {
        const tenantPath = this.getTenantPath(tenantId);
        if (!existsSync(tenantPath)) {
            mkdirSync(tenantPath, { recursive: true });
        }
    }

    /**
     * Ensure module directory exists within tenant
     */
    ensureModuleDirectory(tenantId: string, module: StorageModule): void {
        const modulePath = this.getModulePath(tenantId, module);
        if (!existsSync(modulePath)) {
            mkdirSync(modulePath, { recursive: true });
        }
    }

    /**
     * Generate unique filename for tenant storage
     */
    generateFilename(originalName: string, module: StorageModule): string {
        const ext = extname(originalName).toLowerCase();
        const uuid = uuidv4();
        const prefix = module.substring(0, 4).toUpperCase();
        return `${prefix}-${uuid}${ext}`;
    }

    /**
     * Validate file before storage
     */
    validateFile(file: Express.Multer.File, module: StorageModule): void {
        const config = STORAGE_CONFIG[module];

        // Check file size
        if (file.size > config.maxSize) {
            throw new BadRequestException(`File terlalu besar! Maksimal ${config.maxSize / 1024 / 1024}MB`);
        }

        // Check MIME type
        if (!config.allowedMimeTypes.test(file.mimetype)) {
            throw new BadRequestException('Tipe file tidak valid!');
        }

        // Check extension
        const ext = extname(file.originalname).toLowerCase();
        if (!config.allowedExtensions.includes(ext)) {
            throw new BadRequestException('Ekstensi file tidak valid!');
        }
    }

    /**
     * Store file with tenant isolation
     * Returns the stored file path relative to storage root
     */
    async storeFile(
        tenantId: string,
        module: StorageModule,
        file: Express.Multer.File,
    ): Promise<{ filename: string; path: string; url: string }> {
        // Validate file
        this.validateFile(file, module);

        // Ensure directories exist
        this.ensureModuleDirectory(tenantId, module);

        // Generate unique filename
        const filename = this.generateFilename(file.originalname, module);
        const modulePath = this.getModulePath(tenantId, module);
        const filePath = join(modulePath, filename);

        // Write file to storage
        // Handle both memory storage (file.buffer) and disk storage (file.path)
        let fileData: Buffer;
        if (file.buffer) {
            // Memory storage - use buffer directly
            fileData = file.buffer;
        } else if (file.path) {
            // Disk storage - read from temporary path
            fileData = readFileSync(file.path);
        } else {
            throw new BadRequestException('Data file tidak ditemukan!');
        }

        writeFileSync(filePath, fileData);

        // Return relative path and URL
        const relativePath = `${tenantId}/${module}/${filename}`;

        return {
            filename,
            path: relativePath,
            url: `/files/${relativePath}`,
        };
    }

    /**
     * Delete file from tenant storage
     */
    deleteFile(tenantId: string, module: StorageModule, filename: string): boolean {
        const filePath = join(EXTERNAL_STORAGE_PATH, tenantId, module, filename);

        if (existsSync(filePath)) {
            unlinkSync(filePath);
            return true;
        }
        return false;
    }

    /**
     * Check if file exists
     */
    fileExists(tenantId: string, module: StorageModule, filename: string): boolean {
        const filePath = join(EXTERNAL_STORAGE_PATH, tenantId, module, filename);
        return existsSync(filePath);
    }

    /**
     * Get full file path for reading
     */
    getFilePath(tenantId: string, module: StorageModule, filename: string): string {
        return join(EXTERNAL_STORAGE_PATH, tenantId, module, filename);
    }

    /**
     * List files in tenant module directory
     */
    listFiles(tenantId: string, module: StorageModule): string[] {
        const modulePath = this.getModulePath(tenantId, module);

        if (!existsSync(modulePath)) {
            return [];
        }

        return readdirSync(modulePath).filter(file => {
            const filePath = join(modulePath, file);
            return statSync(filePath).isFile();
        });
    }
}
