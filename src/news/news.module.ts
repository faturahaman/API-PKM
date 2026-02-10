import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsService } from './news.service';
import { NewsAdminController } from './news.admin.controller';
import { NewsPublicController } from './news.public.controller';
import { News } from './entity/news.entity';

@Module({
  imports: [TypeOrmModule.forFeature([News])],
  controllers: [NewsAdminController, NewsPublicController],
  providers: [NewsService],
})
export class NewsModule { }