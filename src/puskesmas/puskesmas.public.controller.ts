import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ApiPaginationParams } from '../common/decorators/api-docs.decorator';
import { ApiPaginatedResponse } from '../common/decorators/api-docs.decorator';
import { ApiErrorResponses } from '../common/decorators/api-docs.decorator';
import { PuskesmasService } from './puskesmas.service';

@ApiTags('Puskesmas Management')
@Controller('public/puskesmas')
export class PuskesmasPublicController {
    constructor(private readonly puskesmasService: PuskesmasService) { }

    @Get()
    @ApiOperation({
        summary: 'Get Public Puskesmas List',
        description: 'Retrieves a list of puskesmas (health centers) accessible to public users.'
    })
    @ApiPaginationParams()
    @ApiQuery({ name: 'search', required: false, description: 'Search puskesmas by name or address' })
    @ApiPaginatedResponse({ description: 'Paginated list of puskesmas' })
    @ApiErrorResponses()
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
