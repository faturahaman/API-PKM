import {
    Controller, Get, Body, Patch, UseGuards,
    UseInterceptors, UploadedFile, UploadedFiles
} from '@nestjs/common';
import { FileInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express';
import { PuskesmasInfoService } from './puskesmas-info.service';
import { UpdatePuskesmasInfoDto } from './dto/puskesmas-info.dto';
import { AuthGuard } from '@nestjs/passport';
import { createMulterOptions, getPublicPath } from '../common/multer.utils';

@UseGuards(AuthGuard('jwt'))
@Controller('admin/puskesmas-info')
export class PuskesmasInfoAdminController {
    constructor(private readonly service: PuskesmasInfoService) { }

    @Get()
    getInfo() {
        return this.service.getInfo();
    }

    @Patch()
    @UseInterceptors(AnyFilesInterceptor(createMulterOptions('web-info')))
    update(
        @Body() dto: UpdatePuskesmasInfoDto,
        @UploadedFiles() files?: Express.Multer.File[]
    ) {
        // Handle logo file
        const logoFile = files?.find(f => f.fieldname === 'logo');
        if (logoFile) {
            dto.logo = getPublicPath('web-info', logoFile.filename);
        }

        // Handle kepala_foto file
        const kepalaFile = files?.find(f => f.fieldname === 'kepala_foto');
        if (kepalaFile) {
            dto.kepala_foto = getPublicPath('web-info', kepalaFile.filename);
        }

        return this.service.updateInfo(dto);
    }
}
