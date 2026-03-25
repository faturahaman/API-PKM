import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFiles, Request } from '@nestjs/common';
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
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { AuthGuard } from '@nestjs/passport';
import { createMulterOptions } from '../common/multer.utils';
import { extractRequestMeta } from '../common/dto/request-meta.dto';

@ApiTags('Admin Pages')
@ApiBearerAuth('JWT-auth')
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
    @ApiOperationDetailed({
        summary: 'Create New Page',
        description: 'Creates a new page with optional image and file attachments.',
        useCases: [
            'Creating new content pages',
            'Adding news articles',
            'Publishing announcements'
        ],
        behavior: [
            'Creates page with provided data',
            'Can upload image and/or file',
            'Sets initial status as draft'
        ]
    })
    @ApiBody({ type: CreatePageDto, description: 'Page creation data' })
    @ApiCreatedResponseDoc('Page created successfully', 'New page has been created')
    @ApiErrorResponses()
    create(
        @Request() req: any,
        @Body() createPageDto: CreatePageDto,
        @UploadedFiles()
        files: { image?: Express.Multer.File[]; file?: Express.Multer.File[] },
    ) {
        const image = files.image ? files.image[0] : undefined;
        const document = files.file ? files.file[0] : undefined;
        return this.pagesService.create(createPageDto, image, document, extractRequestMeta(req));
    }

    @Get()
    @ApiOperationDetailed({
        summary: 'List All Pages (Admin)',
        description: 'Returns a list of all pages with optional search.',
        useCases: [
            'Page management interface',
            'Content administration',
            'Search for specific pages'
        ]
    })
    @ApiPaginationParams()
    @ApiQuery({ name: 'search', required: false, description: 'Search term for page title' })
    @ApiPaginatedResponse({ description: 'Paginated list of pages' })
    @ApiErrorResponses()
    findAll(
        @Query('search') search?: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        return this.pagesService.findAllAdmin(search, Number(page), Number(limit));
    }

    // Check if menu already has a page linked (type 'halaman')
    @Get('check-menu')
    @ApiOperationDetailed({
        summary: 'Check Menu Link',
        description: 'Checks if a specific menu is already linked to a page.',
        useCases: [
            'Preventing duplicate page links',
            'Menu configuration validation'
        ]
    })
    @ApiQuery({ name: 'menu_id', required: true, description: 'Menu UUID to check' })
    @ApiStandardResponse({ description: 'Check result' })
    @ApiErrorResponses()
    checkMenuLink(@Query('menu_id') menuId: string) {
        return this.pagesService.checkMenuLink(menuId);
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
        @Request() req: any,
        @Param('id') id: string,
        @Body() updatePageDto: UpdatePageDto,
        @UploadedFiles()
        files: { image?: Express.Multer.File[]; file?: Express.Multer.File[] },
    ) {
        const image = files.image ? files.image[0] : undefined;
        const document = files.file ? files.file[0] : undefined;
        return this.pagesService.update(id, updatePageDto, image, document, extractRequestMeta(req));
    }

    @Delete(':id')
    remove(@Request() req: any, @Param('id') id: string) {
        return this.pagesService.remove(id, extractRequestMeta(req));
    }

    @Patch(':id/toggle-status')
    toggleStatus(@Param('id') id: string) {
        return this.pagesService.toggleStatus(id);
    }
}
