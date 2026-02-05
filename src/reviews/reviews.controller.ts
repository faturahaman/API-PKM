import { 
  Controller, Get, Post, Body, Param, Put, Query, UseGuards 
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewStatusDto } from './dto/update-review.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('reviews') // Base URL
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // 1. Submit Review (Public - Gak perlu Login)
  @Post()
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  // 2. List Review (Admin Only - Butuh Token)
  @UseGuards(AuthGuard('jwt'))
  @Get('admin')
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('category') category: string
  ) {
    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 10;
    return this.reviewsService.findAll(p, l, category);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('admin/:id/status')
  updateStatus(
    @Param('id') id: string, 
    @Body() updateDto: UpdateReviewStatusDto
  ) {
    return this.reviewsService.updateStatus(id, updateDto);
  }

}