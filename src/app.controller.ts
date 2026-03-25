import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApiStandardResponse, ApiOperationDetailed } from './common/decorators/api-docs.decorator';
import { AppService } from './app.service';

@ApiTags('Health Check')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('health')
  healthCheck() {
    return this.appService.healthCheck();
  }
}