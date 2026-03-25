import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import {
    ApiStandardResponse,
    ApiPaginatedResponse,
    ApiErrorResponses,
    ApiOperationDetailed,
    ApiPaginationParams
} from '../common/decorators/api-docs.decorator';
import { PagesService } from './pages.service';

@ApiTags('Public Pages')
@Controller('pages')
export class PagesPublicController {
    constructor(private readonly pagesService: PagesService) { }

    @Get()
    findPublished() {
        return this.pagesService.findPublished();
    }

    @Get('search')
    search(@Query('q') q: string) {
        return this.pagesService.search(q);
    }

    @Get('pelayanan')
    findPelayanan() {
        return this.pagesService.findPelayanan();
    }

    @Get('berita')
    findBerita(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const p = page ? parseInt(page) || 1 : undefined;
        const l = limit ? parseInt(limit) || undefined : undefined;
        return this.pagesService.findBerita(p, l);
    }

    @Get('menu/:menuId')
    findByMenuId(@Param('menuId') menuId: string) {
        return this.pagesService.findByMenuId(menuId);
    }

    @Get('menu/:menuId/all')
    findAllByMenuId(
        @Param('menuId') menuId: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string
    ) {
        const p = parseInt(page || '1') || 1;
        const l = parseInt(limit || '10') || 10;
        return this.pagesService.findAllByMenuId(menuId, p, l);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.pagesService.findOne(id);
    }

    @Get('data/:data')
    findOneByData(@Param('data') data: string) {
        return this.pagesService.findOneByData(data);
    }
}
