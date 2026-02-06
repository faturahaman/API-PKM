import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsService } from './news.service';
import { NewsAdminController } from './news.admin.controller';
import { NewsPublicController } from './news.public.controller';
import { News, NewsSchema } from './schemas/news.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }]),
  ],
  controllers: [NewsAdminController, NewsPublicController],
  providers: [NewsService],
})
export class NewsModule {}