import { Controller, Post, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { createMulterOptions, getPublicPath } from 'src/common/multer.utils';

@UseGuards(AuthGuard('jwt'))
@Controller('admin/upload')
export class UploadAdminController {

    @Post('editor')
    @UseInterceptors(FileInterceptor('file', createMulterOptions('document')))
    async uploadForEditor(@UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException('File tidak ditemukan!');

        const publicUrl = getPublicPath('document', file.filename);

        return {
            success: 1,
            file: {
                url: publicUrl,
                name: file.originalname,
                size: file.size,
                mimetype: file.mimetype
            }
        };
    }
}