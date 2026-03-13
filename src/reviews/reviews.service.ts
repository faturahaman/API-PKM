import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entity/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { RecaptchaService } from '../common/recaptcha/recaptcha.service';

import { TenantContextService } from '../common/tenant/tenant-context.service';
import { BaseTenantRepository } from '../common/tenant/base-tenant.repository';
import { LogactivityService } from '../logactivity/logactivity.service';
import { LogActivityAction } from '../logactivity/entity/log-activity.entity';
import { RequestMetaDto } from '../common/dto/request-meta.dto';

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);
  private reviewRepository: BaseTenantRepository<Review>;

  constructor(
    @InjectRepository(Review)
    reviewRepositoryNative: Repository<Review>,
    private readonly recaptchaService: RecaptchaService,
    private readonly tenantContextService: TenantContextService,
    private readonly logactivityService: LogactivityService,
  ) {
    this.reviewRepository = new BaseTenantRepository(reviewRepositoryNative, tenantContextService);
  }

  // Create (Bisa buat Public API)
  async create(createReviewDto: CreateReviewDto) {
    await this.recaptchaService.verify(createReviewDto.recaptchaToken);
    const newReview = this.reviewRepository.create(createReviewDto);
    return this.reviewRepository.save(newReview);
  }

  // Find All (Buat Admin Dashboard)
  async findAll(page: number = 1, limit: number = 10, category?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    // filter kategori
    if (category) {
      where.category = category;
    }

    const [data, total] = await this.reviewRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      docs: data,
      total,
      limit,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Update Status Only (Publish/Unpublish)
  async updateStatus(id: string, updateDto: UpdateReviewDto, requestMeta?: RequestMetaDto) {
    const review = await this.reviewRepository.findOne({ where: { id } });

    if (!review) {
      throw new NotFoundException('Review tidak ditemukan');
    }

    const beforeStatus = review.is_publish;

    if (updateDto.is_publish !== undefined) {
      review.is_publish = updateDto.is_publish;
    }

    const savedReview = await this.reviewRepository.save(review);

    // Log activity - UPDATE
    try {
      await this.logactivityService.log({
        action: LogActivityAction.UPDATE,
        module: 'REVIEWS',
        entity_id: savedReview.id,
        ip_address: requestMeta?.ip_address,
        user_agent: requestMeta?.user_agent,
        route: requestMeta?.route,
        method: requestMeta?.method,
        payload_before: { is_publish: beforeStatus },
        payload_after: { is_publish: savedReview.is_publish },
      });
    } catch (error) {
      this.logger.warn(`Failed to log activity: ${error.message}`);
    }

    return savedReview;
  }
}