import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBody } from '@nestjs/swagger';
import {
  ApiStandardResponse,
  ApiPaginatedResponse,
  ApiErrorResponses,
  ApiCreatedResponseDoc,
  ApiOperationDetailed,
  ApiPaginationParams
} from '../common/decorators/api-docs.decorator';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

@ApiTags('Public Reviews')
@Controller('reviews')
export class ReviewsPublicController {
  constructor(private readonly reviewsService: ReviewsService) { }

  @Post()
  @ApiOperationDetailed({
    summary: 'Submit Review',
    description: 'Allows users to submit a review/rating for the puskesma.',
    useCases: [
      'User feedback submission',
      'Rating and reviews',
      'Service improvement feedback'
    ],
    notes: [
      'This is a public endpoint - no authentication required',
      'Review may require moderation before publishing'
    ]
  })
  @ApiBody({ type: CreateReviewDto, description: 'Review data' })
  @ApiCreatedResponseDoc('Review submitted successfully', 'Thank you for your feedback')
  @ApiErrorResponses()
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  @Get()
  @ApiOperationDetailed({
    summary: 'List Published Reviews',
    description: 'Returns published reviews for public viewing.',
    useCases: [
      'Displaying user reviews on website',
      'Rating display',
      'Testimonials section'
    ]
  })
  @ApiPaginationParams()
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category' })
  @ApiPaginatedResponse({ description: 'List of published reviews' })
  @ApiErrorResponses()
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
