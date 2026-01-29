import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Gallery } from './schemas/gallery.schema';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import type { Model, PaginateModel } from 'mongoose';
import { Album, AlbumDocument } from '../album/schemas/album.schema';

@Injectable()
export class GalleryService {
  constructor(
    @InjectModel(Gallery.name)
    private galleryModel: PaginateModel<Gallery>,
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument> 
  ) { }

  async create(createGalleryDto: CreateGalleryDto, imagePath: string) {
    const newGallery = new this.galleryModel({
      ...createGalleryDto,
      image: imagePath,
      is_deleted: false,
    });
    return newGallery.save();
  }

  async findAll(page: number = 1, limit: number = 10, isNoAlbum: boolean = false, albumId?: string) {
    const filter: any = { is_deleted: false };

    if (isNoAlbum) {
      filter.album_id = null;
    } else if (albumId) {
      filter.album_id = albumId;
    }

    return await this.galleryModel.paginate(filter, { page, limit, sort: { upload_date: -1 } });
  }

  async findOne(id: string) {
    return this.galleryModel.findById(id).exec();
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
    
    await this.galleryModel.updateMany(
      { _id: { $in: photoIds } },
      { $set: { album_id: albumId } }
    ).exec();

    const album = await this.albumModel.findById(albumId);

    if (album) {
        const totalPhotos = await this.galleryModel.countDocuments({ 
            album_id: albumId, 
            is_deleted: false 
        });
        
        album.count = totalPhotos;

             const firstPhoto = await this.galleryModel.findById(photoIds[0]);
             if (firstPhoto && firstPhoto.image) {
                album.album_cover = firstPhoto.image;
             }

        await album.save();
    }

    return { success: true };
  }

  async resetAlbumId(albumId: string) {
    return this.galleryModel.updateMany(
      { album_id: albumId },
      { $set: { album_id: null } }
    ).exec();
  }
}