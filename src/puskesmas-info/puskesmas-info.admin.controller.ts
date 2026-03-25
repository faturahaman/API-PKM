import {
    Controller, Get, Body, Patch, UseGuards, Request,
    UseInterceptors, UploadedFile, UploadedFiles
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';
import { FileInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express';
import {
    ApiStandardResponse,
    ApiErrorResponses,
    ApiSuccessResponse,
    ApiOperationDetailed
} from '../common/decorators/api-docs.decorator';
import { PuskesmasInfoService } from './puskesmas-info.service';
import { UpdatePuskesmasInfoDto } from './dto/puskesmas-info.dto';
import { AuthGuard } from '@nestjs/passport';
import { createMulterOptions, getPublicPath } from '../common/multer.utils';

@ApiTags('Admin Puskesmas Info')
@ApiBearerAuth('JWT-auth')
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
        @Request() req: any,
        @Body() dto: UpdatePuskesmasInfoDto,
        @UploadedFiles() files?: Express.Multer.File[]
    ) {
        const tenantId = req.tenantId || (req.user?.role === 'SUPER_ADMIN' ? req.user.active_tenant : req.user?.puskesmas_id) || 'shared';

        // Handle logo file
        const logoFile = files?.find(f => f.fieldname === 'logo');
        if (logoFile) {
            dto.logo = getPublicPath('web-info', logoFile.filename, tenantId);
        }

        // Handle kepala_foto file
        const kepalaFile = files?.find(f => f.fieldname === 'kepala_foto');
        if (kepalaFile) {
            dto.kepala_foto = getPublicPath('web-info', kepalaFile.filename, tenantId);
        }

        return this.service.updateInfo(dto);
    }
}
