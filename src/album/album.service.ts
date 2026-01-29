import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Album } from './schemas/album.schema';
import { CreateAlbumDto } from './dto/create-album.dto';
import { GalleryService } from 'src/gallery/gallery.service';
import type { PaginateModel } from 'mongoose';

@Injectable()
export class AlbumService {
  constructor(
    @InjectModel(Album.name)
    private albumModel: PaginateModel<Album>,
    private galleryService: GalleryService
  ) { }

  async create(createAlbumDto: CreateAlbumDto) {
    const { photo_ids, ...albumData } = createAlbumDto;

    let initialCover: string | null = null;
    
    if (photo_ids && photo_ids.length > 0) {
      const firstPhoto = await this.galleryService.findOne(photo_ids[0]);
      
      if (firstPhoto && firstPhoto.image) {
         initialCover = firstPhoto.image;
      }
    }

    const newAlbum = new this.albumModel({
      ...albumData,
      count: photo_ids ? photo_ids.length : 0,
      album_cover: albumData.album_cover || initialCover || null, 
    });

    const savedAlbum = await newAlbum.save();

    if (photo_ids && photo_ids.length > 0) {
      await this.galleryService.updateAlbumId(photo_ids, savedAlbum._id.toString());
    }

    return savedAlbum;
  }

  async findAll(page: number = 1, limit: number = 10) {
    return await this.albumModel.paginate({}, { page, limit, sort: { createdAt: -1 } });
  }

  async findOne(id: string) {
    return this.albumModel.findById(id).exec();
  }

  async remove(id: string) {
    await this.galleryService.resetAlbumId(id);
    const deletedAlbum = await this.albumModel.findByIdAndDelete(id);
    if (!deletedAlbum) throw new NotFoundException('Album tidak ditemukan');
    return deletedAlbum;
  }
}