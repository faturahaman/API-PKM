import { Controller, Get, Param } from '@nestjs/common';
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

    @Get('menu/:menuId')
    findByMenuId(@Param('menuId') menuId: string) {
        return this.pagesService.findByMenuId(menuId);
    }

    @Get('menu/:menuId/all')
    findAllByMenuId(@Param('menuId') menuId: string) {
        return this.pagesService.findAllByMenuId(menuId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.pagesService.findOne(id);
    }

    
}
