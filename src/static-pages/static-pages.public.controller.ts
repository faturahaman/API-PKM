import { Controller, Get, Param } from '@nestjs/common';
import { StaticPagesService } from './static-pages.service';

@Controller('static-pages')
export class StaticPagesPublicController {
    constructor(private readonly staticPagesService: StaticPagesService) { }

    @Get()
    findAll() {
        return this.staticPagesService.findAll();
    }

    @Get('menu/:menuId')
    findByMenuId(@Param('menuId') menuId: string) {
        return this.staticPagesService.findByMenuId(menuId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.staticPagesService.findOne(id);
    }
}
