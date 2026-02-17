import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin/pages')
@UseGuards(AuthGuard('jwt'))
export class PagesAdminController {
    constructor(private readonly pagesService: PagesService) { }

    @Post()
    create(@Body() createPageDto: CreatePageDto) {
        return this.pagesService.create(createPageDto);
    }

    @Get()
    findAll(
        @Query('search') search?: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        return this.pagesService.findAllAdmin(search, Number(page), Number(limit));
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.pagesService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePageDto: UpdatePageDto) {
        return this.pagesService.update(id, updatePageDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.pagesService.remove(id);
    }
}
