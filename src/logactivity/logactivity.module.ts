import { Module } from '@nestjs/common';
import { LogactivityService } from './logactivity.service';
import { LogactivityController } from './logactivity.controller';

@Module({
  controllers: [LogactivityController],
  providers: [LogactivityService],
})
export class LogactivityModule {}
