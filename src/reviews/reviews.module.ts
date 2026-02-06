import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewsService } from './reviews.service';
import { ReviewsAdminController } from './reviews.admin.controller'; 
import { ReviewsPublicController } from './reviews.public.controller';
import { Review, ReviewSchema } from './schemas/review.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
  ],
  controllers: [ReviewsAdminController, ReviewsPublicController], 
  providers: [ReviewsService],
})
export class ReviewsModule {}