import {
  Controller, Get, Body, Param, Put, Query, UseGuards
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt')) // Guard Global untuk Class ini
@Controller('admin/reviews') // Endpoint: /api/v1/admin/reviews
export class ReviewsAdminController {
  constructor(private readonly reviewsService: ReviewsService) { }

  // List Semua Review (Termasuk yang belum publish)
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

  // Update Status Publish/Unpublish
  @Put(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateReviewDto
  ) {
    return this.reviewsService.updateStatus(id, updateDto);
  }
}