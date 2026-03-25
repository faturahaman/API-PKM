import { Injectable, BadRequestException } from '@nestjs/common';
import {
    existsSync,
    mkdirSync,
    unlinkSync,
    readdirSync,
    statSync,
    readFileSync,
    writeFileSync,
} from 'fs';
import { join, extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
    StorageModuleType,
    MODULE_STORAGE_CONFIG,
    STORAGE_ROOT as CONFIG_STORAGE_ROOT,
    PUBLIC_STORAGE_ROOT,
    getPublicStoragePath,
} from './storage.config';

// Re-export untuk backward compat (FilesController mengimport ini)
export { STORAGE_ROOT } from './storage.config';
export type StorageModule = StorageModuleType;

const STORAGE_TENANTS_DIR = 'tenants';

@Injectable()
export class StorageService {
    constructor() {
        this.ensureStorageRoot();
    }

    // ─── Directory Helpers ────────────────────────────────────────────────────

    private ensureStorageRoot(): void {
        if (!existsSync(PUBLIC_STORAGE_ROOT)) {
            mkdirSync(PUBLIC_STORAGE_ROOT, { recursive: true });
            console.log(`✅ Created public storage directory: ${PUBLIC_STORAGE_ROOT}`);
        }
    }

    /**
     * Get path untuk slug (puskesmas) di public folder.
     * Format: {PUBLIC_STORAGE_ROOT}/{slug}
     */
    getTenantPath(slug: string): string {
        return join(PUBLIC_STORAGE_ROOT, slug);
    }

    getModulePath(slug: string, module: StorageModule): string {
        return join(this.getTenantPath(slug), module);
    }

    /**
     * Get absolute filesystem path untuk sebuah file.
     * Format: {PUBLIC_STORAGE_ROOT}/{slug}/{module}/{filename}
     */
    getFilePath(slug: string, module: StorageModule, filename: string): string {
        return join(this.getModulePath(slug, module), filename);
    }

    /**
     * Get absolute filesystem path dari URL path yang disimpan di DB.
     * Input:  /{slug}/{module}/{filename}
     * Output: {PUBLIC_STORAGE_ROOT}/{slug}/{module}/{filename}
     */
    getFilePathFromUrl(urlPath: string): string | null {
        if (!urlPath) return null;
        // Format: /{slug}/{module}/{filename}
        const parts = urlPath.split('/').filter(Boolean);
        // parts[0]={slug}, parts[1]={module}, parts[2]={filename}
        if (parts.length < 3) return null;

        const [slug, module, filename] = parts;
        return this.getFilePath(slug, module as StorageModule, filename);
    }

    ensureTenantDirectory(slug: string): void {
        const tenantPath = this.getTenantPath(slug);
        if (!existsSync(tenantPath)) {
            mkdirSync(tenantPath, { recursive: true });
        }
    }

    ensureModuleDirectory(slug: string, module: StorageModule): void {
        const modulePath = this.getModulePath(slug, module);
        if (!existsSync(modulePath)) {
            mkdirSync(modulePath, { recursive: true });
        }
    }

    // ─── File Operations ──────────────────────────────────────────────────────

    generateFilename(originalName: string): string {
        const ext = extname(originalName).toLowerCase();
        return `${uuidv4()}${ext}`;
    }

    /**
     * Validasi file sebelum disimpan.
     * Menggunakan MODULE_STORAGE_CONFIG sebagai single source of truth.
     */
    validateFile(file: Express.Multer.File, module: StorageModule): void {
        const config = MODULE_STORAGE_CONFIG[module];

        if (file.size > config.maxSize) {
            throw new BadRequestException(
                `File terlalu besar! Maksimal ${config.maxSize / 1024 / 1024}MB`,
            );
        }

        if (!config.allowedMimeTypes.test(file.mimetype)) {
            throw new BadRequestException(config.errorMessage);
        }

        const ext = extname(file.originalname).toLowerCase();
        if (!config.allowedExtensions.includes(ext)) {
            throw new BadRequestException(config.errorMessage);
        }
    }

    /**
     * Simpan file ke storage dengan slug isolation.
     * File akan disimpan di: public/{slug}/{module}/{filename}
     * Returns: { filename, path (relative), url }
     */
    async storeFile(
        slug: string,
        module: StorageModule,
        file: Express.Multer.File,
    ): Promise<{ filename: string; path: string; url: string }> {
        this.validateFile(file, module);
        this.ensureModuleDirectory(slug, module);

        const filename = this.generateFilename(file.originalname);
        const filePath = this.getFilePath(slug, module, filename);

        let fileData: Buffer;
        if (file.buffer) {
            fileData = file.buffer;
        } else if (file.path) {
            fileData = readFileSync(file.path);
        } else {
            throw new BadRequestException('Data file tidak ditemukan!');
        }

        writeFileSync(filePath, fileData);

        const relativeUrl = `${slug}/${module}/${filename}`;
        return {
            filename,
            path: relativeUrl,
            url: `/${relativeUrl}`,
        };
    }

    /**
     * Hapus file dari storage.
     * Bisa menerima filename + slug/module ATAU URL path langsung.
     */
    deleteFile(slug: string, module: StorageModule, filename: string): boolean {
        const filePath = this.getFilePath(slug, module, filename);
        return this.deleteByAbsolutePath(filePath);
    }

    /**
     * Hapus file berdasarkan URL path yang tersimpan di DB.
     * Input: /{slug}/{module}/{filename}
     */
    deleteFileByUrl(urlPath: string): boolean {
        const absPath = this.getFilePathFromUrl(urlPath);
        if (!absPath) return false;
        return this.deleteByAbsolutePath(absPath);
    }

    private deleteByAbsolutePath(absPath: string): boolean {
        if (existsSync(absPath)) {
            unlinkSync(absPath);
            return true;
        }
        return false;
    }

    fileExists(slug: string, module: StorageModule, filename: string): boolean {
        return existsSync(this.getFilePath(slug, module, filename));
    }

    listFiles(slug: string, module: StorageModule): string[] {
        const modulePath = this.getModulePath(slug, module);
        if (!existsSync(modulePath)) return [];

        return readdirSync(modulePath).filter((file) =>
            statSync(join(modulePath, file)).isFile(),
        );
    }
}
