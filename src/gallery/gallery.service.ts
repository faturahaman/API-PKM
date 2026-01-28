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


async updateAlbumId(photoIds: string[], albumId: string) {
  return this.galleryModel.updateMany(
    { _id: { $in: photoIds } },
    { $set: { album_id: albumId } }
  ).exec();
}

async findOne(id: string) {
    return this.galleryModel.findById(id).exec();
  }

  async findAll(page: number = 1, limit: number = 10, isNoAlbum: boolean = false) {
    const skip = (page - 1) * limit;

    const filter: any = { is_deleted: false };
    
    if (isNoAlbum) {
        filter.album_id = null;
    }

    const [docs, totalDocs] = await Promise.all([
      this.galleryModel
        .find(filter)
        .sort({ upload_date: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.galleryModel.countDocuments(filter),
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

async resetAlbumId(albumId: string) {
    return this.galleryModel.updateMany(
      { album_id: albumId },   // Cari semua foto yg punya alamat album ini
      { $set: { album_id: null } } // Hapus alamatnya (jadi null)
    ).exec();
  }
}