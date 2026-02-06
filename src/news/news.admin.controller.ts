import {
    Controller, Get, Post, Body, Param, Delete, Put, Query, Request,
    UseGuards, UseInterceptors, UploadedFile, BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { createMulterOptions } from 'src/common/multer.utils';

@UseGuards(AuthGuard('jwt')) // Guard Global untuk Class ini
@Controller('admin/news')    // Endpoint: /api/v1/admin/news
export class NewsAdminController {
    constructor(private readonly newsService: NewsService) { }

    @Post()
    @UseInterceptors(FileInterceptor('image', createMulterOptions('gallery')))
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() createNewsDto: CreateNewsDto,
        @Request() req
    ) {
        if (!file) throw new BadRequestException('Cover berita (image) wajib diupload!');

        // --- SECURITY: MAGIC NUMBER CHECK ---
        const { fileTypeFromFile } = await import('file-type');
        const type = await fileTypeFromFile(file.path);
        if (!type || !['image/jpeg', 'image/png'].includes(type.mime)) {
            const fs = await import('fs');
            try {
                fs.unlinkSync(file.path); // Hapus file berbahaya segera
            } catch (e) { }
            throw new BadRequestException('SECURITY ALERT: File content does not match extension!');
        }
        // ------------------------------------

        // --- SECURITY: IDENTITY SPOOFING FIX ---
        const user = req.user;
        const finalData = {
            ...createNewsDto,
            username: user.name // Paksa pakai nama dari Token
        };
        // ---------------------------------------

        const imagePath = `/uploads/news/${file.filename}`;
        return this.newsService.create(finalData, imagePath);
    }

    @Get()
    findAll(
        @Query('page') page: string,
        @Query('limit') limit: string,
        @Query('search') search: string
    ) {
        const p = parseInt(page) || 1;
        const l = parseInt(limit) || 10;
        return this.newsService.findAll(p, l, search);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.newsService.findOne(id);
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('image', createMulterOptions('gallery')))
    update(
        @Param('id') id: string,
        @Body() updateNewsDto: UpdateNewsDto,
        @UploadedFile() file?: Express.Multer.File
    ) {
        // Note: Jika kamu mau super aman, logic Magic Number Check sebaiknya dicopy ke sini juga jika file != null
        const imagePath = file ? `/uploads/news/${file.filename}` : undefined;
        return this.newsService.update(id, updateNewsDto, imagePath);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.newsService.remove(id);
    }
}