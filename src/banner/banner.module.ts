import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannerService } from './banner.service';
import { BannerAdminController } from './banner.admin.controller';
import { BannerPublicController } from './banner.public.controller';
import { Banner } from './entity/banner.entity';
import { LogactivityModule } from '../logactivity/logactivity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Banner]),
    LogactivityModule,
  ],
  controllers: [BannerAdminController, BannerPublicController],
  providers: [BannerService],
  exports: [BannerService],
})
export class BannerModule { }