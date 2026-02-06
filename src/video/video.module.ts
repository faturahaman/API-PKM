import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoService } from './video.service';
import { VideoAdminController } from './video.admin.controller'; 
import { VideoPublicController } from './video.public.controller'; 
import { Video, VideoSchema } from './schemas/video.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),
  ],
  controllers: [VideoAdminController, VideoPublicController], 
  providers: [VideoService],
})
export class VideoModule {}