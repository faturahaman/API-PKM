import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BannerService } from './banner.service';
import { BannerAdminController } from './banner.admin.controller';
import { BannerPublicController } from './banner.public.controller';
import { Banner, BannerSchema } from './schemas/banner.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Banner.name, schema: BannerSchema }]),
  ],
  controllers: [BannerAdminController, BannerPublicController],
  providers: [BannerService],
})
export class BannerModule { }