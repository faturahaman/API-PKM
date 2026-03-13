import { Controller, Get } from '@nestjs/common';
import { PuskesmasService } from './puskesmas.service';

@Controller('public/puskesmas')
export class PuskesmasPublicController {
    constructor(private readonly puskesmasService: PuskesmasService) { }

    @Get()
    async findAll() {
        return this.puskesmasService.findAll();
    }
}
