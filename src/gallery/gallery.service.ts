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

  // --- CREATE ---
  async create(createGalleryDto: CreateGalleryDto, imagePath: string) {
    const newGallery = new this.galleryModel({
      ...createGalleryDto,
      image: imagePath,
    });
    return newGallery.save();
  }

  async findAll() {
    return this.galleryModel.find().sort({ upload_date: -1 }).exec();
  }

  async remove(id: string) {
    const gallery = await this.galleryModel.findById(id);
    if (!gallery) throw new NotFoundException('Data tidak ditemukan');

    const filePath = path.join(process.cwd(), 'public', gallery.image); 

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return this.galleryModel.findByIdAndDelete(id);
  }
}