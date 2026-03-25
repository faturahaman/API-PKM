import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
    ApiStandardResponse,
    ApiPaginatedResponse,
    ApiErrorResponses,
    ApiSuccessResponse,
    ApiCreatedResponseDoc,
    ApiOperationDetailed,
    ApiPaginationParams
} from '../common/decorators/api-docs.decorator';
import { StaticPagesService } from './static-pages.service';
import { CreateStaticPageDto } from './dto/create-static-page.dto';
import { UpdateStaticPageDto } from './dto/update-static-page.dto';
import { AuthGuard } from '@nestjs/passport';
import { createMulterOptions } from '../common/multer.utils';

@ApiTags('Admin Static Pages')
@ApiBearerAuth('JWT-auth')
@Controller('admin/static-pages')
@UseGuards(AuthGuard('jwt'))
export class StaticPagesAdminController {
    constructor(private readonly staticPagesService: StaticPagesService) { }

    @Post()
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'image', maxCount: 1 },
            ],
            createMulterOptions('static-pages'),
        ),
    )
    create(
        @Body() createStaticPageDto: CreateStaticPageDto,
        @UploadedFiles()
        files: { image?: Express.Multer.File[] },
    ) {
        const image = files.image ? files.image[0] : undefined;
        return this.staticPagesService.create(createStaticPageDto, image);
    }

    @Get()
    findAll(
        @Query('search') search?: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        return this.staticPagesService.findAllAdmin(search, Number(page), Number(limit));
    }

    // Check if menu already has a static page linked
    @Get('check-menu')
    checkMenuLink(@Query('menu_id') menuId: string) {
        return this.staticPagesService.checkMenuLink(menuId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.staticPagesService.findOne(id);
    }

    @Patch(':id')
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'image', maxCount: 1 },
            ],
            createMulterOptions('static-pages'),
        ),
    )
    update(
        @Param('id') id: string,
        @Body() updateStaticPageDto: UpdateStaticPageDto,
        @UploadedFiles()
        files: { image?: Express.Multer.File[] },
    ) {
        const image = files.image ? files.image[0] : undefined;
        return this.staticPagesService.update(id, updateStaticPageDto, image);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.staticPagesService.remove(id);
    }
}
