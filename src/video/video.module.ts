import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoService } from './video.service';
import { VideoAdminController } from './video.admin.controller';
import { VideoPublicController } from './video.public.controller';
import { Video } from './entity/video.entity';
import { LogactivityModule } from '../logactivity/logactivity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Video]),
    LogactivityModule,
  ],
  controllers: [VideoAdminController, VideoPublicController],
  providers: [VideoService],
  exports: [VideoService],
})
export class VideoModule { }