import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
    ApiStandardResponse,
    ApiErrorResponses,
    ApiOperationDetailed
} from '../common/decorators/api-docs.decorator';
import { PuskesmasInfoService } from './puskesmas-info.service';

@ApiTags('Public Puskesmas Info')
@Controller('public/puskesmas-info')
export class PuskesmasInfoPublicController {
    constructor(private readonly service: PuskesmasInfoService) { }

    @Get()
    getInfo() {
        return this.service.getInfo();
    }
}
