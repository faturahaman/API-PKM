import {
  Controller, Get, Body, Param, Patch, Query, UseGuards
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import {
  ApiStandardResponse,
  ApiPaginatedResponse,
  ApiErrorResponses,
  ApiOperationDetailed,
  ApiPaginationParams
} from '../common/decorators/api-docs.decorator';
import { ReviewsService } from './reviews.service';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Admin Reviews')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt')) // Guard Global untuk Class ini
@Controller('admin/reviews') // Endpoint: /api/v1/admin/reviews
export class ReviewsAdminController {
  constructor(private readonly reviewsService: ReviewsService) { }

  // List Semua Review (Termasuk yang belum publish)
  @Get()
  @ApiOperationDetailed({
    summary: 'List All Reviews (Admin)',
    description: 'Returns all reviews including unpublished for admin management.',
    useCases: [
      'Review moderation',
      'Managing user feedback',
      'Content administration'
    ]
  })
  @ApiPaginationParams()
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category' })
  @ApiPaginatedResponse({ description: 'Paginated list of reviews' })
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

  // Update Status Publish/Unpublish
  @Patch(':id')
  @ApiOperationDetailed({
    summary: 'Update Review Status',
    description: 'Updates review publish status (publish/unpublish).',
    useCases: [
      'Publishing review',
      'Unpublishing inappropriate content',
      'Review moderation'
    ]
  })
  @ApiParam({ name: 'id', description: 'Review UUID' })
  @ApiBody({ type: UpdateReviewDto, description: 'Status update' })
  @ApiStandardResponse({ description: 'Review status updated' })
  @ApiErrorResponses()
  updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateReviewDto
  ) {
    return this.reviewsService.updateStatus(id, updateDto);
  }
}