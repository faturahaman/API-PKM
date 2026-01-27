import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Gallery } from './schemas/gallery.schema';
import { CreateGalleryDto } from './dto/create-gallery.dto';

@Injectable()
export class GalleryService {
  constructor(@InjectModel(Gallery.name) private galleryModel: Model<Gallery>) { }

  async create(createGalleryDto: CreateGalleryDto, imagePath: string) {
    const newGallery = new this.galleryModel({
      ...createGalleryDto,
      image: imagePath,
      is_deleted: false,
    });
    return newGallery.save();
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [docs, totalDocs] = await Promise.all([
      this.galleryModel
        .find({ is_deleted: false })
        .sort({ upload_date: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.galleryModel.countDocuments({ is_deleted: false }),
    ]);

    return {
      docs,
      totalDocs,
      limit,
      page,
      totalPages: Math.ceil(totalDocs / limit),
      hasNextPage: skip + docs.length < totalDocs,
      hasPrevPage: page > 1,
    };
  }

  async remove(id: string) {
    const updatedGallery = await this.galleryModel.findByIdAndUpdate(
      id,
      { is_deleted: true },
      { new: true }
    );

    if (!updatedGallery) {
      throw new NotFoundException('Data tidak ditemukan');
    }

    return updatedGallery;
  }
}