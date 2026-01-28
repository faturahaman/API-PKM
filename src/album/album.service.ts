import { Injectable } from '@nestjs/common';
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

    const newAlbum = new this.albumModel({
      ...albumData,
      count: photo_ids ? photo_ids.length : 0,
      album_cover: null,
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
}