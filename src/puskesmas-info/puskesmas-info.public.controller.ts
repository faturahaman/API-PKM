import { Controller, Get } from '@nestjs/common';
import { PuskesmasInfoService } from './puskesmas-info.service';

@Controller('public/puskesmas-info')
export class PuskesmasInfoPublicController {
    constructor(private readonly service: PuskesmasInfoService) { }

    @Get()
    getInfo() {
        return this.service.getInfo();
    }
}
