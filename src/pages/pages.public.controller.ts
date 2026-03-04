import { Controller, Get, Param, Query } from '@nestjs/common';
import { PagesService } from './pages.service';

@Controller('pages')
export class PagesPublicController {
    constructor(private readonly pagesService: PagesService) { }

    @Get()
    findPublished() {
        return this.pagesService.findPublished();
    }

    @Get('pelayanan')
    findPelayanan() {
        return this.pagesService.findPelayanan();
    }

    @Get('berita')
    findBerita() {
        return this.pagesService.findBerita();
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
