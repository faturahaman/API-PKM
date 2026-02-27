import {
    Controller, Get, Body, Put, UseGuards,
    UseInterceptors, UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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

    @Put()
    @UseInterceptors(FileInterceptor('logo', createMulterOptions('web-info')))
    update(
        @Body() dto: UpdatePuskesmasInfoDto,
        @UploadedFile() file?: Express.Multer.File
    ) {
        if (file) {
            dto.logo = getPublicPath('web-info', file.filename);
        }

        return this.service.updateInfo(dto);
    }
}
