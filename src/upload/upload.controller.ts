import { Controller, Post, UseGuards, UseInterceptors, UploadedFile, BadRequestException, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { createMulterOptions, getPublicPath } from 'src/common/multer.utils';

@ApiTags('Admin Upload')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'))
@Controller('admin/upload')
export class UploadAdminController {

    @Post('editor')
    @ApiOperation({ summary: 'Upload file for editor', description: 'Upload file to be used in content editor (TinyMCE, etc.)' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({
        status: 200,
        description: 'File uploaded successfully',
        schema: {
            example: {
                success: 1,
                file: {
                    url: 'https://cdn.example.com/uploads/shared/document/filename.jpg',
                    name: 'image.jpg',
                    size: 102400,
                    mimetype: 'image/jpeg'
                }
            }
        }
    })
    @ApiResponse({ status: 400, description: 'File not found or invalid file type' })
    @UseInterceptors(FileInterceptor('file', createMulterOptions('document')))
    async uploadForEditor(@Request() req: any, @UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException('File tidak ditemukan!');

        const tenantId = req.tenantId || (req.user?.role === 'SUPER_ADMIN' ? req.user.active_tenant : req.user?.puskesmas_id) || 'shared';
        const publicUrl = getPublicPath('document', file.filename, tenantId);

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