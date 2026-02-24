import {
    Controller, Get, Post, Body, Param, Query,
    UseInterceptors, UploadedFile, BadRequestException,
    UseGuards, Delete, Put
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from 'src/gallery/dto/create-gallery.dto';
import { createMulterOptions } from 'src/common/multer.utils';

@UseGuards(AuthGuard('jwt')) // Semua endpoint di class ini butuh Token
@Controller('admin/gallery') // Endpoint: /api/v1/admin/gallery
export class GalleryAdminController {
    constructor(private readonly galleryService: GalleryService) { }

    @Post()
    @UseInterceptors(FileInterceptor('image', createMulterOptions('gallery')))
    create(@UploadedFile() file: Express.Multer.File, @Body() createGalleryDto: CreateGalleryDto) {
        if (!file) throw new BadRequestException('File gambar wajib diupload!');
        const imagePath = `/uploads/gallery/${file.filename}`;
        return this.galleryService.create(createGalleryDto, imagePath);
    }

    // Admin juga butuh liat list gallery untuk manajemen
    @Get()
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
    remove(@Param('id') id: string) {
        return this.galleryService.remove(id);
    }

    // Update foto masuk ke album mana
    @Put('album')
    updateAlbum(@Body() body: { photo_ids: string[], album_id: string }) {
        return this.galleryService.updateAlbumId(body.photo_ids, body.album_id);
    }

    // Hapus foto dari album (set album_id ke null)
    @Put('remove-from-album')
    removeFromAlbum(@Body() body: { photo_ids: string[], album_id: string }) {
        return this.galleryService.removeFromAlbum(body.photo_ids, body.album_id);
    }
}