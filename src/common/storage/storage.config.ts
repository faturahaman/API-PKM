/**
 * Shared Storage Configuration
 *
 * Single source of truth untuk semua konfigurasi upload & storage.
 * Digunakan oleh multer.utils.ts (upload) dan storage.service.ts (management).
 */

import { join } from 'path';

// Get the API project root directory
const API_ROOT = process.cwd();

export const PUBLIC_STORAGE_ROOT = join(API_ROOT, 'public');

export type StorageModuleType =
    | 'profile'
    | 'gallery'
    | 'video'
    | 'banner'
    | 'document'
    | 'pages'
    | 'static-pages'
    | 'web-info';

/**
 * Modul yang bisa diakses publik tanpa autentikasi.
 * Contoh: gallery, banner, profile avatar, logo puskesmas, dan gambar artikel.
 */
export const PUBLIC_MODULES: StorageModuleType[] = [
    'gallery',
    'banner',
    'profile',
    'web-info',
    'pages',
    'static-pages'
];

/**
 * Modul yang memerlukan autentikasi dan tenant-matching untuk akses.
 */
export const PRIVATE_MODULES: StorageModuleType[] = [
    'video',
    'document',
];

export interface ModuleStorageConfig {
    folder: string;
    maxSize: number; // dalam bytes
    allowedMimeTypes: RegExp;
    allowedExtensions: string[];
    errorMessage: string;
    filenamePrefix?: string;
    isPublic: boolean;
}

/**
 * Konfigurasi storage per modul.
 * env override tersedia untuk ukuran file agar bisa dikonfigurasi tanpa rebuild.
 */
export const MODULE_STORAGE_CONFIG: Record<StorageModuleType, ModuleStorageConfig> = {
    profile: {
        folder: 'profiles',
        maxSize: parseInt(process.env.UPLOAD_SIZE_PROFILE || (2 * 1024 * 1024).toString()),
        allowedMimeTypes: /^image\/(jpg|jpeg|png)$/,
        allowedExtensions: ['.jpg', '.jpeg', '.png'],
        errorMessage: 'Format file tidak valid! Hanya jpg, jpeg, png yang diperbolehkan.',
        filenamePrefix: 'admin',
        isPublic: false,
    },
    gallery: {
        folder: 'gallery',
        maxSize: parseInt(process.env.UPLOAD_SIZE_GALLERY || (3 * 1024 * 1024).toString()),
        allowedMimeTypes: /^image\/(jpg|jpeg|png)$/,
        allowedExtensions: ['.jpg', '.jpeg', '.png'],
        errorMessage: 'Format file tidak valid! Hanya jpg, jpeg, png yang diperbolehkan.',
        isPublic: true,
    },
    video: {
        folder: 'video',
        maxSize: parseInt(process.env.UPLOAD_SIZE_VIDEO || (15 * 1024 * 1024).toString()),
        allowedMimeTypes: /^video\/(mp4|webm|ogg|quicktime|x-msvideo)$/,
        allowedExtensions: ['.mp4', '.webm', '.ogg', '.mov', '.avi'],
        errorMessage: 'Format file tidak valid! Hanya mp4, webm, ogg, mov, avi yang diperbolehkan.',
        filenamePrefix: 'VID',
        isPublic: false,
    },
    banner: {
        folder: 'banner',
        maxSize: parseInt(process.env.UPLOAD_SIZE_BANNER || (5 * 1024 * 1024).toString()),
        allowedMimeTypes: /^image\/(jpg|jpeg|png|gif)$/,
        allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif'],
        errorMessage: 'Format file tidak valid! Hanya jpg, jpeg, png, gif yang diperbolehkan.',
        isPublic: true,
    },
    document: {
        folder: 'documents',
        maxSize: parseInt(process.env.UPLOAD_SIZE_DOCUMENT || (10 * 1024 * 1024).toString()),
        allowedMimeTypes: /^(application\/pdf|image\/(jpg|jpeg|png))$/,
        allowedExtensions: ['.pdf', '.jpg', '.jpeg', '.png'],
        errorMessage: 'Format file tidak valid! Hanya pdf, jpg, jpeg, png yang diperbolehkan.',
        filenamePrefix: 'DOC',
        isPublic: false,
    },
    pages: {
        folder: 'pages',
        maxSize: parseInt(process.env.UPLOAD_SIZE_PAGES || (10 * 1024 * 1024).toString()),
        allowedMimeTypes: /^(image\/(jpg|jpeg|png|webp)|application\/pdf)$/,
        allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.pdf'],
        errorMessage: 'Format file tidak valid! Hanya gambar (jpg, png, webp) dan PDF yang diperbolehkan.',
        filenamePrefix: 'PAGE',
        isPublic: false,
    },
    'static-pages': {
        folder: 'static-pages',
        maxSize: parseInt(process.env.UPLOAD_SIZE_STATIC_PAGES || (10 * 1024 * 1024).toString()),
        allowedMimeTypes: /^(image\/(jpg|jpeg|png|webp)|application\/pdf)$/,
        allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.pdf'],
        errorMessage: 'Format file tidak valid! Hanya gambar (jpg, png, webp) dan PDF yang diperbolehkan.',
        filenamePrefix: 'STATIC',
        isPublic: false,
    },
    'web-info': {
        folder: 'web-info',
        maxSize: parseInt(process.env.UPLOAD_SIZE_WEB_INFO || (2 * 1024 * 1024).toString()),
        allowedMimeTypes: /^image\/(jpg|jpeg|png)$/,
        allowedExtensions: ['.jpg', '.jpeg', '.png'],
        errorMessage: 'Format file tidak valid! Hanya gambar (jpg, jpeg, png) yang diperbolehkan.',
        filenamePrefix: 'LOGO',
        isPublic: false,
    },
};

/**
 * Root direktori penyimpanan dari environment variable.
 * Sekarang menggunakan folder public untuk akses langsung via URL.
 */
export const STORAGE_ROOT = process.env.STORAGE_ROOT || join(PUBLIC_STORAGE_ROOT, 'storage');

/**
 * Helper: cek apakah modul bersifat publik
 */
export function isPublicModule(module: string): boolean {
    return PUBLIC_MODULES.includes(module as StorageModuleType);
}

/**
 * Mendapatkan path lengkap untuk menyimpan file di public/{slug}/{module}
 */
export function getPublicStoragePath(slug: string, module: string): string {
    return join(PUBLIC_STORAGE_ROOT, slug, module);
}
