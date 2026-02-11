import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './schemas/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) { }

  // Create (Bisa buat Public API)
  async create(createReviewDto: CreateReviewDto) {
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
  async updateStatus(id: string, updateDto: UpdateReviewDto) {
    const review = await this.reviewRepository.findOne({ where: { id } });

    if (!review) {
      throw new NotFoundException('Review tidak ditemukan');
    }

    if (updateDto.is_publish !== undefined) {
      review.is_publish = updateDto.is_publish;
    }

    return this.reviewRepository.save(review);
  }
}