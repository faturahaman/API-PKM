import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewStatusDto } from './dto/update-review.dto';
import type { PaginateModel } from 'mongoose';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: PaginateModel<Review>,
  ) {}

  // Create (Bisa buat Public API)
  async create(createReviewDto: CreateReviewDto) {
    const newReview = new this.reviewModel(createReviewDto);
    return newReview.save();
  }

  // Find All (Buat Admin Dashboard)
  async findAll(page: number = 1, limit: number = 10, category?: string) {
    const filter: any = {};
    if (category) {
      filter.category = category;
    }

    return await this.reviewModel.paginate(filter, {
      page,
      limit,
      sort: { created_at: -1 }, // Review terbaru paling atas
    });
  }

  // Update Status Only (Publish/Unpublish)
  async updateStatus(id: string, updateDto: UpdateReviewStatusDto) {
    const updatedReview = await this.reviewModel.findByIdAndUpdate(
      id,
      { $set: { is_publish: updateDto.is_publish } }, // Cuma update field ini
      { new: true }
    );

    if (!updatedReview) throw new NotFoundException('Review tidak ditemukan');
    return updatedReview;
  }
  
  // ⛔ NO DELETE METHOD HERE (Sesuai request)
}