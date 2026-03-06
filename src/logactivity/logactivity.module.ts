import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogactivityService } from './logactivity.service';
import { LogactivityController } from './logactivity.controller';
import { LogActivity } from './entity/log-activity.entity';
import { TenantModule } from '../common/tenant/tenant.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LogActivity]),
    TenantModule,
  ],
  controllers: [LogactivityController],
  providers: [LogactivityService],
  exports: [LogactivityService],
})
export class LogactivityModule { }
