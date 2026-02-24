import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { AuthGuard } from '@nestjs/passport';
import { createMulterOptions } from '../common/multer.utils';

@Controller('admin/pages')
@UseGuards(AuthGuard('jwt'))
export class PagesAdminController {
    constructor(private readonly pagesService: PagesService) { }

    @Post()
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'image', maxCount: 1 },
                { name: 'file', maxCount: 1 },
            ],
            createMulterOptions('pages'),
        ),
    )
    create(
        @Body() createPageDto: CreatePageDto,
        @UploadedFiles()
        files: { image?: Express.Multer.File[]; file?: Express.Multer.File[] },
    ) {
        const image = files.image ? files.image[0] : undefined;
        const document = files.file ? files.file[0] : undefined;
        return this.pagesService.create(createPageDto, image, document);
    }

    @Get()
    findAll(
        @Query('search') search?: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        return this.pagesService.findAllAdmin(search, Number(page), Number(limit));
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.pagesService.findOne(id);
    }

    @Patch(':id')
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'image', maxCount: 1 },
                { name: 'file', maxCount: 1 },
            ],
            createMulterOptions('pages'),
        ),
    )
    update(
        @Param('id') id: string,
        @Body() updatePageDto: UpdatePageDto,
        @UploadedFiles()
        files: { image?: Express.Multer.File[]; file?: Express.Multer.File[] },
    ) {
        const image = files.image ? files.image[0] : undefined;
        const document = files.file ? files.file[0] : undefined;
        return this.pagesService.update(id, updatePageDto, image, document);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.pagesService.remove(id);
    }

    @Patch(':id/toggle-status')
    toggleStatus(@Param('id') id: string) {
        return this.pagesService.toggleStatus(id);
    }
}
