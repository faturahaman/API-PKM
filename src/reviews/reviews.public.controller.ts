import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('reviews') // Endpoint: /api/v1/reviews
export class ReviewsPublicController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // Submit Review (Public)
  @Post()
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  @Get()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('category') category: string
  ) {
    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 10;
    return this.reviewsService.findAll(p, l, category);
  }
}
