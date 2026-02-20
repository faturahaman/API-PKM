import { Controller, Get, Param } from '@nestjs/common';
import { PagesService } from './pages.service';

@Controller('pages')
export class PagesPublicController {
    constructor(private readonly pagesService: PagesService) { }

    @Get()
    findPublished() {
        return this.pagesService.findPublished();
    }

    @Get('menu/:menuId')
    findByMenuId(@Param('menuId') menuId: string) {
        return this.pagesService.findByMenuId(menuId);
    }

    @Get(':slug')
    findBySlug(@Param('slug') slug: string) {
        return this.pagesService.findBySlug(slug);
    }
}
