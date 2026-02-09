import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannerService } from './banner.service';
import { BannerAdminController } from './banner.admin.controller';
import { BannerPublicController } from './banner.public.controller';
import { Banner } from './schemas/banner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Banner])],
  controllers: [BannerAdminController, BannerPublicController],
  providers: [BannerService],
  exports: [BannerService],
})
export class BannerModule { }