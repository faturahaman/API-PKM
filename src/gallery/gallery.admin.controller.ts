import {
    Controller, Get, Post, Body, Param, Query,
    UseInterceptors, UploadedFile, BadRequestException,
    UseGuards, Delete, Patch, Request
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiStandardResponse,
    ApiPaginatedResponse,
    ApiErrorResponses,
    ApiSuccessResponse,
    ApiCreatedResponseDoc,
    ApiOperationDetailed,
    ApiPaginationParams
} from '../common/decorators/api-docs.decorator';
import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from 'src/gallery/dto/create-gallery.dto';
import { createMulterOptions } from 'src/common/multer.utils';
import { extractRequestMeta } from 'src/common/dto/request-meta.dto';
import { AdminRole } from 'src/admins/entity/admin.entity';

@ApiTags('Admin Gallery')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt')) // Semua endpoint di class ini butuh Token
@Controller('admin/gallery') // Endpoint: /api/v1/admin/gallery
export class GalleryAdminController {
    constructor(
        private readonly galleryService: GalleryService
    ) { }

    @Post()
    @UseInterceptors(FileInterceptor('image', createMulterOptions('gallery')))
    @ApiOperationDetailed({
        summary: 'Upload New Photo',
        description: 'Uploads and creates a new gallery photo entry.',
        useCases: [
            'Adding new photos to gallery',
            'Documenting events',
            'Updating photo collection'
        ],
        behavior: [
            'Requires image file upload',
            'Stores image in tenant-specific directory',
            'Creates database entry with metadata'
        ],
        notes: [
            'Image file is required',
            'Supported formats: jpg, jpeg, png, webp, gif'
        ]
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string', example: 'Foto Kegiatan Hari Kesehatan', description: 'Photo title' },
                description: { type: 'string', example: 'Dokumentasi kegiatan pemeriksaan kesehatan', description: 'Photo description' },
                album_id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000', description: 'Album UUID (optional)' },
                is_published: { type: 'boolean', example: true, description: 'Publish status' },
                image: { type: 'string', format: 'binary', description: 'Image file' }
            },
            required: ['image']
        }
    })
    @ApiCreatedResponseDoc('Photo uploaded successfully', 'New photo has been added to gallery')
    @ApiErrorResponses()
    async create(@Request() req: any, @UploadedFile() file: Express.Multer.File, @Body() createGalleryDto: CreateGalleryDto) {
        if (!file) throw new BadRequestException('File gambar wajib diupload!');

        // BARU: Simpan path file dengan format: /{slug}/gallery/{filename}
        // File akan disimpan di public/{slug}/gallery/{filename}
        // Akses langsung via URL tanpa /files prefix
        const slug = req.tenantId || (req.user?.role === 'SUPER_ADMIN' ? req.user.active_tenant : req.user?.puskesmas_id) || 'shared';
        const imagePath = `/${slug}/gallery/${file.filename}`;

        return this.galleryService.create(createGalleryDto, imagePath, extractRequestMeta(req));
    }

    // Admin juga butuh liat list gallery untuk manajemen
    @Get()
    @ApiOperationDetailed({
        summary: 'List All Photos (Admin)',
        description: 'Returns a paginated list of all gallery photos with optional filtering.',
        useCases: [
            'Gallery management interface',
            'Photo administration',
            'Bulk photo operations'
        ],
        behavior: [
            'Supports pagination',
            'Can filter by album or show unassigned photos',
            'Returns all photos regardless of publish status'
        ]
    })
    @ApiPaginationParams()
    @ApiQuery({ name: 'noAlbum', required: false, description: 'Filter photos without album (true/false)' })
    @ApiQuery({ name: 'albumId', required: false, description: 'Filter by album UUID' })
    @ApiPaginatedResponse({ description: 'Paginated list of photos' })
    @ApiErrorResponses()
    findAll(
        @Query('page') page: string,
        @Query('limit') limit: string,
        @Query('no_album') noAlbum: string,
        @Query('album_id') albumId: string
    ) {
        const p = parseInt(page) || 1;
        const l = parseInt(limit) || 12;
        const isNoAlbum = noAlbum === 'true';

        return this.galleryService.findAll(p, l, isNoAlbum, albumId);
    }

    @Delete(':id')
    @ApiOperationDetailed({
        summary: 'Delete Photo',
        description: 'Permanently removes a photo from the gallery.',
        useCases: [
            'Removing unwanted photos',
            'Cleaning up test images',
            'Gallery management'
        ],
        behavior: [
            'Removes photo record',
            'Deletes image file from storage'
        ],
        notes: [
            'This action is irreversible',
            'Image file will be deleted permanently'
        ]
    })
    @ApiParam({ name: 'id', description: 'Photo UUID' })
    @ApiSuccessResponse('Photo deleted successfully', 'Photo has been removed')
    @ApiErrorResponses()
    remove(@Request() req: any, @Param('id') id: string) {
        return this.galleryService.remove(id, extractRequestMeta(req));
    }

    // Update foto masuk ke album mana
    @Patch('album')
    @ApiOperationDetailed({
        summary: 'Move Photos to Album',
        description: 'Assigns multiple photos to a specific album.',
        useCases: [
            'Organizing photos into albums',
            'Bulk photo management',
            'Album population'
        ],
        behavior: [
            'Updates album_id for multiple photos',
            'All photos must belong to same tenant'
        ],
        notes: [
            'Takes an array of photo IDs',
            'Album ID is required'
        ]
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                photo_ids: { type: 'array', items: { type: 'string' }, example: ['uuid1', 'uuid2'], description: 'Array of photo UUIDs' },
                album_id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000', description: 'Target album UUID' }
            },
            required: ['photo_ids', 'album_id']
        }
    })
    @ApiStandardResponse({ description: 'Photos moved to album successfully' })
    @ApiErrorResponses()
    updateAlbum(@Body() body: { photo_ids: string[], album_id: string }) {
        return this.galleryService.updateAlbumId(body.photo_ids, body.album_id);
    }

    // Hapus foto dari album (set album_id ke null)
    @Patch('remove-from-album')
    @ApiOperationDetailed({
        summary: 'Remove Photos from Album',
        description: 'Removes multiple photos from their album (sets album_id to null).',
        useCases: [
            'Unassigning photos from album',
            'Removing photos from collection',
            'Album management'
        ],
        behavior: [
            'Sets album_id to null for specified photos',
            'Does not delete the photos'
        ]
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                photo_ids: { type: 'array', items: { type: 'string' }, example: ['uuid1', 'uuid2'], description: 'Array of photo UUIDs' },
                album_id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000', description: 'Album UUID' }
            },
            required: ['photo_ids', 'album_id']
        }
    })
    @ApiStandardResponse({ description: 'Photos removed from album successfully' })
    @ApiErrorResponses()
    removeFromAlbum(@Body() body: { photo_ids: string[], album_id: string }) {
        return this.galleryService.removeFromAlbum(body.photo_ids, body.album_id);
    }
}