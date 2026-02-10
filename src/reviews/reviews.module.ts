import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from './reviews.service';
import { ReviewsAdminController } from './reviews.admin.controller';
import { ReviewsPublicController } from './reviews.public.controller';
import { Review } from './entity/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review])],
  controllers: [ReviewsAdminController, ReviewsPublicController],
  providers: [ReviewsService],
})
export class ReviewsModule { }