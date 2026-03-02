import { Controller } from '@nestjs/common';
import { LogactivityService } from './logactivity.service';

@Controller('logactivity')
export class LogactivityController {
  constructor(private readonly logactivityService: LogactivityService) {}
}
