import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import {
    ApiStandardResponse,
    ApiErrorResponses,
    ApiOperationDetailed
} from '../common/decorators/api-docs.decorator';
import { StaticPagesService } from './static-pages.service';

@ApiTags('Public Static Pages')
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
