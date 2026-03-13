import { Controller, Get, Query } from '@nestjs/common';
import { PuskesmasService } from './puskesmas.service';

@Controller('public/puskesmas')
export class PuskesmasPublicController {
    constructor(private readonly puskesmasService: PuskesmasService) { }

    @Get()
    async findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string,
    ) {
        const pageNum = page ? Number(page) : 1;
        const limitNum = limit ? Number(limit) : 10;
        return this.puskesmasService.findAll(pageNum, limitNum, search);
    }
}
