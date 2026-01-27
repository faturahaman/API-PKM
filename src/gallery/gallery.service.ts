import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Gallery } from './schemas/gallery.schema';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GalleryService {
  constructor(@InjectModel(Gallery.name) private galleryModel: Model<Gallery>) {}

  async create(createGalleryDto: CreateGalleryDto, imagePath: string) {
    const newGallery = new this.galleryModel({
      ...createGalleryDto,
      image: imagePath,
      is_deleted: false,
    });
    return newGallery.save();
  }

  async findAll() {
    return this.galleryModel.find({ is_deleted: false }).sort({ upload_date: -1 }).exec();
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